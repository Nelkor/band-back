import { resolve } from 'path'

import { alias } from './dev-helpers/alias'
import { externals } from './dev-helpers/dependencies'

export default {
  target: 'node',
  mode: 'production',
  entry: resolve('src/main.ts'),
  output: {
    path: resolve('app/api/dist'),
    filename: 'index.js',
  },
  resolve: {
    alias,
    extensions: ['.js', '.ts'],
  },
  externals,
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: ['@babel/preset-typescript'],
        },
      },
      {
        test: /\.(sql|txt)$/,
        type: 'asset/source',
      },
    ],
  },
}
