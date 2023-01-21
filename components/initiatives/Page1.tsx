import { Tags, TagsArray } from "@/enum/tags";
import { useRouter } from "next/router";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { HiArrowNarrowRight } from "react-icons/hi";

const Page1 = ({
  tagsSelected,
  setTagsSelected,
  city,
  setCity,
  location,
  setLocation,
}: {
  tagsSelected: Tags[];
  setTagsSelected: (arg: any) => void;
  city: string | undefined;
  setCity: (arg: any) => void;
  location: string | undefined;
  setLocation: (arg: any) => void;
}) => {
  const router = useRouter();

  return (
    <>
      <h2 className="font-semibold text-3xl my-8">
        Choose the topics that best fit your initiative.
      </h2>

      <div className="flex justify-start items-start gap-2 w-full flex-wrap">
        {TagsArray.map((tag: Tags) => {
          return (
            <div
              onClick={() =>
                tagsSelected.includes(tag)
                  ? setTagsSelected((prev: any) =>
                      prev.filter((t: any) => t !== tag)
                    )
                  : setTagsSelected([...tagsSelected, tag])
              }
              className={`cursor-pointer flex justify-center items-center gap-4 px-4 py-2 border border-text rounded-lg ${
                tagsSelected.includes(tag)
                  ? "bg-accent2 text-white"
                  : "text-text"
              }`}
            >
              {tag}
            </div>
          );
        })}
      </div>

      <h2 className="font-semibold text-3xl mt-8 mb-4">
        Input the location the initiative is located in.
      </h2>

      <div className="text-text">
        <GooglePlacesAutocomplete
          selectProps={{
            location,
            onChange: setLocation,
            styles: {
              input: (provided: any) => ({
                ...provided,
              }),
            },
          }}
          autocompletionRequest={{
            componentRestrictions: {
              country: ["in"],
            },
          }}
          apiKey={process.env.NEXT_PUBLIC_MAPS_APIKEY}
        />
      </div>

      <h2 className="font-semibold text-3xl mt-8 mb-4">
        Enter the city the initiative is based in.
      </h2>

      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Eg: Bangalore"
        className="bg-background border border-text rounded-lg px-4 py-2 w-full text-text"
      />

      <div className="w-full flex justify-end mt-8 gap-2">
        <div
          onClick={() => {
            if (city && tagsSelected.length > 0) {
              router.query.page = "2";
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

export default Page1;
