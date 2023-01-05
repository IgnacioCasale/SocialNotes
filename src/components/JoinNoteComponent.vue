<template>
  <q-dialog v-model="confirm" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Paste the shared code to join:</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          outline
          v-model="idNoteInput"
          label="Code"
          @keyup.enter="confirm = false"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat color="white" label="Cancel" v-close-popup />
        <q-btn
          flat
          label="Join Note"
          v-close-popup
          @click="main.joinToNote(idNoteInput)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <div v-if="!yourNotes" class="row justify-center q-mb-sm">
    <q-btn
      @click="confirm = true"
      class="buttonJoinNote"
      icon="add"
      label="Join to note"
    />
  </div>
</template>

<script lang="ts">
import { useMainStore } from 'src/stores/main-store';

export default {
  data() {
    const main = useMainStore();

    return {
      main,
      idNoteInput: '',
      confirm: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.q-card {
  background-color: $secondary;
  padding: 20px;
}

.text-h6 {
  font-size: 18px;
}

:deep(.q-field__label) {
  color: rgb(183, 183, 183) !important;
}
.buttonJoinNote {
  color: white !important;
  border: 1px solid $primary;
  background-color: $background;
}
</style>