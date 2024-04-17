import express from 'express'
import { getQuotesInLoop } from "./controller/getQuotesInLoop.js";
import { getQuotesFaster } from './controller/getQuotes.js'

const PORT = 8080
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Scrapping quotes in loop using promises 
app.get("/quotes", getQuotesInLoop)

// Scrapping quotes using multithreads 
app.get("/quotesFaster", getQuotesFaster)

app.listen(PORT, () => {
  console.log(`Application running on PORT ${PORT}`)
})