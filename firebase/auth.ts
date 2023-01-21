import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { initializeApp, getApps, getApp } from "firebase/app";
import { firebaseConfig } from "@/config";
import axios from "axios";

getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const getEmail = async () => {
  const auth = await getAuth();
  return new Promise((res, rej) => {
    res(auth.currentUser?.email);
  });
};

export const signInUser = (email: string, password: string) => {
  const auth = getAuth();
  return new Promise((res, rej) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: any) => {
        // Signed in
        const user = userCredential.user;
        console.log("Signed in user:", user);
        localStorage.setItem("email", email);

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
        localStorage.setItem("email", email);
        localStorage.setItem("name", name);

        // Post name to MongoDB
        const url = "http://127.0.0.1:5000/signUp";

        const body = {
          name: name,
          email: email,
        };

        try {
          const result = await axios.post(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
          });

          const data = await result.data;
          console.log("Posted name and email", data);

          res(user);
        } catch (err) {
          console.log(err);
          rej(err);
        }
      })
      .catch((error: any) => {
        const errorMessage = error.message;
        console.log("Error:", errorMessage);
        rej(errorMessage);
      });
  });
};
