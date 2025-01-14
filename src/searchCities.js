import OpenAI from "openai";
import { db } from "./config.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function searchSimilarCities(
  searchText,
  limit = 5,
  distanceMeasure = "COSINE"
) {
  if (!searchText?.trim()) {
    throw new Error("Search text cannot be empty");
  }

  try {
    const response = await openai.embeddings.create({
      input: searchText,
      model: "text-embedding-ada-002",
    });
    const searchEmbedding = response.data[0].embedding;

    const citiesRef = db.collection("city_embeddings");
    const vectorQuery = citiesRef
      .select("city", "vector_distance")
      .findNearest({
        vectorField: "city_embedding",
        queryVector: searchEmbedding,
        limit: limit,
        distanceMeasure: distanceMeasure,
        distanceResultField: "vector_distance",
      });

    const results = await vectorQuery.get();

    if (results.empty) {
      console.log("No matching cities found");
      return;
    }

    results.forEach((doc) => {
      const { city, vector_distance } = doc.data();
      console.log(`${city} (similarity: ${(1 - vector_distance).toFixed(4)})`);
    });
  } catch (error) {
    console.error("Search failed:", error);
    throw error;
  }
}

// Add command line argument parsing
const [, , searchTerm, limitArg] = process.argv;
const limit = parseInt(limitArg) || 5;

if (!searchTerm) {
  console.log('Usage: npm run search "<search term>" [limit]');
  process.exit(1);
}

searchSimilarCities(searchTerm, limit).catch((error) => {
  console.error(error);
  process.exit(1);
});
