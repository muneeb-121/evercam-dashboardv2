<template>
  <v-layout wrap>
    <v-flex v-for="(i, index) in items" :key="index" xs12 md4>
      <nuxt-link :to="i.to">
        <v-img :src="i.thumbnail" :lazy-src="i.thumbnail" aspect-ratio="1" />
      </nuxt-link>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios"
import { mapGetters } from "vuex"

export default {
  middleware: "auth",
  components: {
    //
  },
  data: () => ({
    clipped: true,
    drawer: true,
    fixed: true,
    items: [],
    miniVariant: false,
    right: true,
    rightDrawer: false,
    title: "Evercam"
  }),
  computed: {
    ...mapGetters(["token", "user"])
  },
  mounted() {
    this.getCameras()
  },
  methods: {
    async getCameras() {
      let myitems = []
      let keys = await this.getCredentials()
      axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`
      axios
        .get(process.env.API_URL + "cameras")
        .then(function(response) {
          let aux = response.data.cameras
          aux.forEach(function(arrayItem) {
            myitems.push({
              thumbnail:
                arrayItem.thumbnail_url +
                "?api_id=" +
                keys.api_id +
                "&api_key=" +
                keys.api_key,
              title: arrayItem.name,
              to: "/cameras/" + arrayItem.id
            })
          })
        })
        .catch(function(error) {
          console.log(error)
        })
      this.items = myitems
    },
    async getCredentials() {
      try {
        const res = await axios.get(process.env.API_URL + "auth/credentials", {
          params: {
            username: this.user.email
          }
        })
        return res.data
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
