import { useState } from 'react';
import { act } from 'react-testing-library';

let setState;

const useStateMock = jest.fn(() => {
  const [value, setter] = useState({});
  setState = setter;
  return value;
});
useStateMock.set = value => act(() =>
  setState(value)
);

export default useStateMock;
