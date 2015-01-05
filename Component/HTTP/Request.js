var http = require('http'),
    ClientRequest = http.ClientRequest,

    util = require('util')
;


/**
 * Constructs an HTTP request
 *
 * @name Concerto.Component.HTTP.Request
 * @class
 */
var Request = module.exports = function() {

}

util.inherits(Request, ClientRequest);