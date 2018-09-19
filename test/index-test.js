import * as SolidReactComponents from '../src';

describe('The SolidReactComponents module', () => {
  const exports = [
    'AuthPane',
    'LoggedInPane',
    'LoggedOutPane',
    'AuthButton',
    'LoginButton',
    'LogoutButton',
  ];

  exports.forEach(name => {
    it(`exports ${name}`, () => {
      expect(SolidReactComponents[name]).toBeInstanceOf(Object);
    });
  });
});
