var express = require('express'),
    Server = require('http').Server,
    _ = require('lodash'),
    util = require('util'),

    ExpressRequest = require('./ExpressRequest'),
    ExpressResponse = require('./ExpressResponse')
;

/**
 * @class
 */
var ExpressServer = module.exports = function() {
  this.init();
  this.request = { __proto__: ExpressServer.prototype.request, app: this};
  this.response = { __proto__: ExpressServer.prototype.response, app: this};
}

util.inherits(ExpressServer, Server);
_.assign(ExpressServer.prototype, require('express/lib/application'));

ExpressServer.prototype.listen = function() {
  this._server = express.application.listen.apply(
    this.handle.bind(this),
    arguments
  );

  return this._server;
}

ExpressServer.prototype.close = function() {
  this._server.close.apply(this._server, arguments);
}

ExpressServer.prototype.request = ExpressRequest;
ExpressServer.prototype.response = ExpressResponse;