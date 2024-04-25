import puppeteer from "puppeteer";
import { getRedisClient } from "../config/index.js";

export const quoteBatchScrapper = async (urls) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const redisClient = getRedisClient();

  const page = await browser.newPage();
  const results = [];

  for (const url of urls) {
    // getting the cached data from redis 
    const cachedData = await redisClient.get(url);

    if (cachedData) {
      results.push({ url, quotes: JSON.parse(cachedData) });
      console.log("Data fetched from cache for: ", url)
      continue;
    }

    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });

    const quotes = await page.evaluate(() => {
      const quoteList = document.querySelectorAll(".quote");

      return Array.from(quoteList).map((quote) => {
        const text = quote.querySelector(".text").innerText;
        const author = quote.querySelector(".author").innerText;
        return { text, author };
      });
    });

    // setting the redis cache with url as a key and the quotes as a value with TTL
    await redisClient.set(url, JSON.stringify(quotes), "EX", 120);
    results.push({ url, quotes });
  }

  await browser.close();
  return results;
};
