import { quoteScrapper } from "../utils/quoteScrapper.js";

export const getQuotesInLoop = async (req, res) => {
  const urlList = await req.body.list;

  if (!urlList || !urlList.length) {
    res.status(400).send({
      message: "Requires a list URLs to process!",
    });
  }

  try {
    const scrappedData = await Promise.all(
      urlList.map(async (url) => {
        const data = await quoteScrapper(url);
        if (data) {
          return data;
        } else {
          return null;
        }
      })
    );
    res.status(200).send({
      data: scrappedData,
    });
  } catch (error) {
    res.status(500).send({
      message: error,
    });
  }
};
