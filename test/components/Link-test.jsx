import React from 'react';
import { Link } from '../../src/';
import { render, cleanup } from 'react-testing-library';
import useLDflex from '../../src/hooks/useLDflex';

jest.mock('../../src/hooks/useLDflex', () => require('../__mocks__/useLDflex'));

describe('Link', () => {
  afterEach(cleanup);

  it('renders a link with children', async () => {
    const link = <Link>Inbox</Link>;
    const { container } = render(link);
    expect(container).toHaveTextContent('Inbox');
  });

  it('renders a link with href', async () => {
    const link = <Link href="other.inbox"/>;
    const { container } = render(link);

    useLDflex.resolve('other.inbox', 'https://other.org/inbox/');
    expect(container.innerHTML).toBe(
      '<a href="https://other.org/inbox/">https://other.org/inbox/</a>');
  });

  it('renders a link with href with an available label', async () => {
    const link = <Link href="user.inbox"/>;
    const { container } = render(link);

    useLDflex.resolve('user.inbox', 'https://user.me/inbox/');
    useLDflex.resolve('[https://user.me/inbox/].label', 'My Inbox');
    expect(container.innerHTML).toBe(
      '<a href="https://user.me/inbox/">My Inbox</a>');
  });

  it('renders a link with href and children', async () => {
    const link = <Link href="user.inbox">Inbox</Link>;
    const { container } = render(link);

    useLDflex.resolve('user.inbox', 'https://user.me/inbox/');
    expect(container.innerHTML).toBe(
      '<a href="https://user.me/inbox/">Inbox</a>');
  });

  it('renders a link with href and children and other props', async () => {
    const link = <Link href="user.inbox" className="inbox">Inbox</Link>;
    const { container } = render(link);

    useLDflex.resolve('user.inbox', 'https://user.me/inbox/');
    expect(container.innerHTML).toBe(
      '<a href="https://user.me/inbox/" class="inbox">Inbox</a>');
  });
});
