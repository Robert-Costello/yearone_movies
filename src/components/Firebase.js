import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyC4IjKfxn92xbl3axMAiT3RyzbuyQLHWHo',
  authDomain: 'nosql-robert.firebaseapp.com',
  databaseURL: 'https://nosql-robert.firebaseio.com',
  projectId: 'nosql-robert',
  storageBucket: 'nosql-robert.appspot.com',
  messagingSenderId: '1033768236242',
  appId: '1:1033768236242:web:a4d1a00efbdae2e1cda90b',
  measurementId: 'G-NLZ4RVF2W3',
};

//================Firstore Setup===========================

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const db = firebase.firestore();

export const ratings = db.collection('movie-ratings');

//=========================================================
