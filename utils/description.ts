import axios from "axios";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_GPT_APIKEY,
});

export const generateDescription = async (
  title: string,
  city: string,
  physicalNeeds: string[]
) => {
  const url = "http://127.0.0.1:5000/generateDescription";

  try {
    const body = {
      title: title,
      city: city,
      needs: physicalNeeds,
    };

    console.log(body);

    const res = await axios.post(url, {
      mode: "no-cors",
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
    });

    let data = await res.data;

    console.log(data.description);
    return data.description;
  } catch (err) {
    console.log(err);
    return "Failed to generate description";
  }

  //   const openai = new OpenAIApi(configuration);
  //   const needs = physicalNeeds.join(", ");
  //   const prompt = `Write an appeal for an initiative called ${title} located in ${city}, that needs ${needs}.`;

  //   console.log(prompt);

  //   return await openai.createCompletion({
  //     model: "text-babbage-001",
  //     prompt: prompt,
  //     temperature: 0.2,
  //     max_tokens: 120,
  //     top_p: 1,
  //     frequency_penalty: 0,
  //     presence_penalty: 0,
  //   });
};
