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
    item_indexs: [],
    miniVariant: false,
    right: true,
    rightDrawer: false,
    title: "Evercam",
    clearThumbnailTimeOut: null,
    exids: ""
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
  beforeDestroy() {
    this.clearTimer()
  },
  mounted() {
    this.getCameras()
  },
  methods: {
    async getCameras() {
      let myitems = []
      let camera_exids = []
      let array_indexes = []
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
        let item = this.items[this.item_indexs[data.camera_exid]]
        item.thumbnail = `data:image/jpeg;base64,${data.image}`;
      })
      axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`
      axios.get(process.env.API_URL + "cameras")
        .then(function(response) {
          let aux = response.data.cameras
          aux.forEach(function(arrayItem, index, array) {
            array_indexes[arrayItem.id] = index
            camera_exids.push(arrayItem.id)
            myitems.push({
              thumbnail: require('~/static/unavailable.jpg'),
              title: arrayItem.name,
              exid: arrayItem.id,
              to: "/cameras/" + arrayItem.id
            })
          })
          thumbnail_channel.push("thumbnail", {body: camera_exids.join()})
        })
        .catch(function(error) {
          console.log(error)
        })
      this.channel = thumbnail_channel
      this.items = myitems
      this.exids = camera_exids
      this.item_indexs = array_indexes
      this.clearThumbnailTimeOut = setTimeout(this.refreshThumbnail, 60000)
    },

    refreshThumbnail() {
      this.channel.push("thumbnail", {body: this.exids.join()})
      this.clearThumbnailTimeOut = setTimeout(this.refreshThumbnail, 60000)
    },

    clearTimer() {
      clearTimeout(this.clearThumbnailTimeOut)
    }
  }
}
</script>
