import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAQsZa1zpIVnX3oyW6kz5kN7aTIm_uBnWU",
    authDomain: "react-http-8d73b.firebaseapp.com",
    databaseURL: "https://react-http-8d73b-default-rtdb.firebaseio.com",
    projectId: "react-http-8d73b",
    storageBucket: "react-http-8d73b.appspot.com",
    messagingSenderId: "398276918994",
    appId: "1:398276918994:web:764e7179fdb5b59e00b70b"
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };