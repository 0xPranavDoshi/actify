import InitiativeCard, { InitiativeProps } from "@/components/InitiativeCard";
import Navbar from "@/components/Navbar";
import { Tags } from "@/enum/tags";
import { useEffect, useState } from "react";
import { MongoClient, ServerApiVersion } from "mongodb";
import axios from "axios";
import { getRankings } from "@/utils/recommendation";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const Dashboard = () => {
  const [initiatives, setInitiatives] = useState<InitiativeProps[]>([]);

  const [message, setMessage] = useState<string>();
  const [location, setLocation] = useState();
  const [rank, setRank] = useState<any[]>([]);

  useEffect(() => {
    fetchInitiatives();
    let message = localStorage.getItem("message");
    if (message) setMessage(message);
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
          city: obj.city,
          petitionVotes: obj.petitionVotes,
          physicalProducts: obj.physicalProducts,
        };

        // console.log(initiative);
        // console.log(initiatives);

        setInitiatives((prev) => [...prev, initiative]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("rank", rank);
  }, [rank]);

  return (
    <div className="flex flex-col w-screen h-full min-h-screen bg-background justify-start items-center">
      <Navbar />

      <h1 className="text-center w-full text-4xl my-8 font-light">
        Empowering Change, One Initiative at a Time
      </h1>

      <div className="flex flex w-3/4 justify-start items-end gap-8 mb-8">
        <div className="flex flex-col w-[40%]">
          <p>Enter your location</p>
          <div className="text-text w-full">
            <GooglePlacesAutocomplete
              selectProps={{
                location,
                onChange: setLocation,
              }}
              autocompletionRequest={{
                componentRestrictions: {
                  country: ["in"],
                },
              }}
              apiKey={process.env.NEXT_PUBLIC_MAPS_APIKEY}
            />
          </div>
        </div>

        <div className="flex flex-col w-[40%]">
          <p>Enter the type of initiative you would like to support</p>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Eg: I want to support initiatives that help the homeless"
            className="bg-background border border-text rounded-lg px-4 py-2 w-full text-text"
          />
        </div>

        <div
          onClick={async () => {
            if (location && message) {
              let rankings = await getRankings(location["label"], message);
              let newInitiatives: InitiativeProps[] = [];
              localStorage.setItem("message", message);
              localStorage.setItem("location", location["label"]);

              for (let i = 0; i < rankings.length; i++) {
                const ranking = rankings[i];
                let parsed_ranking = JSON.parse(ranking);
                console.log(parsed_ranking);
                newInitiatives.push(parsed_ranking);
              }

              console.log("newInitiatives", newInitiatives);

              // setRank((prev) => [...prev, parsed_ranking]);
              setInitiatives(newInitiatives);
            }
          }}
          className="px-16 py-2 bg-accent flex justify-center items-center rounded-lg cursor-pointer"
        >
          Save
        </div>
      </div>

      {initiatives.length > 0 &&
        initiatives
          // .sort((a, b) => b.donationAmount - a.donationAmount)
          // .filter((item, index) => initiatives.indexOf(item) === index)
          .map((initiative: InitiativeProps) => {
            return <InitiativeCard key={initiative.alias} {...initiative} />;
          })}
    </div>
  );
};

export default Dashboard;
