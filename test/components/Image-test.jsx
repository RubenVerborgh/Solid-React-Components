import React from 'react';
import { Image } from '../../src/';
import { render, cleanup } from 'react-testing-library';
import useLDflex from '../../src/hooks/useLDflex';

jest.mock('../../src/hooks/useLDflex', () => require('../__mocks__/useLDflex'));

describe('An Image', () => {
  afterEach(cleanup);

  describe('with a src property', () => {
    let container;
    const img = () => container.firstChild;
    beforeEach(() => {
      const image = <Image src="user.image" className="pic" width="100"/>;
      ({ container } = render(image));
    });

    describe('before the expression resolves', () => {
      it('is empty', () => {
        expect(container.innerHTML).toBe('');
      });
    });

    describe('after src resolves to a URL', () => {
      beforeEach(() => {
        useLDflex.resolve('user.image', 'https://example.com/image.jpg');
      });

      it('is an img', () => {
        expect(img().tagName).toMatch(/^img$/i);
      });

      it('has the resolved src', () => {
        expect(img()).toHaveAttribute('src', 'https://example.com/image.jpg');
      });

      it('copies other properties', () => {
        expect(img()).toHaveAttribute('class', 'pic');
        expect(img()).toHaveAttribute('width', '100');
      });
    });

    describe('after src resolves to undefined', () => {
      beforeEach(() => {
        useLDflex.resolve('user.image', undefined);
      });

      it('is empty', () => {
        expect(container.innerHTML).toBe('');
      });
    });

    describe('after src errors', () => {
      beforeEach(() => {
        useLDflex.reject('user.image', new Error());
      });

      it('is empty', () => {
        expect(container.innerHTML).toBe('');
      });
    });
  });

  describe('with src and defaultSrc properties', () => {
    let container;
    const img = () => container.firstChild;
    beforeEach(() => {
      const image = <Image src="user.image" defaultSrc="/default.png"/>;
      ({ container } = render(image));
    });

    describe('before the expression resolves', () => {
      it('is an img', () => {
        expect(img().tagName).toMatch(/^img$/i);
      });

      it('has the defaultSrc', () => {
        expect(img()).toHaveAttribute('src', '/default.png');
      });
    });

    describe('after src resolves to a URL', () => {
      beforeEach(() => {
        useLDflex.resolve('user.image', 'https://example.com/image.jpg');
      });

      it('is an img', () => {
        expect(img().tagName).toMatch(/^img$/i);
      });

      it('has the resolved src', () => {
        expect(img()).toHaveAttribute('src', 'https://example.com/image.jpg');
      });
    });

    describe('after src resolves to undefined', () => {
      beforeEach(() => {
        useLDflex.resolve('user.image', undefined);
      });

      it('is an img', () => {
        expect(img().tagName).toMatch(/^img$/i);
      });

      it('has the defaultSrc', () => {
        expect(img()).toHaveAttribute('src', '/default.png');
      });
    });

    describe('after src errors', () => {
      beforeEach(() => {
        useLDflex.reject('user.image', new Error());
      });

      it('is an img', () => {
        expect(img().tagName).toMatch(/^img$/i);
      });

      it('has the defaultSrc', () => {
        expect(img()).toHaveAttribute('src', '/default.png');
      });
    });
  });

  describe('with src and children', () => {
    let container;
    const img = () => container.firstChild;
    beforeEach(() => {
      const image = <Image src="user.image">children</Image>;
      ({ container } = render(image));
    });

    describe('before the expression resolves', () => {
      it('renders the children', () => {
        expect(container.innerHTML).toBe('children');
      });
    });

    describe('after src resolves to a URL', () => {
      beforeEach(() => {
        useLDflex.resolve('user.image', 'https://example.com/image.jpg');
      });

      it('is an img', () => {
        expect(img().tagName).toMatch(/^img$/i);
      });

      it('has the resolved src', () => {
        expect(img()).toHaveAttribute('src', 'https://example.com/image.jpg');
      });
    });

    describe('after src resolves to undefined', () => {
      beforeEach(() => {
        useLDflex.resolve('user.image', undefined);
      });

      it('renders the children', () => {
        expect(container.innerHTML).toBe('children');
      });
    });

    describe('after src errors', () => {
      beforeEach(() => {
        useLDflex.reject('user.image', new Error());
      });

      it('renders the children', () => {
        expect(container.innerHTML).toBe('children');
      });
    });
  });
});
