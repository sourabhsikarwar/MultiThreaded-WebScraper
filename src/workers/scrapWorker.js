import { isMainThread, parentPort } from "worker_threads";
import { quoteScrapper } from "../utils/quoteScrapper.js";

if (!isMainThread) {
  parentPort.on("message", async (task) => {
    console.log(task.url, `Assigned the url to Worker ${task.id} with Task Id ${task.taskId}!`);
    const results = await quoteScrapper(task.url);

    parentPort.postMessage({
      url: task.url,
      thread: task.id,
      taskId: task.taskId,
      data: results,
    });
  });
}
