import React from 'react';
import { evaluateExpressions } from '../../src/';
import { render, cleanup, wait, waitForDomChange } from 'react-testing-library';
import MockPromise from 'jest-mock-promise';
import data from '@solid/query-ldflex';
import auth from 'solid-auth-client';

describe('An evaluateExpressions wrapper', () => {
  const Wrapper = evaluateExpressions(['foo', 'bar'], ({ foo, bar, pending, other, error }) =>
    <span
      data-foo={`${foo}`}
      data-bar={`${bar}`}
      data-pending={`${pending}`}
      data-other={`${other}`}
      data-error={`${error}`}>contents</span>
  );
  let container, foo, bar, rerender;
  const wrapped = () => container.firstChild;

  beforeEach(() => {
    foo = new MockPromise();
    bar = new MockPromise();
    jest.spyOn(foo, 'then');
    jest.spyOn(bar, 'then');
    auth.mockWebId(null);
    data.resolve.mockReturnValue(bar);
    const wrapper = <Wrapper foo={foo} bar="user.bar" other="value" />;
    ({ container, rerender } = render(wrapper));
  });
  afterEach(cleanup);

  it('renders the wrapped component', () => {
    expect(container).toHaveTextContent('contents');
  });

  it('accepts null as valueProps and listProps', () => {
    const Component = evaluateExpressions(null, null, () => null);
    render(<Component/>);
  });

  it('accepts objects as valueProps and listProps', async () => {
    const Component = evaluateExpressions(['a'], ['b'], ({ a, b }) =>
      <span data-a={`${a}`} data-b={`${b.length}`}/>);

    const rendered = render(<Component a={1234} b={[1, 2, 3, 4]} />);
    await waitForDomChange();
    expect(rendered.container.firstChild).toHaveAttribute('data-a', '1234');
    expect(rendered.container.firstChild).toHaveAttribute('data-b', '4');
  });

  it('accepts an LDFlex expression resulting in a regular object as valueProps and listProps', async () => {
    data.resolve.mockReturnValue(1234);
    const Component = evaluateExpressions(['a'], ['b'], ({ a, b }) =>
      <span data-a={`${a}`} data-b={`${b.length}`}/>);

    const rendered = render(<Component a="[path]"/>);
    await waitForDomChange();
    expect(rendered.container.firstChild).toHaveAttribute('data-a', '1234');
    expect(rendered.container.firstChild).toHaveAttribute('data-b', '0');
  });

  it('accepts empty properties', async () => {
    const Component = evaluateExpressions(['a'], ['b'],
      ({ error }) => <span data-error={`${error}`}/>);
    ({ container } = render(<Component/>));
    await expect(waitForDomChange({ timeout: 50 })).rejects.toThrow();

    expect(wrapped()).toHaveAttribute('data-error', 'undefined');
  });

  describe('before properties are resolved', () => {
    beforeEach(async () => {
      await wait(() => {
        expect(data.resolve).toHaveBeenCalled();
      });
    });

    it('passes the first property as undefined', () => {
      expect(wrapped()).toHaveAttribute('data-foo', 'undefined');
    });

    it('passes the second property as undefined', () => {
      expect(wrapped()).toHaveAttribute('data-bar', 'undefined');
    });

    it('sets pending to true', () => {
      expect(wrapped()).toHaveAttribute('data-pending', 'true');
    });

    it('sets error to undefined', () => {
      expect(wrapped()).toHaveAttribute('data-error', 'undefined');
    });

    it('passes other properties to the wrapped component', () => {
      expect(wrapped()).toHaveAttribute('data-other', 'value');
    });

    it('resolves the string expression', () => {
      expect(data.resolve).toHaveBeenLastCalledWith('user.bar');
    });

    describe('after the second property changes', () => {
      let newBar;
      beforeEach(async () => {
        newBar = new MockPromise();
        data.resolve.mockReturnValue(newBar);
        const wrapper = <Wrapper foo={foo} bar="user.newBar" other="value" />;
        rerender(wrapper);
      });

      it('passes the second property as undefined', () => {
        expect(wrapped()).toHaveAttribute('data-bar', 'undefined');
      });

      describe('after the original second property resolves', () => {
        beforeEach(async () => {
          await bar.resolve('second');
          await expect(waitForDomChange({ timeout: 50 })).rejects.toThrow();
        });

        it('sets pending to true', () => {
          expect(wrapped()).toHaveAttribute('data-pending', 'true');
        });
      });

      describe('after the new second property resolves', () => {
        beforeEach(async () => {
          newBar.resolve('new second');
          await waitForDomChange();
        });

        it('has the new second property value', () => {
          expect(wrapped()).toHaveAttribute('data-bar', 'new second');
        });

        it('sets pending to true', () => {
          expect(wrapped()).toHaveAttribute('data-pending', 'true');
        });
      });
    });
  });

  describe('after the first property resolves', () => {
    beforeEach(async () => {
      foo.resolve('first');
      await waitForDomChange();
    });

    it('passes the first property value', () => {
      expect(wrapped()).toHaveAttribute('data-foo', 'first');
    });

    it('passes the second property as undefined', () => {
      expect(wrapped()).toHaveAttribute('data-bar', 'undefined');
    });

    it('sets pending to true', () => {
      expect(wrapped()).toHaveAttribute('data-pending', 'true');
    });

    describe('after the second property changes', () => {
      let newBar;
      beforeEach(async () => {
        newBar = new MockPromise();
        data.resolve.mockReturnValue(newBar);
        const wrapper = <Wrapper foo={foo} bar="user.newBar" other="value" />;
        rerender(wrapper);
      });

      it('passes the second property as undefined', () => {
        expect(wrapped()).toHaveAttribute('data-bar', 'undefined');
      });

      describe('after the original second property resolves', () => {
        beforeEach(async () => {
          await bar.resolve('second');
        });

        it('passes the second property as undefined', () => {
          expect(wrapped()).toHaveAttribute('data-bar', 'undefined');
        });

        it('sets pending to true', () => {
          expect(wrapped()).toHaveAttribute('data-pending', 'true');
        });
      });

      describe('after the new second property resolves', () => {
        beforeEach(async () => {
          await newBar.resolve('new second');
          await waitForDomChange();
        });

        it('still has the new second property value', () => {
          expect(wrapped()).toHaveAttribute('data-bar', 'new second');
        });

        it('sets pending to false', () => {
          expect(wrapped()).toHaveAttribute('data-pending', 'false');
        });
      });
    });
  });

  describe('after the first property errors', () => {
    beforeEach(async () => {
      foo.reject(new Error('error'));
      await waitForDomChange();
    });

    it('passes the first property as undefined', () => {
      expect(wrapped()).toHaveAttribute('data-foo', 'undefined');
    });

    it('passes the second property as undefined', () => {
      expect(wrapped()).toHaveAttribute('data-bar', 'undefined');
    });

    it('sets pending to true', () => {
      expect(wrapped()).toHaveAttribute('data-pending', 'true');
    });

    it('sets the error', () => {
      expect(wrapped()).toHaveAttribute('data-error', 'Error: error');
    });

    describe('after the first property changes', () => {
      let newFoo;
      beforeEach(async () => {
        newFoo = new MockPromise();
        data.resolve.mockReturnValue(newFoo);
        const wrapper = <Wrapper foo="user.newFoo" bar="user.bar" other="value" />;
        rerender(wrapper);
      });

      it('sets error to undefined', () => {
        expect(wrapped()).toHaveAttribute('data-error', 'undefined');
      });

      it('passes the first property as undefined', () => {
        expect(wrapped()).toHaveAttribute('data-foo', 'undefined');
      });

      it('resolves the string expression', () => {
        expect(data.resolve).toHaveBeenLastCalledWith('user.newFoo');
      });

      describe('after the new first property resolves without error', () => {
        beforeEach(async () => {
          newFoo.resolve('new first');
          await waitForDomChange();
        });

        it('has the new first property value', () => {
          expect(wrapped()).toHaveAttribute('data-foo', 'new first');
        });

        it('sets error to undefined', () => {
          expect(wrapped()).toHaveAttribute('data-error', 'undefined');
        });
      });
    });
  });

  describe('after the second property resolves', () => {
    beforeEach(async () => {
      bar.resolve('second');
      await waitForDomChange();
    });

    it('passes the first property as undefined', () => {
      expect(wrapped()).toHaveAttribute('data-foo', 'undefined');
    });

    it('passes the second property value', () => {
      expect(wrapped()).toHaveAttribute('data-bar', 'second');
    });

    it('sets pending to true', () => {
      expect(wrapped()).toHaveAttribute('data-pending', 'true');
    });
  });

  describe('after the second property errors', () => {
    beforeEach(async () => {
      bar.reject(new Error('error'));
      await waitForDomChange();
    });

    it('passes the first property as undefined', () => {
      expect(wrapped()).toHaveAttribute('data-foo', 'undefined');
    });

    it('passes the second property as undefined', () => {
      expect(wrapped()).toHaveAttribute('data-bar', 'undefined');
    });

    it('sets pending to true', () => {
      expect(wrapped()).toHaveAttribute('data-pending', 'true');
    });

    it('sets the error', () => {
      expect(wrapped()).toHaveAttribute('data-error', 'Error: error');
    });
  });

  describe('after both properties resolve', () => {
    beforeEach(async () => {
      foo.resolve('first');
      bar.resolve('second');
      await waitForDomChange();
    });

    it('passes the first property value', () => {
      expect(wrapped()).toHaveAttribute('data-foo', 'first');
    });

    it('passes the second property value', () => {
      expect(wrapped()).toHaveAttribute('data-bar', 'second');
    });

    it('sets pending to false', () => {
      expect(wrapped()).toHaveAttribute('data-pending', 'false');
    });

    describe('after the user changes', () => {
      beforeEach(async () => {
        bar = new MockPromise();
        data.resolve.mockReturnValue(bar);
        auth.mockWebId('https://example.org/#me');
      });

      it('passes the first property value', () => {
        expect(wrapped()).toHaveAttribute('data-foo', 'first');
      });

      it('passes the old second property value', () => {
        expect(wrapped()).toHaveAttribute('data-bar', 'second');
      });

      it('sets pending to true', () => {
        expect(wrapped()).toHaveAttribute('data-pending', 'true');
      });

      describe('after both properties resolve', () => {
        beforeEach(async () => {
          bar.resolve('second change');
          await waitForDomChange();
        });

        it('passes the same first property value', () => {
          expect(wrapped()).toHaveAttribute('data-foo', 'first');
        });

        it('passes the changed second property value', () => {
          expect(wrapped()).toHaveAttribute('data-bar', 'second change');
        });

        it('sets pending to false', () => {
          expect(wrapped()).toHaveAttribute('data-pending', 'false');
        });
      });
    });
  });
});
