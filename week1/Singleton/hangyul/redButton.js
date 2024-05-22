import { singletonCounter } from "./counter.js";

export function increment() {
  singletonCounter.increment();
}
