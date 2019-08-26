import Vue from "vue"
import Vuex from "vuex"
import persist from "vuex-persist"
import axios from "axios"
import qs from "qs"

import { rehydrateStore } from "@/utils"

Vue.use(Vuex)

export const state = () => ({
  token: null
})

export const mutations = {
  SET_USER(state, { token }) {
    state.token = token
  },

  UNSET_USER(state) {
    state.token = null
  }
}

export const actions = {
  LOGOUT({ commit }) {
    axios.defaults.headers.common["Authorization"] = undefined
    delete axios.defaults.headers.common["Authorization"]
    commit("UNSET_USER")
    // redirect
    this.app.router.push("/login")
  },

  async LOGIN({ commit }, { form }) {
    try {
      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
      const { data } = await axios.post(
        process.env.API_URL + "auth/login",
        qs.stringify(form),
        config
      )
      commit("SET_USER", data)
      this.app.router.push("/cameras")
    } catch (err) {
      const message =
        err.response.status === 401
          ? "Incorrect username or password"
          : "Could not login"
      console.log(message)
    }
  }
}

export const getters = {
  token: state => state.token,
  isAuthenticated: state => state.token !== null
}

export const plugins = [
  new persist({
    storage: window.localStorage,
    key: "state",
    restoreState: rehydrateStore
  }).plugin
]
