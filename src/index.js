import puppeteer from "puppeteer";
import express from 'express'
import { getQuotesInLoop } from "./controller/getQuotes.js";

const PORT = 8080
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getQuotes = async (req, res) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto("https://quotes.toscrape.com/", {
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

  res.status(200).send({
    quotes: quotes
  })

  //   await page.click(".pager > .next > a")

  await browser.close();
};

app.get("/quotes", getQuotesInLoop)

app.listen(PORT, () => {
  console.log(`Application running on PORT ${PORT}`)
})