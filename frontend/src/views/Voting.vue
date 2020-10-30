<template>
  <div class="header">
    <img src="@/assets/voting-logo.svg" class="logo-img"/>
    <img :src="userImage" class="user-img" @click="logout"/>
  </div>

  <div class="body"> 
    <div class="container">
      <State1 v-if="step === 1" @next-step="completedKyc"/>
      <State2 v-if="step === 2" @next-step="completedSavingKeys" :publicKey="publicKey" :privateKey="privateKey"/>
      <State3 v-if="step === 3" @next-step="submitChoice" :choices="poll.choices"/>
      <State4 v-if="step === 4" :choices="poll.choices" :publicKey="publicKey" :pollId="poll.index"/>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { Key, Numeric } from '@protonprotocol/protonjs'
import axios from 'axios'
import { fetchPoll } from '../api/poll'

import State1 from '@/components/State1'
import State2 from '@/components/State2'
import State3 from '@/components/State3'
import State4 from '@/components/State4'

export default {
  name: 'Voting',

  components: {
    State1,
    State2,
    State3,
    State4
  },

  data () {
    return {
      step: 1,
      publicKey: undefined,
      privateKey: undefined,
      poll: undefined
    }
  },

  watch: {
    actor: {
      immediate: true,
      handler: function (newActor) {
        if (!newActor) {
          this.$router.push('/')
        }
      }
    }
  },

  computed: {
    ...mapState({
      actor: state => state.user.actor,
      avatar: state => state.user.avatar
    }),

    userImage () {
      if (this.avatar) {
        if (this.avatar.indexOf('/9j/') !== -1) {
          return `data:image/jpeg;base64,${this.avatar}`
        } else if (this.avatar.indexOf('iVBORw0KGgo') !== -1) {
          return `data:image/png;base64,${this.avatar}`
        }
      }

      return '/proton_avatar.png'
    }
  },

  methods: {
    ...mapActions({
      transact: 'user/transact',
      logout: 'user/logout'
    }),

    completedKyc () {
      const { privateKey, publicKey } = Key.generateKeyPair(Numeric.KeyType.k1, { secureEnv: true })
      this.privateKey = privateKey
      this.publicKey = publicKey

      this.step = 2
    },

    completedSavingKeys () {
      this.step = 3
    },

    async submitChoice (selectedChoice) {
      const CONTRACT = 'protonvoting'
      const VOTE_ACTION = 'vote'
      const POLL_ID = 0

      const to_sign = `${POLL_ID}:${selectedChoice}`

      const actions = [{
        account: CONTRACT,
        name: VOTE_ACTION,
        data: {
          relay: CONTRACT,
          poll_id: POLL_ID,
          choice: selectedChoice,
          key: this.publicKey.toString(),
          signature: this.privateKey.sign(to_sign, true).toString()
        }
      }]

      const result = await this.transact({ actions, broadcast: false })
      const { signatures, signer, transaction } = result

      try {
        const res = await axios.post('https://www.api.bloks.io/proton-voting/vote', { signatures, signer, transaction })
        if (res.data.success) {
          await this.fetchPoll()
          this.step = 4
        } else {
          alert(res.data.error)
        }
      } catch (e) {
        console.log(e)
      }
    },

    async fetchPoll () {
      this.poll = await fetchPoll(0)
    }
  },

  created () {
    this.fetchPoll()
  }
}
</script>

<style scoped>
.header {
  height: 88px;
  background-color: #191b45;
  display: flex;
  align-items: center;
  padding: 0px 88px;
}

.body {
  height: calc(100vh - 120px);
  padding-top: 32px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #eceff6;
}

.container {
  max-width: 500px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.logo-img {
  width: 109px;
  height: 35px;
  object-fit: contain;
}

.user-img {
  cursor: pointer;
  width: 40px;
  height: 40px;
  margin-left: auto;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 25px;
}
</style>