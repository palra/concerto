var http = require('http'),
    BaseResponse = require('../../Component/HTTP/Response'),
    util = require('util')
;


/**
 * Constructs an Express HTTP response
 *
 * @name Concerto.Bridge.Express.ExpressResponse
 * @class
 */
var ExpressResponse = module.exports = function() {

}

util.inherits(ExpressResponse, BaseResponse);