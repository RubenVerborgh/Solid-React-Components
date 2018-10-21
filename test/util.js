export function mockPromise() {
  let callbacks;
  const promise = new Promise((resolve, reject) => (callbacks = { resolve, reject }));
  promise.resolve = v => new Promise(r => setImmediate(r) && callbacks.resolve(v));
  promise.reject = e => new Promise(r => setImmediate(r) && callbacks.reject(e));
  jest.spyOn(promise, 'then');
  return promise;
}

export function asyncIterable(...items) {
  const iterable = {
    [Symbol.asyncIterator]: () => ({ next }),
  };
  async function next() {
    if (!items.length)
      return { done: true };
    const value = items.shift();
    // Throw an error
    if (value instanceof Error)
      throw value;
    // Halt iteration until resume is called
    if (value === undefined) {
      return new Promise(resolve => {
        iterable.resume = () => {
          resolve(next());
          return new Promise(r => setImmediate(r));
        };
      });
    }
    // Return a simple value
    return { value };
  }
  return iterable;
}

export function update(component) {
  return new Promise(resolve => setImmediate(() => {
    component.update();
    resolve();
  }));
}

export function setProps(component, props) {
  return new Promise(resolve => {
    component.setProps(props, () => setImmediate(resolve));
  });
}

export function unmount(component) {
  return new Promise(resolve => setImmediate(() => {
    component.unmount();
    resolve();
  }));
}
