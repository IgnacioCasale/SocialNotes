
<template>
  <div class="mainDiv">
    <div class="row justify-center">
      <div
        class="tabNotes"
        v-bind:class="{ tabNoteActive: !privateNote }"
        @click="privateNote = true"
      >
        Your Notes
      </div>
      <div
        class="tabNotes"
        v-bind:class="{ tabNoteActive: privateNote }"
        @click="privateNote = false"
      >
        Shared Notes
      </div>
    </div>

    <q-btn
      @click="main.createNewPrivateNote"
      round
      class="addNoteButton"
      color="primary"
      icon="add"
    />

    <JoinNoteComponent v-if="!privateNote" />
    <div class="allNotesDiv">
      <NoteComponent
        v-if="privateNote"
        :privateNote="true"
        :otherUserNote="false"
        :notes="main.getUserOwnNotes"
      />
      <NoteComponent
        v-if="!privateNote"
        :privateNote="false"
        :otherUserNote="false"
        :notes="main.getUserOwnNotes"
      />
      <NoteComponent
        v-if="!privateNote"
        :privateNote="false"
        :otherUserNote="true"
        :notes="main.getOtherUsersNotes"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { useMainStore } from 'src/stores/main-store';
import NoteComponent from 'src/components/NoteComponent.vue';
import JoinNoteComponent from 'src/components/JoinNoteComponent.vue';

export default {
  components: {
    NoteComponent,
    JoinNoteComponent,
  },
  data() {
    const main = useMainStore();

    return {
      privateNote: true,
      main,
    };
  },
};
</script>

<style scoped lang="scss">
.mainDiv {
  background-color: $secondary !important;
  height: 100vh;
  width: 100%;
  padding-top: 60px;
  position: absolute;
  top: 0;
  right: 1;
  overflow: hidden;
}

.allNotesDiv {
  overflow-y: scroll;
  height: 100vh;
  padding-bottom: 150px;
}

.addNoteButton {
  position: absolute;
  bottom: 30px;
  right: 30px;
  z-index: 11;
  color: $secondary !important;
  box-shadow: 0px 0px 4px 1px grey;
}

.deleteNoteDialog {
  background-color: $background;
}

.tabNotes {
  color: white;
  border-radius: 10px;
  padding: 4px 8px 4px 8px;
  margin: 5px;
  margin-top: 0px;
  margin-bottom: 10px;
  cursor: pointer;
  box-shadow: inset 0px 0px 5px $primary;
}

.tabNoteActive {
  background-color: $primary;
  color: $secondary;
  box-shadow: 0px 0px 4px 1px grey;
}
</style>