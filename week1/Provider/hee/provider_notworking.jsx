// 📍 리렌더링이 발생하는 케이스
// 핸들러와 값을 다시 훅으로 합쳐볼려고 했음 => 실패!! 리렌더링이 발생한다.

// 변경(값과 핸들러를 분리)
import { createContext, useContext, useMemo, useState } from 'react'

/**
 * @link https://velog.io/@velopert/react-context-tutorial#%EA%B0%92%EA%B3%BC-%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8-%ED%95%A8%EC%88%98%EB%A5%BC-%EB%91%90%EA%B0%9C%EC%9D%98-context%EB%A1%9C-%EB%B6%84%EB%A6%AC%ED%95%98%EA%B8%B0
 */
const CounterValueContext = createContext()
const CounterHandlerContext = createContext()

const CounterProvider = ({ children }) => {
  const [counter, setCounter] = useState(1)
  const handler = useMemo(() => ({
    increase() {
      setCounter((prev) => prev + 1)
    },
    decrease() {
      setCounter((prev) => prev - 1)
    },
  }), [])
  return (
    <CounterHandlerContext.Provider value={handler}>
      <CounterValueContext.Provider value={counter}>{children}</CounterValueContext.Provider>
    </CounterHandlerContext.Provider>
  )
}

const returnObj = {}
const useCounter = () => {
  // 카운터가 변경되면 useCounter 함수가 다시 호출됨.
  const counter = useContext(CounterValueContext)
  // 카운터가 변경되더라도 핸들러는 변경되지 않음.
  const handler = useContext(CounterHandlerContext)

  if (counter === undefined || handler === undefined) {
    throw new Error('useCounterHandler should be used within CounterProvider')
  }

  returnObj.counter = counter
  returnObj.handler = handler

  // 🚨 하지만, useCounter 함수가 다시 호출되면 컴포넌트의 리렌더링이 발생함!
  // 객체의 같은 참조값을 반환하더라도 리렌더링이 발생한다.
  // 이는 useContext를 사용하는 훅이 다시 호출되면 "상태의 사용 여부랑 상관없이" 훅을 호출한 컴포넌트도 다시 렌더링 됨을 의미한다.
  return returnObj
}

const App = () => {
  return (
    <CounterProvider>
      <div>
        <Value />
        <Buttons />
        <ReRendered />
        <NotRender />
      </div>
    </CounterProvider>
  )
}

const Value = () => {
  const {counter} = useCounter()

  // 🚨 리렌더링 발생!
  return (
    <div>
      <h1>{counter}</h1>
      <p>last update: {new Date().getTime()}</p>
    </div>
  )
}

const Buttons = () => {
  const {handler} = useCounter()

  // 🚨 리렌더링 발생!
  return (
    <div>
      <button onClick={handler.increase}>+</button>
      <button onClick={handler.decrease}>-</button>
      <p>last update: {new Date().getTime()}</p>
    </div>
  )
}

const ReRendered = () => {
  // 🚨 컴포넌트 내부에서 훅을 호출하면 반환값을 JSX에서 사용하지 않더라도 리렌더링 된다.
  useCounter()
  return (
    <div>
      <p>last update: {new Date().getTime()}</p>
    </div>
  )
}

const NotRender = () => {
  // ✅ 리렌더링 되지 않는 컴포넌트.
  return (
    <div>
      <p>last update: {new Date().getTime()}</p>
    </div>
  )
}

export default App
