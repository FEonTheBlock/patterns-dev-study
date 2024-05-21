// 변경(값과 핸들러를 분리)
import { createContext, useContext, useState } from 'react'

/**
 * @link https://velog.io/@velopert/react-context-tutorial#%EA%B0%92%EA%B3%BC-%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8-%ED%95%A8%EC%88%98%EB%A5%BC-%EB%91%90%EA%B0%9C%EC%9D%98-context%EB%A1%9C-%EB%B6%84%EB%A6%AC%ED%95%98%EA%B8%B0
 */
const CounterValueContext = createContext()
const CounterHandlerContext = createContext()

const CounterProvider = ({ children }) => {
  const [counter, setCounter] = useState(1)
  const handler = {
    increase() {
      setCounter((prev) => prev + 1)
    },
    decrease() {
      setCounter((prev) => prev - 1)
    },
  }
  return (
    <CounterHandlerContext.Provider value={handler}>
      <CounterValueContext.Provider value={counter}>{children}</CounterValueContext.Provider>
    </CounterHandlerContext.Provider>
  )
}

const useCounterValue = () => {
  const value = useContext(CounterValueContext)
  if (value === undefined) {
    throw new Error('useCounterValue should be used within CounterProvider')
  }
  return value
}
const useCounterHandler = () => {
  const value = useContext(CounterHandlerContext)
  if (value === undefined) {
    throw new Error('useCounterHandler should be used within CounterProvider')
  }
  return value
}

const App = () => {
  return (
    <CounterProvider>
      <div>
        <Value />
        <Buttons />
      </div>
    </CounterProvider>
  )
}

const Value = () => {
  const counter = useCounterValue()
  return <h1>{counter}</h1>
}

const Buttons = () => {
  const handler = useCounterHandler()

  return (
    <div>
      <button onClick={handler.increase}>+</button>
      <button onClick={handler.decrease}>-</button>
    </div>
  )
}

export default App
