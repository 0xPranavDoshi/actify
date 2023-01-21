import { InitiativeProps } from "@/components/InitiativeCard";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getEmail } from "../firebase/auth";

import { initializeApp, getApps, getApp } from "firebase/app";
import { firebaseConfig } from "@/config";
let app: any;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else getApp();

const MyInitiatives = () => {
  const [initiatives, setInitiatives] = useState<InitiativeProps[]>([]);

  useEffect(() => {
    fetchInitiatives();
    console.log(app);
  }, []);

  //   useEffect(() => {
  //     setTimeout(async () => {
  //       const auth = await getAuth();
  //       const user = auth.currentUser;
  //       console.log(user);
  //     }, 0);
  //   }, [getApps]);

  const fetchInitiatives = async () => {
    const url = "http://127.0.0.1:5000/fetchInitiatives";

    try {
      const res = await axios.get(url, {
        // mode: "no-cors",
        method: "GET",
        // headers: {
        //   "Content-Type": "application/json",
        //   "Access-Control-Allow-Origin": "*",
        // },
      });

      let data = await res.data;

      const email = await getEmail();
      console.log("", email);

      console.log(data);

      data.forEach((obj: any) => {
        let initiative = {
          imageSrc: obj.image,
          title: obj.title,
          description: obj.description,
          donationGoal: obj.donationGoal,
          donationAmount: obj.donationAmount,
          location: obj.location,
          tags: obj.tags,
          city: obj.location,
          petitionVotes: obj.petitionVotes,
          physicalProducts: obj.physicalProducts,
        };

        !initiatives.map((obj) => {
          if (initiative.title !== obj.title)
            setInitiatives((prev) => [...prev, initiative]);
        });
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="min-h-screen h-full flex-col justify-start items-center w-screen bg-background flex">
      <Navbar />
      <h1>Your initiatives</h1>
    </div>
  );
};

export default MyInitiatives;
