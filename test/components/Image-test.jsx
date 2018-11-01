import React from 'react';
import { Image } from '../../src/';
import { shallow } from 'enzyme';

// Mock evaluateExpressions so we can fake expression values directly
jest.mock('../../src/components/evaluateExpressions', () =>
  (fields, Component) => {
    if (Component.name === 'Image') {
      const Wrapper = (...args) => Component(...args);
      Wrapper.fields = fields;
      return Wrapper;
    }
    return Component;
  });

describe('An Image', () => {
  it('wraps the component with expression evaluation', () => {
    expect(Image).toHaveProperty(['fields']);
  });

  it('evaluates src expressions', () => {
    expect(Image).toHaveProperty(['fields'], ['src']);
  });

  describe('with a src property', () => {
    let image;
    beforeAll(() => {
      image = shallow(<Image className="pic" width="100"/>);
    });
    afterAll(() => image.unmount());

    describe('before the expression resolves', () => {
      beforeAll(() => image.setProps({ pending: true }));

      it('is empty', () => {
        expect(image.html()).toBe(null);
      });
    });

    describe('after src resolves to a URL', () => {
      beforeAll(() => image.setProps({ src: 'https://example.com/image.jpg' }));

      it('is an img', () => {
        expect(image.name()).toBe('img');
      });

      it('has the resolved src', () => {
        expect(image.prop('src')).toBe('https://example.com/image.jpg');
      });

      it('copies other properties', () => {
        expect(image.prop('className')).toBe('pic');
        expect(image.prop('width')).toBe('100');
      });
    });

    describe('after src resolves to undefined', () => {
      beforeAll(() => image.setProps({ src: undefined }));

      it('is empty', () => {
        expect(image.html()).toBe(null);
      });
    });

    describe('after src errors', () => {
      beforeAll(() => image.setProps({ error: new Error() }));

      it('is empty', () => {
        expect(image.html()).toBe(null);
      });
    });
  });

  describe('with src and defaultSrc properties', () => {
    let image;
    beforeAll(() => {
      image = shallow(
        <Image defaultSrc="/default.png" className="pic" width="100"/>);
    });
    afterAll(() => image.unmount());

    describe('before the expression resolves', () => {
      beforeAll(() => image.setProps({ pending: true }));

      it('is an img', () => {
        expect(image.name()).toBe('img');
      });

      it('has the defaultSrc', () => {
        expect(image.prop('src')).toBe('/default.png');
      });

      it('copies other properties', () => {
        expect(image.prop('className')).toBe('pic');
        expect(image.prop('width')).toBe('100');
      });
    });

    describe('after src resolves to a URL', () => {
      beforeAll(() => image.setProps({ src: 'https://example.com/image.jpg' }));

      it('is an img', () => {
        expect(image.name()).toBe('img');
      });

      it('has the resolved src', () => {
        expect(image.prop('src')).toBe('https://example.com/image.jpg');
      });

      it('copies other properties', () => {
        expect(image.prop('className')).toBe('pic');
        expect(image.prop('width')).toBe('100');
      });
    });

    describe('after src resolves to undefined', () => {
      beforeAll(() => image.setProps({ src: undefined }));

      it('is an img', () => {
        expect(image.name()).toBe('img');
      });

      it('has the defaultSrc', () => {
        expect(image.prop('src')).toBe('/default.png');
      });

      it('copies other properties', () => {
        expect(image.prop('className')).toBe('pic');
        expect(image.prop('width')).toBe('100');
      });
    });

    describe('after src errors', () => {
      beforeAll(() => image.setProps({ error: new Error() }));

      it('is an img', () => {
        expect(image.name()).toBe('img');
      });

      it('has the defaultSrc', () => {
        expect(image.prop('src')).toBe('/default.png');
      });

      it('copies other properties', () => {
        expect(image.prop('className')).toBe('pic');
        expect(image.prop('width')).toBe('100');
      });
    });
  });

  describe('with src and children', () => {
    let image;
    beforeAll(() => {
      image = shallow(<Image className="pic" width="100">children</Image>);
    });
    afterAll(() => image.unmount());

    describe('before the expression resolves', () => {
      beforeAll(() => image.setProps({ pending: true }));

      it('renders the children', () => {
        expect(image.text()).toBe('children');
      });
    });

    describe('after src resolves to a URL', () => {
      beforeAll(() => image.setProps({ src: 'https://example.com/image.jpg' }));

      it('is an img', () => {
        expect(image.name()).toBe('img');
      });

      it('has the resolved src', () => {
        expect(image.prop('src')).toBe('https://example.com/image.jpg');
      });

      it('copies other properties', () => {
        expect(image.prop('className')).toBe('pic');
        expect(image.prop('width')).toBe('100');
      });
    });

    describe('after src resolves to undefined', () => {
      beforeAll(() => image.setProps({ src: undefined }));

      it('renders the children', () => {
        expect(image.text()).toBe('children');
      });
    });

    describe('after src errors', () => {
      beforeAll(() => image.setProps({ error: new Error() }));

      it('renders the children', async () => {
        expect(image.text()).toBe('children');
      });
    });
  });
});
