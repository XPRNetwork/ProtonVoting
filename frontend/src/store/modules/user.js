import userApi from '../../api/user'

const getDefaultState = () => ({
  actor: undefined,
  permission: undefined
})

const state = () => getDefaultState()

const getters = {}

const actions = {
  async login ({ commit }) {
    const session = await userApi.login()
    commit('setUser', session)
  },

  async logout ({ commit }) {
    await userApi.logout()
    commit('resetUser')
  },

  async transact ({ state }, { actions, broadcast }) {
    actions = actions.map(action => {
      action.authorization = [{ actor: state.actor, permission: state.permission }]
      return action
    })
    return await userApi.transact(actions, broadcast)
  }
}

const mutations = {
  setUser (state, session) {
    if (session.auth) {
      state.actor = session.auth.actor
      state.permission = session.auth.permission
    }

    if (session.accountData && session.accountData.length) {
      const { avatar } = session.accountData[0]
      state.avatar = avatar
    }
  },

  resetUser (state) {
    Object.assign(state, getDefaultState())
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}