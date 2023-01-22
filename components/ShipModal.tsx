import axios from "axios";
import { useEffect, useState } from "react";

const ShipModal = ({
  initiativeLocation,
  physicalNeeds,
  setSupplyModal,
}: {
  initiativeLocation: string;
  physicalNeeds: string[];
  setSupplyModal: (value: boolean) => void;
}) => {
  const [needsSelected, setNeedsSelected] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(0);

  const [success, setSuccess] = useState(false);

  const [distance, setDistance] = useState();
  const [duration, setDuration] = useState();

  useEffect(() => {
    console.log(needsSelected);
  }, [needsSelected]);

  const userLocation = localStorage.getItem("location");
  const url = `https://maps.googleapis.com/maps/api/staticmap?size=400x400&key=${process.env.NEXT_PUBLIC_MAPS_APIKEY}&path=color:0xff0000ff|weight:5|${userLocation}|${initiativeLocation}&markers=color:blue%7Clabel:S%7C${userLocation}&markers=color:red%7Clabel:D%7C${initiativeLocation}}`;

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    const url = "http://127.0.0.1:5000/getDistanceDuration";

    const body = {
      location1: userLocation,
      location2: initiativeLocation,
    };

    const res = await axios.post(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.data;
    console.log(data);

    if (data) {
      setDistance(data.distance);
      setDuration(data.duration);
    }
  };

  return (
    <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full">
      <div className="w-1/2 h-3/4 border border-gray-400 bg-gray-200 rounded-3xl p-8 overflow-y-auto flex justify-start items-center flex-col">
        {success && (
          <>
            <h1 className="text-4xl mb-4 font-light">
              Shipment of {quantity} {needsSelected[0]} Confirmed!
            </h1>
            <div
              onClick={() => setSupplyModal(false)}
              className="mt-8 flex justify-center items-center w-1/2 px-4 py-2 bg-accent cursor-pointer rounded-lg"
            >
              Exit Checkout
            </div>
          </>
        )}
        {!success && (
          <>
            <h1 className="text-4xl mb-4 font-light">Shipment Info</h1>
            <img src={url} alt="" />
            <div className="flex gap-4 mt-2">
              <p>
                <b>Distance:</b> {distance}
              </p>
              <p>
                <b>Duration:</b> {duration}
              </p>
            </div>

            <p className="mt-8 w-full text-left mb-1">
              Select the physical needs that you are shipping:
            </p>

            <div className="flex gap-4 w-full text-left">
              {physicalNeeds.map((need) => {
                return (
                  <div
                    onClick={() =>
                      !needsSelected.includes(need)
                        ? setNeedsSelected((prev) => [...prev, need])
                        : setNeedsSelected((prev) =>
                            prev.filter((item) => item !== need)
                          )
                    }
                    className={`px-4 py-2 border border-gray-400 rounded-lg cursor-pointer text-text ${
                      needsSelected.includes(need) && "bg-accent2 text-white"
                    }`}
                  >
                    {need}
                  </div>
                );
              })}
            </div>
            {needsSelected.map((need) => {
              return (
                <>
                  <p className="mt-4 w-full text-left mb-1">
                    Quantity of {need}
                  </p>
                  <input
                    value={quantity}
                    onChange={(e) => setQuantity(+e.target.value)}
                    type="text"
                    placeholder="Eg: 2"
                    className="bg-background border border-text rounded-lg px-4 py-2 w-full text-text"
                  />
                </>
              );
            })}

            <div
              onClick={() => {
                if (quantity && needsSelected.length > 0) {
                  setSuccess(true);
                }
              }}
              className="mt-8 flex justify-center items-center w-1/2 px-4 py-2 bg-accent cursor-pointer rounded-lg"
            >
              Confirm Shipment
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default ShipModal;
