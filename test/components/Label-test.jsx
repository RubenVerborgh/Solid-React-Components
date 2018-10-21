import React from 'react';
import { Label } from '../../src/';
import { mount } from '../util';
import data from '@solid/query-ldflex';

data.resolve.mockImplementation(async (path) => ({
  '[https://example.org/#thing].label': 'Example Label',
})[path]);

describe('Label', () => {
  it('renders a label with src', async () => {
    const label = await mount(<Label src="[https://example.org/#thing]"/>);
    expect(label.text()).toBe('Example Label');
    label.unmount();
  });

  it('renders a label with children', async () => {
    const label = await mount(<Label src="other">default</Label>);
    expect(label.text()).toBe('default');
    label.unmount();
  });
});
