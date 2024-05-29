class Dog {
  constructor(name) {
    this.name = name;
  }

  bark() {
    console.log("왈!");
  }
}

const dog1 = new Dog("뿌꾸");
const dog2 = new Dog("만월");

console.log(dog1.name);
dog1.bark();

// console.log(Dog.prototype);
// constructor: ƒ Dog(name, breed) bark: ƒ bark()

// console.log(dog1.__proto__);
// constructor: ƒ Dog(name, breed) bark: ƒ bark()

// console.log(Object.getPrototypeOf(dog1));
// __proto__가 비표준이므로 getPrototypeOf 사용

Dog.prototype.play = () => console.log("놀기!");
// Dog의 프로토타입에 play 추가

dog1.play();

class SuperDog extends Dog {
  constructor(name) {
    super(name);
  }

  fly() {
    console.log("슈웅!");
  }
}
// Dog를 상속받은 SuperDog에 fly() 추가

const dog3 = new SuperDog("댕댕");
console.log(dog3.name);
dog3.bark();
dog3.play();
dog3.fly();

const cat = {
  nyang() {
    console.log("냥!");
  },
};

const cat1 = Object.create(cat);

cat1.nyang();
// cat1은 cat 객체를 Prototype으로 사용하므로 nyang 메서드 사용 가능

// 결론: Prototype 패턴으로 메서드 중복을 줄일 수 있고 메모리 절약 가능
