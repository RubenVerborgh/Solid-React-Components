import React from 'react';
import { Name } from '../../src/';
import { render, cleanup, waitForDomChange } from 'react-testing-library';
import data from '@solid/query-ldflex';

data.resolve.mockImplementation(async (path) => ({
  'user.name': 'The User',
})[path]);

describe('Name', () => {
  afterEach(cleanup);

  it('renders a name with src', async () => {
    const { container } = render(<Name src="user"/>);
    await waitForDomChange();
    expect(container).toHaveTextContent('The User');
  });

  it('renders a name with children', async () => {
    const { container } = render(<Name src="other">default</Name>);
    await expect(waitForDomChange({ timeout: 50 })).rejects.toThrow();
    expect(container).toHaveTextContent('default');
  });
});
