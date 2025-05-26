import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
// import webpack from 'webpack';
// import dotenv from 'dotenv';

// const APP_ENV = process.env.NODE_ENV || 'dev';
// dotenv.config({ path: `.env.${APP_ENV}` });

// const prod = ['production', 'staging', 'preprod'].includes(APP_ENV);
// const mode = prod ? 'production' : 'development';

export default {
  mode: 'development',
  entry: './app/index.tsx',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      app: path.resolve('app'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './app/public/index.html',
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
    }),
    // new webpack.DefinePlugin({
    //   'process.env': JSON.stringify(process.env),
    // }),
  ],
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
};
