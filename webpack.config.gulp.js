/**
 * WEBPACK CONFIG
 *
 * Notes on config properties:
 *
 * 'entry'
 * Entry point for the bundle.
 *
 * 'output'
 * If you pass an array - the modules are loaded on startup. The last one is exported.
 *
 * 'resolve'
 * Array of file extensions used to resolve modules.
 *
 * 'webpack-dev-server'
 * Is a little node.js Express server, which uses the webpack-dev-middleware to serve a webpack bundle.
 * It also has a little runtime which is connected to the server via Socket.IO.
 *
 * 'webpack/hot/dev-server'
 * By adding a script to your index.html file and a special entry point in your configuration
 * you will be able to get live reloads when doing changes to your files.
 *
 * devtool: 'source-map'
 * The source map file.
 *
 * HotModuleReplacementPlugin()
 * Hot Module Replacement (HMR) exchanges, adds or removes modules while an application is running without page reload.
 *
 * NoErrorsPlugin()
 * Hot loader is better when used with NoErrorsPlugin and hot/only-dev-server since it eliminates page reloads
 * altogether and recovers after syntax errors.
 *
 * 'react-hot'
 * React Hot Loader is a plugin for Webpack that allows instantaneous live refresh without losing state
 * while editing React components.
 *
 * 'babel'
 * Babel enables the use of ES6 today by transpiling your ES6 JavaScript into equivalent ES5 source
 * that is actually delivered to the end user browser.
 */

var path    = require('path');
var webpack = require('webpack');

module.exports = {
  entry:  [
    /*'webpack-dev-server/client?http://localhost:3030',
    'webpack/hot/dev-server',*/

    './app/include/scripts/packages/react/index.js',
    './app/include/scripts/packages/react/main.sass'
  ],
  output: {
    //path:     './app/styles/js/',
    path:     '/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test:    /\.js|.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'/*,
        query: ['es2015', 'react', 'stage-0', 'stage-1']*/
      },
      {
        test: /\.css|.sass$/,
        loaders: [
          'style',
          'css?sourceMap'
          /*'css-loader!autoprefixer-loader?browsers=last 2 versions'*/,
          'sass?sourceMap']
      },
      {
        test: /\.(png|jpg|svg|gif|eot|woff|ttf)$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.css', '.sass']
  },
  //
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  //
  devtool: 'source-map',
  //watch: true,
  colors: true,
  progress: true
};
