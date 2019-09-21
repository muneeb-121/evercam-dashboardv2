<template>
  <div id="map">
    <v-layout>git 
      <h2>Map page</h2>
    </v-layout>
    <GmapMap
      :center="cameras[0].location"
      :zoom="13"
      map-type-id="terrain"
      style="position: relative;padding-bottom: 75%;height: 0;overflow: hidden;"
      >
      <GmapMarker
        :key="index"
        v-for="(cam, index) in cameras"
        :position="cam.location"
        :clickable="true"
        :draggable="true"
        @click="center=cam.location"
        @mouseover="toggleInfoWindow(cam,index)"
    />
    <gmap-info-window
      :options="infoOptions"
      :position="infoWindowPos"
      :opened="infoWinOpen"
      @closeclick="infoWinOpen=false"
    >
    <div v-html="infoContent"></div>
    </gmap-info-window>
   

    </GmapMap>
  </div>
</template>


<style scoped>
#map {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  z-index: 1;
  height: 100%;
  overflow-y: hidden !important;
  overflow-x: hidden !important;
}
</style>

<script>
import { mapGetters } from 'vuex'
export default {

  data : () => ({
        infoContent: '',
        infoWindowPos: {
          lat: 0,
          lng: 0
        },
        infoWinOpen: false,
        currentMidx: null,
        infoOptions: {
          pixelOffset: {
            width: 0,
            height: -35
          }
        }
  }),

  computed : {
    ...mapGetters({getCameras:'cameras'}),
    cameras(){
      return this.getCameras
    }
  },

  methods : {
    toggleInfoWindow(cam,index){

        this.infoWindowPos = cam.location;
        this.infoContent = this.getInfoWindowContent(cam);
        this.infoWinOpen=true
      },
      getInfoWindowContent: function (cam) {
        return (`<div class="card">
                <img src="${cam.thumbnail_url}" alt="Camera Thumbnail" style="max-width:300px;padding-top:20px;">
                <div class="container">
                  <h4><b>${cam.name}</b></h4>
                  
                  <br>
                  <h5>Vendor:${cam.vendor_name}</h5>
                  <h5>Model:${cam.model_name}</h5>
                  <h5>TimeZone:${cam.timezone}</h5>
                </div>
                </div>`);
      }

    }

  }
</script>
