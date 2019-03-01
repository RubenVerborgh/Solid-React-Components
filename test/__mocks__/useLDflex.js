import { useState } from 'react';
import { act } from 'react-testing-library';

const pending = {};

const useLDflexMock = jest.fn((expression, listMode = false) => {
  const [result, setResult] = useState([listMode ? [] : undefined, true, null]);
  pending[expression] = setResult;
  return result;
});
useLDflexMock.resolve = (expression, value) => act(() =>
  pending[expression]([value])
);
useLDflexMock.reject = (expression, error) => act(() =>
  pending[expression]([undefined, false, error])
);

export default useLDflexMock;
