<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';

export default defineComponent({
  name: 'App',

  mounted() {
    //Controls login
    const auth = useAuthStore();
    auth.handleAuthStateChange();
  },
});
</script>
