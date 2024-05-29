/**
 * @link https://github.com/pmndrs/valtio/blob/main/src/vanilla.ts
 */
type Path = (string | symbol)[]
type Op =
  | [op: 'set', path: Path, value: unknown, prevValue: unknown]
  | [op: 'delete', path: Path, prevValue: unknown]
  | [op: 'resolve', path: Path, value: unknown]
  | [op: 'reject', path: Path, error: unknown]
type Listener = (op: Op, nextVersion: number) => void

type CreateSnapshot = <T extends object>(target: T, version: number) => T
type RemoveListener = () => void
type AddListener = (listener: Listener) => RemoveListener

type ProxyState = readonly [
  target: object,
  ensureVersion: (nextCheckVersion?: number) => number,
  createSnapshot: CreateSnapshot,
  addListener: AddListener
]

type ProxyObject = object

const isObject = (x: unknown): x is object => typeof x === 'object' && x !== null

// shared state
const proxyStateMap = new WeakMap<ProxyObject, ProxyState>()
const refSet = new WeakSet()

// 메모리 관리를 위한 WeakMap 설정
const proxyCache = new WeakMap<object, object>()
// [현재 버전, 다음 체크 버전]
const versionHolder = [1, 1] as [number, number]

const canProxy = (x: unknown) =>
  isObject(x) &&
  !refSet.has(x) &&
  (Array.isArray(x) || !(Symbol.iterator in x)) &&
  !(x instanceof WeakMap) &&
  !(x instanceof WeakSet) &&
  !(x instanceof Error) &&
  !(x instanceof Number) &&
  !(x instanceof Date) &&
  !(x instanceof String) &&
  !(x instanceof RegExp) &&
  !(x instanceof ArrayBuffer)

/**
 * proxyFunction 구성
 * 1. 입력 객체가 유효한지 확인하고, 캐시된 Proxy 객체가 있는지 확인
 * 2. 새로운 버전과 리스너를 설정
 * 3. 프로퍼티 리스너와 전체 객체 리스너를 관리하는 함수들을 정의
 * 4. Proxy 핸들러를 정의하여 객체의 속성 접근, 설정, 삭제를 처리
 * 5. 주어진 객체를 Proxy 객체로 변환하고 필요한 상태를 설정
 * 6. 최종적으로 Proxy 객체를 반환합니다.
 */
