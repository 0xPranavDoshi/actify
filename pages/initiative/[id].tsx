import { InitiativeProps } from "@/components/InitiativeCard";
import Navbar from "@/components/Navbar";
import ProgressBar from "@/components/ProgressBar";
import axios from "axios";
import { GetStaticPaths } from "next";

const Initiative = ({
  initiative,
  name,
}: {
  initiative: InitiativeProps;
  name: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-start h-full min-h-screen w-screen bg-background">
      <Navbar />
      <h1 className="font-semibold text-4xl text-text my-8">
        {initiative.title}
      </h1>
      <div className="flex justify-start items-start gap-10 w-3/4">
        <img src={initiative.imageSrc} alt="" className="rounded-xl w-[70%]" />

        <div className="flex flex-col justify-start items-start w-[30%]">
          <div className="flex flex-col justify-start items-start w-full">
            <h1 className="font-semibold text-2xl text-text mr-4">
              Rs. {initiative.donationAmount}
            </h1>
            <p className="text-text mb-2">
              Raised out of Rs. {initiative.donationGoal}
            </p>
            <ProgressBar
              bgcolor="#0099CC"
              completed={
                (+initiative.donationAmount / +initiative.donationGoal) * 100
              }
            />

            <div className="cursor-pointer px-4 py-2 bg-accent rounded-lg flex justify-center items-center w-full mt-8">
              Donate
            </div>

            <p className="mt-16">
              Help {name} by donating{" "}
              <b>{initiative.physicalProducts.join(", ")}</b>.
            </p>
            <div className="cursor-pointer px-4 py-2 bg-accent rounded-lg flex justify-center items-center w-full mt-4">
              Supply
            </div>
          </div>
        </div>
      </div>

      <p className="w-3/4 text-left text-sm">#{initiative.tags.join(" #")}</p>

      <p className="text-xl mt-8 text-left w-3/4">{initiative.description}</p>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(context: any) {
  const alias = context.params.id;

  const url = "http://127.0.0.1:5000/fetchfromAlias";

  const body = {
    alias: alias,
  };

  console.log(body);

  const res = await axios.post(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.data[0];

  let initiative: InitiativeProps = {
    imageSrc: data.image ? data.image : "",
    title: data.title ? data.title : "",
    alias: data.alias ? data.alias : "",
    description: data.description ? data.description : "",
    donationGoal: data.donationGoal ? data.donationGoal : 0,
    donationAmount: data.donationAmount ? data.donationAmount : 0,
    location: data.location ? data.location : "",
    tags: data.tags ? data.tags : [],
    city: data.location ? data.location : "",
    petitionVotes: data.petitionVotes ? data.petitionVotes : 0,
    physicalProducts: data.physicalProducts ? data.physicalProducts : [],
  };

  console.log(initiative);

  return {
    props: {
      initiative: initiative,
      name: data.name ? data.name : "[name]",
    },
  };
}

export default Initiative;
