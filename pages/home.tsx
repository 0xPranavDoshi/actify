import InitiativeCard, { InitiativeProps } from "@/components/InitiativeCard";
import Navbar from "@/components/Navbar";
import { Tags } from "@/enum/tags";
import { useState } from "react";

const Dashboard = () => {
  const [initiatives, setInitiatives] = useState<InitiativeProps[]>([
    {
      imageSrc:
        "https://images.unsplash.com/photo-1617854818583-09e7f077a156?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      title: "Help the Homeless",
      description:
        "We are trying to help the homeless in our community by providing them with food and shelter.",
      donationGoal: "$100,000",
      donationAmount: "$50,000",
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

  return (
    <div className="flex flex-col w-screen h-screen bg-background justify-start items-center">
      <Navbar />

      <h1 className="text-center w-full text-4xl my-8 font-light">
        Discover Initiatives to Support
      </h1>

      {initiatives.map((initiative: InitiativeProps) => {
        return <InitiativeCard {...initiative} />;
      })}
    </div>
  );
};

export default Dashboard;
