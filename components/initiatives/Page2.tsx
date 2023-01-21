import { Tags, TagsArray } from "@/enum/tags";
import { useRouter } from "next/router";
import { useState } from "react";
import { HiArrowNarrowRight } from "react-icons/hi";

const Page2 = ({
  donationGoal,
  setDonationGoal,
  physicalNeeds,
  setPhysicalNeeds,
  donationAmount,
  setDonationAmount,
}: {
  donationGoal: number | undefined;
  setDonationGoal: (arg: any) => void;
  physicalNeeds: string[] | undefined;
  setPhysicalNeeds: (arg: any) => void;
  donationAmount: number | undefined;
  setDonationAmount: (arg: any) => void;
}) => {
  const router = useRouter();
  return (
    <>
      <h2 className="font-semibold text-3xl my-8">
        Enter your donation goal in rupees.
      </h2>

      <input
        type="number"
        value={donationGoal}
        onChange={(e) => {
          setDonationGoal(+e.target.value);
        }}
        placeholder="Eg: 10000"
        className="bg-background border border-text rounded-lg px-4 py-2 w-full text-text"
      />

      <h2 className="font-semibold text-3xl my-8">
        Enter the amount you've raised so far in rupees.
      </h2>

      <input
        type="number"
        value={donationAmount}
        onChange={(e) => {
          setDonationAmount(+e.target.value);
        }}
        placeholder="Eg: 100"
        className="bg-background border border-text rounded-lg px-4 py-2 w-full text-text"
      />

      <h2 className="font-semibold text-3xl mt-8 mb-4">
        Enter the physical needs of the initiative.
      </h2>

      <input
        type="text"
        value={physicalNeeds}
        onChange={(e) => {
          setPhysicalNeeds(e.target.value.split(","));
        }}
        placeholder="Eg: Food, Clothes, etc."
        className="bg-background border border-text rounded-lg px-4 py-2 w-full text-text"
      />

      <div className="w-full flex justify-end mt-12 gap-2">
        <div
          onClick={() => {
            router.query.page = "1";
            router.push(router);
          }}
          className="px-8 gap-2 py-2 border border-accent flex justify-start  items-center rounded-lg cursor-pointer"
        >
          <p>Back</p>
        </div>

        <div
          onClick={() => {
            if (donationGoal && physicalNeeds && donationAmount) {
              router.query.page = "3";
              router.push(router);
            }
          }}
          className="px-8 gap-2 py-2 bg-accent flex justify-start  items-center rounded-lg cursor-pointer"
        >
          <p className="text-white">Continue</p>
          <HiArrowNarrowRight className="text-xl" />
        </div>
      </div>
    </>
  );
};

export default Page2;
