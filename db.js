import { DataAPIClient } from "@datastax/astra-db-ts";
import dotenv from "dotenv";

dotenv.config();

const {
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_COLLECTION_NAME,
} = process.env;

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT);
export const collection = db.collection(ASTRA_DB_COLLECTION_NAME);
