
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set, get, update, remove, onValue, off } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDoMyEQ4XGpRalbq4midqher6yUEwPd80Y",
    authDomain: "framework-gestao.firebaseapp.com",
    databaseURL: "https://framework-gestao-default-rtdb.firebaseio.com",
    projectId: "framework-gestao",
    storageBucket: "framework-gestao.firebasestorage.app",
    messagingSenderId: "131859838839",
    appId: "1:131859838839:web:6f4b3f2e34fed360b99372",
    measurementId: "G-DXT4DY8RS4"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

export const dbRef = (path: string) => ref(database, path);

export const syncData = (path: string, callback: (data: any) => void) => {
  const r = dbRef(path);
  onValue(r, (snapshot) => {
    callback(snapshot.val());
  });
  return () => off(r);
};

export const saveData = async (path: string, data: any) => {
  await set(dbRef(path), data);
};

export const updateData = async (path: string, data: any) => {
  await update(dbRef(path), data);
};

export const deleteData = async (path: string) => {
  await remove(dbRef(path));
};
