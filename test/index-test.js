import * as SolidReactComponents from '../src';

describe('The SolidReactComponents module', () => {
  const exports = [
    'useWebId',
    'useLoggedIn',
    'useLoggedOut',
    'useLDflex',
    'useLDflexValue',
    'useLDflexList',
    'useLatestUpdate',
    'useLiveUpdate',

    'withWebId',
    'evaluateExpressions',

    'LoggedIn',
    'LoggedOut',
    'LoginButton',
    'LogoutButton',
    'AuthButton',
    'Value',
    'Image',
    'Link',
    'Label',
    'Name',
    'List',
    'LiveUpdate',

    'UpdateContext',
  ];

  exports.forEach(name => {
    it(`exports ${name}`, () => {
      expect(SolidReactComponents[name]).toBeInstanceOf(Object);
    });
  });
});
