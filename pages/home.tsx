import InitiativeCard, { InitiativeProps } from "@/components/InitiativeCard";
import Navbar from "@/components/Navbar";
import { Tags } from "@/enum/tags";
import { useEffect, useState } from "react";
import { MongoClient, ServerApiVersion } from "mongodb";
import axios from "axios";

const Dashboard = () => {
  const [initiatives, setInitiatives] = useState<InitiativeProps[]>([
    {
      imageSrc:
        "https://images.unsplash.com/photo-1617854818583-09e7f077a156?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      title: "Help the Homeless",
      alias: "help-the-homeless",
      description:
        "We are trying to help the homeless in our community by providing them with food and shelter.",
      donationGoal: "100,000",
      donationAmount: "50,000",
      location: {
        lat: 0,
        lng: 0,
      },
      tags: [Tags.Food],
      city: "Bangalore",
      petitionVotes: 100,
      physicalProducts: ["Food", "Shelter"],
    },
  ]);

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

        // console.log(initiative);
        // console.log(initiatives);

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
    <div className="flex flex-col w-screen h-full min-h-screen bg-background justify-start items-center">
      <Navbar />

      <h1 className="text-center w-full text-4xl my-8 font-light">
        Discover Initiatives to Support
      </h1>

      {initiatives
        .filter((item, index) => initiatives.indexOf(item) === index)
        .map((initiative: InitiativeProps) => {
          return <InitiativeCard {...initiative} />;
        })}
    </div>
  );
};

export default Dashboard;
