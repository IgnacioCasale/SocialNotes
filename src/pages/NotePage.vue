<template>
  <div class="header row justify-between items-center">
    <q-btn to="/main" class="backButtonHeader" label="&#60; back" />
    <div class="cursor-pointer">
      <p class="tittleNoteHeader">
        {{ tittleNote[this.$route.params.id]['tittle'] }}
      </p>
      <q-popup-edit v-model="tittleNote" auto-save v-slot="scope">
        <q-input
          v-model="scope.value[this.$route.params.id]['tittle']"
          dense
          autofocus
          counter
          class="inputTittle"
          @keyup.enter="scope.set"
          @keydown="updateTittleNote(scope.value)"
          maxlength="25"
        />
      </q-popup-edit>
    </div>
  </div>
  <div v-if="ownNote" class="divNoteInput">
    <q-input
      v-model="this.main.getUserOwnNotes[this.$route.params.id]['text']"
      filled
      @keydown="updateTextNote()"
      type="textarea"
      class="noteInput"
      ref="inputField"
    />
  </div>

  <div v-else class="divNoteInput">
    <q-input
      v-model="this.main.getOtherUsersNotes[this.$route.params.id]['text']"
      filled
      @keydown="updateTextNote()"
      type="textarea"
      class="noteInput"
      ref="inputField"
    />
  </div>
</template>

<script lang="ts">
import { useMainStore } from 'src/stores/main-store';
import { QuasarConfProxy } from '@quasar/app-vite';

export default {
  data() {
    const main = useMainStore();
    return {
      main,
      text: {},
      tittleNote: {},
      userNoteID: '',
      ownNote: true,
    };
  },

  beforeMount() {
    this.text = this.getNoteData();
    this.tittleNote = this.getNoteData();
    if (this.main.getOtherUsersNotes[this.$route.params.id as keyof object]) {
      this.userNoteID =
        this.main.getOtherUsersNotes[this.$route.params.id as keyof object][
          'user'
        ];
    }
  },

  methods: {
    updateTittleNote(scope: object) {
      setTimeout(() => {
        if (this.ownNote == false) {
          this.main.updateOtherUserTittleNoteFirebase(
            this.$route.params.id,
            scope,
            this.userNoteID
          );
        } else {
          this.main.updateTittleNoteFirebase(this.$route.params.id, scope);
        }
      }, 250);
    },

    updateTextNote() {
      setTimeout(() => {
        const inputValue = (this.$refs['inputField'] as QuasarConfProxy)
          .modelValue;

        console.log(inputValue);
        if (this.ownNote == false) {
          this.main.updateOtherUserTextNoteFirebase(
            this.$route.params.id,
            inputValue,
            this.userNoteID
          );
        } else {
          this.main.updateTextNoteFirebase(this.$route.params.id, inputValue);
        }
      }, 250);
    },

    getNoteData() {
      if (
        this.main.getUserOwnNotes[this.$route.params.id as keyof object] != null
      ) {
        this.ownNote = true;
        return this.main.getUserOwnNotes;
      } else {
        this.ownNote = false;
        return this.main.getOtherUsersNotes;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.q-btn {
  padding: 0px !important;
}

.header {
  position: absolute;
  top: 0;
  right: 0;
  background-color: $background;
  border-bottom: 1px solid $primary;
  height: 50px;
  width: 100%;
  z-index: 10;
  padding: 10px;
}

.backButtonHeader {
  text-transform: uppercase;
}

.tittleNoteHeader {
  text-transform: uppercase;
  letter-spacing: 1px;
  max-width: 180px;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  background-color: $secondary;
  margin: 0px;
  padding: 3px;
  padding-left: 8px;
  padding-right: 6px;
  padding-bottom: 0px;
  border-top-left-radius: 10px;
  border-right: 1px solid $primary;
}

.inputTittle {
  :deep(.q-field__native) {
    color: black !important;
  }
}

.noteInput {
  background-color: $secondary;
  position: absolute;
  top: 0;
  height: 100vh !important;
  width: 100%;
  padding-top: 50px;
  :deep(.q-field__control) {
    height: 100%;
    width: 100%;
    padding-right: 0px;
  }
  :deep(.q-field__native) {
    padding-bottom: 50px;
    padding-right: 10px;
  }
}
</style>