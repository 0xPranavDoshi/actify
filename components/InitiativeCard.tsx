import { GrLocation } from "react-icons/gr";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { useEffect, useState } from "react";
import { Tags } from "@/enum/tags";
import { addPetition } from "@/utils/petition";
import { useRouter } from "next/router";

export interface InitiativeProps {
  imageSrc: string;
  title: string;
  alias: string;
  description: string;
  donationGoal: string;
  donationAmount: string;
  tags: Tags[];
  location: any;
  city: string;
  petitionVotes: number;
  physicalProducts: string[];
}

const InitiativeCard = ({
  imageSrc,
  title,
  alias,
  description,
  donationGoal,
  donationAmount,
  location,
  tags,
  city,
  petitionVotes,
  physicalProducts,
}: InitiativeProps) => {
  const [isStarred, setIsStarred] = useState(false);
  const [votes, setVotes] = useState<number>(petitionVotes);
  const router = useRouter();

  useEffect(() => {
    let starredInitiatives: string[] | undefined = localStorage
      .getItem("starredInitiatives")
      ?.split(",");
    if (starredInitiatives) {
      if (starredInitiatives.includes(title)) {
        setIsStarred(true);
      }
    }
  }, []);

  const increasePetitionCount = () => {
    addPetition(title, votes + 1);

    let starredInitiatives: string[] | undefined = localStorage
      .getItem("starredInitiatives")
      ?.split(",");

    if (starredInitiatives) {
      starredInitiatives.push(title);
      localStorage.setItem("starredInitiatives", starredInitiatives.join(","));
    } else {
      let starredInitiatives: string[] = [title];
      localStorage.setItem("starredInitiatives", starredInitiatives.join(","));
    }

    setVotes((votes) => (votes += 1));
  };

  const decreasePetitionCount = () => {
    addPetition(title, votes - 1);
    console.log("decreasing");

    let starredInitiatives: string[] | undefined = localStorage
      .getItem("starredInitiatives")
      ?.split(",");

    if (starredInitiatives) {
      starredInitiatives.splice(starredInitiatives.indexOf(title), 1);
      localStorage.setItem("starredInitiatives", starredInitiatives.join(","));
    }

    setVotes((votes) => (votes -= 1));
  };

  return (
    <div
      onClick={() => router.push(`/initiative/${alias}`)}
      className="cursor-pointer flex mb-8 justify-start items-start bg-secondary rounded-xl w-3/4"
    >
      <img
        src={imageSrc}
        alt=""
        width={300}
        className="rounded-l-xl h-full object-cover"
      />
      <div className="flex flex-col p-4 w-full">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h2 className="text-3xl font-semibold mb-2">{title}</h2>
            <p>{description}</p>
          </div>

          <div className="flex justify-center items-center gap-1 mt-2">
            <p>{votes}</p>
            {isStarred ? (
              <AiFillStar
                onClick={() => {
                  setIsStarred(!isStarred);
                  decreasePetitionCount();
                }}
                fill="#0099CC"
                className="text-2xl cursor-pointer"
              />
            ) : (
              <AiOutlineStar
                onClick={() => {
                  setIsStarred(!isStarred);
                  increasePetitionCount();
                }}
                fill="black"
                className="text-2xl cursor-pointer"
              />
            )}
          </div>
        </div>

        <div className="flex justify-between items-end w-full mt-4">
          <div className="flex flex-col">
            <p className="text-2xl font-semibold">Rs. {donationAmount}</p>
            <p className="text-sm">Raised out of Rs. {donationGoal}</p>
          </div>
          <div className="flex gap-2 justify-center items-center mr-4">
            <GrLocation />
            <p>{city}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitiativeCard;
