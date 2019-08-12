<template>
  <div>
    <v-layout>
      <VueCompareImage
        :left-image="require('~/static/favicon.png')"
        :right-image="require('~/static/favicon.png')"
      />
      <span class="timer" data-from="25" data-to="75" />
      <div class="inner" />
      <p>Date: <input id="datepicker" type="text" /></p>
    </v-layout>
  </div>
</template>

<script>
import VueCompareImage from "vue-compare-image"
import $ from "jquery"
import "jquery-ui/ui/widgets/datepicker"
import "jquery-ui/themes/base/datepicker.css"
import "jquery-ui/themes/base/theme.css"

export default {
  components: { VueCompareImage },
  mounted() {
    //do something after mounting vue instance
    //$(".timer").countTo()
    $(".inner").append("<h2>Compare component</h2>")
    $("#datepicker").datepicker()
  }
}
</script>
