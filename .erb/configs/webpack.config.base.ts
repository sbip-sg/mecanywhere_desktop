/**
 * Base webpack config used across other specific configs
 */

import dotenv from 'dotenv';
import webpack from 'webpack';
import TsconfigPathsPlugins from 'tsconfig-paths-webpack-plugin';
import webpackPaths from './webpack.paths';
import { dependencies as externals } from '../../release/app/package.json';
import path from 'path';

const configuration: webpack.Configuration = {
  externals: [...Object.keys(externals || {})],

  stats: 'errors-only',

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            // Remove this line to enable type checking in webpack builds
            transpileOnly: true,
            compilerOptions: {
              module: 'esnext',
            },
          },
        },
      },
    ],
  },

  output: {
    path: webpackPaths.srcPath,
    // https://github.com/webpack/webpack/issues/1114
    library: {
      type: 'commonjs2',
    },
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules'],
    fallback: {
      fs: false,
      path: false,
      querystring: require.resolve('querystring-es3'),
      os: require.resolve('os-browserify/browser'),
      util: require.resolve('util/'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      url: require.resolve('url/'),
    },
    // There is no need to add aliases here, the paths in tsconfig get mirrored
    plugins: [new TsconfigPathsPlugins()],
    alias: {
      react: path.resolve('./node_modules/react')
    }
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      ...dotenv.config().parsed,
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};

export default configuration;
