const { context } = jest.requireActual('@solid/query-ldflex').default;

export default {
  context,
  resolve: jest.fn(),
  clearCache: jest.fn(),
};
