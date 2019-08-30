<template>
  <v-container class="pa-2" fluid>
    <v-row>
      <v-col cols="12" sm="2">
        <v-overflow-btn
          v-model="order"
          :items="items"
        ></v-overflow-btn>
      </v-col>
      <v-col class="text-right">
        <v-btn-toggle mandatory rounded class="py-2">
          <v-btn>
            All
          </v-btn>
          <v-btn>
            Compares
          </v-btn>
          <v-btn>
            Clips
          </v-btn>
          <v-btn>
            URLs
          </v-btn>
          <v-btn>
            Images
          </v-btn>
          <v-btn>
            Time-lapses
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-divider />
    <v-row>
      <v-col
        v-for="archive in to_show"
        :key="archive.id"
        cols="3"
      >
        <v-card
          outlined
          nuxt
          elevation="10"
          :to="'/cameras/' + archive.camera_id + '/archives/' + archive.id"
        >
          <v-icon
            v-if="archive.type == 'compare'"
            dark
            dense
            class="pa-2 archive-icon"
          >
            fas fa-compress-arrows-alt
          </v-icon>
          <v-icon
            v-else-if="archive.type == 'clip'"
            dark
            dense
            class="pa-2 archive-icon"
          >
            fas fa-video
          </v-icon>
          <v-icon
            v-else-if="archive.type == 'url'"
            dark
            dense
            class="pa-2 archive-icon"
          >
            fas fa-copy
          </v-icon>
          <v-icon
            v-else-if="archive.type == 'edit'"
            dark
            dense
            class="pa-2 archive-icon"
          >
            fas fa-images
          </v-icon>
          <v-icon v-else dark dense class="pa-2 archive-icon">
            fas fa-history
          </v-icon>
          <v-img
            :src="archive.thumbnail_url"
            class="white--text"
            height="200px"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          >
            <v-card-title
              class="fill-height align-end"
              v-text="archive.title"
            />
          </v-img>

          <v-card-text>
            <v-icon>fas fa-calendar-alt</v-icon>
            {{ getDate(archive.from_date) }} - {{ getDate(archive.to_date) }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <div v-show="pagination" class="text-xs-center pt-2 pb-12">
      <v-btn dark width="100%" @click="loadMore">
        Load more...
      </v-btn>
    </div>
    <div class="custom_buttom">
      <v-menu
        v-model="fab"
        top
        fixed
        transition="slide-y-transition"
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
            v-model="fab"
            color="blue darken-2"
            dark
            fab
            v-on="on"
          >
            <v-icon v-if="fab">fas fa-times</v-icon>
            <v-icon v-else>fas fa-plus</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in op_create"
            :key="index"
            @click=""
          >
            <v-list-item-title>
              <v-icon small>{{ item.icon }}</v-icon>&nbsp;{{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-container>
</template>

<style scoped>
.v-btn.extended {
  margin-right: 75px;
  border-radius: 25px;
  align-content: left;
}
.custom_buttom {
  bottom: 16px;
  position: fixed;
  right: 16px;
}
</style>

<script>
import axios from "axios"
import moment from "moment"

export default {
  data() {
    return {
      items: ["Date", "Type", "Title"],
      order: "Date",
      fab: false,
      to_show: {},
      pagination: false,
      op_create: [
        { title: "Cloud Recording Clip", icon: "fas fa-video"},
        { title: "Local Recording Clip", icon: "fas fa-video"},
        { title: "Evercam Compare", icon: "fas fa-video"},
        { title: "URL (YouTube, Vimeo...)", icon: "fas fa-link"},
        { title: "Upload File", icon: "fas fa-upload"},
      ],
    }
  },
  asyncData({ params, error }) {
    return axios
      .get(process.env.API_URL + `cameras/${params.id}/archives`)
      .then(res => {
        return { archives: res.data.archives }
      })
      .catch(e => {
        error({ statusCode: 404, message: "Post not found" })
      })
  },
  computed: {
    pages () {
      return this.pagination.rowsPerPage ? Math.ceil(this.archives.length / this.pagination.rowsPerPage) : 0
    }
  },
  mounted() {
    //do something after mounting vue instance
    console.log(this.archives.length)
    console.log(this.to_show);
    if (this.archives.length < 14) {
      this.pagination = false
    } else {
      this.pagination = true
      this.to_show = this.archives.slice(0, 13)
    }
  },
  methods: {
    getDate(date) {
      return moment(date).format("MM/DD/YY HH:mm")
    },
    loadMore() {
      console.log(this.archives.slice(14, 28));
      this.to_show.concat(this.archives.slice(14, 28))
      // Array.prototype.push.apply(this.to_show,this.archives.slice(14, 28));
      console.log(this.to_show);
    }
  }
}
</script>
