import axios from "axios";

export const getRankings = async (location: string, message: string) => {
  const url = "http://127.0.0.1:5000/getRankedList";

  try {
    const body = {
      location: location,
      message: message,
    };

    const res = await axios.post(url, {
      //   mode: "no-cors",
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        // "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
    });

    let data = await res.data;

    console.log(data);

    return data;
  } catch (err) {
    console.log(err);
  }
};
