import React from 'react';
import { Link } from '../../src/';
import { mount } from '../util';
import data from '@solid/query-ldflex';

data.resolve.mockImplementation(async (path) => ({
  'user.inbox': 'https://user.me/inbox/',
})[path]);

describe('Link', () => {
  it('renders a link with children', async () => {
    const link = await mount(<Link>Inbox</Link>);
    expect(link.text()).toBe('Inbox');
    link.unmount();
  });

  it('renders a link with href', async () => {
    const link = await mount(<Link href="user.inbox"/>);
    expect(link.html())
      .toBe('<a href="https://user.me/inbox/">https://user.me/inbox/</a>');
    link.unmount();
  });

  it('renders a link with href and children', async () => {
    const link = await mount(<Link href="user.inbox">Inbox</Link>);
    expect(link.html())
      .toBe('<a href="https://user.me/inbox/">Inbox</a>');
    link.unmount();
  });

  it('renders a link with href and children and other props', async () => {
    const link = await mount(<Link href="user.inbox" className="inbox">Inbox</Link>);
    expect(link.html())
      .toBe('<a href="https://user.me/inbox/" class="inbox">Inbox</a>');
    link.unmount();
  });
});
