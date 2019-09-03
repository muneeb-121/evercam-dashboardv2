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
  },

  SET_CAMERAS(state, { cameras }) {
    state.cameras = cameras
  },

  UNSET_CAMERAS(state) {
    state.cameras = null
  }
}

export const actions = {
  LOGOUT({ commit }) {
    axios.defaults.headers.common["Authorization"] = undefined
    delete axios.defaults.headers.common["Authorization"]
    commit("UNSET_USER")
    commit("UNSET_CAMERAS")
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
      
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`
      const res = await axios.get(`${process.env.API_URL}cameras`)
      const cameras_json = res.data
      commit("SET_USER", data)
      commit("SET_CAMERAS", cameras_json)
      this.app.router.push("/cameras")
    } catch (err) {
      console.log(err)
    }
  },

  async CAMERAS({ commit }, { token }) {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      const { data } = await axios.get(
        `${process.env.API_URL}cameras`
      )
      commit("SET_CAMERAS", data)
    } catch (err) {
      console.log(err)
    }
  }
}

export const getters = {
  token: state => state.token,
  cameras: state => state.cameras,
  isAuthenticated: state => state.token !== null
}

export const plugins = [
  new persist({
    storage: window.localStorage,
    key: "state",
    restoreState: rehydrateStore
  }).plugin
]
