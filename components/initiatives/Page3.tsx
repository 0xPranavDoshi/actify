import { Tags, TagsArray } from "@/enum/tags";
import { useRouter } from "next/router";
import { HiArrowNarrowRight } from "react-icons/hi";

const Page3 = ({
  title,
  setTitle,
  description,
  setDescription,
  city,
  physicalNeeds,
}: {
  title: string | undefined;
  setTitle: (arg: any) => void;
  description: string | undefined;
  setDescription: (arg: any) => void;
  city: string | undefined;
  physicalNeeds: string[] | undefined;
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

      <h5 className="text-lg cursor-pointer text-accent2 hover:underline">
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
          onClick={() => {
            router.query.page = "4";
            router.push(router);
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

export default Page3;
