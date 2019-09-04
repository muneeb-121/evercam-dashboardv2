<template>
  <v-navigation-drawer
    id="style-1"
    v-model="drawer"
    :mini-variant="miniVariant"
    :clipped="clipped"
    :fixed="fixed"
    app
  >
    <v-list class="pt-0" dense>
      <v-list-group value="true">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title class="nav-label">
              <v-img
                :src="require('~/static/favicon.png')"
                alt="Evercam Logo"
                class="evercam-icon"
              />
              <nuxt-link class="cameras-link" :to="'/cameras'">
                Cameras
              </nuxt-link>
            </v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          link
          class="title"
        >
          <v-icon
            v-if="item.recording_status === 'on'"
            class="green--text smalest-size"
            v-bind:title="item.storage_duration"
          >
            fas fa-circle
          </v-icon>
          <v-list-item-title
            class="title-text"
            v-bind:class="{ 'camera-opacity': item.camera_offline }"
            v-text="item.title"
            v-bind:title="item.offline_reason"
          />
          <v-icon
            v-if="item.status !== 'online'"
            x-small
            class="red--text">
            fa fa-unlink
          </v-icon>
        </v-list-item>
      </v-list-group>
    </v-list>

    <v-list class="pt-0" dense>
      <v-list-item :to="'/snapmails'" link>
        <v-list-item-icon>
          <v-icon>fas fa-envelope-open-text</v-icon>
        </v-list-item-icon>

        <v-list-item-title>Snapmails</v-list-item-title>
      </v-list-item>

      <v-list-item :to="'/archives'" link>
        <v-list-item-icon>
          <v-icon>fas fa-archive</v-icon>
        </v-list-item-icon>

        <v-list-item-title>Archives</v-list-item-title>
      </v-list-item>

      <v-list-item :to="'/map'" link>
        <v-list-item-icon>
          <v-icon>fas fa-map-marked</v-icon>
        </v-list-item-icon>

        <v-list-item-title>Map View</v-list-item-title>
      </v-list-item>

      <v-list-item :to="'/users/account'" link>
        <v-list-item-icon>
          <v-icon>fas fa-cog</v-icon>
        </v-list-item-icon>

        <v-list-item-title>Settings</v-list-item-title>
      </v-list-item>

      <v-list-item link @click="preformLogout">
        <v-list-item-icon>
          <v-icon>fas fa-sign-out-alt</v-icon>
        </v-list-item-icon>

        <v-list-item-title>Sign out</v-list-item-title>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <div class="pa-0 float-right">
        <v-btn icon right @click.stop="miniVariant = !miniVariant">
          <v-icon>fas fa-chevron-right</v-icon>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
#style-1::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f5;
}

#style-1::-webkit-scrollbar-thumb {
  background-color: #f90;
  background-image: -webkit-linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
}

#style-1::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
}

.camera-opacity {
  opacity: 0.60;
}

.smalest-size {
  font-size: 3px !important;
}

.title {
  background: #303030;
  min-height: 25px !important;
}

.title-text {
  font-size: 13px !important;
  font-weight: normal !important;
  flex-grow: unset;
  flex-basis: auto;
  margin-left: 3px;
  margin-right: 5px;
}

.cameras-link {
  text-decoration: none;
  color: #ffffff !important;
}

.nav-label {
  color: #fff;
  font-size: 16px !important;
  padding-top: 5px;
}

.evercam-icon {
  float: left;
  height: 24px;
  margin-right: 5px;
  margin-top: -4px;
  width: 24px;
}
</style>

<script>
import { mapGetters, mapActions } from "vuex"
import axios from "axios"

export default {
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: true,
      items: [],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Evercam"
    }
  },
  computed: {
    ...mapGetters(["token", "cameras"])
  },
  created() {
    //do something after creating vue instance
    this.getCameras()
  },
  methods: {
    ...mapActions({ logout: "LOGOUT" }),
    preformLogout() {
      axios
        .post(process.env.API_URL + "auth/logout", { token: this.token })
        .then(function(response) {
          // handle success
          console.log(response)
        })
        .catch(function(error) {
          // handle error
          console.log(error)
        })
      this.logout()
    },
    getCameras() {
      let myitems = []
      this.cameras.forEach(function(camera) {
        myitems.push({
          offline_reason: (camera.status == "offline" ? camera.offline_reason : ""),
          storage_duration: (camera.cloud_recordings ? camera.cloud_recordings.storage_duration : ""),
          title: camera.name,
          status: camera.status,
          camera_offline: (camera.status == "offline" ? true : false),
          recording_status: (camera.cloud_recordings ? camera.cloud_recordings.status : ""),
          to: "/cameras/" + camera.id
        })
      })
      this.items = myitems
    }
  }
}
</script>
