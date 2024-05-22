import { singletonCounter } from "./counter.js";

export function decrement() {
  singletonCounter.decrement();
}
