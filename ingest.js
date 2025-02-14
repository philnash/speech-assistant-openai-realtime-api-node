import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import OpenAI from "openai";

import { collection } from "./db.js";

import { parseArgs } from "node:util";

const { OPENAI_API_KEY } = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: { url: { type: "string", short: "u" } },
});

const { url } = values;
const html = await fetch(url).then((res) => res.text());

const doc = new JSDOM(html, { url });
const reader = new Readability(doc.window.document);
const article = reader.parse();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 100,
});

const docs = await Promise.all((await splitter.splitText(article.textContent)).map(async (chunk) => {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: chunk,
    encoding_format: "float",
  });

  const vector = embedding.data[0].embedding;
  return {
    text: chunk,
    $vectorize: vector,
  }}
));

await collection.insertMany(docs);
