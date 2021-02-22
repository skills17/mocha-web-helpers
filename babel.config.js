module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: 'last 2 chrome versions, last 2 firefox versions',
      },
    ],
    '@babel/typescript',
  ],
  plugins: ['@babel/plugin-proposal-class-properties'],
  ignore: ['**/*.d.ts'],
};
