import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { initializeApp, getApps, getApp } from "firebase/app";
import { firebaseConfig } from "@/config";

getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const signInUser = (email: string, password: string) => {
  const auth = getAuth();
  return new Promise((res, rej) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: any) => {
        // Signed in
        const user = userCredential.user;
        console.log("Signed in user:", user);
        res(user);
      })
      .catch((error: any) => {
        const errorMessage = error.message;
        console.log("Error:", errorMessage);
        rej(errorMessage);
      });
  });
};

export const registerUser = (name: string, email: string, password: string) => {
  console.log("Registering user:", name, email, password);

  const auth = getAuth();

  return new Promise((res, rej) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential: any) => {
        // Signed in
        const user = userCredential.user;
        console.log("Created user:", user);

        // Post name to MongoDB
        res(user);
      })
      .catch((error: any) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error:", errorMessage);
        rej(errorMessage);
      });
  });
};
