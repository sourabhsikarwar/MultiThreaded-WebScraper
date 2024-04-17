import puppeteer from "puppeteer";

export const quoteScrapper = async (url) => {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
  
    const page = await browser.newPage();
  
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
    
    // await page.click(".pager > .next > a") | ---> for navigating to next page
    
    await browser.close();
    return quotes
  };