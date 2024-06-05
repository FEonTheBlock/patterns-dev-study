> 뇌피셜로 작성한 글

## Container Presentational Pattern

비즈니스 로직과 UI 로직을 분리하는 패턴

- 컨테이너 컴포넌트: 상태를 가지고 있고, 데이터를 불러오는 역할
- 프레젠테이셔널 컴포넌트: 상태를 가지고 있지 않고, UI를 보여주는 역할

### Container Components

예시

`Todos.tsx`

```tsx
const Todos = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  })
  const hasData = !isEmpty(data)
  return (
    <div>
      <h1>오늘의 할일 목록</h1>
      {match([isError, isLoading, hasData, data])
        .with([true, P._, P._, P._], () => <Retry onClickRetry={refetch} />)
        .with([false, true, P._, P._], () => <Loading />)
        .with([false, false, true, P.not(undefined)], ([, , , data]) => <TodoList data={data} />)
        .otherwise(() => (
          <Empty />
        ))}
    </div>
  )
}
```

### Presentational Components

`Retry.tsx`

```tsx
const Retry = ({ onClickRetry }: Props) => {
  return (
    <button type="button" onClick={onClickRetry}>
      Retry
    </button>
  )
}
```

`Loading.tsx`

```tsx
const Loading = () => {
  return <div>Loading</div>
}
```

`TodoList.tsx`

```tsx
const TodoList = ({ data }: Props) => {
  return (
    <ul>
      {data.map(({ id, title }) => (
        <li key={id}>
          <span style={{ color: 'white' }}>{title}</span>
        </li>
      ))}
    </ul>
  )
}
```

`Empty.tsx`

```tsx
const Empty = () => {
  return <div>Empty</div>
}
```

## React의 선언형 방식

`Todos.tsx`

```tsx
const Todos = () => {
  const { reset } = useQueryErrorResetBoundary()
  return (
    <div>
      <h1>오늘의 할일 목록</h1>
      <ErrorBoundary fallback={<Retry onClickRetry={reset} />}>
        <Suspense fallback={<Loading />}>
          <TodoList />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
```

`TodoList.tsx`

```tsx
const TodoList = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  })
  return !isEmpty(data) ? (
    <ul>
      {data?.map(({ id, title }) => (
        <li key={id}>
          <span style={{ color: 'white' }}>{title}</span>
        </li>
      ))}
    </ul>
  ) : (
    <Empty />
  )
}
```

## 점점 더 직접적으로 상태를 가지는 컴포넌트

- 각 컴포넌트가 직접적으로 다루는 상태를 가짐
- 테스트에 용이 및 분리하기 편해짐
  - 부분 렌더링과 같은 아키텍처 적용하기 쉬워지는?
- graphQL과 같은 툴의 필요성

`TodoList.tsx`

```tsx
const TodoList = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  })
  return !isEmpty(data) ? (
    <ul>
      {data?.map(({ id, title }) => (
        <li key={id}>
          <span style={{ color: 'white' }}>{title}</span>
        </li>
      ))}
    </ul>
  ) : (
    <Empty />
  )
}
```
