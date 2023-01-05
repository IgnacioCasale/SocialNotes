<template>
  <div>
    <q-dialog v-model="deleteConfirm" persistent>
      <q-card class="deleteNoteDialog">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Do you want to delete this note?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="white" v-close-popup />
          <q-btn
            @click="deleteThisNote"
            flat
            label="Delete"
            v-close-popup
            color="red"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="shareConfirm">
      <q-card class="deleteNoteDialog">
        <q-card-section class="row items-center justify-center">
          <span class="q-ml-sm q-mb-md"
            >Copy the following code and send it to your friends</span
          >
          <div class="codeToShare">
            <b>{{ idUserNote }}/{{ shareNoteID }}</b>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            @click="shareNote"
            flat
            label="Copy"
            v-close-popup
            color="orange"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="column reverse">
      <div
        v-for="(data, key) in notes"
        :key="key"
        :data="data"
        class="row justify-center reverseNotesDiv"
      >
        <q-card
          v-if="
            (!privateNote && notes[key]['private'] == false) ||
            (privateNote && notes[key]['private'] == true)
          "
          class="my-card"
          flat
          bordered
        >
          <q-card-section horizontal>
            <div @click="navigateToNote(key)" class="noteDiv">
              <p class="tittleCard">
                {{ notes[key]['tittle'] }}
              </p>

              <p class="textNote">
                {{ notes[key]['text'] }}
              </p>
            </div>

            <q-card-actions vertical class="justify-around q-px-md">
              <q-btn
                @click="
                  (shareConfirm = true) &&
                    (shareNoteID = key) &&
                    (idUserNote = notes[key]['user'])
                "
                flat
                round
                color="white"
                icon="share"
              />
              <q-btn
                flat
                round
                color="white"
                icon="delete"
                @click="
                  (deleteConfirm = true) &&
                    (idDeletedNote = key) &&
                    (idUserNote = notes[key]['user'])
                "
              />
            </q-card-actions>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import { useMainStore } from 'src/stores/main-store';
import { copyToClipboard } from 'quasar';

export default {
  data() {
    const main = useMainStore();
    const router = useRouter();

    return {
      main,
      deleteConfirm: false,
      shareConfirm: false,
      shareNoteID: '',
      idDeletedNote: '',
      idUserNote: '',
      textToClipboard: '',
      route: router,
    };
  },
  props: {
    notes: Object,
    privateNote: Boolean,
    otherUserNote: Boolean,
  },

  methods: {
    navigateToNote(key: string) {
      this.route.push('/note/' + key);
    },

    deleteThisNote() {
      if (this.otherUserNote) {
        this.main.deleteOtherUserNoteFirebase(
          this.idDeletedNote,
          this.idUserNote
        );
      } else {
        this.main.deleteOwnNoteFirebase(this.idDeletedNote);
      }
    },

    shareNote() {
      if (!this.otherUserNote) this.main.changeNoteToPublic(this.shareNoteID);
      copyToClipboard(this.idUserNote + '/' + this.shareNoteID)
        .then(() => {
          // success!
        })
        .catch(() => {
          // fail
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.reverseNotesDiv {
  max-width: 100vw;
}

.deleteNoteDialog {
  background-color: $background;
}

.my-card {
  background-color: $background;
  min-width: 50px;
  border: 1px solid $primary;
  margin-bottom: 10px;
}

.tittleCard {
  text-transform: uppercase;
  font-weight: 600;
  margin: 10px;
  margin-bottom: 0px;
  padding: 0px !important;
  color: white !important;
  letter-spacing: 2px;
  font-size: 16px;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 23px;
}

.textNote {
  margin-bottom: 0px !important;
  color: white;
  padding: 12px;
  padding-top: 3px;
  max-height: 40px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  font-size: 14px;
}

.noteDiv {
  width: 500px;
  max-width: 600px;
}

:deep(.q-card__actions) {
  padding: 4px !important;
  padding-right: 8px !important;
}

.codeToShare {
  background-color: $secondary;
  padding: 4px 8px 4px 8px;
  border-radius: 5px;
}
</style>