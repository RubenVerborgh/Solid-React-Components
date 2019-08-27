import React from 'react';
import { UpdateContext, useLiveUpdate } from '../../src/';
import { render, cleanup } from '@testing-library/react';

describe('useLiveUpdate', () => {
  afterAll(cleanup);

  it('uses an UpdateContext', () => {
    function ShowUpdateContext() {
      return useLiveUpdate();
    }

    const { container } = render(
      <UpdateContext.Provider value="live-update-value">
        <ShowUpdateContext/>
      </UpdateContext.Provider>
    );
    expect(container.innerHTML).toBe('live-update-value');
  });
});
