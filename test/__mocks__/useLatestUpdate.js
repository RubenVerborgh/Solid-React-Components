import { useState } from 'react';
import { act } from 'react-testing-library';

let setUpdate;

const useLatestUpdateMock = jest.fn(() => {
  const [result, setter] = useState({});
  setUpdate = setter;
  return result;
});
useLatestUpdateMock.set = value => act(() =>
  setUpdate(value)
);

export default useLatestUpdateMock;
