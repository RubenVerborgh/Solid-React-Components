import React from 'react';
import { Image } from '../../src/';
import { mount } from 'enzyme';
import * as ldflex from '@solid/query-ldflex';

jest.setMock('@solid/query-ldflex', {});

describe('An Image', () => {
  describe('with a src property', () => {
    let image;
    beforeEach(() => {
      ldflex.user = { image: { then: jest.fn() } };
      image = mount(<Image src="user.image" className="pic" width="100"/>);
    });
    const img = () => image.find('img').first();

    describe('before the expression resolves', () => {
      it('is empty', () => {
        expect(image.html()).toBe(null);
      });
    });

    describe('after src resolves to a URL', () => {
      beforeEach(done => {
        const resolve = ldflex.user.image.then.mock.calls[0][0];
        resolve('https://example.com/image.jpg');
        setImmediate(() => image.update());
        setImmediate(done);
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
      beforeEach(done => {
        const resolve = ldflex.user.image.then.mock.calls[0][0];
        resolve(undefined);
        setImmediate(() => image.update());
        setImmediate(done);
      });

      it('is empty', () => {
        expect(image.html()).toBe(null);
      });
    });

    describe('after src errors', () => {
      beforeEach(done => {
        const reject = ldflex.user.image.then.mock.calls[0][1];
        reject(new Error());
        setImmediate(() => image.update());
        setImmediate(done);
      });

      it('is empty', () => {
        expect(image.html()).toBe(null);
      });
    });
  });

  describe('with src and defaultSrc properties', () => {
    let image;
    beforeEach(() => {
      ldflex.user = { image: { then: jest.fn() } };
      image = mount(<Image src="user.image" defaultSrc="/default.png"
        className="pic" width="100"/>);
    });
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
      beforeEach(done => {
        const resolve = ldflex.user.image.then.mock.calls[0][0];
        resolve('https://example.com/image.jpg');
        setImmediate(() => image.update());
        setImmediate(done);
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
      beforeEach(done => {
        const resolve = ldflex.user.image.then.mock.calls[0][0];
        resolve(undefined);
        setImmediate(() => image.update());
        setImmediate(done);
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
      beforeEach(done => {
        const reject = ldflex.user.image.then.mock.calls[0][1];
        reject(new Error());
        setImmediate(() => image.update());
        setImmediate(done);
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
