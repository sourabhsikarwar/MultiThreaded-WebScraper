export const getQuotesFaster = async (req, res) => {
  const urlList = await req.body.list;

  if (!urlList || !urlList.length) {
    res.status(400).send({
      message: "Requires a list URLs to process!",
    });
  }
};
