## Container Presentational 패턴이 구조상 더 좋은 케이스

### [글: 전역 상태 사용시, 상태의 타입이 좁혀지지 않는다](https://velog.io/@woohm402/no-global-state-manager#3-%EC%83%81%ED%83%9C%EC%9D%98-%ED%83%80%EC%9E%85%EC%9D%B4-%EC%A2%81%ED%98%80%EC%A7%80%EC%A7%80-%EC%95%8A%EB%8A%94%EB%8B%A4)

전역 상태의 타입은 프로젝트의 어떤 곳에서 봐도 하나뿐입니다. 가장 간단한 예로, todo 를 페치해서 전역 상태에 집어넣는 경우 초기에는 todo 데이터가 없었을 것입니다. 따라서 todo의 타입은 아래와 같이 정의되어야 합니다.

```ts
type TodoState = {
  todo: Todo | undefined;
}
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
const todo = useSelector((store) => store.todo) as Todo;
```
어느 쪽이든 그리 좋아 보이진 않습니다.

props 였다면?
반면 props 의 장점 중 하나가 타입이 좁혀진 채로 전달된다는 것입니다.

```ts
const TodoPage = () => {
  // ...

  return todo ? <TodoDetail todo={todo} /> : 'loading...';
}

const TodoDetail = ({ todo }: { todo: Todo }) => {
  // 짜잔, undefined 일 수가 없습니다.
  return <div>{todo.title}</div>
}
```
그리고 자식 컴포넌트는 "실제로 내가 받을 값"에만 집중하면 됩니다.

