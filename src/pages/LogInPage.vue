<template>
  <div class="q-mt-sm row text-center justify-center">
    <h6 class="q-mb-lg q-mt-lg col-12 q-mt-none">Welcome!</h6>

    <div class="col-12 flex justify-center">
      <q-input
        style="max-width: 400px; width: 85vw"
        filled
        v-model="email"
        class="col-12 q-mt-sm"
        placeholder="Email"
        type="email"
        lazy-rules
        ref="email"
        :rules="[(val) => isValidEmail(val) || 'Write a valid email']"
      >
      </q-input>
    </div>

    <div class="col-12 flex justify-center">
      <q-input
        style="max-width: 400px; width: 85vw"
        filled
        v-model="password"
        class="q-mt-none"
        placeholder="Password"
        type="password"
        ref="password"
        :rules="[(val) => !!val || '* Required']"
      >
      </q-input>
    </div>
  </div>

  <div class="row flex justify-center">
    <form @submit.prevent="submit">
      <q-btn
        :disable="email.length == 0 || password.length == 0"
        type="submit"
        style="width: 85vw; max-width: 400px"
        class="col-12 q-mt-lg logInButton"
        label="Log In"
        color="primary"
      />
    </form>
    <div class="col-12 q-mt-sm flex justify-center">
      <q-btn
        style="width: 85vw; max-width: 400px"
        flat
        label="Back to Home"
        color="white"
        to="/"
      />
    </div>
  </div>
</template>


<script lang="ts">
import { QuasarConfProxy } from '@quasar/app-vite';
import { useAuthStore } from '../stores/auth-store';

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },

  methods: {
    //Check if email is valid
    isValidEmail(email: string) {
      var re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },

    submit() {
      (this.$refs.email as QuasarConfProxy).validate();
      (this.$refs.password as QuasarConfProxy).validate();
      if (
        !(this.$refs.email as QuasarConfProxy).hasError &&
        !(this.$refs.password as QuasarConfProxy).hasError
      ) {
        const auth = useAuthStore();
        auth.logInUser(this.email, this.password);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.logInButton {
  color: $secondary !important;
}
</style>