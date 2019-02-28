import MockPromise from 'jest-mock-promise';

export function asyncIterable(...items) {
  let halt = new MockPromise();
  const iterable = {
    then: (...args) => halt.then(...args),
    [Symbol.asyncIterator]: () => ({ next }),
  };
  async function next() {
    if (!items.length) {
      halt.resolve();
      return { done: true };
    }
    const value = items.shift();
    // Throw an error
    if (value instanceof Error)
      throw value;
    // Halt iteration until resume is called
    if (value === undefined) {
      halt.resolve();
      return new Promise(resolve => {
        iterable.resume = () => resolve(next());
      });
    }
    // Return a simple value
    return { value };
  }
  return iterable;
}
