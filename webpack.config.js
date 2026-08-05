const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'bundle.[contenthash].js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'Excel CSV Mapper',
    }),
    // Host the Office manifest + ribbon icons so the add-in can be
    // sideloaded from a URL and deployed via the M365 admin center.
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.xml', to: 'manifest.xml' },
        { from: 'assets', to: 'assets' },
      ],
    }),
  ],
  devServer: {
    port: 3000,
    hot: true,
    open: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
