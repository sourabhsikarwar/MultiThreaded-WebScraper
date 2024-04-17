import Queue from "../services/queue.js";

export const getQuotesFaster = async (req, res) => {
  const urlList = await req.body.list;

  const results = [];

  if (!urlList || !urlList.length) {
    res.status(400).send({
      message: "Requires a list URLs to process!",
    });
  }

  try {
    const queue = new Queue();
    let index = 0;
    let timeout = 0;
    let urlLength = urlList.length;

    while (index < urlLength && timeout < 20) {
      if (!queue.isFull()) {
        
      }
      timeout++;
    }

    if (timeout >= 20) {
      throw new Error("API Timeout!");
    }

    if (results.length > 0) {
      res.status(200).send(results);
    } else {
      throw new Error("Something Went Wrong!");
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
