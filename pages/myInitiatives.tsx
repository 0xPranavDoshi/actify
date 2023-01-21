import InitiativeCard, { InitiativeProps } from "@/components/InitiativeCard";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { useEffect, useState } from "react";

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
  }, []);

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

      const email = localStorage.getItem("email");
      console.log("email", email);

      console.log(data);

      data.forEach((obj: any) => {
        let initiative = {
          imageSrc: obj.image,
          title: obj.title,
          alias: obj.alias,
          description: obj.description,
          donationGoal: obj.donationGoal,
          donationAmount: obj.donationAmount,
          location: obj.location,
          tags: obj.tags,
          city: obj.location,
          petitionVotes: obj.petitionVotes,
          physicalProducts: obj.physicalProducts,
        };

        // initiatives.map((initObj) => {
        if (obj.email === email) {
          console.log("initiative", initiative);

          setInitiatives((prev) => [...prev, initiative]);
        }
        // });
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="min-h-screen h-full flex-col justify-start items-center w-screen bg-background flex">
      <Navbar />
      <h1 className="text-4xl my-8 font-light">Your initiatives</h1>

      {initiatives
        .filter((item, index) => initiatives.indexOf(item) === index)
        .map((initiative: InitiativeProps) => {
          return <InitiativeCard {...initiative} />;
        })}
    </div>
  );
};

export default MyInitiatives;
