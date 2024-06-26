console.log("===== 팩토리 패턴 사용 =====");
// 팩토리 패턴을 이용하면 new 키워드를 사용하지 않고 함수 호출로 객체 생성

const createDog = ({ name, sound }) => ({
  name,
  sound,
  myDog() {
    return `${this.name}(은/는) ${this.sound} 하고 짖어요`;
  },
});

const dog1 = createDog({
  name: "만월",
  sound: "왕왕",
});

const dog2 = createDog({
  name: "뿌꾸",
  sound: "망망",
});

console.log(dog1);
console.log(dog2.myDog());

// 팩토리 패턴은 복잡한 객체, 환경에서 키/값을 다양하게 설정할 때 원하는 객체를 쉽게 만들 수 있음

const createObjectFromArray = ([key, value]) => ({
  [key]: value,
});

const myCat = createObjectFromArray(["누룽지", "냐옹"]);

console.log(myCat);

// 단점: 객체를 하나씩 만드는 것 보다 클래스를 활용하는 것이 메모리 절약에 더 효과적

console.log("===== 클래스 사용 =====");

class Dog {
  constructor({ name, sound }) {
    this.name = name;
    this.sound = sound;
  }

  myDog() {
    return `${this.name}(은/는) ${this.sound} 하고 짖어요`;
  }
}

const myDog1 = new Dog({
  name: "만월",
  sound: "왕왕",
});

const myDog2 = new Dog({
  name: "뿌꾸",
  sound: "망망",
});

console.log(myDog1);
console.log(myDog2.myDog());
