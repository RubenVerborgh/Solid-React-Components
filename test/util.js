import * as enzyme from 'enzyme';

export function immediate(value) {
  return new Promise(resolve => setImmediate(resolve, value));
}

export function mockPromise() {
  let callbacks;
  const promise = new Promise((resolve, reject) => (callbacks = { resolve, reject }));
  promise.resolve = value => callbacks.resolve(value) || immediate();
  promise.reject = error => callbacks.reject(error) || immediate();
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
        iterable.resume = () => immediate(resolve(next()));
      });
    }
    // Return a simple value
    return { value };
  }
  return iterable;
}

export function mount(component) {
  return update(enzyme.mount(component));
}

export async function update(component) {
  await immediate();
  component.update();
  return component;
}

export async function setProps(component, props) {
  await new Promise(resolve => component.setProps(props, resolve));
  return immediate(component);
}
