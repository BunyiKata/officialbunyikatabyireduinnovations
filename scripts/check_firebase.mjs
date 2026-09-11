import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function inspectData() {
  console.log('Querying Firebase Realtime Database...');
  
  // 1. Check profiles
  const profilesSnap = await get(ref(db, 'profiles'));
  console.log('--- PROFILES ---');
  if (profilesSnap.exists()) {
    const profiles = profilesSnap.val();
    for (const [id, p] of Object.entries(profiles)) {
      if (p.email && (p.email.includes('ijat') || p.email.includes('kacang') || p.email.includes('174'))) {
        console.log(`Profile [${id}]:`, JSON.stringify(p, null, 2));
      }
    }
  } else {
    console.log('No profiles found.');
  }

  // 2. Check classes
  const classesSnap = await get(ref(db, 'classes'));
  console.log('--- CLASSES ---');
  if (classesSnap.exists()) {
    const classes = classesSnap.val();
    for (const [id, c] of Object.entries(classes)) {
      console.log(`Class [${id}]:`, JSON.stringify(c, null, 2));
    }
  } else {
    console.log('No classes found.');
  }

  // 3. Check families
  const familiesSnap = await get(ref(db, 'families'));
  console.log('--- FAMILIES ---');
  if (familiesSnap.exists()) {
    const families = familiesSnap.val();
    for (const [id, f] of Object.entries(families)) {
      console.log(`Family [${id}]:`, JSON.stringify(f, null, 2));
    }
  } else {
    console.log('No families found.');
  }

  // 4. Check students
  const studentsSnap = await get(ref(db, 'students'));
  console.log('--- STUDENTS ---');
  if (studentsSnap.exists()) {
    const students = studentsSnap.val();
    for (const [id, s] of Object.entries(students)) {
      console.log(`Student [${id}]:`, JSON.stringify(s, null, 2));
    }
  } else {
    console.log('No students found.');
  }

  process.exit(0);
}

inspectData().catch(err => {
  console.error('Error querying Firebase:', err);
  process.exit(1);
});