const proxyFunction = <T extends object>(baseObject: T): T => {
  /**
   * 1. 초기 검증 및 캐시 확인
   */
  if (!isObject(baseObject)) {
    throw new Error('object required')
  }
  const found = proxyCache.get(baseObject) as T | undefined
  if (found) {
    return found
  }

  /**
   * 2. 버전 및 리스너 설정
   */
  // Proxy 객체의 현재 버전 추적
  let version = versionHolder[0]
  // 상태 변경을 구독하는 리스너의 집합
  const listeners = new Set<Listener>()
  // 상태가 변경되었을 때 모든 리스너에게 알림을 보냄
  const notifyUpdate = (op: Op, nextVersion = ++versionHolder[0]) => {
    if (version !== nextVersion) {
      version = nextVersion
      listeners.forEach((listener) => listener(op, nextVersion))
    }
  }
  // 현재 체크하고 있는 버전 저장
  let checkVersion = versionHolder[1]
  // 현재 버전을 확인하고 필요시 업데이트
  const ensureVersion = (nextCheckVersion = ++versionHolder[1]) => {
    // 버전이 변경될 예정이고, 리스너가 없는 경우에
    if (checkVersion !== nextCheckVersion && !listeners.size) {
      checkVersion = nextCheckVersion
      propProxyStates.forEach(([propProxyState]) => {
        const propVersion = propProxyState[1](nextCheckVersion)
        if (propVersion > version) {
          version = propVersion
        }
      })
    }
    return version
  }

  /**
   * 프로퍼티 리스너 설정
   */
  // 특정 프로퍼티의 변경을 감지하는 리스너를 생성
  const createPropListener =
    (prop: string | symbol): Listener =>
    (op, nextVersion) => {
      const newOp: Op = [...op]
      newOp[1] = [prop, ...(newOp[1] as Path)]
      notifyUpdate(newOp, nextVersion)
    }
  // 각 프로퍼티의 Proxy 상태와 리스너 제거 함수를 저장하는 Map
  const propProxyStates = new Map<string | symbol, readonly [ProxyState, RemoveListener?]>()
  // 특정 프로퍼티에 리스너 추가
  const addPropListener = (prop: string | symbol, propValue: unknown) => {
    const propProxyState = !refSet.has(propValue as object) && proxyStateMap.get(propValue as object)
    if (propProxyState) {
      if (import.meta.env?.MODE !== 'production' && propProxyStates.has(prop)) {
        throw new Error('prop listener already exists')
      }
      if (listeners.size) {
        const remove = propProxyState[3](createPropListener(prop))
        propProxyStates.set(prop, [propProxyState, remove])
      } else {
        propProxyStates.set(prop, [propProxyState])
      }
    }
  }

  /**
   * 리스너 관리 함수
   */
  // 특정 프로퍼티의 리스너 제거
  const removePropListener = (prop: string | symbol) => {
    const entry = propProxyStates.get(prop)
    if (entry) {
      propProxyStates.delete(prop)
      entry[1]?.()
    }
  }
  // 전체 객체에 대한 리스너 추가. 리스너가 처음 추가될 때 각 프로퍼티에 대한 리스너도 추가
  const addListener = (listener: Listener) => {
    listeners.add(listener)
    if (listeners.size === 1) {
      propProxyStates.forEach(([propProxyState, prevRemove], prop) => {
        if (import.meta.env?.MODE !== 'production' && prevRemove) {
          throw new Error('remove already exists')
        }
        const remove = propProxyState[3](createPropListener(prop))
        propProxyStates.set(prop, [propProxyState, remove])
      })
    }
    // 전체 객체에 대한 리스너를 추가. 리스너가 모두 제거되면 프로퍼티 리스너도 제거
    const removeListener = () => {
      listeners.delete(listener)
      if (listeners.size === 0) {
        propProxyStates.forEach(([propProxyState, remove], prop) => {
          if (remove) {
            remove()
            propProxyStates.set(prop, [propProxyState])
          }
        })
      }
    }
    return removeListener
  }

  /**
   * Proxy 핸들러 정의
   */
  // 객체 초기화 상태 추적
  let initializing = true
  // Proxy 핸들러 객체로, 객체의 속성 접근, 설정, 삭제 시 동작 정의
  const handler: ProxyHandler<T> = {
    // 프로퍼티가 삭제될 때 리스너를 제거하고 변경 알림
    deleteProperty(target: T, prop: string | symbol) {
      const prevValue = Reflect.get(target, prop)
      removePropListener(prop)
      const deleted = Reflect.deleteProperty(target, prop)
      if (deleted) {
        notifyUpdate(['delete', [prop], prevValue])
      }
      return deleted
    },
    // 프로퍼티가 설정될 때 변경을 처리하고 필요시 리스너 추가
    set(target: T, prop: string | symbol, value: any, receiver: object) {
      const hasPrevValue = !initializing && Reflect.has(target, prop)
      const prevValue = Reflect.get(target, prop, receiver)
      if (
        hasPrevValue &&
        (Object.is(prevValue, value) || (proxyCache.has(value) && Object.is(prevValue, proxyCache.get(value))))
      ) {
        return true
      }
      removePropListener(prop)
      //   if (isObject(value)) {
      //     value = getUntracked(value) || value;
      //   }
      let nextValue = value
      if (value instanceof Promise) {
        value
          .then((v) => {
            ;(value as any).status = 'fulfilled'
            ;(value as any).value = v
            notifyUpdate(['resolve', [prop], v])
          })
          .catch((e) => {
            ;(value as any).status = 'rejected'
            ;(value as any).reason = e
            notifyUpdate(['reject', [prop], e])
          })
      } else {
        if (!proxyStateMap.has(value) && canProxy(value)) {
          nextValue = proxyFunction(value)
        }
        addPropListener(prop, nextValue)
      }
      Reflect.set(target, prop, nextValue, receiver)
      notifyUpdate(['set', [prop], value, prevValue])
      return true
    },
  }

  const newProxy = <T extends object>(target: T, handler: ProxyHandler<T>): T => new Proxy(target, handler)

  /**
   * Proxy 객체 생성
   */
  // 새로운 Proxy 객체 생성
  const proxyObject = newProxy(baseObject, handler)
  // 원본 객체와 프록시 객체를 매핑을 저장 하는 proxyCache 설정
  proxyCache.set(baseObject, proxyObject)
  // 프록시 객체의 상태를 저장하는 배열인 proxyState 설정
  const proxyState: ProxyState = [
    baseObject,
    ensureVersion,
    createSnapshot, // 스냅샷 생성 함수
    addListener,
  ]
  proxyStateMap.set(proxyObject, proxyState)
  // baseObject의 모든 속성 키를 가져와 프록시 객체 초기화 시 원본 객체 속성 값들을 복사
  Reflect.ownKeys(baseObject).forEach((key) => {
    const desc = Object.getOwnPropertyDescriptor(baseObject, key) as PropertyDescriptor
    if ('value' in desc && desc.writable) {
      proxyObject[key as keyof T] = baseObject[key as keyof T]
    }
  })
  initializing = false
  return proxyObject
}
