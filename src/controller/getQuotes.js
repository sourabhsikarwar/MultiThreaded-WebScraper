import ParallelScrapper from "../services/parallelScrapper.js";

export const getQuotesFaster = async (req, res) => {
  const urlList = await req.body.list;

  if (!urlList || !urlList.length) {
    res.status(400).send({
      message: "Requires a list URLs to process!",
    });
  }

  try {
    const scrapper = new ParallelScrapper(4, "./src/services/scrapWorker.js");

    const taskList = urlList.map((url) => scrapper.addTask(url))

    // const taskList = await urlList.map(async (url) => {
    //   const data = await scrapper.addTask(url);
    //   console.log(data, "data")
    //   return data
    // });

    const results = await Promise.all(taskList)

    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};
