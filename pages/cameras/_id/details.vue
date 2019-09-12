<template>
  <v-container>
    <v-row>
      <v-col cols="6" class="left-col">
        <v-card class="card-style">
          <v-card-title class="subtitle-1">
            Camera Details
            <v-btn class="edit-link caption" text @click="openCameraUpdate">
              EDIT
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-simple-table class="cameras-details">
              <tbody>
                <tr>
                  <td class="col-4 cam-label caption">
                    ID:
                  </td>
                  <td class="col-8 caption">
                    {{ camera.id }}
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Name:
                  </td>
                  <td class="caption">
                    {{ camera.name }}
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Owner:
                  </td>
                  <td class="caption">
                    {{ camera.owner }}
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Project:
                  </td>
                  <td v-if="camera.project" class="caption">
                    {{ camera.project.name }}
                  </td>
                  <td v-else class="grey--text caption">
                    Not Set
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Vendor:
                  </td>
                  <td class="caption">
                    {{ camera.vendor_name }}
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Model:
                  </td>
                  <td class="caption">
                    {{ camera.model_name }}
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Created:
                  </td>
                  <td class="caption">
                    {{ camera.created_at }}
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Status:
                  </td>
                  <td
                    v-if="camera.status == 'online'"
                    class="green--text caption"
                  >
                    Online
                  </td>
                  <td v-else class="red--text caption">
                    Offline
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Timezone:
                  </td>
                  <td class="caption">
                    {{ camera.timezone }}
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Sharing:
                  </td>
                  <td class="caption">
                    Is Public:
                    <span v-if="camera.is_public" class="bold--text">
                      [Yes]
                    </span>
                    <span v-else class="bold--text">
                      [No]
                    </span>
                    <span>& Is Discoverable:</span>
                    <span v-if="camera.discoverable" class="bold--text">
                      [Yes]
                    </span>
                    <span v-else class="bold--text">[No]</span>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>

          <v-card-title class="subtitle-1">
            URLs
            <v-btn class="edit-link caption" text @click="openCameraUpdate">
              EDIT
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-simple-table class="cameras-details">
              <tbody>
                <tr>
                  <td class="col-4 cam-label caption">
                    Username:
                  </td>
                  <td v-if="camera.cam_username" class="col-8 caption">
                    {{ camera.cam_username }}
                  </td>
                  <td v-else class="grey--text caption">
                    Not Set
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Password:
                  </td>
                  <td v-if="camera.cam_password" class="caption">
                    {{ camera.cam_password }}
                  </td>
                  <td v-else class="grey--text caption">
                    Not Set
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    Snapshot URL:
                  </td>
                  <td class="caption">
                    {{ snapshot_url }}
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    H264 URL:
                  </td>
                  <td v-if="camera.external.rtsp.h264" class="caption">
                    {{
                      camera.external.rtsp.h264.replace(
                        `rtsp://${camera.external.host}:${camera.external.rtsp.port}/`,
                        ""
                      )
                    }}
                  </td>
                  <td v-else class="grey--text caption">
                    Not available
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    IP (or Domain):
                  </td>
                  <td v-if="camera.external" class="caption">
                    {{ camera.external.host }}
                  </td>
                  <td v-else class="grey--text caption">
                    Not Set
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    VH HTTP Port:
                  </td>
                  <td v-if="camera.external.http.port !== ''" class="caption">
                    {{ camera.external.http.port }}
                  </td>
                  <td v-else class="grey--text caption">
                    Not Set
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    NVR HTTP Port:
                  </td>
                  <td
                    v-if="camera.external.http.nvr_port !== ''"
                    class="caption"
                  >
                    {{ camera.external.http.nvr_port }}
                  </td>
                  <td v-else class="grey--text caption">
                    Not Set
                  </td>
                </tr>
                <tr>
                  <td class="caption">
                    RTSP Port:
                  </td>
                  <td v-if="camera.external.rtsp.port !== ''" class="caption">
                    {{ camera.external.rtsp.port }}
                  </td>
                  <td v-else class="grey--text caption">
                    Not Set
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>

          <v-card-title class="subtitle-1">
            Other
          </v-card-title>
          <v-card-text>
            <v-simple-table class="cameras-details">
              <tbody>
                <tr>
                  <td class="col-4 cam-label caption">
                    Notifications:
                  </td>
                  <td class="col-8 caption">
                    <v-checkbox
                      class="notify-checkbox caption"
                      hide-details
                      light
                    >
                      <template v-slot:label>
                        <span class="caption">
                          Send me a notification if this camera goes offline
                          (azhar@evercam.io)
                        </span>
                      </template>
                    </v-checkbox>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" class="right-col">
        <v-card class="card-style">
          <v-card-title class="label subtitle-1">
            Location
            <v-btn class="edit-link caption" text>
              EDIT
            </v-btn>
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

          <v-card-title class="label subtitle-1">
            Last Snapshot
          </v-card-title>
          <v-card-text>
            <v-img :src="thumbnail_url" aspect-ratio="2" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">
            Cameras Details
          </span>
        </v-card-title>
        <v-card-text>
          <v-container class="model-container">
            <v-row>
              <v-col cols="8">
                <v-text-field v-model="camera.name" label="Name*" required />
                <v-select
                  v-model="selectedVendor"
                  :items="vendors"
                  item-value="id"
                  item-text="name"
                  label="Vendor"
                  @change="onSelectVendor"
                />
                <v-select
                  v-model="selectedModel"
                  :items="models"
                  item-value="id"
                  item-text="name"
                  label="Model"
                  @change="onSelectVendor"
                />
                <v-text-field
                  v-model="camera.cam_username"
                  label="Username"
                  required
                />
                <v-text-field
                  v-model="camera.cam_password"
                  label="Password"
                  required
                />
                <v-text-field
                  v-model="snapshot_url"
                  label="Snapshot URL"
                  required
                />
                <v-text-field v-model="rtsp_url" label="RTSP URL" required />
              </v-col>
              <v-col cols="4">
                <v-img :src="testSnapshot" aspect-ratio="2" />
                <v-btn color="blue darken-1" text @click="doTestSnapshot">
                  Test Snapshot
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="updateCamera">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.left-col {
  background-color: #fff;
  color: #000;
  padding-right: 0;
}

