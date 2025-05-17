import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const RECONNECT_DEPLAY_MS = 1000;
const MAX_RECONNECT_ATTEMPTS = 30;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

try {
  await pool.connect();
  pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
    retryPoolConnection();
  });
  console.log("Connected to PostgreSQL");
} catch (err) {
  console.error("Connection error", err);
  throw err;
}

async function retryPoolConnection() {
  let attemptCount = 0;
  while (attemptCount < MAX_RECONNECT_ATTEMPTS) {
    try {
      await new Promise((resolve) => setTimeout(resolve, RECONNECT_DEPLAY_MS));
      console.log(`Reconnection attempt ${attemptCount + 1}...`);
      await pool.connect();
      console.log("Reconnected to PostgreSQL");
      return;
    } catch (err) {
      console.error("Reconnection error", err);
      attemptCount++;
    }
  }

  throw new Error("Max reconnection attempts reached");
}

export default pool;
