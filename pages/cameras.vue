<template>
  <v-layout wrap>
    <v-flex
      v-for="(i, index) in items"
      :key="index"
      xs12
      md4
    >
      <v-img
        :src="i.thumbnail"
        :lazy-src="i.thumbnail"
        aspect-ratio="1"
      ></v-img>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  middleware: 'auth',
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
    title: 'Evercam'
  }),
  computed: {
    ...mapGetters(['token'])
  },
  mounted() {
    this.getCameras()
  },
  methods: {
    getCameras() {
      let api_id = this.token.api_id
      let api_key = this.token.api_key
      let myitems = []
      axios.get(process.env.API_URL + 'cameras',{
        params: {
          api_id: api_id,
          api_key: api_key
        }
      })
      .then(function (response) {
        // handle success
        let aux = response.data.cameras
        aux.forEach(function (arrayItem) {
          myitems.push({
            thumbnail: arrayItem.thumbnail_url + '?api_id=' + api_id + '&api_key=' + api_key,
            title: arrayItem.name,
            to: '/camera/' + arrayItem.id
          })
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
      this.items = myitems
    },
  }
}
</script>
