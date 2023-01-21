import { InitiativeProps } from "@/components/InitiativeCard";
import Page1 from "@/components/initiatives/Page1";
import Page3 from "@/components/initiatives/Page3";
import Page2 from "@/components/initiatives/Page2";
import Navbar from "@/components/Navbar";
import { Tags, TagsArray } from "@/enum/tags";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiArrowNarrowRight } from "react-icons/hi";

const CreateInitiative = () => {
  const router = useRouter();
  const [page, setPage] = useState<number>(
    router.query.page ? +router.query.page : 1
  );

  useEffect(() => {
    setPage(router.query.page ? +router.query.page : 1);
  }, [router]);

  useEffect(() => {
    console.log(page);
  }, [page]);

  const [tagsSelected, setTagsSelected] = useState<Tags[]>([]);
  const [city, setCity] = useState<string>();

  const [donationGoal, setDonationGoal] = useState<number>();
  const [donationAmount, setDonationAmount] = useState<number>();
  const [physicalNeeds, setPhysicalNeeds] = useState<string[]>();

  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();

  return (
    <div className="flex flex-col w-screen h-screen bg-background justify-start items-center">
      <Navbar />

      <div className="flex flex-col w-1/2">
        {page === 1 && (
          <Page1
            tagsSelected={tagsSelected}
            setTagsSelected={setTagsSelected}
            city={city}
            setCity={setCity}
          />
        )}

        {page === 2 && (
          <Page2
            physicalNeeds={physicalNeeds}
            setPhysicalNeeds={setPhysicalNeeds}
            donationGoal={donationGoal}
            setDonationGoal={setDonationGoal}
            donationAmount={donationAmount}
            setDonationAmount={setDonationAmount}
          />
        )}

        {page === 3 && (
          <Page3
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            city={city}
            physicalNeeds={physicalNeeds}
            donationGoal={donationGoal}
            donationAmount={donationAmount}
            tagsSelected={tagsSelected}
          />
        )}
      </div>
    </div>
  );
};

export default CreateInitiative;
