import React from 'react';
import { Name } from '../../src/';
import { render, cleanup } from '@testing-library/react';
import useLDflex from '../../src/hooks/useLDflex';

jest.mock('../../src/hooks/useLDflex', () => require('../__mocks__/useLDflex'));

describe('Name', () => {
  afterEach(cleanup);

  it('renders a name with src', async () => {
    const name = <Name src="user"/>;
    const { container } = render(name);

    useLDflex.resolve('user.name', 'Example Name');
    expect(container).toHaveTextContent('Example Name');
  });

  it('renders children until src resolves', async () => {
    const name = <Name src="user">default</Name>;
    const { container } = render(name);
    expect(container).toHaveTextContent('default');

    useLDflex.resolve('user.name', 'Example Name');
    expect(container).toHaveTextContent('Example Name');
  });

  it('renders children if src does not resolve', async () => {
    const name = <Name src="other">default</Name>;
    const { container } = render(name);
    expect(container).toHaveTextContent('default');

    useLDflex.resolve('other.name', undefined);
    expect(container).toHaveTextContent('default');
  });
});
