// Mixin: 상속 없이 객체나 클래스에 재사용 가능한 기능을 추가

// name 프로퍼티만 가진 Dog 클래스
class Dog {
  constructor(name) {
    this.name = name;
  }
}

// 짖기, 꼬리흔들기, 놀기 기능을 가진 mixin
const dogFunctionality = {
  bark: () => console.log("왈!"),
  wagTail: () => console.log("살랑살랑!"),
  play: () => console.log("놀자!"),
};

// Mixin의 기능을 Dog의 프로토타입에 추가, Dog 클래스의 인스턴스들은 Dog의 프로토타입에 추가된 dogFunctionality의 기능을 사용 가능
Object.assign(Dog.prototype, dogFunctionality);

const dangdang = new Dog("뿌꾸");

console.log("===dog1===");
dangdang.name; // 뿌꾸
dangdang.bark(); // 왈!
dangdang.play(); // 놀자!

// 믹스인 자체는 상속 사용 가능
const animalFunctionality = {
  walk: () => console.log("뚜벅"),
  sleep: () => console.log("쿨쿨"),
};

const dogFunctionality2 = {
  bark: () => console.log("왈!"),
  wagTail: () => console.log("살랑살랑!"),
  play: () => console.log("놀자!"),
  walk() {
    super.walk();
  },
  sleep() {
    super.sleep();
  },
};

// dogFunctionality2 animalFunctionality의 프로퍼티를 추가
Object.assign(dogFunctionality2, animalFunctionality);
Object.assign(Dog.prototype, dogFunctionality2);

const dog2 = new Dog("만월");

console.log("===dog2===");
console.log(dog2.name); // 만월
dog2.bark(); // 왈!
dog2.wagTail(); // 살랑살랑!
dog2.bark(); // 왈!
dog2.play(); // 놀자!
dog2.walk(); // 뚜벅
dog2.sleep(); // 쿨쿨

// Window 객체는 WindowOrWorkerGlobalScope와 WindowEventHandler 의 믹스인으로 구성, setTimeout, setInterval, indexedDB, isSecureContext 같은 프로퍼티를 사용
// WindowOrWorkerGlobalScope는 믹스인, 해당 믹스인을 직접 사용할수는 없음.

// React의 경우, 훅에 의해 대체 가능하지만 고차 컴포넌트를 사용하길 권장
// 객체의 프로토타입을 직접 수정하는 것은 의도하지 않은 프로토타입 프로퍼티의 수정으로 이어질 수 있어 주의
