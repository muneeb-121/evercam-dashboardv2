<template>
  <v-app id="login">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <video-player
            ref="videoPlayer"
            class="video-player-login"
            :options="{
              muted: true,
              autoplay: true,
              fluid: true,
              loop: true,
              controls: false,
              userActions: {
                hotkeys: false
              },
              language: 'en',
              sources: [
                {
                  type: 'video/mp4',
                  src: require('~/static/gpoview-a756f65192d97eb7c27d054296cd84fa4d2c41707d8c8ad1a579690cfb66e093.mp4')
                }
              ]
            }"
          />
          <v-flex xs12 sm8 md4 lg3>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <v-img
                    :src="require('~/static/EVERCAM-475x100-Transparent-2.png')"
                    alt="Evercam Construction Cameras"
                    width="70%"
                  />
                </div>
                <v-form ref="model">
                  <v-text-field
                    v-model="model.username"
                    name="login"
                    label="Login"
                    type="text"
                  />
                  <v-text-field
                    id="password"
                    v-model="model.password"
                    name="password"
                    label="Password"
                    type="password"
                  />
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      block
                      color="primary"
                      :loading="loading"
                      @click="preformLogin"
                    >
                      Sign in
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
              <v-card-text class="text-center">
                I've <a href="./">forgotten my password</a>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions } from "vuex"
import { videoPlayer } from "vue-video-player"
import "video.js/dist/video-js.css"

export default {
  layout: "clean",
  middleware: "unauth",
  components: {
    videoPlayer
  },
  data: () => ({
    loading: false,
    model: {
      username: "",
      password: ""
    }
  }),
  methods: {
    ...mapActions({ login: "LOGIN", cameras: "CAMERAS" }),
    preformLogin() {
      const form = this.model
      this.login({ form })
      // this.cameras()
    }
  }
}
</script>
