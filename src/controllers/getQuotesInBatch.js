import ParallelBatchScrapper from "../services/batchedParallelScrapper.js";
import os from "os";

export const getQuotesInBatch = async (req, res) => {
  const urlList = await req.body.list;
  const numCores = 4; // Fixed thread pool capacity
  // const numCores = os.cpus().length; // Dynamic thread pool capacity

  if (!urlList || !urlList.length) {
    res.status(400).send({
      message: "Requires a list URLs to process!",
    });
  }

  try {
    const scrapper = new ParallelBatchScrapper(
      numCores,
      urlList,
      "./src/workers/batchScrapWorker.js"
    );
    const results = await scrapper.startScrapper();

    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};
