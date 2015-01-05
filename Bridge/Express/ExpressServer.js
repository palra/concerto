var express = require('express'),
    EventEmitterHelpers = require('../../Component/Event/EventEmitterHelpers'),
    ExpressRequest = require('./ExpressRequest'),
    ExpressResponse = require('./ExpressResponse'),
    appProto = require('express/lib/application'),
    mixin = require('merge-descriptors')
;

/**
 * Extends express server
 *
 * @class
 * @name Concerto.Bridge.Express.ExpressServer
 */
var ExpressServer = module.exports = function() {
  this.init();
}

EventEmitterHelpers.implementEmitter(ExpressServer, 'waterfall', 'series', 'parallel');
mixin(ExpressServer.prototype, appProto);

ExpressServer.prototype.request = ExpressRequest;
ExpressServer.prototype.response = ExpressResponse;