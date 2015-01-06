var express = require('express'),
    mixin = require('merge-descriptors'),
    EventEmitter = require('events').EventEmitter,
    util = require('util')
;

/**
 * @class
 */
var ExpressServer = module.exports = function() {
  this.init();
  this.request = { __proto__: this.request, app: app};
  this.response = { __proto__: this.response, app: app}
}

util.inherits(ExpressServer, EventEmitter);

mixin(ExpressServer.prototype, require('express/lib/application'));

ExpressServer.prototype.listen = function() {
  this._server = express.application.listen.apply(
    this.handle.bind(this),
    arguments
  );
}

ExpressServer.prototype.close = function() {
  this._server.close.apply(this._server, arguments);
}

ExpressServer.prototype.request = express.request;
ExpressServer.prototype.response = express.response;