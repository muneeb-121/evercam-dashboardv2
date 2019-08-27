<template>
  <v-layout wrap>
    <v-flex v-for="item in items" :key="item.exid" xs12 md4>
      <nuxt-link :to="item.to">
        <v-img :id="item.exid" :src="item.thumbnail" :lazy-src="item.thumbnail" aspect-ratio="1" />
      </nuxt-link>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios"
import { Socket } from "phoenix-socket"
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
    ...mapGetters(["token"])
  },
  watch: {
    $route() {
      if (this.channel) {
        this.channel.leave()
      }
    }
  },
  mounted() {
    this.getCameras()
  },
  methods: {
    async getCameras() {
      let myitems = []      
      let socket = new Socket(process.env.SOCKET_URL, {
        params: {
          token: this.token,
          ip: "1.1.1.1",
          source: "Thumbnail render"
        }
      })
      socket.connect()
      let thumbnail_channel = socket.channel("thumbnail:render", {})
      thumbnail_channel.join()
      thumbnail_channel.on("thumbnail", data => {        
        this.items.filter(function (item) {
          if (item.exid.match(data.camera_exid)) {
            item.thumbnail = `data:image/jpeg;base64,${data.image}`
          }
        })
      })

      axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`
      axios.get(process.env.API_URL + "cameras")
        .then(function(response) {
          let aux = response.data.cameras
          aux.forEach(function(arrayItem) {
            myitems.push({
              thumbnail: require('~/static/unavailable.jpg'),
              title: arrayItem.name,
              exid: arrayItem.id,
              to: "/cameras/" + arrayItem.id
            })
            thumbnail_channel.push("thumbnail", {body: arrayItem.id})
          })
        })
        .catch(function(error) {
          console.log(error)
        })
      this.channel = thumbnail_channel
      this.items = myitems
      setTimeout(this.refreshThumbnail, 60000)
    },

    refreshThumbnail() {
      let thumbnail_channel = this.channel
      this.items.filter(function (item) {
        thumbnail_channel.push("thumbnail", {body: item.exid})
      })
      // setTimeout(this.refreshThumbnail, 60000)
    }
  }
}
</script>
