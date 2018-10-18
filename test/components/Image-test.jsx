import React from 'react';
import { Image } from '../../src/';
import { mount } from 'enzyme';
import { resolveLDflex } from '../../src/util';
import { mockPromise } from '../util';

jest.mock('../../src/util', () => {
  const util = require.requireActual('../../src/util');
  util.resolveLDflex = jest.fn();
  return util;
});

describe('An Image', () => {
  describe('with a src property', () => {
    let image, src;
    beforeEach(() => {
      src = mockPromise();
      resolveLDflex.mockReturnValue(src);
      image = mount(<Image src="user.image" className="pic" width="100"/>);
    });
    afterEach(() => image.unmount());
    const img = () => image.find('img').first();

    describe('before the expression resolves', () => {
      it('is empty', () => {
        expect(image.html()).toBe(null);
      });
    });

    describe('after src resolves to a URL', () => {
      beforeEach(async () => {
        await src.resolve('https://example.com/image.jpg');
        image.update();
      });

      it('is an img', () => {
        expect(img().name()).toBe('img');
      });

      it('has the resolved src', () => {
        expect(img().prop('src')).toBe('https://example.com/image.jpg');
      });

      it('copies other properties', () => {
        expect(img().prop('className')).toBe('pic');
        expect(img().prop('width')).toBe('100');
      });
    });

    describe('after src resolves to undefined', () => {
      beforeEach(async () => {
        await src.resolve(undefined);
        image.update();
      });

      it('is empty', () => {
        expect(image.html()).toBe(null);
      });
    });

    describe('after src errors', () => {
      beforeEach(async () => {
        await src.reject(new Error());
        image.update();
      });

      it('is empty', () => {
        expect(image.html()).toBe(null);
      });
    });
  });

  describe('with src and defaultSrc properties', () => {
    let image, src;
    beforeEach(() => {
      src = mockPromise();
      resolveLDflex.mockReturnValue(src);
      image = mount(<Image src="user.image" defaultSrc="/default.png"
        className="pic" width="100"/>);
    });
    afterEach(() => image.unmount());
    const img = () => image.find('img').first();

    describe('before the expression resolves', () => {
      it('is an img', () => {
        expect(img().name()).toBe('img');
      });

      it('has the defaultSrc', () => {
        expect(img().prop('src')).toBe('/default.png');
      });

      it('copies other properties', () => {
        expect(img().prop('className')).toBe('pic');
        expect(img().prop('width')).toBe('100');
      });
    });

    describe('after src resolves to a URL', () => {
      beforeEach(async () => {
        await src.resolve('https://example.com/image.jpg');
        image.update();
      });

      it('is an img', () => {
        expect(img().name()).toBe('img');
      });

      it('has the resolved src', () => {
        expect(img().prop('src')).toBe('https://example.com/image.jpg');
      });

      it('copies other properties', () => {
        expect(img().prop('className')).toBe('pic');
        expect(img().prop('width')).toBe('100');
      });
    });

    describe('after src resolves to undefined', () => {
      beforeEach(async () => {
        await src.resolve(undefined);
        image.update();
      });

      it('is an img', () => {
        expect(img().name()).toBe('img');
      });

      it('has the defaultSrc', () => {
        expect(img().prop('src')).toBe('/default.png');
      });

      it('copies other properties', () => {
        expect(img().prop('className')).toBe('pic');
        expect(img().prop('width')).toBe('100');
      });
    });

    describe('after src errors', () => {
      beforeEach(async () => {
        await src.reject(new Error());
        image.update();
      });

      it('is an img', () => {
        expect(img().name()).toBe('img');
      });

      it('has the defaultSrc', () => {
        expect(img().prop('src')).toBe('/default.png');
      });

      it('copies other properties', () => {
        expect(img().prop('className')).toBe('pic');
        expect(img().prop('width')).toBe('100');
      });
    });
  });
});
