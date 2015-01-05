var http = require('http'),
    BaseRequest = require('../../Component/HTTP/Request'),
    util = require('util')
;


/**
 * Constructs an Express HTTP request
 *
 * @name Concerto.Bridge.Express.ExpressRequest
 * @class
 */
var ExpressRequest = module.exports = function() {

}

util.inherits(ExpressRequest, BaseRequest);