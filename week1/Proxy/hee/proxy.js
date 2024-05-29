// https://patterns-dev-kr.github.io/design-patterns/proxy-pattern/
// Proxy 객체를 활용하면 특정 객체와의 인터렉션을 조금 더 컨트롤 할 수 있게 된다. Proxy 객체는 어떤 객체의 값을 설정하거나 값을 조회할때 등의 인터렉션을 직접 제어할 수 있다.

const person = {
  name: "John Doe",
  age: 42,
  nationality: "American"
};

const personProxy = new Proxy(person, {
  get: (obj, prop, receiver) => {
    console.log(`The value of ${prop} is ${obj[prop]}`);
    return obj[prop];
  },
  set: (obj, prop, value, receiver) => {
    console.log(`Changed ${prop} from ${obj[prop]} to ${value}`);
    obj[prop] = value;
    return true;
  }
});

console.log('personProxy.name: ', personProxy.name);
personProxy.age = 43;
console.log('personProxy.age: ', personProxy.age);

// 출력 결과
// The value of name is John Doe
// personProxy.name:  John Doe
// Changed age from 42 to 43
// The value of age is 43
// personProxy.age:  43