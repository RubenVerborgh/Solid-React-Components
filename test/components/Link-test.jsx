import React from 'react';
import { Link } from '../../src/';
import { render, cleanup, waitForDomChange } from 'react-testing-library';
import data from '@solid/query-ldflex';

data.resolve.mockImplementation(async (path) => ({
  'user.inbox': 'https://user.me/inbox/',
  'other.inbox': 'https://other.org/inbox/',
  '[https://user.me/inbox/].label': 'My Inbox',
})[path]);

describe('Link', () => {
  afterEach(cleanup);

  it('renders a link with children', async () => {
    const link = <Link>Inbox</Link>;
    const { container } = render(link);
    expect(container).toHaveTextContent('Inbox');
    await expect(waitForDomChange({ timeout: 50 })).rejects.toThrow();
  });

  it('renders a link with href', async () => {
    const link = <Link href="other.inbox"/>;
    const { container } = render(link);
    await waitForDomChange();
    expect(container.innerHTML).toBe(
      '<a href="https://other.org/inbox/">https://other.org/inbox/</a>');
  });

  it('renders a link with href with an available label', async () => {
    const link = <Link href="user.inbox"/>;
    const { container } = render(link);
    await waitForDomChange();
    expect(container.innerHTML).toBe(
      '<a href="https://user.me/inbox/">My Inbox</a>');
  });

  it('renders a link with href and children', async () => {
    const link = <Link href="user.inbox">Inbox</Link>;
    const { container } = render(link);
    await waitForDomChange();
    expect(container.innerHTML).toBe(
      '<a href="https://user.me/inbox/">Inbox</a>');
  });

  it('renders a link with href and children and other props', async () => {
    const link = <Link href="user.inbox" className="inbox">Inbox</Link>;
    const { container } = render(link);
    await waitForDomChange();
    expect(container.innerHTML).toBe(
      '<a href="https://user.me/inbox/" class="inbox">Inbox</a>');
  });
});
