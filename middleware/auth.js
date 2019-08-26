export default ({ store, redirect }) => {
  if (store.getters.token == null) {
    // redirect to login page and pass
    // callback url query for redirecting
    // upon authenticating
    redirect("/login")
  }
}
