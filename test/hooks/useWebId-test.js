import { useWebId } from '../../src/';
import { renderHook, cleanup, act } from 'react-hooks-testing-library';
import auth from 'solid-auth-client';

describe('useWebId', () => {
  let result, unmount;
  beforeAll(() => {
    ({ result, unmount } = renderHook(() => useWebId()));
  });
  afterAll(() => unmount());
  afterAll(cleanup);

  it('returns undefined when the login status is unknown', () => {
    expect(result.current).toBeUndefined();
  });

  it('returns null when the user is logged out', () => {
    act(() => void auth.mockWebId(null));
    expect(result.current).toBeNull();
  });

  it('returns the WebID when the user is logged in', () => {
    act(() => void auth.mockWebId('https://example.org/#me'));
    expect(result.current).toBe('https://example.org/#me');
  });
});
