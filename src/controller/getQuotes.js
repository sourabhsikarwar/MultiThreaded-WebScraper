import ParallelScrapper from "../services/parallelScrapper.js";
import os from "os";

export const getQuotesFaster = async (req, res) => {
  const urlList = await req.body.list;
  const numCores = os.cpus().length;

  if (!urlList || !urlList.length) {
    res.status(400).send({
      message: "Requires a list URLs to process!",
    });
  }

  try {
    const scrapper = new ParallelScrapper(numCores, "./src/services/scrapWorker.js");

    const taskList = urlList.map((url) => scrapper.addTask(url))

    const results = await Promise.all(taskList)

    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};
