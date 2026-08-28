type Task = any;

type QueueObject = {
  drain: (callbackFn: VoidFunction) => void;
  push: (payload: Task | Task[]) => void;
  unshift: (payload: Task | Task[]) => void;
  error: (callbackFn: (error?: Error, task?: Task) => void) => void;
};

type CallbackFn = (data: any, error?: Error) => void;

type ProcessorFn = (task: Task, callback: CallbackFn) => Promise<void>;

type OnCompleteFn = (data: any, task: Task, error?: Error) => void;

function Queue(
  processorFn: ProcessorFn,
  onCompleteFn: OnCompleteFn,
  concurrency: number,
): QueueObject {
  if (concurrency <= 0) {
    throw new Error("Concurrency should be greater than 0");
  }

  const queue: Task[] = [];

  const drainListeners = new Set<VoidFunction>();
  const errorListeners = new Set<(error?: Error, task?: Task) => void>();

  const inFlight = new Set<Promise<void>>();

  let isProcessing = false;

  function push(payload: Task | Task[]) {
    if (Array.isArray(payload)) {
      queue.push(...payload);
    } else {
      queue.push(payload);
    }

    if (!isProcessing) {
      void processQueue();
    }
  }

  function unshift(payload: Task | Task[]) {
    if (Array.isArray(payload)) {
      queue.unshift(...payload);
    } else {
      queue.unshift(payload);
    }

    if (!isProcessing) {
      void processQueue();
    }
  }

  function drain(cb: VoidFunction) {
    drainListeners.add(cb);
  }

  function error(cb: (error?: Error, task?: Task) => void) {
    errorListeners.add(cb);
  }

  async function processQueue() {
    if (isProcessing) return;

    isProcessing = true;

    while (true) {
      while (queue.length > 0 && inFlight.size < concurrency) {
        const task = queue.shift()!;

        const promise = processorFn(task, (data, err) => {
          if (err) {
            errorListeners.forEach((fn) => fn(err, task));
          } else {
            onCompleteFn(data, task);
            console.log(data);
          }
        })
          .catch((err) => {
            errorListeners.forEach((fn) => fn(err, task));
          })
          .finally(() => {
            inFlight.delete(promise);
          });

        inFlight.add(promise);
      }

      if (inFlight.size === 0) {
        break;
      }

      await Promise.race(inFlight);
    }

    isProcessing = false;

    if (queue.length > 0) {
      processQueue();
      return;
    }

    drainListeners.forEach((fn) => fn());
  }

  return {
    push,
    unshift,
    drain,
    error,
  };
}

const processorFn: ProcessorFn = (task, callback) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Processing task", task.name);

      callback(`${task.name} done`);

      resolve();
    }, 500);
  });
};

const onCompleteFn: OnCompleteFn = (data, task, error) => {
  console.log("Task completed:", task.name, error, Date.now());
};

const q = Queue(processorFn, onCompleteFn, 2);

q.push({ name: "foo" });

q.push([{ name: "baz" }, { name: "bay" }, { name: "bax" }]);

setTimeout(() => {
  q.push([{ name: "x" }, { name: "y" }, { name: "z" }, { name: "w" }]);
}, 600);

q.drain(() => {
  console.log("All tasks processed");
});

q.error((err, task) => {
  console.error(err, task);
});
