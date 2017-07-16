const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
  entry: {
    sunburst: './lib/client/sunburst'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
    publicPath: 'public/'
  },
  module: {
    rules: [
      {
        test: /.js/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: false
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: { importLoaders: 1 },
            },
            'postcss-loader',
          ],
        }),
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
  ],
};