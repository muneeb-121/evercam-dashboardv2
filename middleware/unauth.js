export default ({ store, redirect }) => {
  if (store.getters.token !== null) {
    // redirect home; authed user should
    // not view
    redirect("/")
  }
}