.right-col {
  background-color: #fff;
  color: #000;
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
  color: #428bca;
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
  background-color: #fff;
  border-radius: 30px !important;
  border: 1px solid #428bca;
  height: 28px !important;
  padding: 0 10px !important;
  margin-left: 25px;
  text-decoration: none;
}

.model-container {
  padding: 0 !important;
}

.notify-checkbox {
  margin-bottom: 0 !important;
  margin-top: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>

<script>
export default {
  name: "Details",
  data() {
    return {
      dialog: false,
      vendors: [],
      models: [],
      testSnapshot: "",
      mapTypeId: "terrain"
    }
  },
  async asyncData({ params, store, $axios }) {
    const { data } = await $axios.get(
      `${process.env.API_URL}cameras/${params.id}`
    )
    let c = data.cameras[0]
    return {
      camera: c,
      thumbnail_url: `${c.thumbnail_url}?authorization=${store.getters.token}`,
      snapshot_url: c.external.http.jpg.replace(
        `${c.external.http.camera}/`,
        ""
      ),
      rtsp_url: c.external.rtsp.h264.replace(
        `rtsp://${c.external.host}:${c.external.rtsp.port}/`,
        ""
      ),
      center: { lat: c.location.lat, lng: c.location.lng },
      markers: [{ position: { lat: c.location.lat, lng: c.location.lng } }],
      selectedVendor: { name: c.vendor_name, id: c.vendor_id },
      selectedModel: { name: c.model_name, id: c.model_id }
    }
  },
  mounted() {
    this.loadVendors()
    this.loadModels("hikvision")
  },
  methods: {
    async loadVendors() {
      const { data } = await this.$axios.get(`${process.env.API_URL}vendors`)
      this.vendors = data.vendors
    },
    async loadModels(vendor_id) {
      const { data } = await this.$axios.get(
        `${process.env.API_URL}models?vendor_id=${vendor_id}&limit=300`
      )
      this.models = data.models
    },
    async doTestSnapshot() {
      let data = {
        external_url: `http://${this.camera.external.host}:${this.camera.external.http.port}`,
        jpg_url: this.snapshot_url,
        cam_username: this.camera.cam_username,
        cam_password: this.camera.cam_password,
        vendor_id: "hikvision",
        camera_exid: this.camera.id
      }
      try {
        let response = await this.$axios.post(
          `${process.env.API_URL}cameras/test`,
          data
        )
        this.testSnapshot = response.data.data
      } catch (e) {
        console.log(e)
      }
    },
    openCameraUpdate() {
      this.dialog = !this.dialog
    },
    onSelectVendor(data) {
      console.log(data)
    },
    updateCamera() {
      console.log(this.snapshot_url)
    }
  }
}
</script>
