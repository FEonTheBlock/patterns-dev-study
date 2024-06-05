// https://www.inflearn.com/course/%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%A1%9C-%EB%B0%B0%EC%9A%B0%EB%8A%94-%EB%8F%99%EC%8B%9C%EC%84%B1-%ED%95%A8%EC%88%98%ED%98%95/dashboard
function delay<T>(time: number, value: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), time));
}

interface File {
  name: string;
  body: string;
  size: number;
}

function getFile(name: string): Promise<File> {
  return delay(1000, {name, body: '...', size: 100})
}

function* take<T>(length: number, iterable: Iterable<T>) {
  const iterator = iterable[Symbol.iterator]();

  while (length-- > 0) {
    const { value, done } = iterator.next();
    if (done) break;
    yield value;

    // yield 'hi'
  }
}

function* chunk<T>(size: number, iterable: Iterable<T>) {
  const iterator = iterable[Symbol.iterator]()
  while (true) {
    const arr = [...take(size, { [Symbol.iterator]: () => iterator })]
    if (arr.length) yield arr
    if (arr.length < size) break
    // yield 'hi';
  }
}

async function conccurent_명령형<T>(limit: number, fs: (() => Promise<T>)[]) {
  const result: T[][] = []
  for (let i=0; i<fs.length; i++) {
    const tmp: Promise<T>[] = []
    for (let j=0; j<limit; j++) {
      const f = fs[i*limit+j]
      tmp.push(f())
    }
    result.push(await Promise.all(tmp))
  }
  return result.flat();
}

function* map<A, B>(f: (a: A) => B, iterable: Iterable<A>): IterableIterator<B> {
  for (const a of iterable) {
    yield f(a)
  }
}

// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/fromAsync
// Array.fromAsync()
async function formAsync<T>(iterable: Iterable<Promise<T>>) {
  const arr: Awaited<T>[] = []
  for await (const a of iterable) {
    arr.push(a)
  }
  return arr
}

async function conccurent_함수형<T>(limit: number, fs: (() => Promise<T>)[]) {
    const result = await formAsync(
    map(
      ps => Promise.all(ps),
      map(
        fs => fs.map(f => f()),
        chunk(limit, fs)
      )
    )
  );
  return result.flat();
}

// 클래스 더해서 함수형으로 !!
function fx<T>(iterable: Iterable<T>) {
  return new FxIterator(iterable)
}

class FxIterator<T> {
  constructor(public iterable: Iterable<T>) {}

  chunk(size: number) {
    return fx(chunk(size, this.iterable))
  }

  map<U>(f: (a: T) => U) {
    return fx(map(f, this.iterable))
  }

  to<U>(f: (iterable: Iterable<T>) => U): U {
    return f(this.iterable)
  }
}

async function conccurent_체인함수형<T>(limit: number, fs: (() => Promise<T>)[]) {
  return fx(fs)
    .chunk(limit)
    .map(fs => fs.map(f => f()))
    .map(ps => Promise.all(ps))
    .to(formAsync)
    .then(arr => arr.flat())
}

export async function main() {
  console.time()

  const files = await conccurent_체인함수형(3, [
    () => getFile('file1.png'),
    () => getFile('file2.png'),
    () => getFile('file3.png'),
    () => getFile('file4.png'),
    () => getFile('file5.png'),
    () => getFile('file6.png'),
  ])

  console.log(files)

  console.timeEnd()
}

main()

