import React from 'react';
import { Label } from '../../src/';
import { render, cleanup, waitForDomChange } from 'react-testing-library';
import data from '@solid/query-ldflex';

data.resolve.mockImplementation(async (path) => ({
  '[https://ex.org/#me].label': 'Example Label',
})[path]);

describe('Label', () => {
  afterEach(cleanup);

  it('renders a label with src', async () => {
    const label = <Label src="[https://ex.org/#me]"/>;
    const { container } = render(label);
    expect(container).toHaveTextContent('');
    await waitForDomChange();
    expect(container).toHaveTextContent('Example Label');
  });

  it('renders children until src resolves', async () => {
    const label = <Label src="[https://ex.org/#me]">default</Label>;
    const { container } = render(label);
    expect(container).toHaveTextContent('default');
    await waitForDomChange();
    expect(container).toHaveTextContent('Example Label');
  });

  it('renders children if src does not resolve', async () => {
    const label = <Label src="[https://ex.org/#other]">default</Label>;
    const { container } = render(label);
    expect(container).toHaveTextContent('default');
    await expect(waitForDomChange({ timeout: 50 })).rejects.toThrow();
    expect(container).toHaveTextContent('default');
  });
});
