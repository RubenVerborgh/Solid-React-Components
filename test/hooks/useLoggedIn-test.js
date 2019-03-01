import { useLoggedIn } from '../../src/';
import { renderHook, cleanup } from 'react-hooks-testing-library';
import auth from 'solid-auth-client';

describe('useLoggedIn', () => {
  let result, unmount;
  beforeAll(() => {
    ({ result, unmount } = renderHook(() => useLoggedIn()));
  });
  afterAll(() => unmount());
  afterAll(cleanup);

  it('returns undefined when the login status is unknown', () => {
    expect(result.current).toBeUndefined();
  });

  it('returns false when the user is logged out', () => {
    auth.mockWebId(null);
    expect(result.current).toBe(false);
  });

  it('returns true the user is logged in', () => {
    auth.mockWebId('https://example.org/#me');
    expect(result.current).toBe(true);
  });
});
