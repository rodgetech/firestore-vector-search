import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const serviceAccount = JSON.parse(
  fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
);

initializeApp({
  credential: cert(serviceAccount),
});

export const db = getFirestore();

function validateEnv() {
  const required = ["OPENAI_API_KEY", "FIREBASE_SERVICE_ACCOUNT_PATH"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

validateEnv();
