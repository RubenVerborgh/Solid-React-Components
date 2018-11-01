import React from 'react';
import { Link } from '../../src/';
import { mount } from 'enzyme';
import { timers } from '../util';
import data from '@solid/query-ldflex';

data.resolve.mockImplementation(async (path) => ({
  'user.inbox': 'https://user.me/inbox/',
  'other.inbox': 'https://other.org/inbox/',
  '[https://user.me/inbox/].label': 'My Inbox',
})[path]);

describe('Link', () => {
  jest.useFakeTimers();

  it('renders a link with children', async () => {
    const link = mount(<Link>Inbox</Link>);
    await timers(link);
    expect(link.text()).toBe('Inbox');
    link.unmount();
  });

  it('renders a link with href', async () => {
    const link = mount(<Link href="other.inbox"/>);
    await timers(link);
    expect(link.html())
      .toBe('<a href="https://other.org/inbox/">https://other.org/inbox/</a>');
    link.unmount();
  });

  it('renders a link with href with an available label', async () => {
    const link = mount(<Link href="user.inbox"/>);
    await timers(link);
    expect(link.html())
      .toBe('<a href="https://user.me/inbox/">My Inbox</a>');
    link.unmount();
  });

  it('renders a link with href and children', async () => {
    const link = mount(<Link href="user.inbox">Inbox</Link>);
    await timers(link);
    expect(link.html())
      .toBe('<a href="https://user.me/inbox/">Inbox</a>');
    link.unmount();
  });

  it('renders a link with href and children and other props', async () => {
    const link = mount(<Link href="user.inbox" className="inbox">Inbox</Link>);
    await timers(link);
    expect(link.html())
      .toBe('<a href="https://user.me/inbox/" class="inbox">Inbox</a>');
    link.unmount();
  });
});
