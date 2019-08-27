import { useWebId } from '../../src/';
import { renderHook, cleanup } from '@testing-library/react-hooks';
import auth from 'solid-auth-client';

describe('useWebId', () => {
  let result;
  beforeAll(() => {
    ({ result } = renderHook(() => useWebId()));
  });
  afterAll(cleanup);

  it('returns undefined when the login status is unknown', () => {
    expect(result.current).toBeUndefined();
  });

  it('returns null when the user is logged out', () => {
    auth.mockWebId(null);
    expect(result.current).toBeNull();
  });

  it('returns the WebID when the user is logged in', () => {
    auth.mockWebId('https://example.org/#me');
    expect(result.current).toBe('https://example.org/#me');
  });
});
