// 기존(값과 핸들러를 분리하기 전)
import { createContext, useContext, useMemo, useState } from 'react'

const CounterContext = createContext()

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

  const value = { counter, handler }

  return <CounterContext.Provider value={value}>{children}</CounterContext.Provider>
}

const useCounter = () => {
  const value = useContext(CounterContext)
  if (value === undefined) {
    throw new Error('useCounterState should be used within CounterProvider')
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
  const { counter } = useCounter()
  return <h1>{counter}</h1>
}

const Buttons = () => {
  const { handler } = useCounter()

  return (
    <div>
      <button onClick={handler.increase}>+</button>
      <button onClick={handler.decrease}>-</button>
    </div>
  )
}

export default App
