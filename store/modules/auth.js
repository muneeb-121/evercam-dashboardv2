import axios from 'axios'

import * as mutationTypes from '../types/mutations'
import * as actionTypes from '../types/actions'

const state = {
  token: null,
  user: null,
}

const mutations = {
  [mutationTypes.SET_USER] (state, { users, credentials }) {
    console.log(users);
    console.log(credentials);
    state.token = credentials
    state.user = users
  },

  [mutationTypes.UNSET_USER] (state) {
    state.user = null
    state.token = null
  }
}

const actions = {
  [actionTypes.LOGOUT] ({ commit }) {
    axios.defaults.headers.common['Authorization'] = undefined
    delete axios.defaults.headers.common['Authorization']
    commit(mutationTypes.UNSET_USER)
    // redirect
    this.app.router.push('/login')
  },

  async [actionTypes.LOGIN] ({ commit }, { form }) {
    try {
      console.log("url: ", process.env.API_URL + 'users/' + form.username + '/credentials');
      console.log(form);
      const auxCredentials = await axios.get(process.env.API_URL + 'users/'+ form.username +'/credentials', {
        params: {
          password: form.password
        }
      });
      const auxUser = await axios.get(process.env.API_URL + 'users/' + form.username, {
        params: {
          api_id: auxCredentials.data.api_id,
          api_key: auxCredentials.data.api_key
        }
      })
      axios.defaults.headers.common['Authorization'] = `Bearer ${auxCredentials.data.api_key}`
      const users = auxUser.data.users[0]
      const credentials = auxCredentials.data
      commit(mutationTypes.SET_USER, { users, credentials })
      this.app.router.push('/cameras')
    } catch (err) {
      const message = err.response.status === 401 || 404 ? 'Incorrect username or password' : 'Could not login'
      console.log(message);
    }
  }
}

const getters = {
  user: state => state.user,
  token: state => state.token,
  isAuthenticated: state => state.user !== null,
  userName: state => state.user.userName
}

export default {
  state,
  mutations,
  actions,
  getters,
}
