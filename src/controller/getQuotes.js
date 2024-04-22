import ParallelScrapper from "../services/parallelScrapper.js";
import os from "os";

export const getQuotesFaster = async (req, res) => {
  const urlList = await req.body.list;
  const urlListLength = urlList.length;
  const numCores = 4 // Fixing it for now but can be dynamic based on the system

  if (!urlList || !urlList.length) {
    res.status(400).send({
      message: "Requires a list URLs to process!",
    });
  }

  try {
    const scrapper = new ParallelScrapper(numCores, "./src/services/scrapWorker.js");

    // batching urls list with number of cores available accordting to the system
    const batchingUrls = () => {
      const batchedUrls = [];
      const batchSize = Math.ceil(urlListLength / numCores);
      for (let i = 0; i < numCores; i++) {
        const start = i * batchSize;
        const end = start + batchSize;
        batchedUrls.push(urlList.slice(start, end));
      }
      return batchedUrls;
    }

    const batchedTask = batchingUrls.map((batch) => scrapper.scrap(batch))

    const results = await Promise.all(batchedTask)

    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};
