import { singletonCounter } from "./counter.js";
import { increment } from "./redButton.js";
import { decrement } from "./blueButton.js";

function render() {
  document.querySelector(".counter").textContent =
    singletonCounter.getCounter();
}

document.querySelector(".red").addEventListener("click", () => {
  increment();
  render();
});

document.querySelector(".blue").addEventListener("click", () => {
  decrement();
  render();
});
