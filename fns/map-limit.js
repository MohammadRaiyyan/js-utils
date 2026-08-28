/*
Implement mapLimit, which is a utility function which produces a list of outputs by mapping
each inputs through an itrette function.
Inputs:
  inputs:An array of inputs
  limit: The number of maximum operation can be performed at a time
  iterateeFn: The async function that will be called with each input to generate the corresponding output. it will have
              two args:
              input: The input being processed
              callback: A function that will be called when the input is finished processing.
                        It will be provided one argument at a time.

  callback: A function that should be called with the array of outputs once all the operations are performed.

*/

async function mapLimit(inputs, limit, iterateeFn, callback) {
  const results = [];
  let runningTasks = new Set();
  for (const [index, input] of inputs.entries()) {
    console.log(`🚀 Starting ${input}`);
    const task = new Promise((resolve, reject) => {
      function cleanup(e) {
        runningTasks.delete(task);
        results[index] = undefined;
        reject(e);
      }
      try {
        iterateeFn(input, (error, res) => {
          if (error) {
            cleanup(error);
            return;
          }

          console.log(`✅ Finished ${input}`);
          results[index] = res;

          runningTasks.delete(task);
          resolve(res);
          console.log(
            `Running: ${runningTasks.size} | Remaining: [${[...runningTasks].length}]`,
          );
        });
      } catch (error) {
        cleanup(error);
      }
    });

    runningTasks.add(task);

    console.log(`📌 Added ${input}, Currently Running = ${runningTasks.size}`);

    if (runningTasks.size >= limit) {
      console.log(`⏸ Limit reached (${limit}). Waiting...\n`);
      await Promise.any(runningTasks);
      console.log(`▶ One task completed. Continuing...\n`);
    }
  }
  await Promise.all(runningTasks);
  callback(results);
}

async function iterateeFn(input, callback) {
  const randomDelay = Math.floor(Math.random() * 100) + 200;
  setTimeout(() => {
    const result = input * 2;
    callback(null, result);
  }, randomDelay);
}
function processedcallback(results) {
  console.log(results);
}

// mapLimit([1, 2, 3, 4, 5], 3, iterateeFn, processedcallback);

// Map Limit 2
//
async function mapLimit2(tasks = [], limit = 2, mapper = () => {}) {
  if (limit <= 0) throw new Error("Limit should be greater than 0");
  const result = [];
  const runningTasks = new Set();
  for (let index = 0; index < tasks.length; index++) {
    const task = Promise.resolve()
      .then(() => mapper(tasks[index], index))
      .then((res) => (result[index] = res))
      .finally(() => {
        runningTasks.delete(task);
      });

    runningTasks.add(task);
    console.log(`📌 Added ${task}, Currently Running = ${runningTasks.size}`);
    if (runningTasks.size >= limit) {
      console.log(`⏸ Limit reached (${limit}). Waiting...\n`);
      await Promise.race(runningTasks);
      console.log(`▶ One task completed. Continuing...\n`);
    }
  }
  await Promise.all(runningTasks);
  return result;
}
const items = [1, 2, 3, 4, 5];
const maxLimit = 3;
function mapper(task, index) {
  return new Promise((resolve) => {
    setTimeout(
      () => {
        resolve(task * 2);
      },
      index + Math.floor(Math.random()) * 100,
    );
  });
}

mapLimit2(items, maxLimit, mapper).then(console.log);
