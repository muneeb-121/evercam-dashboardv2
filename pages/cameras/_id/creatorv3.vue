<template>
  <v-layout class="pa-2" align-center justify-center>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="snackbarTimeout"
      :top="true"
    >
      {{ snackbarText }}
      <v-btn dark text @click="snackbar = false">
        <v-icon>fas fa-times</v-icon>
      </v-btn>
    </v-snackbar>
    <div class="custom-loading" v-if="isLoading">
      <v-progress-circular
        :size="80"
        :width="7"
        color="primary"
        indeterminate
        class="spin-loading"
      />
    </div>
    <v-row style="height: 100%;width: 100%">
      <v-col cols="9">
        <v-row style="max-widht: 100%">
          <v-col cols="12">
            <v-stage ref="stage" :config="configKonva">
              <v-layer ref="layer">
                <v-image :config="configImage" />
              </v-layer>
              <v-layer ref="layer2">
                <v-image
                  @mousedown="handleStageMouseDown"
                  @dragstart="handleDragStart"
                  @dragend="handleDragEnd"
                  :config="configLogo"
                />
                <v-transformer ref="transformer" />
              </v-layer>
              <v-layer ref="layer3">
                <v-image
                  :config="configWatermark"
                />
              </v-layer>
            </v-stage>
          </v-col>
          <v-col cols="12">
            <swiper
              ref="mySwiper"
              :options="swiperOption"
              class="my-swiper"
              @slideChange="getMoreSnapshots"
            >
              <swiper-slide v-for="slide in slides" :key="slide" class="swiper-slide">
                <img :src="slide" class="swiper-img" style="max-width: 100%">
              </swiper-slide>
              <!-- <div class="swiper-pagination swiper-pagination-bullets" /> -->
              <div slot="button-prev" class="swiper-button-prev" />
              <div slot="button-next" class="swiper-button-next" />
            </swiper>
            <vue-slider
              ref="slider"
              v-model="date_value"
              :tooltip-formatter="formatter1"
              :tooltip="'always'"
              :min="min_slider"
              :max="max_slider"
              :clickable="false"
              style="with: 100%"
              @drag-end="getSnapshots"
              class="mt-8"
            />
            <vue-slider
              ref="slider"
              v-model="time_value"
              :tooltip-formatter="formatter2"
              :tooltip="'always'"
              :min="minHour"
              :max="maxHour"
              :clickable="false"
              style="with: 100%"
              @drag-end="getSnapshots"
              class="mt-8"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3">
        <v-tabs
          slot="extension"
          v-model="tabs"
          class="elevation-2"
          dark
          :centered="true"
          :grow="true"
          :right="true"
        >
          <v-tab
            v-for="item in ['Basic', 'Schedule', 'Advanced']"
            :key="item"
          >
            {{ item }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabs">
          <v-tab-item>
            <v-card flat tile>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="title" label="Title" type="text" />
                  </v-col>
                </v-row>
                <p class="font-weight-bold">First frame</p>
                <vue-ctk-date-time-picker
                  id="from_datetime2"
                  v-model="from_datetime2"
                  class="datetime-picker"
                  format="YYYY-MM-DD HH:mm"
                  button-color="#68a2d5"
                  color="#68a2d5"
                  :disabled-dates="from_disabled_days"
                  :disabled-hours="from_disabled_hours"
                  inline
                  no-button
                  no-shortcuts
                  no-header
                  no-label
                />
                <p class="font-weight-bold">Last frame</p>
                <vue-ctk-date-time-picker
                  id="to_datetime2"
                  v-model="to_datetime2"
                  class="datetime-picker"
                  format="YYYY-MM-DD HH:mm"
                  button-color="#68a2d5"
                  color="#68a2d5"
                  :disabled-dates="to_disabled_days"
                  :disabled-hours="to_disabled_hours"
                  inline
                  no-button
                  no-shortcuts
                  no-header
                  no-label
                />
              </v-card-text>
            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card flat tile>
              <v-card-text>
                <v-row justify="space-around" no-gutters>
                  <v-col class="d-flex" cols="12" sm="12">
                    <v-select
                      v-model="schedule_type"
                      :items="op_schedule"
                      :item-value="op_schedule.value"
                      label="Restrict Hours Per Day"
                    />
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="12">
                    <FullCalendar
                      ref="fullCalendar"
                      :plugins="plugins"
                      :axisFormat="axisFormat"
                      :defaultView="defaultView"
                      :allDaySlot="allDaySlot"
                      :slotDuration="slotDuration"
                      :columnFormat="columnFormat"
                      :columnHeaderFormat="columnHeaderFormat"
                      :defaultDate="defaultDate"
                      :dayNamesShort="dayNamesShort"
                      :eventLimit="eventLimit"
                      :eventOverlap="eventOverlap"
                      :eventColor="eventColor"
                      :firstDay="firstDay"
                      :height="height"
                      :selectHelper="selectHelper"
                      :selectable="selectable"
                      :timezone="timezone"
                      :header="header"
                      :editable="editable"
                      :events="events"
                      @select="selectCalendar"
                      @eventClick="clickCalendar"
                      @eventDrop="dropCalendar"
                      @eventResize="resizeCalendar"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card flat tile>
              <v-card-text>
                <v-row justify="space-around" no-gutters>
                  <v-col class="d-flex" cols="12" sm="12">
                    <v-file-input v-model="watermark_logo" label="Logo" prepend-icon="mdi-camera" @change="addLogo"/>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="12">
                    <v-select
                      v-model="format"
                      :items="op_format"
                      :item-value="op_format.value"
                      label="Format"
                    />
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="12">
                    <v-select
                      v-model="duration"
                      :items="format == 'mp4' ? op_duration : op_duration_gif"
                      label="Duration"
                    />
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="12">
                    <v-text-field
                      v-if="duration === '0'"
                      v-model="custom_duration"
                      label="Custom Duration"
                      type="number"
                    />
                    <span v-if="duration === '0'" class="strong font-weight-normal">
                      &nbsp;&nbsp;seconds, {{ custom_duration * 24 }} Frames
                      playing at 24 FPS.
                    </span>
                    <span
                      v-else
                      class="strong font-weight-normal"
                    >&nbsp;&nbsp;{{ duration * 24 }} Frames playing at 24 FPS.</span>
                    <span
                      v-if="headers"
                      class="strong font-weight-normal"
                    >&nbsp;&nbsp;(+ 4 seconds intro + 6 seconds outro)</span>
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="12">
                    <v-select
                      v-model="rm_date"
                      :items="op_rm_date"
                      :item-value="op_rm_date.value"
                      label="Remove date"
                    />
                  </v-col>
                  <v-col class="d-flex" cols="10" sm="10" />

                  <v-col class="d-flex" cols="12" sm="12">
                    <v-checkbox v-model="watermark" label="Add watermark" @change="addWatermark" />
                  </v-col>

                  <v-col class="d-flex" cols="12" sm="12">
                    <v-checkbox v-model="headers" label="Add headers" />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
        <v-dialog v-model="dialog">
          <template v-slot:activator="{ on }">
            <v-btn width="100%" color="primary" dark v-on="on" @click="checkForm">Create Time-lapse</v-btn>
          </template>

          <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>Processing!</v-card-title>

            <v-card-text>
              We are processing your request. We will let you know when it is
              done
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" text @click="dialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-layout>
</template>

<style lang="scss" scoped>
.v-tabs-items {
  height: 90%;
}
.custom-loading {
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  top: 0;
}
.spin-loading {
  top: 50%;
  left: 50%;
}
.vue-slider {
  width: 100% !important;
}
.item {
  display: flex;
  align-items: center;
}
.item-name {
  font-size: 18px;
}
.item-domain {
  color: grey;
}
.logo {
  max-width: 60px;
  margin-right: 10px;
  border: 1px solid #eaecf0;
}

.cool-class {
  padding: 0px !important;
  width: 100%;
}
.menu-left {
  margin-right: 0px;
  width: 25%;
  height: calc(100vh - 55px);
  right: 0;
  position: fixed;
  z-index: 2;
  color: #2f353a;
  background: #fff;
}
.viewer-content {
  border: 1px solid #eaecf0;
}
.my-swiper {
  width: 100%;
  .swiper-slide {
    text-align: center;
    background-color: #eee;
    display: flex;
    align-items: center;
    height: 100%;
  }
  .swiper-pagination {
    > .swiper-pagination-bullet {
      background-color: red;
    }
  }
}

</style>

<script>
import moment from "moment";
import VueKonva from "vue-konva";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";
import "fullcalendar/dist/fullcalendar.css";
import DatePicker from 'vue2-datepicker'
import FullCalendar from '@fullcalendar/vue'
import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import momentPlugin from '@fullcalendar/moment';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { mapGetters } from "vuex"

const width = window.innerWidth - 200 - 460;
const height = window.innerHeight - 272 - 65;

export default {
  name: "Timelapse",
  components: {
    swiper,
    swiperSlide,
    FullCalendar,
    VueCtkDateTimePicker,
    VueKonva,
    VueSlider,
    DatePicker
  },
  data: function() {
    return {
      minHour: 0,
      maxHour: 24,
      snackbarColor: "",
      snackbar: false,
      snackbarText: "",
      snackbarTimeout: 3000,
      schedule_type: "on_schedule",
      schedule: JSON.stringify({
        "Monday": ["08:00-18:00"],
        "Tuesday": ["08:00-18:00"],
        "Wednesday": ["08:00-18:00"],
        "Thursday": ["08:00-18:00"],
        "Friday": ["08:00-18:00"],
        "Saturday": [],
        "Sunday": []
      }),
      calendar: null,
      plugins: [ interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, momentPlugin],
      axisFormat: 'HH',
      defaultView: 'timeGridWeek',
      allDaySlot: false,
      slotDuration: '00:60:00',
      columnFormat: 'dddd',
      columnHeaderFormat: { weekday: 'short' },
      defaultDate: '1970-01-01',
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      eventLimit: true,
      eventOverlap: false,
      eventColor: '#458CC7',
      firstDay: 1,
      height: 'auto',
      selectHelper: true,
      selectable: true,
      timezone: 'UTC',
      header: {
        left: '',
        center: '',
        right: '',
      },
      header: false,
      editable: true,
      events: null,
      tabs: null,
      lang: {
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        pickers: ['next 7 days', 'next 30 days', 'previous 7 days', 'previous 30 days'],
        placeholder: {
          date: 'Select Date',
          dateRange: 'Select Date Range'
        }
      },
      isLoading: true,
      firstLoading: true,
      min_slider: null,
      max_slider: null,
      dialog: false,
      from_disabled_days: [],
      to_disabled_days: [],
      from_disabled_hours: [],
      to_disabled_hours: [],
      disableTitle: true,
      formatter1: v => this.getString(v),
      formatter2: v => this.getTimeString(v),
      date_value: 0,
      time_value: 8,
      marks: val => ({
        label: this.getString(val),
        labelStyle: {
          opacity: val * 0.01 * 0.7 + 0.3
        },
        labelActiveStyle: {
          color: "#3498db"
        }
      }),
      slides: [],
      swiperOption: {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 5,
        coverflowEffect: {
          rotate: 20,
          stretch: 0,
          depth: 150,
          modifier: 1,
          slideShadows : true
        },
        pagination: {
          el: ".swiper-pagination",
          type: "fraction"
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
      },
      configKonva: {
        width: width,
        height: height
      },
      configLogo: {
        x: 20,
        y: 20,
        draggable: true,
        image: new Image(),
        name: "logo"
      },
      configWatermark: {
        x: 20,
        y: 20,
        draggable: true,
        image: new Image(),
        name: "logo"
      },
      configImage: {
        x: 0,
        y: 0,
        height: height,
        width: width,
        draggable: false,
        image: new Image(),
        name: "image"
      },
      testImg: new Image(),
      isDragging: false,
      events: null,
      thumbnail: null,
      componentKey: 0,
      errors: [],
      value: {
        start: "2019-01-07",
        end: "2019-01-07"
      },
      calendar: {
        configs: {
          sundayStart: false,
          isDatePicker: true,
          isDateRange: false,
          isMultiple: false,
          calendarsCount: 3,
          changeMonthFunction: true,
          changeYearFunction: true,
          dayNames: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
          monthNames: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
          ],
          isModal: true,
          applyStylesheet: true
        }
      },
      cameras: [],
      items: [],
      loading: false,
      camera_name: null,
      from_datetime2: moment()
        .subtract(7, "days")
        .format("YYYY-MM-DD hh:mm"),
      to_datetime2: moment().format("YYYY-MM-DD hh:mm"),
      hour_from: "08:00",
      hour_to: "18:00",
      from: null,
      to: null,
      title: null,
      create: false,
      duration: "15",
      custom_duration: 3,
      format: "mp4",
      headers: false,
      watermark: false,
      watermark_logo: null,
      date_range: "7",
      rm_date: false,
      op_rm_date: [{ text: "Yes", value: true }, { text: "No", value: false }],
      op_date: [
        { text: "Last 7 days", value: "7" },
        { text: "Last 30 days", value: "30" },
        { text: "Last 90 days", value: "90" },
        { text: "All project", value: "all" },
        { text: "Specific day", value: "day" },
        { text: "Custom", value: "custom" }
      ],
      op_position: [
        { text: "Bottom-left", value: "0" },
        { text: "Top-right", value: "1" },
        { text: "Bottom-right", value: "2" },
        { text: "Top-left", value: "3" }
      ],
      op_schedule: [
        { text: "Continuous", value: "continuous" },
        { text: "Working Hours", value: "working_hours" },
        { text: "Custom", value: "on_schedule" }
      ],
      op_duration: [
        { text: "15 sec", value: "15" },
        { text: "30 sec", value: "30" },
        { text: "45 sec", value: "45" },
        { text: "1 min", value: "60" },
        { text: "1 min 30 sec", value: "90" },
        { text: "2 min", value: "120" },
        { text: "2 min 30 sec", value: "150" },
        { text: "3 min", value: "180" },
        { text: "5 min", value: "300" },
        { text: "Custom", value: "0" }
      ],
      op_duration_gif: [
        { text: "3 sec", value: "3" },
        { text: "4 sec", value: "4" },
        { text: "5 sec", value: "5" }
      ],
      op_format: [{ text: "MP4", value: "mp4" }, { text: "GIF", value: "gif" }],
      currentSnapshots: []
    };
  },
  watch: {
    schedule_type: function() {
      if (this.$refs.fullCalendar) {
        if (this.schedule_type === "continuous"){
        let schedule = {
          "Monday": ["00:00-23:59"],
          "Tuesday": ["00:00-23:59"],
          "Wednesday": ["00:00-23:59"],
          "Thursday": ["00:00-23:59"],
          "Friday": ["00:00-23:59"],
          "Saturday": ["00:00-23:59"],
          "Sunday": ["00:00-23:59"]
        }
        this.schedule = JSON.stringify(schedule);
        this.clearCalendar();
        this.renderEvents()
      } else if (this.schedule_type === "working_hours"){
        let schedule = {
          "Monday": ["08:00-18:00"],
          "Tuesday": ["08:00-18:00"],
          "Wednesday": ["08:00-18:00"],
          "Thursday": ["08:00-18:00"],
          "Friday": ["08:00-18:00"],
          "Saturday": [],
          "Sunday": []
        }
        this.schedule = JSON.stringify(schedule);
        this.clearCalendar();
        this.renderEvents()
      } else if (this.schedule_type === "on_schedule") {
        this.clearCalendar();
      }
      } else {
        this.schedule_type = "on_schedule"
      }
    },
    from_datetime2: function() {
      if (this.selected_camera.id) {
        this.from_disabled_days = this.get_disable_dates(this.from_datetime2);
        this.from_disabled_hours = this.get_disable_hours(this.from_datetime2);
        let from_timestamp = moment(this.from_datetime2)
          .subtract(1, "hours")
          .format("YYYY-MM-DDTHH:mm:ss.000+00:00");
        this.$axios
          .$get(
            process.env.API_URL +
              "cameras/" +
              this.selected_camera.id +
              "/recordings/snapshots/" +
              from_timestamp +
              "/nearest"
          )
          .then(response => {
            if (response.snapshots.length != 0) {
              this.before_img = response.snapshots[0].data;
            }
          });
      }
    },

    to_datetime2: function() {
      if (this.selected_camera.id) {
        this.to_disabled_days = this.get_disable_dates(this.to_datetime2);
        this.to_disabled_hours = this.get_disable_hours(this.to_datetime2);
        let to_timestamp = moment(this.to_datetime2)
          .subtract(1, "hours")
          .format("YYYY-MM-DDTHH:mm:ss.000+00:00");
        this.$axios
          .$get(
            process.env.API_URL +
              "cameras/" +
              this.selected_camera.id +
              "/recordings/snapshots/" +
              to_timestamp +
              "/nearest"
          )
          .then(response => {
            if (response.snapshots.length != 0) {
              this.after_img = response.snapshots[0].data;
            }
          });
      }
    }
  },

  computed: {
    ...mapGetters(["token"]),
    selected_camera: function() {
      return this.$store.state.cameras.find(
        o => o.id === this.$route.params.id
      );
    },
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },

  mounted() {
    this.title = this.selected_camera.name +
        " - " +
        moment(this.from_datetime2).format("YYYY-MM-DD HH:mm") +
        " - " +
        moment(this.to_datetime2).format("YYYY-MM-DD HH:mm") +
        " (" +
        this.format.toUpperCase() +
        " " +
        this.duration +
        " sec.)";
    this.compare_images()
    //this.renderEvents()
  },

  methods: {
    selectCalendar(event) {
      let api = this.$refs.fullCalendar.getApi()
      api.addEvent(event)
      this.schedule = JSON.stringify(this.parseCalendar());
    },
    clickCalendar(event) {
      if (window.confirm("Are you sure you want to delete this event?")) {
        let api = this.$refs.fullCalendar.getApi()
        let findingID = null
        if (event.event.id === "") {
          findingID = event.el
        } else {
          findingID = event.event.id
        }
        let removeEvent = api.getEventById( findingID )
        removeEvent.remove()
      }
      this.schedule = JSON.stringify(this.parseCalendar())
    },
    dropCalendar(event) {
      this.schedule = JSON.stringify(this.parseCalendar())
    },
    resizeCalendar(event) {
      this.schedule = JSON.stringify(this.parseCalendar())
    },
    getMoreSnapshots() {
      if (this.currentSnapshots.length > 7) {
        if (this.swiper.activeIndex == this.slides.length - 2) {
          for (var i = 0; i < 8; i++) {
            let url =
              process.env.API_URL +
              "cameras/" +
              this.selected_camera.id +
              "/recordings/snapshots/" +
              this.currentSnapshots[i].created_at +
              "?authorization=" +
              this.token +
              "&view=true";
            this.slides.push(url)
          }
          this.currentSnapshots.splice(0, 8)
        }
      }
      this.getSlides();
    },
    getSnapshots() {
      this.isLoading = true
      var val = this.date_value;
      var date = new Date(val * 1000);
      this.$axios
        .$get(
          process.env.API_URL +
            "cameras/" +
            this.selected_camera.id +
            "/recordings/snapshots/" +
            date.getFullYear() +
            "/" +
            date.getMonth() +
            "/" +
            date.getDate() +
            "/" +
            this.time_value +
            "?authorization=" +
            this.token
        )
        .then(response => {
          this.currentSnapshots = response.snapshots
          if (response.snapshots.length > 7) {
            this.slides = []
            for (var i = 0; i < 8; i++) {
              let url =
                process.env.API_URL +
                "cameras/" +
                this.selected_camera.id +
                "/recordings/snapshots/" +
                response.snapshots[i].created_at +
                "?authorization=" +
                this.token +
                "&view=true";
              this.slides.push(url)
            }
            this.currentSnapshots.splice(0, 8)
            this.getSlides();
            this.swiper.slideTo(0, 0)
          } else {
            this.isLoading = false;
            this.snackbarColor = "error"
            this.snackbarText = "We can not found snapshots on the selected date. Try again."
            this.snackbar = true
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.snackbarColor = "error"
          this.snackbarText = "We can not found snapshots on the selected date. Try again."
          this.snackbar = true
        })
    },
    getSlides() {
      var index = this.swiper.activeIndex;
      var img = new Image();
      img.src = this.slides[index];
      this.configImage.image = img;

      img.onload = () => {
        this.$refs.stage.getStage().drawScene();
        this.isLoading = false;
        // this.updateTransformer();
      };
    },
    getSeconds(date) {
      var mydate = date.split(" ")
      var mydate2 = mydate[0].split("-")
      var date = new Date(mydate2[0], mydate2[1], mydate2[2])
      var seconds = date.getTime() / 1000
      return seconds;
    },
    getString(val) {
      var date = new Date(val * 1000);
      var str =
        date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
      return str;
    },
    getTimeString(val) {
      if (val < 10) {
        val = "0" + val
      }
      return val + ":00";
    },
    getInterval() {
      var interval =
        (this.getSeconds(this.to_datetime2) -
          this.getSeconds(this.from_datetime2)) /
        10;
      return interval;
    },
    async compare_images() {
      await this.$axios
        .$get(
          process.env.API_URL +
            "cameras/" +
            this.selected_camera.id +
            "/recordings/snapshots/oldest"
        )
        .then(response => {
          var date = new Date(response.created_at);
          var seconds = date.getTime() / 1000;
          this.min_slider = seconds;
        });
      await this.$axios
        .$get(
          process.env.API_URL +
            "cameras/" +
            this.selected_camera.id +
            "/recordings/snapshots/latest"
        )
        .then(response => {
          var date = new Date(response.created_at);
          var seconds = date.getTime() / 1000;
          this.max_slider = seconds;
        });
      this.date_value = this.max_slider;
      this.getSnapshots();
    },
    toggleMarker() {
      this.marker = !this.marker;
    },
    sendMessage() {
      this.clearMessage();
    },
    clearMessage() {
      this.message = "";
    },

    arrayDiff(a1, a2) {
      var o1 = {},
        o2 = {},
        diff = [],
        i,
        len,
        k;
      for (i = 0, len = a1.length; i < len; i++) {
        o1[a1[i]] = true;
      }
      for (i = 0, len = a2.length; i < len; i++) {
        o2[a2[i]] = true;
      }
      for (k in o1) {
        if (!(k in o2)) {
          diff.push(k);
        }
      }
      for (k in o2) {
        if (!(k in o1)) {
          diff.push(k);
        }
      }
      return diff;
    },

    get_disable_dates(date) {
      let last_day = moment(date)
        .endOf("month")
        .format("DD");
      let year = moment(date).format("YYYY");
      let month = moment(date).format("MM");

      let month_all_days = [];
      for (let i = 1; i <= last_day; i++) {
        month_all_days.push(i);
      }

      let availible_days;
      let disabled_days_value = [];
      this.$axios
        .$get(
          process.env.API_URL +
            "cameras/" +
            this.selected_camera.id +
            "/recordings/snapshots/" +
            year +
            "/" +
            month +
            "/days"
        )
        .then(response => {
          availible_days = response.days;
          let days_diff = this.arrayDiff(month_all_days, availible_days);
          days_diff.forEach(function(day) {
            let month_val = ("0" + month).slice(-2);
            let day_val = ("0" + day).slice(-2);
            let complete_date = year + "-" + month_val + "-" + day_val;
            disabled_days_value.push(complete_date);
          });
        });
      return disabled_days_value;
    },

    get_disable_hours(date) {
      let first_day = moment(date).format("DD");
      let year = moment(date).format("YYYY");
      let month = moment(date).format("MM");

      let availible_hours;
      let disabled_hours_value = [];
      this.$axios
        .$get(
          process.env.API_URL +
            "cameras/" +
            this.selected_camera.id +
            "/recordings/snapshots/" +
            year +
            "/" +
            month +
            "/" +
            first_day +
            "/hours"
        )
        .then(response => {
          availible_hours = response.hours;
          for (let i = 0; i <= 23; i++) {
            if (!availible_hours.includes(i)) {
              let hour_val = ("0" + i).slice(-2);
              disabled_hours_value.push(hour_val);
            }
          }
        });
      return disabled_hours_value;
    },

    clearCalendar () {
      let api = this.$refs.fullCalendar.getApi()
      let events = api.getEvents()
      events.forEach((event) => {
        event.remove();
      });
    },

    renderEvents() {
      let api = this.$refs.fullCalendar.getApi()
      let schedule = JSON.parse(this.schedule)
      let calendarWeek = this.currentCalendarWeek()
      let days = Object.keys(schedule)
      days.forEach((weekDay) => {
        let day  = schedule[weekDay]
        if (day.length != 0) {
          day.forEach((event) => {
            let start = event.split("-")[0]
            let end = event.split("-")[1]
            let addEvent = {
              id: this.generate_random_string(4),
              start: moment(`${calendarWeek[weekDay]} ${start}`, "YYYY-MM-DD HH:mm")._i,
              end: moment(`${calendarWeek[weekDay]} ${end}`, "YYYY-MM-DD HH:mm")._i
            }
            api.addEvent(addEvent);
          });
        }
      });
    },

    currentCalendarWeek() {
      let calendarWeek = {}
      let weekStart = moment(this.$refs.fullCalendar.getApi().view.currentStart)
      let weekEnd = moment(this.$refs.fullCalendar.getApi().view.currentEnd)
      while (weekStart.isBefore(weekEnd)) {
        let weekDay = weekStart.format("dddd")
        calendarWeek[weekDay] = weekStart.format('YYYY-MM-DD')
        weekStart.add(1, "days")
      }
      return calendarWeek;
    },

    generate_random_string(string_length) {
      let random_string = '';
      let random_ascii;
      for(let i = 0; i < string_length; i++) {
          random_ascii = Math.floor((Math.random() * 25) + 97);
          random_string += String.fromCharCode(random_ascii)
      }
      return random_string
    },

    checkForm: function(e) {
      if (this.selected_camera) {
        let formData = new FormData();
        let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        formData.append("camera", this.selected_camera.id);
        formData.append("from_datetime", moment(this.from_datetime2).format());
        formData.append("to_datetime", moment(this.to_datetime2).format());
        formData.append("title", this.title);
        formData.append("analyze", this.analyze);
        formData.append("headers", this.headers);
        formData.append("watermark", this.watermark);
        formData.append("schedule", this.schedule);
        formData.append("format", this.format);
        formData.append("rm_date", this.rm_date);
        formData.append("timezone", timezone);
        if (this.duration === "0") {
          formData.append("duration", this.custom_duration);
        } else {
          formData.append("duration", this.duration);
        }
        if (this.watermark_logo) {
          formData.append("watermark_position", this.watermark_position);
          formData.append("watermark_logo", this.watermark_logo);
        }

        this.$axios
          .$post(process.env.API_URL + "timelapse", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(function(response) {
            if (response.status != 201) {
              this.clearForm();
            } else {
              this.clearForm();
            }
          })
          .catch(() => {
            this.clearForm();
          });
      }

      if (this.duration === "0" && this.custom_duration <= 0) {
        this.$notify({
          group: "notify",
          type: "warn",
          title: "Important message",
          text: "Duration required"
        });
      }

      e.preventDefault();
    },
    clearForm: function() {
      this.title = null;
      this.camera_id = null;
      this.camera_name = null;
      this.date_range = "7";
      this.from = null;
      this.to = null;
      this.schedule_type = "working_hours";
      this.duration = "15";
      this.headers = false;
      this.format = "mp4";
      this.rm_date = false;
    },

    parseCalendar: function() {
      var events = this.$refs.fullCalendar.getApi().getEvents()
      var schedule = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
      };
      events.map(function(event) {
        var days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ];
        var startTime = moment(event.start).get("hours");
        var endTime = moment(event.end).get("hours");
        var day = moment(event.start).get("day");
        schedule[days[day]] = schedule[days[day]].concat(
          startTime + "-" + endTime
        );
      });
      return schedule;
    },
    handleStageMouseDown(e) {
      // clicked on stage - cler selection
      if (e.target === e.target.getStage()) {
        this.selectedShapeName = "";
        this.updateTransformer();
        return;
      }

      // clicked on transformer - do nothing
      const clickedOnTransformer =
        e.target.getParent().className === "Transformer";
      if (clickedOnTransformer) {
        return;
      }

      // find clicked rect by its name
      const name = e.target.name();
      const rect = this.configLogo;
      if (rect) {
        this.selectedShapeName = name;
      } else {
        this.selectedShapeName = "";
      }
      this.updateTransformer();
    },
    updateTransformer() {
      // here we need to manually attach or detach Transformer node
      const transformerNode = this.$refs.transformer.getStage();
      const stage = transformerNode.getStage();
      const { selectedShapeName } = this;

      const selectedNode = stage.findOne("." + selectedShapeName);
      // do nothing if selected node is already attached
      if (selectedNode === transformerNode.node()) {
        return;
      }

      if (selectedNode) {
        // attach to another node
        transformerNode.attachTo(selectedNode);
      } else {
        // remove transformer
        transformerNode.detach();
      }
      transformerNode.getLayer().batchDraw();
    },
    handleDragStart() {
      this.isDragging = true;
    },
    addWatermark() {
      if (this.watermark) {
        let watermark_image = new Image();
        watermark_image.src = require("~/static/watermark.png");
        watermark_image.onload = () => {
          this.configWatermark.image = watermark_image;
        };
      } else {
        this.configWatermark.image = new Image();
      }
    },
    addLogo() {
      if (this.watermark_logo) {
        let reader = new FileReader();
        reader.onload = () => {
          let dataURL = reader.result;
          let logo = new Image()
          logo.src = dataURL
          logo.onload = () => {
            this.configLogo.image = logo;
          }
        };
        reader.readAsDataURL(this.watermark_logo);
      } else {
        this.configLogo.image = new Image();
      }
    },
    handleDragEnd() {
      this.isDragging = false;
    }
  }
};
</script>
