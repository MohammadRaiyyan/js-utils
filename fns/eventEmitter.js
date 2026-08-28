class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(eventName, callback) {
    this.events.set(eventName, [
      ...(this.events.get(eventName) || []),
      callback,
    ]);
    return () => {
      const remainingEvents = this.events
        .get(eventName)
        .filter((cb) => cb !== callback);
      if (remainingEvents.length) {
        this.events.set(eventName, remainingEvents);
      } else {
        this.events.delete(eventName);
      }
    };
  }
  emit(eventName, ...args) {
    if (this.events.has(eventName)) {
      this.events.get(eventName).forEach((cb) => {
        cb(...args);
      });
    }
  }
  once() {}
  remove() {}
}

const emitter = new EventEmitter();

emitter.on("nameChanged", (name) => {
  console.log("Name changed to", name);
});

emitter.on("ageChanged", (age) => {
  console.log("Age changed to", age);
});

emitter.emit("nameChanged", "new name");
emitter.emit("ageChanged", "new age");
