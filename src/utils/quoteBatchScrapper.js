import puppeteer from "puppeteer";

export const quoteBatchScrapper = async (urls) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  const results = [];

  for (const url of urls) {
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

    results.push({ url, quotes });
  }

  await browser.close();
  return results;
};
