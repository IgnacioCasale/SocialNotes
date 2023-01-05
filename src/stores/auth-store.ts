import { defineStore } from 'pinia';

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth, firestoreDB, realtimeDB } from 'src/boot/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, set } from 'firebase/database';
import { LocalStorage } from 'quasar';
import { useMainStore } from './main-store';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loggedIn: false,
  }),

  getters: {},

  actions: {
    sigUpUser(email: string, password: string, name: string) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;

          // Create user in firestore database
          const docData = {
            name: name,
            email: email,
            id: user.uid,
          };
          setDoc(doc(firestoreDB, 'users', user.uid), docData);

          // Create user notes in realtime database
          set(ref(realtimeDB, 'notes/' + user.uid), {
            noteNumber: 0,
            ownNotes: '',
            otherUsersNotes: '',
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    },

    /*
     * It is triggered each time the user logs in or logs out (or reloads the page). If logged in,
     * the another page is loaded and the loggedIn variable is set to true
     */
    handleAuthStateChange() {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.loggedIn = true;
          LocalStorage.set('loggedIn', true);
          const main = useMainStore();
          main.readUserNotesFromFirebase();
          main.readOtherUserNotesFromFirebase();
          this.router.push('/main');
        } else {
          this.loggedIn = false;
          LocalStorage.set('loggedIn', false);
          this.router.push('/');
        }
      });
    },

    logInUser(email: string, password: string) {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          //execute code after login
        })
        .catch(() => {
          console.log('Usuario o Contraseña incorrecta.');
        });
    },

    logOutUser() {
      this.loggedIn = false;
      LocalStorage.set('loggedIn', false);
      signOut(auth);
    },
  },
});
