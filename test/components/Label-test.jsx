import React from 'react';
import { Label } from '../../src/';
import { render, cleanup } from '@testing-library/react';
import useLDflex from '../../src/hooks/useLDflex';

jest.mock('../../src/hooks/useLDflex', () => require('../__mocks__/useLDflex'));

describe('Label', () => {
  afterEach(cleanup);

  it('renders a label with src', async () => {
    const label = <Label src="user"/>;
    const { container } = render(label);

    useLDflex.resolve('user.label', 'Example Label');
    expect(container).toHaveTextContent('Example Label');
  });

  it('renders children until src resolves', async () => {
    const label = <Label src="user">default</Label>;
    const { container } = render(label);
    expect(container).toHaveTextContent('default');

    useLDflex.resolve('user.label', 'Example Label');
    expect(container).toHaveTextContent('Example Label');
  });

  it('renders children if src does not resolve', async () => {
    const label = <Label src="other">default</Label>;
    const { container } = render(label);
    expect(container).toHaveTextContent('default');

    useLDflex.resolve('other.label', undefined);
    expect(container).toHaveTextContent('default');
  });
});
