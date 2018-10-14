import * as SolidReactComponents from '../src';

describe('The SolidReactComponents module', () => {
  const exports = [
    'withWebId',
    'resolveExpressions',
    'AuthPane',
    'LoggedInPane',
    'LoggedOutPane',
    'AuthButton',
    'LoginButton',
    'LogoutButton',
    'DataField',
  ];

  exports.forEach(name => {
    it(`exports ${name}`, () => {
      expect(SolidReactComponents[name]).toBeInstanceOf(Object);
    });
  });
});
