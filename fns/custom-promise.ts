type Executor<T> = (
  resolve: (value: T | MyPromise<T>) => void,
  reject: (reason: unknown) => void,
) => void;

type PromiseState = "PENDING" | "FULFILLED" | "REJECTED";

type OnFulfilled<T, TResult> = (value: T) => TResult | MyPromise<TResult>;

type OnRejected<TResult> = (reason: unknown) => TResult | MyPromise<TResult>;

class MyPromise<T> {
  #state: PromiseState = "PENDING";

  #value: T | undefined;

  #reason: unknown;

  #fulfilledCallbacks: Array<() => void> = [];

  #rejectedCallbacks: Array<() => void> = [];

  constructor(executor: Executor<T>) {
    const resolve = (value: T | MyPromise<T>) => {
      this.#resolve(value);
    };

    const reject = (reason: unknown) => {
      this.#reject(reason);
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  #resolve(value: T | MyPromise<T>): void {
    if (this.#state !== "PENDING") return;

    if (value instanceof MyPromise) {
      value.then(
        (result) => {
          this.#resolve(result);
          return result;
        },
        (reason) => {
          this.#reject(reason);
          return undefined as never;
        },
      );

      return;
    }

    this.#state = "FULFILLED";
    this.#value = value;

    this.#fulfilledCallbacks.forEach((callback) => callback());

    this.#fulfilledCallbacks = [];
    this.#rejectedCallbacks = [];
  }

  #reject(reason: unknown): void {
    if (this.#state !== "PENDING") return;

    this.#state = "REJECTED";
    this.#reason = reason;

    this.#rejectedCallbacks.forEach((callback) => callback());

    this.#fulfilledCallbacks = [];
    this.#rejectedCallbacks = [];
  }

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: OnFulfilled<T, TResult1>,
    onRejected?: OnRejected<TResult2>,
  ): MyPromise<TResult1 | TResult2> {
    return new MyPromise<TResult1 | TResult2>((resolve, reject) => {
      const handleFulfilled = () => {
        queueMicrotask(() => {
          try {
            // No callback means value passes through
            if (!onFulfilled) {
              resolve(this.#value as unknown as TResult1 | TResult2);
              return;
            }

            const result = onFulfilled(this.#value as T);

            this.#resolvePromise(result, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };

      const handleRejected = () => {
        queueMicrotask(() => {
          try {
            // No rejection handler means error propagates
            if (!onRejected) {
              reject(this.#reason);
              return;
            }

            const result = onRejected(this.#reason);

            this.#resolvePromise(result, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };

      if (this.#state === "PENDING") {
        this.#fulfilledCallbacks.push(handleFulfilled);
        this.#rejectedCallbacks.push(handleRejected);
      } else if (this.#state === "FULFILLED") {
        handleFulfilled();
      } else {
        handleRejected();
      }
    });
  }

  #resolvePromise<TResult>(
    result: TResult | MyPromise<TResult>,
    resolve: (value: TResult | MyPromise<TResult>) => void,
    reject: (reason: unknown) => void,
  ): void {
    try {
      if (result instanceof MyPromise) {
        result.then(
          (value) => {
            resolve(value);
            return value;
          },
          (reason) => {
            reject(reason);
            return undefined as never;
          },
        );
      } else {
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  }

  catch<TResult = never>(
    onRejected?: OnRejected<TResult>,
  ): MyPromise<T | TResult> {
    return this.then(undefined, onRejected);
  }

  finally(callback?: () => void): MyPromise<T> {
    return this.then(
      (value) => {
        callback?.();
        return value;
      },
      (reason) => {
        callback?.();
        throw reason;
      },
    );
  }

  static resolve<T>(value: T): MyPromise<T> {
    return new MyPromise((resolve) => {
      resolve(value);
    });
  }

  static reject(reason: unknown): MyPromise<never> {
    return new MyPromise((_resolve, reject) => {
      reject(reason);
    });
  }
}

const promise = new MyPromise<string>((resolve, reject) => {
  setTimeout(() => {
    resolve("Hi There");
  }, 500);
});
promise
  .then((res) => {
    console.log("res", res);
  })
  .catch((e) => console.error(e));
