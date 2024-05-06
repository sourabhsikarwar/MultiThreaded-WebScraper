# Multithreaded Webscrapper

This is a simple webscraper which utilizes the concept of multithreading and parallel processing using the [Worker Threads module of Node.js](https://nodejs.org/api/worker_threads.html).

**Working**:
It takes the bulk of URLs in request body and make batches of URLs to distribute over the threads. After batching, the worker function runs and do its work of scraping the data using Puppeteer.

Also, If it already the have the data in redis cache, checking the corresponding URL, it returns the result.

![Project Image](https://github.com/sourabhsikarwar/MultiThreaded-WebScraper/blob/main/src/assets/readme.png)
