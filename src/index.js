import express from 'express'
import { getQuotesInLoop } from "./controller/getQuotesInLoop.js/index.js";

const PORT = 8080
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/quotes", getQuotesInLoop)
app.get("/quotesFaster", () => {
  console.log("Quotes")
})

app.listen(PORT, () => {
  console.log(`Application running on PORT ${PORT}`)
})