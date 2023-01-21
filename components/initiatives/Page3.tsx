import { Tags, TagsArray } from "@/enum/tags";
import { generateDescription } from "@/utils/description";
import { useRouter } from "next/router";
import { HiArrowNarrowRight } from "react-icons/hi";
import { InitiativeProps } from "../InitiativeCard";
import axios from "axios";

const Page3 = ({
  title,
  setTitle,
  description,
  setDescription,
  city,
  physicalNeeds,
  donationGoal,
  donationAmount,
  tagsSelected,
}: {
  title: string | undefined;
  setTitle: (arg: any) => void;
  description: string | undefined;
  setDescription: (arg: any) => void;
  city: string | undefined;
  physicalNeeds: string[] | undefined;
  donationGoal: number | undefined;
  donationAmount: number | undefined;
  tagsSelected: Tags[] | undefined;
}) => {
  const router = useRouter();

  return (
    <>
      <h2 className="font-semibold text-3xl my-8">
        Write your initiative title.
      </h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        placeholder="Eg: Help the Homeless"
        className="bg-background border border-text rounded-lg px-4 py-2 w-full text-text"
      />

      <h2 className="font-semibold text-3xl mt-8 mb-4">
        Enter a short description of your initiative.
      </h2>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={10}
        placeholder="Eg: We are trying to help the homeless in our community by ..."
        className="bg-background border border-text rounded-lg px-4 py-2 w-full text-text"
      />

      <h5
        onClick={async () => {
          if (title && city && physicalNeeds && physicalNeeds.length > 0) {
            const generatedDesc = await generateDescription(
              title,
              city,
              physicalNeeds
            );

            console.log(generatedDesc);

            let desc = generatedDesc.data.choices[0].text;
            desc = desc?.substring(2, desc.length);

            setDescription(desc);
          }
        }}
        className="text-lg cursor-pointer text-accent2 hover:underline"
      >
        Generate description
      </h5>

      <div className="w-full flex justify-end mt-12 gap-2">
        <div
          onClick={() => {
            router.query.page = "2";
            router.push(router);
          }}
          className="px-8 gap-2 py-2 border border-accent flex justify-start  items-center rounded-lg cursor-pointer"
        >
          <p>Back</p>
        </div>

        <div
          onClick={async () => {
            if (
              title &&
              description &&
              city &&
              donationGoal &&
              donationAmount &&
              physicalNeeds &&
              physicalNeeds.length > 0 &&
              tagsSelected &&
              tagsSelected.length > 0
            ) {
              // const initiative: InitiativeProps = {
              //   title,
              //   description,
              //   city,
              //   imageSrc: "",
              //   donationGoal: donationGoal.toString(),
              //   donationAmount: donationAmount.toString(),
              //   tags: tagsSelected,
              //   location: null,
              //   physicalProducts: physicalNeeds,
              //   petitionVotes: 0,
              // };

              const url = "http://127.0.0.1:5000/addInitiative";

              const body = {
                name: "Pranav",
                email: "pranav@a.com",
                title: title,
                description: description,
                donationGoal: donationGoal,
                donationAmount: donationAmount,
                location: "Mumbai",
                petitionVotes: 0,
                physicalProducts: physicalNeeds,
                image: "",
                website: "",
              };

              const res = await axios.post(url, {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" },
              });

              const data = await res.data;
              console.log(data);
            }
          }}
          className="px-8 gap-2 py-2 bg-accent flex justify-start  items-center rounded-lg cursor-pointer"
        >
          <p className="text-white">Submit</p>
        </div>
      </div>
    </>
  );
};

export default Page3;
