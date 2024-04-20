import ParallelScrapper from "../services/parallelScrapper.js"

export const getQuotesFaster = async (req, res) => {
  const urlList = await req.body.list;

  if (!urlList || !urlList.length) {
    res.status(400).send({
      message: "Requires a list URLs to process!",
    });
  }

  try {
    const scrapper = new ParallelScrapper(4, "./src/services/scrapWorker.js")

    for(let url of urlList){
      scrapper.addTask(url)
    }
    
    const results = await scrapper.getScrappedData()

    res.status(200).send({
      message: "Chal Raha he!"
    })

  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};
