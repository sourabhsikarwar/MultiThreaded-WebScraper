import Redis from "ioredis";
import * as dotenv from "dotenv";
dotenv.config();

let client = null;

export const getRedisClient = () => {
  if (!client) {
    client = new Redis(process.env.REDIS_DATABASE_URL);
  }
  return client;
};
