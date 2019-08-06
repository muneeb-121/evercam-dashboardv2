<template>
  <v-app dark>
    <left />
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Left from '~/components/left.vue'

export default {
  middleware: 'auth',
  components: {
    Left
  }
}
</script>
