<template>
  <v-layout align-center justify-center>
    <v-img
      v-if="ajaxWait"
      class="text-xs-center buttons"
      :src="require('~/static/loading.gif')"
      alt="Evercam Logo"
    />
    <div v-else class="cont">
      <form
        @submit="checkForm"
        method="post"
        class="form-horizontal"
      >
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header v-slot="{ open }">
              <v-row no-gutters>
                <v-col cols="4">1. Basic options</v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-select
                v-model="selected"
                :items="items"
                filled
                color="blue-grey lighten-2"
                label="Cameras"
                item-text="name"
                item-value="name"
              >
                <template v-slot:selection="data">
                  <v-avatar left>
                    <v-img :src="data.item.thumbnail_url + '?api_id=' + api_id + '&api_key=' + api_key"></v-img>
                  </v-avatar>
                  {{ data.item.name }}
                </template>
                <template v-slot:item="data">
                  <template v-if="typeof data.item !== 'object'">
                    <v-list-item-content v-text="data.item"></v-list-item-content>
                  </template>
                  <template v-else>
                    <v-list-item-avatar>
                      <img :src="data.item.thumbnail_url + '?api_id=' + api_id + '&api_key=' + api_key">
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-html="data.item.name"></v-list-item-title>
                      <v-list-item-subtitle v-html="data.item.id"></v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </template>
              </v-select>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="title"
                    :append-outer-icon="marker ? 'mdi-pencil' : 'mdi-content-save'"
                    filled
                    label="Title"
                    type="text"
                    @click:append-outer="toggleMarker"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header v-slot="{ open }">
              <v-row no-gutters>
                <v-col cols="4">2. Select dates</v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <vue-ctk-date-time-picker
                class="datetime-picker"
                id="from_datetime"
                v-model="from_datetime"
                format='YYYY-MM-DD HH:mm'
                button-color="#68a2d5"
                color="#68a2d5"
                label="First"
                :disabled-dates="from_disabled_days"
                :disabled-hours="from_disabled_hours"
                noClearButton="true"
              />
              <vue-ctk-date-time-picker
                class="datetime-picker"
                id="to_datetime"
                format='YYYY-MM-DD HH:mm'
                v-model="to_datetime"
                button-color="#68a2d5"
                color="#68a2d5"
                label="Last"
                :disabled-dates="to_disabled_days"
                :disabled-hours="to_disabled_hours"
                noClearButton="true"
                right="true"
              />
              <VueCompareImage
                v-bind:leftImage="before_img"
                v-bind:rightImage="after_img"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header v-slot="{ open }">
              <v-row no-gutters>
                <v-col cols="4">3. Optional Settings</v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row
                justify="space-around"
                no-gutters
              >
                <div slot="content">
                  <div class="form-group">
                    <div class="row col-sm-12 pt-3">
                      <label class="font-weight-bold col-form-label col-sm-3">Restrict Hours Per Day</label>
                      <select
                        v-on:change="handleChange"
                        class="form-control col-sm-5"
                        id="schedule"
                        v-model="schedule"
                        name="schedule"
                      >
                        <option v-for="option in op_schedule" v-bind:value="option.value">
                          {{ option.text }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div v-if="schedule != 'continuous'" class="row form-group">
                    <label class="font-weight-bold col-form-label col-sm-3"></label>
                    <full-calendar
                      class="col-sm-9"
                      style="padding-left: 0px;"
                      ref="calendar"
                      :config="config"
                      :events="config.events"
                      :key="componentKey"
                    ></full-calendar>
                  </div>

                  <div class="form-group">
                    <div class="row col-sm-12">
                      <label class="font-weight-bold col-form-label col-sm-3">Logo</label>
                      <popper
                        class="col-sm-5 pl-0 pr-0"
                        trigger="hover"
                        :options="{
                          placement: 'right',
                          modifiers: { offset: { offset: '0,10px' } }
                        }">
                        <div class="popper">
                          <img style="max-height:600px;max-width:300px"v-if="watermark_logo" id="file-image"></img>
                          <p v-else>There's no logo</p>
                        </div>

                        <div slot="reference" class="custom-file">
                          <input type="file" class="custom-file-input" accept="image/x-png,image/jpeg" id="watermark_logo" ref="watermark_logo" @change="onFileChange">
                          <label class="custom-file-label" id="file-label" for="customFile">Choose file</label>
                        </div>
                      </popper>
                    </div>
                  </div>

                  <div class="form-group">
                    <div class="row col-sm-12">
                      <label for="duration" class="col-sm-3 font-weight-bold col-form-label">Output format</label>
                      <select
                        class="form-control col-sm-2"
                        id="format"
                        v-model="format"
                        name="format"
                      >
                        <option v-for="option in op_format" v-bind:value="option.value">
                          {{ option.text }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group">
                    <div class="row col-sm-12">
                      <label for="duration" class="col-sm-3 font-weight-bold col-form-label">Output duration</label>
                      <select
                        class="form-control col-sm-2"
                        id="duration"
                        v-model="duration"
                        name="duration"
                      >
                        <option v-if="format === 'mp4'" v-for="option in op_duration" v-bind:value="option.value">
                          {{ option.text }}
                        </option>
                        <option v-if="format === 'gif'" v-for="option in op_duration_gif" v-bind:value="option.value">
                          {{ option.text }}
                        </option>
                      </select>
                      <div v-if="duration === '0'" class="row form-group col-md-2" style="margin-left:5px;">
                        <input class="form-control" type="number" id="custom_duration" v-model="custom_duration">
                      </div>
                      <span v-if="duration === '0'" class="strong font-weight-normal">&nbsp;&nbsp;seconds, {{ custom_duration * 24 }} Frames playing at 24 FPS.</span>
                      <span v-else class="strong font-weight-normal">&nbsp;&nbsp;{{ duration * 24 }} Frames playing at 24 FPS.</span>
                      <span v-if="headers" class="strong font-weight-normal">&nbsp;&nbsp;(+ 4 seconds intro + 6 seconds outro)</span>
                    </div>
                  </div>

                  <div class="form-group">
                    <div class="row col-sm-12">
                      <label for="rm_date" class="col-sm-3 font-weight-bold col-form-label">Remove timestamp</label>
                      <select
                        class="form-control col-sm-2"
                        id="rm_date"
                        v-model="rm_date"
                        name="rm_date"
                      >
                        <option v-for="option in op_rm_date" v-bind:value="option.value">
                          {{ option.text }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group">
                    <div class="row col-sm-12">
                      <label class="font-weight-bold col-form-label col-sm-3"></label>
                      <label for="watermark" class="pl-0 pr-0 col-sm-9 font-weight-bold col-form-label">
                        <input class="custom-check" type="checkbox" id="watermark" v-model="watermark">
                        Add watermark
                      </label>
                    </div>
                  </div>

                  <div v-if="format === 'mp4'" class="form-group">
                    <div class="row col-sm-12">
                      <label class="font-weight-bold col-form-label col-sm-3"></label>
                      <label for="headers" class="pl-0 pr-0 col-sm-9 font-weight-bold col-form-label">
                        <input class="custom-check" type="checkbox" id="headers" v-model="headers">
                        Add headers
                      </label>
                    </div>
                  </div>
                </div>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              color="primary"
              dark
              v-on="on"
            >
              Create Time-lapse
            </v-btn>
          </template>

          <v-card>
            <v-card-title
              class="headline grey lighten-2"
              primary-title
            >
              Processing!
            </v-card-title>

            <v-card-text>
              We are processing your request. We will let you know when it is done
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="dialog = false"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </form>
    </div>
 </v-layout>
</template>

<style scoped>

.cont {
  width: 60%;
}

.card {
  margin-bottom: 0px !important;
}

.submit-button {
  margin-top: 1.5rem !important;
}

#to_datetime {
  right: 0px !important;
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
  max-width: 50px;
  max-height: 35px;
  margin-right: 10px;
  border: 1px solid #eaecf0;
}

.col-form-label {
  font-size: 14px;
}

.btn{
  padding: 7px;
}

.compare_section{
  padding: 0;
}

.date-time-picker{
  z-index: 1 !important;
  position: absolute !important;
  padding: 15px !important;
  width: 265px;
}

.compare-container {
  margin: 0px 120px !important;
  position: relative !important;
}

</style>

<script>
import FunctionalCalendar from 'vue-functional-calendar'
import moment from 'moment'
import Popper from 'vue-popperjs';
import 'vue-popperjs/dist/vue-popper.css';
import VueCompareImage from 'vue-compare-image';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import { CoolSelect, EventEmitter } from "vue-cool-select";
import { BulmaAccordion, BulmaAccordionItem } from 'vue-bulma-accordion'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import axios from 'axios'

export default {
  name: 'timelapse',
  components: {
    FunctionalCalendar,
    'popper': Popper,
    VueCompareImage,
    CoolSelect,
    BulmaAccordion,
    BulmaAccordionItem,
    VueCtkDateTimePicker
  },
  data: function() {
    return{
      dialog: false,
      password: 'Password',
      show: false,
      message: 'Hey!',
      marker: true,
      iconIndex: 0,
      icons: [
        'mdi-emoticon',
        'mdi-emoticon-cool',
        'mdi-emoticon-dead',
        'mdi-emoticon-excited',
        'mdi-emoticon-happy',
        'mdi-emoticon-neutral',
        'mdi-emoticon-sad',
        'mdi-emoticon-tongue',
      ],

      date: null,
      trip: {
        name: '',
        location: null,
        start: null,
        end: null,
      },
      locations: ['Australia', 'Barbados', 'Chile', 'Denmark', 'Equador', 'France'],
      ajaxWait: true,
      from_disabled_days: [],
      to_disabled_days: [],
      from_disabled_hours: [],
      to_disabled_hours: [],
      disableTitle: true,
      camera_id: "",
      before_img: '',
      after_img: '',
      from_datetime: moment().subtract(7, "days").format("YYYY-MM-DD hh:mm"),
      to_datetime: moment().format("YYYY-MM-DD hh:mm"),
      from: null,
      to: null,
      events: null,
      thumbnail: null,
      componentKey: 0,
      myschedule: JSON.stringify({
        "Monday": ["00:00-23:59"],
        "Tuesday": ["00:00-23:59"],
        "Wednesday": ["00:00-23:59"],
        "Thursday": ["00:00-23:59"],
        "Friday": ["00:00-23:59"],
        "Saturday": ["00:00-23:59"],
        "Sunday": ["00:00-23:59"]
      }),
      value:{
        start: "2019-01-07",
        end: "2019-01-07"
      },
      config: {
        axisFormat: 'HH',
        allDaySlot: false,
        columnFormat: 'ddd',
        defaultDate: '1969-12-29',
        slotDuration: '00:60:00',
        defaultView: 'agendaWeek',
        dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        eventColor: '#007bff',
        editable: true,

        eventLimit: true,
        eventOverlap: false,
        firstDay: 1,
        agoDayHide: 0,
        header: {
          left: '',
          center: '',
          right: '',
        },
        height: 'auto',
        selectHelper: true,
        selectable: true,
        timezone: 'local',
        select: (start, end) => {
          let eventData
          eventData = {
            start: start,
            end: end
          }
          this.$refs.calendar.fireMethod('renderEvent', eventData, true);
          this.$refs.calendar.fireMethod('unselect');
          var schedule = JSON.stringify(this.parseCalendar());
          this.myschedule = schedule
        },
        eventClick: (event, element) => {
          event.preventDefault
          if (window.confirm("Are you sure you want to delete this event?")){
            this.$refs.calendar.fireMethod('removeEvents', event._id);
          }
        },
        eventResize: (event) => {
          this.$refs.calendar.$emit('refetch-events')
          var schedule = JSON.stringify(this.parseCalendar());
          this.myschedule = schedule
        }
      },
      eventData: {
        start: null,
        end: null,
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
          dayNames: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
          monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          isModal: true,
          applyStylesheet: true,
        }
      },
      cameras: [],
      camera_id: null,
      camera_name: null,
      schedule: 'continuous',
      title: null,
      editedTitle: null,
      create: false,
      duration: '15',
      custom_duration: 3,
      format: 'mp4',
      headers: false,
      watermark: false,
      watermark_logo: null,
      date_range: '7',
      items: [],
      selected: null,
      loading: false,
      selectEventEmitter: new EventEmitter(),
      rm_date: false,
      op_rm_date: [
        { text: 'Yes', value: true },
        { text: 'No', value: false }
      ],
      op_date: [
        { text: 'Last 7 days', value: '7' },
        { text: 'Last 30 days', value: '30' },
        { text: 'Last 90 days', value: '90' },
        { text: 'All project', value: 'all' },
        { text: 'Specific day', value: 'day' },
        { text: 'Custom', value: 'custom' }
      ],
      op_position: [
        { text: 'Bottom-left', value: '0' },
        { text: 'Top-right', value: '1' },
        { text: 'Bottom-right', value: '2' },
        { text: 'Top-left', value: '3' }
      ],
      op_schedule: [
        { text: '24/7 (Use all available footage)', value: 'continuous' },
        { text: 'Working Hours (Mon-Fri 7am to 6pm , Sat 7am to 12pm)', value: 'working_hours' },
        { text: 'Custom', value: 'random_hours' }
      ],
      op_duration: [
        { text: '15 sec', value: '15' },
        { text: '30 sec', value: '30' },
        { text: '45 sec', value: '45' },
        { text: '1 min', value: '60' },
        { text: '1 min 30 sec', value: '90' },
        { text: '2 min', value: '120' },
        { text: '2 min 30 sec', value: '150' },
        { text: '3 min', value: '180' },
        { text: '5 min', value: '300' },
        { text: 'Custom', value: '0' }
      ],
      op_duration_gif: [
        { text: '3 sec', value: '3' },
        { text: '4 sec', value: '4' },
        { text: '5 sec', value: '5' }
      ],
      op_format: [
        { text: 'MP4', value: 'mp4' },
        { text: 'GIF', value: 'gif' }
      ]
    }
  },
  watch: {
    from_datetime: function () {
      if (!this.selected.exid) {
        this.$notify({
          group: 'notify',
          type: 'warn',
          title: 'Important message',
          text: 'Camera required'
        })
      } else {
        this.from_disabled_days = this.get_disable_dates(this.from_datetime)
        this.from_disabled_hours = this.get_disable_hours(this.from_datetime)
        this.editTitle()
        console.log(this.from_datetime);
        let from_timestamp = moment(this.from_datetime).subtract(1, 'hours').format("YYYY-MM-DDTHH:mm:ss.000+00:00")
        axios.get(process.env.API_URL + "cameras/" + this.selected.exid + "/recordings/snapshots/" + from_timestamp + "/nearest/?api_id=" + this.api_id + "&api_key=" + this.api_key).then(response => {
          if (response.body.snapshots.length == 0) {
            console.log("From image not found");
          }else{
             this.before_img = response.body.snapshots[0].data
          }
        });
      }
    },

    to_datetime: function () {
      if (!this.selected.exid) {
        this.$notify({
          group: 'notify',
          type: 'warn',
          title: 'Important message',
          text: 'Camera required'
        })
      } else {
        this.to_disabled_days = this.get_disable_dates(this.to_datetime)
        this.to_disabled_hours = this.get_disable_hours(this.to_datetime)
        this.editTitle()
        let to_timestamp = moment(this.to_datetime).subtract(1, 'hours').format("YYYY-MM-DDTHH:mm:ss.000+00:00")
        axios.get(process.env.API_URL + "cameras/" + this.selected.exid + "/recordings/snapshots/" + from_timestamp + "/nearest/?api_id=" + this.api_id + "&api_key=" + this.api_key).then(response => {
          if (response.body.snapshots.length == 0) {
            console.log("To image not found");
          }else{
             this.after_img = response.body.snapshots[0].data
          }
        });
      }
    }
  },

  computed: {
    icon () {
      return this.icons[this.iconIndex]
    },
  },

  mounted() {
    axios.get(process.env.API_URL + "/auth/credentials").then(response => {
      this.api_key = response.data.api_key;
      this.api_id = response.data.api_id;
    });
    this.getCameras()
    //this.editTitle()
  },

  methods: {
    toggleMarker () {
      this.marker = !this.marker
    },
    sendMessage () {
      this.clearMessage()
    },
    clearMessage () {
      this.message = ''
    },
    editTitle() {
      this.title = this.selected.name + " - " + moment(this.from_datetime).format("YYYY-MM-DD HH:mm") + " - " + moment(this.to_datetime).format("YYYY-MM-DD HH:mm") + " (" + this.format.toUpperCase() + " " + this.duration + " sec.)"
      this.editedTitle = this.title
    },

    arrayDiff(a1, a2) {
      var o1={}, o2={}, diff=[], i, len, k;
      for (i=0, len=a1.length; i<len; i++) { o1[a1[i]] = true; }
      for (i=0, len=a2.length; i<len; i++) { o2[a2[i]] = true; }
      for (k in o1) { if (!(k in o2)) { diff.push(k); } }
      for (k in o2) { if (!(k in o1)) { diff.push(k); } }
      return diff;
    },

    get_disable_dates(date){

      let first_day = moment(date).format("DD")
      let last_day = moment(date).endOf("month").format("DD")
      let year = moment(date).format("YYYY")
      let month = moment(date).format("MM")

      let month_all_days = []
      for(let i = 1; i <= last_day; i++ ){
        month_all_days.push(i)
      }

      let availible_days;
      let disabled_days_value = [];
      axios.get('https://media.evercam.io/v2/cameras/'+this.selected.exid+'/recordings/snapshots/'+year+'/'+month+'/days?api_id='+this.api_id+'&api_key='+this.api_key).then(response => {
        availible_days = response.body.days
        let days_diff = this.arrayDiff(month_all_days, availible_days);
        days_diff.forEach(function(day) {
          let month_val = ('0' + month).slice(-2)
          let day_val = ('0' + day).slice(-2)
          let complete_date = year + "-" + month_val + "-" + day_val
          disabled_days_value.push(complete_date)
        })
      });
      return disabled_days_value;
    },

    get_disable_hours(date){
      let first_day = moment(date).format("DD")
      let year = moment(date).format("YYYY")
      let month = moment(date).format("MM")

      let availible_hours
      let disabled_hours_value = [];
      axios.get('https://media.evercam.io/v2/cameras/'+this.selected.exid+'/recordings/snapshots/'+year+'/'+month+'/'+first_day+'/hours?api_id='+this.api_id+'&api_key='+this.api_key).then(response => {
        availible_hours = response.body.hours
        for(let i = 0; i <= 23; i++ ){
          if (!availible_hours.includes(i)){
            let hour_val = ('0' + i).slice(-2)
            disabled_hours_value.push(hour_val)
          }
        }
      });
      return disabled_hours_value;
    },

    onSelect(data){
      this.compare_images(data.exid)
    },

    async onSearch(search) {
      this.noData = false;
      this.loading = true;
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(async () => {
        const response = await fetch(
          `/v1/cameras?search=${search}`
        );
        this.items = await response.json();
        this.loading = false;
        if (!this.items.length) this.noData = true;
      }, 500);
    },

    compare_images(camera_id){
      console.log(camera_id);
      axios.get(process.env.API_URL + 'cameras/'+camera_id+'/recordings/snapshots/oldest').then(response => {
        this.before_img = response.body.data
        this.from_datetime = moment(response.body.created_at).format("YYYY-MM-DD HH:mm")
        this.from_disabled_days = this.get_disable_dates(response.body.created_at)
      });
      axios.get(process.env.API_URL + 'cameras/'+camera_id+'/recordings/snapshots/latest').then(response => {
        this.after_img = response.body.data
        this.to_datetime =  moment(response.body.created_at).format("YYYY-MM-DD HH:mm")
        this.to_disabled_days = this.get_disable_dates(response.body.created_at)
      });
    },

    getCameras() {
      axios.get(process.env.API_URL + 'cameras').then(response => {
        let items = response.data.cameras
        this.items = items
        this.selected = items[0]
        console.log(this.selected);
        this.compare_images(this.selected.id)
        this.ajaxWait = false;
        this.editTitle()
      }).catch(function (error) {
        return []
      });
    },
    getDates() {
      var d = new Date();
      this.from_datetime = d.getFullYear() + "-" + (parseInt(d.getMonth()) + 1) + "-" + (parseInt(d.getDate()) - 1) + " " + (parseInt(d.getHours()) + 1) + ":" + d.getMinutes()
      this.to_datetime = d.getFullYear() + "-" + (parseInt(d.getMonth()) + 1) + "-" + d.getDate() + " " + (parseInt(d.getHours()) + 1) + ":" + d.getMinutes()
    },
    filterFunction() {
      var input, filter, div, a, i, txtValue;
      input = this.$refs.myInput;
      filter = input.value.toUpperCase();
      div = this.$refs.myDropdown;
      a = div.getElementsByTagName("a");
      for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          a[i].style.display = "";
        } else {
          a[i].style.display = "none";
        }
      }
    },
    isFutureDate(date) {
        const currentDate = new Date();
        //const pastDate = new Date('2018', '10', '01');
        //if (pastDate > date){
        //  return date
        //}
        return date > currentDate;
    },
    handleChange: function(){
      if (this.schedule === "continuous"){
        this.myschedule = {
          "Monday": ["00:00-23:59"],
          "Tuesday": ["00:00-23:59"],
          "Wednesday": ["00:00-23:59"],
          "Thursday": ["00:00-23:59"],
          "Friday": ["00:00-23:59"],
          "Saturday": ["00:00-23:59"],
          "Sunday": ["00:00-23:59"]
        }
        this.myschedule = JSON.stringify(this.myschedule);
        this.config.events = null
        this.config.eventSources = null
      } else {
        if (this.schedule === "working_hours"){
          this.config.editable = false
          this.config.selectable = false
          if (!this.config.events){
            this.config.events = [
              {
                _id: "0",
                start: '1969-12-29T07:00:00',
                end: '1969-12-29T18:00:00',
              },
              {
                _id: "1",
                start: '1969-12-30T07:00:00',
                end: '1969-12-30T18:00:00',
              },
              {
                _id: "2",
                start: '1969-12-31T07:00:00',
                end: '1969-12-31T18:00:00',
              },
              {
                _id: "3",
                start: '1970-01-01T07:00:00',
                end: '1970-01-01T18:00:00',
              },
              {
                _id: "4",
                start: '1970-01-02T07:00:00',
                end: '1970-01-02T18:00:00',
              },
              {
                _id: "5",
                start: '1970-01-03T07:00:00',
                end: '1970-01-03T12:00:00',
              },
            ]
          }
          this.myschedule = {
            "Monday": ["07:00-18:00"],
            "Tuesday": ["07:00-18:00"],
            "Wednesday": ["07:00-18:00"],
            "Thursday": ["07:00-18:00"],
            "Friday": ["07:00-18:00"],
            "Saturday": ["07:00-12:00"],
            "Sunday": []
          }
          this.myschedule = JSON.stringify(this.myschedule);
        } else if (this.schedule === "random_hours") {
          this.config.editable = true
          this.config.selectable = true
          var events = this.$refs.calendar.fireMethod('clientEvents');
          events.preventDefault
          for (var i = 0; i < events.length; i++) {
            this.$refs.calendar.fireMethod('removeEvents', events[i]._id);
          }
          this.config.events = null
          this.config.eventSources = null
        }
      }
      this.componentKey += 1;
    },

    checkForm2: function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    },

    checkForm: function (e) {
      if (this.selected) {
        let formData = new FormData();
        formData.append('camera', this.selected.exid)
        formData.append('from_datetime', this.from_datetime)
        formData.append('to_datetime', this.to_datetime)
        formData.append('title', this.title)
        formData.append('analyze', this.analyze)
        formData.append('headers', this.headers)
        formData.append('watermark', this.watermark)
        formData.append('schedule', this.myschedule)
        formData.append('format', this.format)
        formData.append('rm_date', this.rm_date)
        if (this.duration === "0"){
          formData.append('duration', this.custom_duration)
        } else {
          formData.append('duration', this.duration)
        }
        if (this.watermark_logo) {
          formData.append('watermark_position',this.watermark_position)
          formData.append('watermark_logo',this.watermark_logo)
        }

        axios.post('/v1/timelapse', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }).then(function (response) {
          if (response.status != 201) {
            this.clearForm();
          }else{
            this.clearForm();
          }
        }).catch(function (error) {
          this.clearForm();
        });
      }

      if (!this.selected) {
        // var d = document.getElementById("selected");
        // d.className += " is_invalid";
        // this.$notify({
        //   group: 'notify',
        //   type: 'warn',
        //   title: 'Important message',
        //   text: 'Camera required'
        // })
      }

      if (this.duration === "0" && this.custom_duration <= 0){
        this.$notify({
          group: 'notify',
          type: 'warn',
          title: 'Important message',
          text: 'Duration required'
        })
      }

      e.preventDefault();
    },
    clearForm: function() {
      this.title = null;
      this.camera_id = null;
      this.camera_name = null;
      this.date_range = '7';
      this.from= null;
      this.to= null;
      this.schedule= 'continuous';
      this.duration= '15';
      this.headers= false;
      this.format= 'mp4';
      this.rm_date= false;
      this.selectEventEmitter.emit("set-search", "");
    },
    onFileChange(e) {
      this.watermark_logo = e.target.files[0]
      var reader = new FileReader();
      reader.onload = function (e) {
          document.getElementById('file-image').src = e.target.result
      }
      reader.readAsDataURL(e.target.files[0]);
      document.getElementById('file-label').innerHTML = this.watermark_logo.name;
    },
    fileMouseOver() {

    },
    parseCalendar: function() {
      var events = this.$refs.calendar.fireMethod('clientEvents');
      var schedule = {
        'Monday': [],
        'Tuesday': [],
        'Wednesday': [],
        'Thursday': [],
        'Friday': [],
        'Saturday': [],
        'Sunday': [],
      }
      events.map(function(event){
        var endTime = ''
        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        var startTime = moment(event.start).get('hours');
        var endTime = moment(event.end).get('hours');
        var day = moment(event.start).get('day');
        schedule[days[day]] = schedule[days[day]].concat(startTime + "-" + endTime)
      });
      return schedule
    }
  }
}
</script>
