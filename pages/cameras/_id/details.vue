<template>
  <v-container>
    <v-row>
      <v-col cols="6" class="left-col">
        <v-card class="card-style">
          <v-card-title>
            Camera Details
            <nuxt-link class="edit-link" :to="'/'">
              EDIT
            </nuxt-link>
          </v-card-title>
          <v-card-text>
            <v-simple-table class="cameras-details">
              <tbody>
                <tr>
                  <td class="col-4 cam-label">ID:</td>
                  <td  class="col-8">{{ camera.id }}</td>
                </tr>
                <tr>
                  <td>Name:</td>
                  <td>{{ camera.name }}</td>
                </tr>
                <tr>
                  <td>Owner:</td>
                  <td>{{ camera.owner }}</td>
                </tr>
                <tr>
                  <td>Project:</td>
                  <td v-if="camera.project">{{ camera.project.name }}</td>
                  <td v-else class="grey--text">Not Set</td>
                </tr>
                <tr>
                  <td>Vendor:</td>
                  <td>{{ camera.vendor_name }}</td>
                </tr>
                <tr>
                  <td>Model:</td>
                  <td>{{ camera.model_name }}</td>
                </tr>
                <tr>
                  <td>Created:</td>
                  <td>{{ camera.created_at }}</td>
                </tr>
                <tr>
                  <td>Status:</td>
                  <td v-if="camera.status == 'online'" class="green--text">Online</td>
                  <td v-else class="red--text">Offline</td>
                </tr>
                <tr>
                  <td>Timezone:</td>
                  <td>{{ camera.timezone }}</td>
                </tr>
                <tr>
                  <td>Sharing:</td>
                  <td>
                    Is Public:
                    <span v-if="camera.is_public" class="bold--text">[Yes]</span>
                    <span v-else class="bold--text">[No]</span>
                    <span>& Is Discoverable:</span>
                    <span v-if="camera.discoverable" class="bold--text">[Yes]</span>
                    <span v-else class="bold--text">[No]</span>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
            <br>
          </v-card-text>

          <v-card-title>
            URLs
            <nuxt-link class="edit-link" :to="'/'">
              EDIT
            </nuxt-link>
          </v-card-title>
          <v-card-text>
            <v-simple-table class="cameras-details">
              <tbody>
                <tr>
                  <td class="col-4 cam-label">Username:</td>
                  <td v-if="camera.cam_username" class="col-8">{{ camera.cam_username }}</td>
                  <td v-else class="grey--text">Not Set</td>
                </tr>
                <tr>
                  <td>Password:</td>
                  <td v-if="camera.cam_password">{{ camera.cam_password }}</td>
                  <td v-else class="grey--text">Not Set</td>
                </tr>
                <tr>
                  <td>Snapshot URL:</td>
                  <td>{{ camera.external.http.jpg.replace(`${camera.external.http.camera}/`, "") }}</td>
                </tr>
                <tr>
                  <td>H264 URL:</td>
                  <td v-if="camera.external.rtsp.h264">{{ camera.external.rtsp.h264.replace(`rtsp://${camera.external.host}:${camera.external.rtsp.port}/`, "") }}</td>
                  <td v-else class="grey--text">Not available</td>
                </tr>
                <tr>
                  <td>IP (or Domain):</td>
                  <td v-if="camera.external">{{ camera.external.host }}</td>
                  <td v-else class="grey--text">Not Set</td>
                </tr>
                <tr>
                  <td>VH HTTP Port:</td>
                  <td v-if="camera.external.http.port !== ''">{{ camera.external.http.port }}</td>
                  <td v-else class="grey--text">Not Set</td>
                </tr>
                <tr>
                  <td>NVR HTTP Port:</td>
                  <td v-if="camera.external.http.nvr_port !== ''">{{ camera.external.http.nvr_port }}</td>
                  <td v-else class="grey--text">Not Set</td>
                </tr>
                <tr>
                  <td>RTSP Port:</td>
                  <td v-if="camera.external.rtsp.port !== ''">{{ camera.external.rtsp.port }}</td>
                  <td v-else class="grey--text">Not Set</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>

          <v-card-title>Other</v-card-title>
          <v-card-text>
            <v-simple-table class="cameras-details">
              <tbody>
                <tr>
                  <td class="col-4 cam-label">Notifications:</td>
                  <td  class="col-8">
                    <v-checkbox
                      label="Send me a notification if this camera goes offline (azhar@evercam.io)"
                      light
                    ></v-checkbox>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" class="right-col">
        <v-card class="card-style">
          <v-card-title class="label">
            Location
            <nuxt-link class="edit-link" :to="'/'">
              EDIT
            </nuxt-link>
          </v-card-title>
          <v-card-text>
            <gmap-map :center="center" :map-type-id="mapTypeId" :zoom="14">
              <gmap-marker
                v-for="(item, index) in markers"
                :key="index"
                :position="item.position"
                @click="center = item.position"
              />
            </gmap-map>
          </v-card-text>

          <v-card-title class="label">Last Snapshot</v-card-title>
          <v-card-text>
            <v-img
              :src="thumbnail_url"
              aspect-ratio="2"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.left-col {
  background-color: #fff;
  color: #000;
  padding-top: 0;
  padding-right: 0;
}

.right-col {
  background-color: #fff;
  color: #000;
  padding-top: 0;
  padding-right: 24px;
}

.label {
  padding-bottom: 0;
}

.bold--text {
  font-weight: bold;
}

.card-style {
  border-radius: 0;
  box-shadow: none;
}

.cam-label {
  width: 30%;
}

.cameras-details td {
  border-bottom-width: 0 !important;
  height: auto;
  padding: 5px;
}

.vue-map-container {
  height: 450px;
  max-width: 992px;
  width: 100%;
}

.edit-link {
  font-size: 11px !important;
  font-weight: 600;
  color: #428bca;
  -webkit-transition: all .2s linear;
  transition: all .2s linear;
  background-color: #fff;
  border-radius: 30px !important;
  border: 1px solid #428bca;
  padding: 0 12px;
  margin-left: 25px;
  text-decoration: none;
}
</style>

<script>
  import axios from "axios"
  import { mapGetters } from "vuex"

  export default {
    name: "Details",
    data() {
      return {
        mapTypeId: "terrain"
      }
    },
    computed: {
      ...mapGetters(["token"])
    },
    async asyncData({ params, error }) {
      return axios
        .get(process.env.API_URL + `cameras/${params.id}`)
        .then(res => {
          return {
            camera: res.data.cameras[0],
            thumbnail_url: `${res.data.cameras[0].thumbnail_url}?authorization=${axios.defaults.headers.common["Authorization"].replace("Bearer ", "")}`,
            center: { lat: res.data.cameras[0].location.lat, lng: res.data.cameras[0].location.lng },
            markers: [
              { position: { lat: res.data.cameras[0].location.lat, lng: res.data.cameras[0].location.lng } }
            ]
          }
        })
        .catch(() => {
          error({ statusCode: 404, message: "Post not found" })
        })
    }
  };
</script>