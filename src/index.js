import express from 'express'
import { getQuotesInLoop } from "./controllers/getQuotesInLoop.js";
import { getQuotesInBatch } from './controllers/getQuotesInBatch.js'
import { getQuotesFaster } from './controllers/getQuotes.js'

const PORT = 8080
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Scrapping quotes in loop using promises 
app.get("/quotes", getQuotesInLoop)

// Scrapping quotes using multithreads 
app.get("/quotesFaster", getQuotesFaster)

// Scrapping quotes using multithreads with batching
app.get("/quotesBatch", getQuotesInBatch)

app.listen(PORT, () => {
  console.log(`Application running on PORT ${PORT}`)
})