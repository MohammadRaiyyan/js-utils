/*
-Process method requirements
The process method receive a single async function that should be executes by following the algorithm described below:

-If there is currently no async function being executed by the class, the received callback method should be executed immediately.
-If there is currently only one async function currently being executed the callback method should be executed immediately as well.
-If there are two async function currently being executed the next callback method should be put into the queue.
-After one of the currently executing async function is finished.
-When there were no argument passed to the constructor the first callback method that was pushed into the queue should be executed (First in first out).
-When the argument passed to the constructor was LIFO, the last callback in the queue should be executed.
-If there are more than 6 callbacks in the queue discard any extra callbacks.
-If there are more than 3 callbacks in the queue, follow FIFO if no argument is passed to constructor.
*/

class ProcessQueueCallbacks {
  constructor(order = "FIFO") {
    this.order = order;
    this.executing = 0;
    this.queue = [];
  }

  process(callback) {
    if (this.executing < 2) {
      this.executing++;
      callback
        .then((res) => console.log(res))
        .finally(() => {
          this.executing--;
          /*  Ask executeNextCallback to provide next call back from the queue
              as asking a human to  call process and give me the next call back from the list if any present
          */
          if (this.executing < 2) this.executeNextCallback();
        });
    } else if (this.queue.length < 6) {
      this.queue.push(callback);
    }
  }
  executeNextCallback() {
    if (this.queue.length > 0) {
      const callback =
        this.order === "FIFO" ? this.queue.shift() : this.queue.pop();
      this.process(callback);
    }
  }
}

const queues = new ProcessQueueCallbacks("LIFO");

function dummyAPI(index) {
  return new Promise((res) => {
    setTimeout(() => {
      res(index);
    }, index * 100);
  });
}

queues.process(dummyAPI(1));
queues.process(dummyAPI(2));
queues.process(dummyAPI(6));
queues.process(dummyAPI(4));
queues.process(dummyAPI(3));
queues.process(dummyAPI(5));
queues.process(dummyAPI(7));
queues.process(dummyAPI(9));
queues.process(dummyAPI(8));
queues.process(dummyAPI(2));
queues.process(dummyAPI(4));
