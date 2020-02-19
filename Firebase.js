import * as Firebase from 'firebase';
import 'firebase/firestore';


const firebaseConfig = {
  // config stuff
}

const firebaseInstance = Firebase.initializeApp(firebaseConfig);
export const db = firebaseInstance.firestore();