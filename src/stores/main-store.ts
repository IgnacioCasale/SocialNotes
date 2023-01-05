import { onValue, ref, update } from 'firebase/database';
import { defineStore } from 'pinia';
import { auth, realtimeDB } from 'src/boot/firebase';

export const useMainStore = defineStore('main', {
  state: () => ({
    actualUserNotes: {}, //All note info of the actual user
    actualOtherNotes: {}, //Others Users notes ID from actual user
    otherUsersNotes: {}, //All Notes info from all others users
    MAX_NOTES_PER_ACCOUNT: 1000,
  }),

  getters: {
    getUserOwnNotes(): object {
      const noteKey = 'ownNotes';
      return this.actualUserNotes[noteKey as keyof object];
    },

    getOtherUsersNotes(): object {
      return this.otherUsersNotes;
    },

    getNoteNumber(): string {
      const noteNumberKey = 'noteNumber';
      return this.actualUserNotes[noteNumberKey as keyof object];
    },
  },

  actions: {
    readUserNotesFromFirebase() {
      const userID = auth.currentUser?.uid;

      const userNotes = ref(realtimeDB, 'notes/' + userID);
      onValue(userNotes, (snapshot) => {
        const notes = snapshot.val();
        this.actualUserNotes = notes;
        const noteKey = 'otherUsersNotes';
        this.actualOtherNotes = notes[noteKey as keyof object];
      });
    },

    readOtherUserNotesFromFirebase() {
      const notes = ref(realtimeDB, 'notes/');

      onValue(notes, (snapshot) => {
        const notes = snapshot.val();

        if (this.actualOtherNotes) {
          for (let i = 0; i < Object.keys(this.actualOtherNotes).length; i++) {
            const otherUserNotes =
              notes[Object.keys(this.actualOtherNotes)[i]]['ownNotes'];

            this.obtainOtherUserNotesForThisUser(i, otherUserNotes);
          }
        } else {
          this.otherUsersNotes = {};
        }
      });
    },

    obtainOtherUserNotesForThisUser(
      otherUserIndex: number,
      otherUserNotes: object
    ) {
      for (let j = 0; j < Object.keys(otherUserNotes).length; j++) {
        if (
          Object.values(this.actualOtherNotes)[otherUserIndex]?.hasOwnProperty(
            Object.keys(otherUserNotes)[j]
          )
        ) {
          const noteSharedByUser = {};
          noteSharedByUser[Object.keys(otherUserNotes)[j] as keyof object] =
            Object.values(otherUserNotes)[j] as never;

          const aux = {
            ...this.otherUsersNotes,
            ...noteSharedByUser,
          };
          this.otherUsersNotes = Object.assign({}, aux);
        }
      }
    },

    updateTittleNoteFirebase(id: string | string[], tittle: object) {
      const userID = auth.currentUser?.uid;

      const idTittleNotesKey =
        'notes/' + userID + '/ownNotes/' + id + '/tittle';

      const updates = {};
      updates[idTittleNotesKey as keyof object] =
        tittle[id as keyof object]['tittle'];
      update(ref(realtimeDB), updates);
    },

    updateOtherUserTittleNoteFirebase(
      id: string | string[],
      tittle: object,
      otherUser: string
    ) {
      const idTittleNotesKey =
        'notes/' + otherUser + '/ownNotes/' + id + '/tittle';

      const updates = {};
      updates[idTittleNotesKey as keyof object] =
        tittle[id as keyof object]['tittle'];
      update(ref(realtimeDB), updates);
    },

    updateTextNoteFirebase(id: string | string[], noteText: string) {
      const userID = auth.currentUser?.uid;

      const idTextNotesKey = 'notes/' + userID + '/ownNotes/' + id + '/text';

      const updates = {};
      updates[idTextNotesKey as keyof object] = noteText as never;
      update(ref(realtimeDB), updates);
    },

    updateOtherUserTextNoteFirebase(
      id: string | string[],
      noteText: string,
      otherUser: string
    ) {
      const idTextNotesKey = 'notes/' + otherUser + '/ownNotes/' + id + '/text';

      const updates = {};
      updates[idTextNotesKey as keyof object] = noteText as never;
      update(ref(realtimeDB), updates);
    },

    deleteOwnNoteFirebase(id: string | string[]) {
      const userID = auth.currentUser?.uid;

      const idOwnNotesKey = 'notes/' + userID + '/ownNotes/' + id;

      try {
        const updates = {};
        updates[idOwnNotesKey as keyof object] = null as never;
        update(ref(realtimeDB), updates);
      } catch (e) {
        console.log(e);
      }
    },

    deleteOtherUserNoteFirebase(id: string | string[], otherUserID: string) {
      const userID = auth.currentUser?.uid;

      const idNoteOtherUserKey =
        'notes/' + userID + '/otherUsersNotes/' + otherUserID + '/' + id;

      try {
        const updates = {};
        updates[idNoteOtherUserKey as keyof object] = null as never;
        update(ref(realtimeDB), updates);
      } catch (e) {
        console.log(e);
      }
    },

    createNewPrivateNote() {
      const userID = auth.currentUser?.uid;
      const noteNumber: number = parseInt(this.getNoteNumber);
      let stringNoteNumber = '';

      this.incrementNoteNumber(1);
      stringNoteNumber = this.fixNoteNumberLength();

      //no allowed more than X notes per account. (It's only because is a personal project)
      if (noteNumber < this.MAX_NOTES_PER_ACCOUNT) {
        const nextNoteID = stringNoteNumber + '-' + this.generateRandomID(10);
        const newNoteKey = 'notes/' + userID + '/ownNotes/' + nextNoteID;
        const newNote = {
          user: userID,
          private: true,
          tittle: 'note ' + this.getNoteNumber,
          text: '',
        };

        const updates = {};
        updates[newNoteKey as keyof object] = newNote as never;
        update(ref(realtimeDB), updates);
      } else {
        console.log('max notes reached');
      }
    },

    /*
     * It can add 0 to the beginning of the number to ensure a correct order in firebase.
     */
    fixNoteNumberLength(): string {
      const noteNumber: number = parseInt(this.getNoteNumber);
      let stringNoteNumber = '';

      if (noteNumber < 10) {
        stringNoteNumber = '00' + this.getNoteNumber;
      }
      if (noteNumber > 10 && noteNumber < 100) {
        stringNoteNumber = '0' + this.getNoteNumber;
      }

      return stringNoteNumber;
    },

    incrementNoteNumber(increment: number) {
      const userID = auth.currentUser?.uid;
      const noteNumberKey = 'notes/' + userID + '/noteNumber/';

      const updates = {};
      updates[noteNumberKey as keyof object] = (this.getNoteNumber +
        increment) as never;
      update(ref(realtimeDB), updates);
    },

    generateRandomID(length: number) {
      let result = '';
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },

    changeNoteToPublic(id: string | string[]) {
      const userID = auth.currentUser?.uid;
      const noteKey = 'notes/' + userID + '/ownNotes/' + id + '/private';

      const updates = {};
      updates[noteKey as keyof object] = false as never;
      update(ref(realtimeDB), updates);
    },

    joinToNote(userNoteID: string) {
      const stringAux = userNoteID.split('/');
      const otherUserID = stringAux[0];
      const noteID = stringAux[1];
      const myUserID = auth.currentUser?.uid;
      const otherNotesKey =
        'notes/' + myUserID + '/otherUsersNotes/' + otherUserID + '/' + noteID;

      const updates = {};
      updates[otherNotesKey as keyof object] = '' as never;
      update(ref(realtimeDB), updates);
    },
  },
});
