import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/analytics';

import {firebaseConfig} from '../secrets';

//================Firstore Setup===========================

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const db = firebase.firestore();

export const ratings = db.collection('movie-ratings');

//=========================================================
