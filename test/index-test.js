import * as SolidReactComponents from '../src';

describe('The SolidReactComponents module', () => {
  const exports = [
    'withWebId',
    'evaluateExpressions',
    'AuthPane',
    'LoggedInPane',
    'LoggedOutPane',
    'AuthButton',
    'LoginButton',
    'LogoutButton',
    'Value',
    'Image',
  ];

  exports.forEach(name => {
    it(`exports ${name}`, () => {
      expect(SolidReactComponents[name]).toBeInstanceOf(Object);
    });
  });
});
