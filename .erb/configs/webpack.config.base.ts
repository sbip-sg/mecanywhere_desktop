/**
 * Base webpack config used across other specific configs
 */

import dotenv from 'dotenv';
import webpack from 'webpack';
import TsconfigPathsPlugins from 'tsconfig-paths-webpack-plugin';
import webpackPaths from './webpack.paths';
import { dependencies as externals } from '../../release/app/package.json';
import path from 'path';


// Load .env file
const env = dotenv.config().parsed;
const pymecaEnv = dotenv.config({ path: path.resolve(__dirname, '../../.env.pymeca') }).parsed;

// console.log("process.platform", process.platform)
// Determine TASK_EXECUTOR_URL based on the OS
// const TASK_EXECUTOR_URL = process.platform === "win32"
//     ? "http://localhost:2591"
//     : "http://172.18.0.255:2591";

const IPV4_ADDRESS = process.platform === "win32" ? "173.18.0.255" : "172.18.0.255"
// console.log("IPV4_ADDRESS", IPV4_ADDRESS)
// Merge custom environment variables
const environmentVariables = {
  ...env, // Existing .env variables
  ...pymecaEnv,
  IPV4_ADDRESS,
  NODE_ENV: 'production', // You can keep or remove this line depending on your setup
};


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
    plugins: [new TsconfigPathsPlugins()]
  },

  plugins: [
    new webpack.EnvironmentPlugin(environmentVariables),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};

export default configuration;
