<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="header">
      <q-toolbar>
        <q-toolbar-title>
          <q-img
            src="../../public/icons/logoIcon.png"
            spinner-color="white"
            style="height: 40px; max-width: 40px"
          />
        </q-toolbar-title>

        <q-btn
          flat
          color="orange"
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="right" bordered>
      <q-list>
        <q-item-label header> Menu </q-item-label>

        <div @click="auth.logOutUser" class="q-ml-lg">
          <q-icon color="red" style="font-size: 25px" name="logout" />
          {{ essentialLinks[0].title }}
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { useAuthStore } from 'src/stores/auth-store';
import { defineComponent, ref } from 'vue';

const linksList = [
  {
    title: 'Log out',
    caption: '',
    icon: 'logout',
    link: 'https://quasar.dev',
  },
];

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const auth = useAuthStore();
    const leftDrawerOpen = ref(false);

    return {
      auth,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>

<style scoped lang="scss">
.header {
  background-color: $background;
}

:deep(.q-item__section--avatar) {
  color: red;
}

:deep(.q-item__label) {
  color: white;
  text-transform: uppercase;
}

:deep(.q-drawer__content) {
  background-color: $background;
}
</style>
