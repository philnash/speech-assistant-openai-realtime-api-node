import { collection } from "./db.js";
import OpenAI from "openai";

const { OPENAI_API_KEY } = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

async function taylorSwiftFacts({ query }) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
    encoding_format: "float",
  });
  const docs = await collection.find(
    {},
    { sort: { $vector: embedding.data[0].embedding }, limit: 10 }
  );
  const result = (await docs.toArray()).map((doc) => doc.text).join("\n");
  return result;
}

export const DESCRIPTIONS = [
  {
    type: "function",
    name: "taylorSwiftFacts",
    description:
      "Discover facts, up to date data, and additional information about Taylor Swift, her life and her shows, that you don't already know",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query",
        },
      },
    },
  },
];

export const TOOLS = {
  taylorSwiftFacts,
};
