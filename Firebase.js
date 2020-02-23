import * as Firebase from 'firebase';
import 'firebase/firestore';


const firebaseConfig = {}

const firebaseInstance = Firebase.initializeApp(firebaseConfig);
export const db = firebaseInstance.firestore();
export const auth = firebaseInstance.auth();