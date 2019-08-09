<template>
  <v-app id="login" class="primary">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <img src="https://evercam.io/wp-content/uploads/2016/07/EVERCAM-475x100-Transparent.png" alt="Evercam Construction Cameras" width="100%">
                </div>
                <v-form
                ref="model">
                  <v-text-field name="login" label="Login" type="text"
                                v-model="model.username"></v-text-field>
                  <v-text-field name="password" label="Password" id="password" type="password"
                                v-model="model.password"></v-text-field>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn block color="primary" @click="preformLogin" :loading="loading">Login</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<style scoped lang="css">
  #login {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
  }
</style>

<script>
  import { mapActions } from 'vuex'
  import axios from 'axios'
  import { LOGIN } from '@/store/types/actions'

  export default {
    layout: 'clean',
    middleware: 'unauth',
    data: () => ({
      loading: false,
      model: {
        username: '',
        password: ''
      }
    }),

    methods: {
      ...mapActions({ login: LOGIN }),
      preformLogin() {
        const form = this.model
        this.login({ form })
      },
    }

  };
</script>
