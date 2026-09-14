import { cert, initializeApp, getApps } from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getCredentials() {
  // Option 1: Direct environment variables
  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return cert({
      projectId: process.env.FIREBASE_PROJECT_ID || "ai-code-editor-27a31",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
  }

  // Option 2: Full JSON string in environment variable
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      return cert(parsed);
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON:", e.message);
    }
  }

  // Option 3: Local file (for local development, kept in .gitignore)
  const candidatePaths = [
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    path.resolve(__dirname, "../serviceAccountKey.json"),
  ].filter(Boolean);

  for (const filePath of candidatePaths) {
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        return cert(fileContent);
      } catch (err) {
        console.error(`Error reading Firebase service account file at ${filePath}:`, err.message);
      }
    }
  }

  console.warn("WARNING: No Firebase Admin credentials found in environment variables or serviceAccountKey.json!");
  return undefined;
}

const credential = getCredentials();

export const app = getApps().length > 0
  ? getApps()[0]
  : initializeApp(credential ? { credential } : {});