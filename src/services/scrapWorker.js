import { workerData, parentPort } from "worker_threads";
import { quoteScrapper } from "../utils/quoteScrapper";

const url = workerData.url

const results = quoteScrapper(url)

parentPort.postMessage(results)

