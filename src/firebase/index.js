import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAbj_6HCK3INAJJTyUhLVt3nXmOxASM5pA",
  authDomain: "cicopal-vendas.firebaseapp.com",
  projectId: "cicopal-vendas",
  storageBucket: "cicopal-vendas.appspot.com",
  messagingSenderId: "645937206136",
  appId: "1:645937206136:web:15d29288b98c261b9f2e8d",
  measurementId: "G-QLN5V8NRJH"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

firebase.firestore().enablePersistence();
export default firebaseApp;