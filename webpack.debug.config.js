const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');
// const webpack = require("webpack");
const autoprefixer = require('autoprefixer');
const rtl = require('postcss-rtl');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  optimization: {
    minimize: false
  },
  mode: 'none',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['url-loader']
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader'
          }
        ]
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'global',
                localIdentName: '[name]__[local]___[hash:base64:5]'
              },
              sourceMap: true,
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins() {
                return [rtl(), autoprefixer()];
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'options.css'
    }),
    new HtmlWebPackPlugin({
      favicon: './src/assets/icons/favicon.png',
      template: './src/index.html',
      filename: './index.html'
    })
  ]
};
