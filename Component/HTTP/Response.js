var http = require('http'),
    ServerResponse = http.ServerResponse,

    util = require('util')
;


/**
 * Constructs an HTTP response
 *
 * @name Concerto.Component.HTTP.Response
 * @class
 */
var Response = module.exports = function() {

}

util.inherits(Response, ServerResponse);