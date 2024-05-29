let instance;
let counter = 0;

class Counter {
  constructor() {
    if (instance) {
      throw new Error("Singleton allows only one instance");
    }
    instance = this;
  }
  getInstance() {
    return this;
  }
  getCounter() {
    return counter;
  }
  increment() {
    return ++counter;
  }
  decrement() {
    return --counter;
  }
}

const singletonCounter = Object.freeze(new Counter());
export { singletonCounter };
