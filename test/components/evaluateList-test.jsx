import React from 'react';
import { evaluateList } from '../../src/';
import { render, cleanup, waitForDomChange } from '@testing-library/react';
import { asyncIterable } from '../util';

describe('An evaluateList wrapper', () => {
  const Wrapper = evaluateList('items', ({ items, foo, pending, error }) =>
    <span
      data-foo={`${foo}`}
      data-pending={`${pending}`}
      data-error={`${error}`}>{JSON.stringify(items)}</span>
  );
  let container, iterable;
  const span = () => container.firstChild;
  afterAll(cleanup);

  describe('for an empty iterable', () => {
    beforeAll(() => {
      iterable = asyncIterable(undefined);
      const wrapper = <Wrapper items={iterable} foo="bar"/>;
      ({ container } = render(wrapper));
    });

    it('renders the wrapped component', () => {
      expect(span().tagName).toMatch(/^span$/i);
    });

    it('passes other properties to the wrapped component', () => {
      expect(span()).toHaveAttribute('data-foo', 'bar');
    });

    describe('before resolving', () => {
      beforeAll(async () => {
        await iterable;
      });

      it('passes the empty list', () => {
        expect(span()).toHaveTextContent('[]');
      });

      it('sets pending to true', () => {
        expect(span()).toHaveAttribute('data-pending', 'true');
      });

      it('sets error to undefined', () => {
        expect(span()).toHaveAttribute('data-error', 'undefined');
      });
    });

    describe('after resolving', () => {
      beforeAll(async () => {
        iterable.resume();
        await waitForDomChange();
      });

      it('passes the empty list', () => {
        expect(span()).toHaveTextContent('[]');
      });

      it('sets pending to false', () => {
        expect(span()).toHaveAttribute('data-pending', 'false');
      });

      it('sets error to undefined', () => {
        expect(span()).toHaveAttribute('data-error', 'undefined');
      });
    });
  });

  describe('for an iterable of length 1', () => {
    beforeAll(() => {
      iterable = asyncIterable(undefined, 'a');
      const wrapper = <Wrapper items={iterable}/>;
      ({ container } = render(wrapper));
    });

    describe('before resolving', () => {
      beforeAll(async () => {
        await iterable;
      });

      it('passes the empty list', () => {
        expect(span()).toHaveTextContent('[]');
      });

      it('sets pending to true', () => {
        expect(span()).toHaveAttribute('data-pending', 'true');
      });

      it('sets error to undefined', () => {
        expect(span()).toHaveAttribute('data-error', 'undefined');
      });
    });

    describe('after resolving', () => {
      beforeAll(async () => {
        iterable.resume();
        await waitForDomChange();
      });

      it('passes the list', () => {
        expect(span()).toHaveTextContent('["a"]');
      });

      it('sets pending to false', () => {
        expect(span()).toHaveAttribute('data-pending', 'false');
      });

      it('sets error to undefined', () => {
        expect(span()).toHaveAttribute('data-error', 'undefined');
      });
    });
  });

  describe('for an iterable of length 3', () => {
    beforeAll(() => {
      iterable = asyncIterable(undefined, 'a', 'b', 'c');
      const wrapper = <Wrapper items={iterable}/>;
      ({ container } = render(wrapper));
    });

    describe('before resolving', () => {
      beforeAll(async () => {
        await iterable;
      });

      it('passes the empty list', () => {
        expect(span()).toHaveTextContent('[]');
      });

      it('sets pending to true', () => {
        expect(span()).toHaveAttribute('data-pending', 'true');
      });

      it('sets error to undefined', () => {
        expect(span()).toHaveAttribute('data-error', 'undefined');
      });
    });

    describe('after resolving', () => {
      beforeAll(async () => {
        iterable.resume();
        await waitForDomChange();
      });

      it('passes the list', () => {
        expect(span()).toHaveTextContent('["a","b","c"]');
      });

      it('sets pending to false', () => {
        expect(span()).toHaveAttribute('data-pending', 'false');
      });

      it('sets error to undefined', () => {
        expect(span()).toHaveAttribute('data-error', 'undefined');
      });
    });
  });

  describe('for an iterable that errors', () => {
    beforeAll(() => {
      iterable = asyncIterable(undefined, 'a', 'b', new Error('c'), 'd');
      const wrapper = <Wrapper items={iterable}/>;
      ({ container } = render(wrapper));
    });

    describe('before resolving', () => {
      beforeAll(async () => {
        await iterable;
      });

      it('passes the list', () => {
        expect(span()).toHaveTextContent('[]');
      });

      it('sets pending to true', () => {
        expect(span()).toHaveAttribute('data-pending', 'true');
      });

      it('sets error to undefined', () => {
        expect(span()).toHaveAttribute('data-error', 'undefined');
      });
    });

    describe('after resolving', () => {
      beforeAll(async () => {
        iterable.resume();
        await waitForDomChange();
      });

      it('passes the items up to the error', () => {
        expect(span()).toHaveTextContent('["a","b"]');
      });

      it('sets pending to false', () => {
        expect(span()).toHaveAttribute('data-pending', 'false');
      });

      it('sets the error', () => {
        expect(span()).toHaveAttribute('data-error', 'Error: c');
      });
    });
  });

  describe('for an iterable that is replaced during iteration', () => {
    let rerender;
    beforeAll(() => {
      iterable = asyncIterable('a', 'b', undefined, 'c', 'd');
      const wrapper = <Wrapper items={iterable}/>;
      ({ container, rerender } = render(wrapper));
    });

    describe('before replacing', () => {
      beforeAll(async () => {
        await waitForDomChange();
      });

      it('sets the property to the items so far', () => {
        expect(span()).toHaveTextContent('["a","b"]');
      });

      it('sets pending to true', () => {
        expect(span()).toHaveAttribute('data-pending', 'true');
      });

      it('sets error to undefined', () => {
        expect(span()).toHaveAttribute('data-error', 'undefined');
      });
    });

    describe('after replacing', () => {
      let newIterable;
      beforeAll(async () => {
        newIterable = asyncIterable('x', 'y', undefined, 'z');
        const wrapper = <Wrapper items={newIterable}/>;
        rerender(wrapper);
        await iterable.resume();
      });

      describe('while the replacement is iterating', () => {
        beforeAll(async () => {
          await waitForDomChange();
        });

        it('sets the property to the items so far', () => {
          expect(span()).toHaveTextContent('["x","y"]');
        });

        it('sets pending to true', () => {
          expect(span()).toHaveAttribute('data-pending', 'true');
        });

        it('sets error to undefined', () => {
          expect(span()).toHaveAttribute('data-error', 'undefined');
        });
      });

      describe('after the replacement is done iterating', () => {
        beforeAll(async () => {
          newIterable.resume();
          await waitForDomChange();
        });

        it('sets the property to all items', () => {
          expect(span()).toHaveTextContent('["x","y","z"]');
        });

        it('sets pending to false', () => {
          expect(span()).toHaveAttribute('data-pending', 'false');
        });

        it('sets error to undefined', () => {
          expect(span()).toHaveAttribute('data-error', 'undefined');
        });
      });
    });
  });
});
