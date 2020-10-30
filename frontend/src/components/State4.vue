<template>
  <div class="top-container">
    <div class="top-title">
      Current Results
    </div>

    <div class="divider"/>

    <div class="results-container">
      <!-- eslint-disable-next-line vue/no-unused-vars-->
      <div v-for="(choice, index) of choices" :key="choice.value" class="choice-title">
        <div style="display: flex;">
          <span class="vote-result-title">{{ choice.value }}</span>
          <span class="vote-result-counter">{{ choice.votes }} Votes</span>
        </div>
        <div style="display: flex; margin-top: 5px;">
          <div class="progress-bar">
            <span
              class="progress-bar-fill"
              :style="`
                width: ${(choice.votes / totalVotes) * 100}%;
                background-color: ${colors[index % 2]};
              `"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="bottom-container">
    <img src="@/assets/voting-2020-logohead.svg" class="voting-logo"/>
    <div class="bottom-title">
      YOU'VE VOTED
    </div>
    <div class="bottom-subtitle">
      Your vote has been registered under your public key. 
    </div>
    <div class="bottom-button" @click="seeVote">
      SEE VOTE
    </div>
  </div>
</template>

<script>
import { fetchVoteByKey } from '../api/poll'

export default {
  name: 'State4',
  props: ['choices', 'publicKey', 'pollId'],

  data () {
    return {
      colors: ['#f06464', '#618ce8']
    }
  },

  computed: {
    totalVotes () {
      return this.choices.reduce((acc, choice) => acc + choice.votes, 0)
    }
  },

  methods: {
    async seeVote () {
      const vote = await fetchVoteByKey(this.publicKey, this.pollId)
      if (vote) {
        window.open(`https://proton.bloks.io/transaction/${vote.txid}`)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.divider {
  height: 1px;
  opacity: 0.56;
  background-color: #cbd3e6;
}

.voting-logo {
  width: 120px;
  height: 122px;
  object-fit: none;
  border-radius: 60px;
  box-shadow: 0 8px 12px -4px rgba(130, 136, 148, 0.24), 0 0 4px 0 rgba(141, 141, 148, 0.16), 0 0 2px 0 rgba(141, 141, 148, 0.12);
}

.top-container {
  width: 504px;
  border-radius: 2px;
  background-color: #f7f9fd;
}

.bottom-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  width: 504px;
  height: 437px;
  border-radius: 2px;
  background-color: #f7f9fd;
}

.bottom-title {
  padding-top: 33px;
  font-family: HelveticaNeue;
  font-size: 32px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: 1.6px;
  text-align: center;
  color: #0a1829;
}


.bottom-subtitle {
  padding-top: 20px;
  width: 328px;
  height: 48px;
  opacity: 0.4;
  font-family: BreeSerif;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: 1px;
  text-align: center;
  color: #191b45;
}

.bottom-button {
  cursor: pointer;
  margin-top: 61px;
  width: 440px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  object-fit: contain;
  border-radius: 4px;
  color: #3947a3;
  border: solid 2px rgb(57,71,163, 0.2);
  font-family: HelveticaNeue;
  font-size: 14px;
  font-weight: bold;
}

.top-title {
  padding: 15px 0px 17px 32px;
  text-align: left;
  font-family: HelveticaNeue;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #000000;
}

.results-container {
  padding: 0px 32px 32px 32px;
  background-color: #f7f9fd;
}

.choice-title {
  display: flex;
  flex-direction: column;
  justify-content: left;
  margin-top: 24px;
}

.vote-result-title {
  font-family: HelveticaNeue;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  color: #000000;
}

.vote-result-counter {
  margin-left: auto;
  font-family: HelveticaNeue;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: normal;
  text-align: right;
  color: #a1a5b1;
}

.progress-bar {
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 3px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, .2);
}

.progress-bar-fill {
  display: block;
  height: 5px;
  border-radius: 3px;
  
  transition: width 500ms ease-in-out;
}
</style>
