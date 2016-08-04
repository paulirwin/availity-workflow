var merge = require('webpack-merge');
var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');
var context = require('../context');
var logger = require('../logger');

function Config() {

}

var proto = Config.prototype;

proto.extend = function(_webpackConfig) {
  return merge(this.get(), _webpackConfig);
};

proto.get = function() {

  this.webpackConfig = require('./webpack-config');

  // Developers should be able to pass in their own Webpack configuration
  // in order to override the defaults (loaders, entry points, etc.)
  //
  // EX:
  //
  //    workflow.use({
  //      gulp: gulp,
  //      wepback: require('./loca/webpack.config')
  //    });
  //
  var externalWebpack = context.webpack || {};

  //
  return merge(this.webpackConfig, externalWebpack);
};

proto.startServer = function() {

  var compiler = webpack(this.get());

  new webpackDevServer(compiler, {
    quiet: true,
    noInfo: true,
    lazy: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }).listen(context.getConfig().servers.app.port, context.getConfig().servers.app.host, function(err) {
    if (err) {
      logger.fail('Error in WebpackDevServer: ' + JSON.stringify(err));
    }
  });

}

var config = new Config();

module.exports = config;
