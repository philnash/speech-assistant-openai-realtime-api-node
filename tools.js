import { collection } from "./db.js";

async function taylorSwiftFacts({ query }) {
  const docs = await collection.find(
    {},
    { $vectorize: query, limit: 10, projection: { $vectorize: 1 } }
  );
  return (await docs.toArray()).map((doc) => doc.$vectorize).join("\n");
}

export const DESCRIPTIONS = [
  {
    type: "function",
    name: "taylorSwiftFacts",
    description:
      "Search for up to date information about Taylor Swift from her wikipedia page",
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
