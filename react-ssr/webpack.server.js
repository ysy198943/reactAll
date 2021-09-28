const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const path = require('path');
const baseConfig = require('./webpack.base');

const config = {
  target: 'node',
  entry: './src/server/index.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  externals: [nodeExternals()] // 不打包node自带的模块
}

module.exports = merge(baseConfig, config)