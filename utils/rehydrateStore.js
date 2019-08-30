import axios from "axios"

export default (key, storage) => {
  try {
    // parse persisted state and restore to vuex store
    const state = JSON.parse(storage.getItem("state"))
    // set app wide auth header for authorized requests
    if (state.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`
    } else {
      delete axios.defaults.headers.common["Authorization"]
    }
    return state
  } catch (err) {
    return undefined
  }
}
