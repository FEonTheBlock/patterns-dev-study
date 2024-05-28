## Container/Presentational 패턴

비지니스 로직과 UI를 분리하는 방법이다.
클래스 컴포넌트가 있었을 때는 Container/Presentational 형태로 비지니스 로직을 분리했다.
HOC구조로 설명될 수도 있다.

### 장점

Container/Presentational 패턴은 여러 장점들을 가지고 있다.

해당 패턴을 활용하면 자연스럽게 관심사의 분리를 구현하게 된다. Presentational 컴포넌트는 UI를 담당하는 순수함수로 작성하게 되는 반면 Container 컴포넌트는 상태와 기타 데이터를 책임지게 된다.

Presentational 컴포넌트는 데이터 변경 없이 화면에 출력할 수 있으므로 앱의 여러 곳에서 다양한 목적으로 재사용할 수 있다.

Presentational 컴포넌트는 앱의 비즈니스 로직을 수정하지 않으므로 코드베이스에 대한 이해가 깊지 않은 개발자더라도 쉽게 수정이 가능하다. 공통으로 쓰이는 Presentational 컴포넌트가 디자인의 요구사항에 따라 수정하면 앱 전체에서 반영된다.

Presentational 컴포넌트는 테스트하기도 쉽다. 일반적으로 순수함수로 구현되므로 전체 목 데이터 스토어를 만들 필요 없이 요구하는 데이터만 인자로 넘겨주면 된다.

### 단점

Container/Presentational 패턴은 비즈니스 로직과 렌더링 로직을 쉽게 분리할 수 있지만 훅을 활용하면 클래스형 컴포넌트를 사용하지 않고도, 또 이 패턴을 따르지 않아도 같은 효과를 볼 수 있다. 참고로 지금은 상태를 가진 컴포넌트도 함수형으로 만들 수 있다.

훅을 사용하더라도 이 패턴을 사용할 수는 있지만 너무 작은 규모의 앱에서는 오버엔지니어링 일 수 있다.

## Container Presentational 패턴이 구조상 더 좋은 케이스

### [글: 전역 상태 사용시, 상태의 타입이 좁혀지지 않는다](https://velog.io/@woohm402/no-global-state-manager#3-%EC%83%81%ED%83%9C%EC%9D%98-%ED%83%80%EC%9E%85%EC%9D%B4-%EC%A2%81%ED%98%80%EC%A7%80%EC%A7%80-%EC%95%8A%EB%8A%94%EB%8B%A4)

전역 상태의 타입은 프로젝트의 어떤 곳에서 봐도 하나뿐입니다. 가장 간단한 예로, todo 를 페치해서 전역 상태에 집어넣는 경우 초기에는 todo 데이터가 없었을 것입니다. 따라서 todo의 타입은 아래와 같이 정의되어야 합니다.

```ts
type TodoState = {
  todo: Todo | undefined;
};
```

이러면 받는 쪽에서는 어떨까요? 부모 컴포넌트에서 이미 로딩 처리를 해 줬기 때문에 TodoDetail 컴포넌트가 마운트된 시점에 이미 todo 데이터가 있어야 한다고 해 보겠습니다.

```ts
import { useSelector } from 'react-redux';

const TodoDetail = () => {
  const todo = useSelector((store) => store.todo);
  return <div>{todo.title}</div> // TSError: todo 는 undefined 일 수 있습니다.
```

개발자에게는 몇 가지 선택지가 있습니다.

```ts
// 타입 가드
// "아니 todo 가 undefined 일 리가 없는데 왜 이래야 돼?"
if (!todo) return;
```

```ts
// 타입 단언
// 매우 찝찝한 방식. 추후 Todo 가 실제로 undefined 일 수 있게 된다면?
const todo = useSelector(store => store.todo) as Todo;
```

어느 쪽이든 그리 좋아 보이진 않습니다.

props 였다면?
반면 props 의 장점 중 하나가 타입이 좁혀진 채로 전달된다는 것입니다.

```ts
const TodoPage = () => {
  // ...

  return todo ? <TodoDetail todo={todo} /> : 'loading...';
};

const TodoDetail = ({ todo }: { todo: Todo }) => {
  // 짜잔, undefined 일 수가 없습니다.
  return <div>{todo.title}</div>;
};
```

그리고 자식 컴포넌트는 "실제로 내가 받을 값"에만 집중하면 됩니다.

> 즉 상위 컴포넌트에서 UI 컴포넌트에게 데이터를 전달하는 식으로 사용하면 더욱 쉽게 비동기 데이터 상태에 따른 UI렌더링 분기 처리를 수행할 수 있다. React의 Suspnse와의 궁합도 매우 좋다.

```jsx
import { Suspense } from 'react';
import User from './User';
import fetchData from './fetchData';

function Main() {
  // 상위 컴포넌트에서 UI 컴포넌트에게 데이터를 주입
  return (
    <main>
      <h2>Suspense 사용</h2>
      <Suspense fallback={<p>사용자 정보 로딩중...</p>}>
        {/* UI 컴포넌트 */}
        <User resource={fetchData('1')} />
      </Suspense>
    </main>
  );
}

export default Main;
```
