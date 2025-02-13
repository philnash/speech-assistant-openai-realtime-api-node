import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

import { collection } from "./db.js";

import { parseArgs } from "node:util";

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

const docs = (await splitter.splitText(article.textContent)).map((chunk) => ({
  $vectorize: chunk,
}));

await collection.insertMany(docs);
