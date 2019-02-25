import { useLoggedOut } from '../../src/';
import { renderHook, cleanup, act } from 'react-hooks-testing-library';
import auth from 'solid-auth-client';

describe('useLoggedOut', () => {
  let result, unmount;
  beforeAll(() => {
    ({ result, unmount } = renderHook(() => useLoggedOut()));
  });
  afterAll(() => unmount());
  afterAll(cleanup);

  it('returns undefined when the login status is unknown', () => {
    expect(result.current).toBeUndefined();
  });

  it('returns true when the user is logged out', () => {
    act(() => void auth.mockWebId(null));
    expect(result.current).toBe(true);
  });

  it('returns false the user is logged in', () => {
    act(() => void auth.mockWebId('https://example.org/#me'));
    expect(result.current).toBe(false);
  });
});
