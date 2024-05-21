## Proxy

https://patterns-dev-kr.github.io/design-patterns/proxy-pattern/

Proxy 객체를 활용하면 특정 객체와의 인터렉션을 조금 더 컨트롤 할 수 있게 된다. Proxy 객체는 어떤 객체의 값을 설정하거나 값을 조회할때 등의 인터렉션을 직접 제어할 수 있다.

### 사용 예시: 유효성 검사

Proxy는 person객체를 실수로 수정하는것을 예방해주어 데이터를 안전하게 관리할 수 있다.

```js
const person = {
  name: "John Doe",
  age: 42,
  nationality: "American"
};

const personProxy = new Proxy(person, {
  get: (obj, prop) => {
    if (!obj[prop]) {
      console.log(
        `Hmm.. this property doesn't seem to exist on the target object`
      )
      return undefined
    } else {
      console.log(`The value of ${prop} is ${obj[prop]}`)
      return obj[prop]
    }
  },
  set: (obj, prop, value) => {
    if (prop === 'age' && typeof value !== 'number') {
      console.log(`Sorry, you can only pass numeric values for age.`)
    } else if (prop === 'name' && value.length < 2) {
      console.log(`You need to provide a valid name.`)
    } else {
      console.log(`Changed ${prop} from ${obj[prop]} to ${value}.`)
      obj[prop] = value
    }
  },
})
```

### Reflect

JavaScript는 Reflect라는 빌트인 객체를 제공하는데 Proxy와 함께 사용하면 대상 객체를 쉽게 조작할 수 있다.
이전 예제에서는 Proxy의 핸들러 내에서 괄호 표기를 사용하여 직접 프로퍼티를 수정하거나 읽을 수 있었다. 그 대신에 Reflect 객체를 쓸 수 있다.
Reflect 객체의 메서드는 핸들러 객체과 같은 이름의 메서드를 가질 수 있다.

프로퍼티를 직접 조작하는 것 보다도 더 안정적인 프로그래밍이 가능하다. (참고: https://ui.toast.com/posts/ko_20210413)

자세한 내용은 [Reflect와 Proxy 를 함께 사용한 이유](https://ui.toast.com/posts/ko_20210413#4-proxy%EC%97%90%EC%84%9C-reflect%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B2%8C%EB%90%9C-%EC%9D%B4%EC%9C%A0)를 참고해라.
