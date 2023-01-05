<template>
  <q-carousel
    transition-prev="scale"
    transition-next="scale"
    animated
    control-color="primary"
    padding
    v-model="slide"
    class="carousel"
  >
    <q-carousel-slide :name="1" class="column no-wrap flex-center">
      <q-icon name="contact_mail" color="primary" size="90px" />

      <div class="q-mt-sm text-center">
        <h6 class="q-mb-lg q-mt-none">Who are you?</h6>
        <q-input
          style="max-width: 400px; width: 85vw"
          filled
          v-model="name"
          class="col q-mt-none"
          placeholder="Full name"
          type="text"
          ref="name"
          :rules="[(val) => !!val || '* Required']"
        >
        </q-input>
        <q-input
          style="max-width: 400px; width: 85vw"
          filled
          v-model="email"
          class="col q-mt-sm"
          placeholder="Email"
          type="email"
          lazy-rules
          ref="email"
          :rules="[(val) => isValidEmail(val) || 'Write a valid email']"
        >
        </q-input>
      </div>

      <div class="row flex justify-center">
        <form @submit.prevent="submitEmail">
          <q-btn
            :disable="email.length == 0 || name.length == 0"
            type="submit"
            style="width: 85vw; max-width: 400px"
            class="col-12 q-mt-lg nextStepButton"
            label="Next Step"
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
    </q-carousel-slide>

    <q-carousel-slide :name="2" class="column no-wrap flex-center">
      <q-icon name="security" color="primary" size="90px" />

      <div class="q-mb-sm row text-center justify-center">
        <h6 class="q-mb-lg q-mt-sm col-12">Last Step! Set a password!</h6>

        <div class="row q-mb-lg justify-center">
          <q-input
            v-model="password"
            class="col-10"
            placeholder="Password"
            type="password"
            lazy-rules
            ref="password"
            :rules="[
              (val) => val.length >= 6 || 'Minimum 6 characters required.',
            ]"
          >
            <template v-slot:prepend>
              <q-icon color="white" name="lock" />
            </template>
          </q-input>
          <q-input
            v-model="password2"
            class="col-10"
            placeholder="Re-enter the password"
            type="password"
            lazy-rules
            ref="password2"
            :rules="[
              (val) => password == password2 || 'Passwords do not match',
            ]"
          >
            <template v-slot:prepend>
              <q-icon color="white" name="lock" />
            </template>
          </q-input>
        </div>
      </div>

      <div class="row flex justify-center">
        <form @submit.prevent="createAccount">
          <q-btn
            :disable="password != password2 || !password"
            type="submit"
            style="width: 85vw; max-width: 400px"
            class="col-12 q-mt-none nextStepButton"
            label="Set password"
            color="primary"
          />
        </form>
        <div class="col-12 q-mt-sm flex justify-center">
          <q-btn
            style="width: 85vw; max-width: 400px"
            flat
            label="Back"
            color="white"
            @click="slide = 1"
          />
        </div>
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth-store';

export default {
  data() {
    return {
      email: '',
      name: '',
      password: '',
      password2: '',
      slide: ref(1),
      lorem:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.',
    };
  },

  methods: {
    //Check if email is valid
    isValidEmail(email: string) {
      var re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },

    //For slide 1. Check the email for errors.
    submitEmail() {
      this.$refs.email.validate();
      if (!this.$refs.email.hasError) this.slide = 2;
    },

    //For slide 2. Create a account
    createAccount() {
      //Call signInStore. email password
      this.$refs.password.validate();
      this.$refs.password2.validate();
      if (!this.$refs.password.hasError && !this.$refs.password2.hasError) {
        const auth = useAuthStore();
        auth.sigUpUser(this.email, this.password, this.name);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.carousel {
  height: 100vh;
  max-height: 100%;
  background-color: $background;
}

.nextStepButton {
  color: $secondary !important;
}
</style>