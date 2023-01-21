import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_GPT_APIKEY,
});

export const generateDescription = async (
  title: string,
  city: string,
  physicalNeeds: string[]
) => {
  const openai = new OpenAIApi(configuration);
  const needs = physicalNeeds.join(", ");
  const prompt = `Write an appeal for an initiative called ${title} located in ${city}, that needs ${needs}.`;

  console.log(prompt);

  return await openai.createCompletion({
    model: "text-babbage-001",
    prompt: prompt,
    temperature: 0.2,
    max_tokens: 120,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
};
