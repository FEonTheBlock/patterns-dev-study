// https://ui.toast.com/weekly-pick/ko_20210112

// Vue3의 reactivity system을 구현해보는 코드입니다.
// Vue3의 reactivity system은 Proxy 객체를 사용하여 구현되었습니다.

const targetMap = new WeakMap(); // 키가 객체여야함

/**
 * track: 반응형으로 실행할 코드 저장
 * @param {*} target reactive 객체
 * @param {*} key reactive 객체 속성 key
 */
function track(target, key) {
  if (!activeEffect) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
  }
}

/**
 * trigger: 저장된 코드를 실행
 * @param {*} target 
 * @param {*} key 
 */
function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }

  const dep = depsMap.get(key);
  if (dep) {
    dep.forEach(effect => effect());
  }

}

/**
 * reactive: 반응형 객체 생성
 * @param {*} target 
 * @returns 
 */
function reactive(target) {
  const proxy = new Proxy(
    target,
    {
      get(target, key, receiver) {
        const res = Reflect.get(target, key, receiver);
        track(target, key);

        return res;
      },
      set(target, key, value, receiver) {
        const oldValue = target[key];
        const res = Reflect.set(target, key, value, receiver);

        if (oldValue !== res) {
          trigger(target, key, value, oldValue);
        }
        return res;
      }
    }
  )

  return proxy;
}

/**
 * get 트랩에서는 activeEffect가 존재할 때만 deps에 추후 실행할 코드(activeEffect)를 추가
 */
let activeEffect = null;

function effect(fn) {
  activeEffect = fn;
  fn();
  activeEffect = null;
}

/**
 *  [반응형 예제 코드 설명]
 *  reactive({a: 1, b: 2})로 반응형 참조를 생성한다.
 *  effect 함수에 sumFn을 전달하여 실행한다.
 *
 *  sumFn이 activeEffect에 할당된다.
 *  sumFn을 실행한다.
 *  numbers의 a와 b에 접근하고 activeEffect가 존재하므로 각 속성의 deps<Set>에 추후 실행할 코드로 sumFn을 저장한다.
 *  함수의 실행에 따라 sum에 3이 할당된다.
 *  effect 함수에 multiplyFn을 전달하여 실행하고, 하위 과정은 동일하게 동작한다.
 *  numbers.a가 변경되면 a에 할당된 deps<Set>를 찾아 들어있는 모든 함수를 실행한다.
 */
const numbers = reactive({a: 1, b: 2});
const sumFn = () => { sum = numbers.a + numbers.b; };
const multiplyFn = () => { multiply = numbers.a * numbers.b };

let sum = 0;
let multiply = 0;

effect(sumFn);
effect(multiplyFn);

console.log(`sum: ${sum}, multiply: ${multiply}`);
// sum: 3, multiply: 2

numbers.a = 10;
console.log(`sum: ${sum}, multiply: ${multiply}`);
// sum: 12, multiply: 20