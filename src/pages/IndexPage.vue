<template>
  <div>
    <div class="logoDiv row justify-center">
      <q-img
        class="logo col-md-6 col-12"
        src="../../public/icons/logo.png"
        spinner-color="white"
        style="height: 200px; max-width: 200px"
      />
    </div>
    <div class="row justify-center">
      <q-btn
        to="/signUp"
        class="btnSignIn col-6"
        color="primary"
        label="Sign up"
      />
    </div>
    <div class="row justify-center">
      <q-btn
        to="/logIn"
        flat
        class="q-mt-sm col-6"
        color="white"
        label="Log in"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'IndexPage',
};
</script>

<style scoped lang="scss">
.logoDiv {
  margin: 20px;
  margin-top: 50px;
  margin-bottom: 100px;
}

.logo {
  max-width: 280px !important;
}
</style>