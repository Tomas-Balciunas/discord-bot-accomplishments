import path from 'path';

export default {
  test: {
    globals: true,
    testTimeout: 15000,
    coverage: {
      provider: 'v8',
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: '@tests', replacement: path.resolve(__dirname, './tests') },
    ],
  },
};
