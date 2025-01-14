import OpenAI from "openai";
import { db } from "./config.js";
import { FieldValue } from "firebase-admin/firestore";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const cities = [
  "Tokyo, Japan",
  "Paris, France",
  "New York City, USA",
  "London, UK",
  "Dubai, UAE",
  "Singapore",
  "Barcelona, Spain",
  "Rome, Italy",
  "Sydney, Australia",
  "Hong Kong",
  "Amsterdam, Netherlands",
  "Istanbul, Turkey",
  "Bangkok, Thailand",
  "Seoul, South Korea",
  "Venice, Italy",
  "San Francisco, USA",
  "Rio de Janeiro, Brazil",
  "Prague, Czech Republic",
  "Cape Town, South Africa",
  "Vienna, Austria",
];

async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    input: text,
    model: "text-embedding-ada-002",
  });

  return response.data[0].embedding;
}

async function storeEmbeddings() {
  const batchSize = 500; // Firestore batch size limit
  let successCount = 0;
  const citiesRef = db.collection("city_embeddings");

  try {
    for (let i = 0; i < cities.length; i += batchSize) {
      const batch = db.batch();
      const batchCities = cities.slice(i, i + batchSize);

      for (const city of batchCities) {
        try {
          const embedding = await generateEmbedding(city);
          const docRef = citiesRef.doc();

          batch.set(docRef, {
            city: city,
            city_embedding: FieldValue.vector(embedding),
          });

          console.log(`Generated embedding for ${city}`);
          successCount++;
        } catch (error) {
          console.error(`Failed to generate embedding for ${city}:`, error);
        }
      }

      await batch.commit();
    }

    console.log(
      `Successfully stored ${successCount}/${cities.length} embeddings`
    );
  } catch (error) {
    console.error("Failed to store embeddings:", error);
    throw error;
  }
}

storeEmbeddings().catch(console.error);
