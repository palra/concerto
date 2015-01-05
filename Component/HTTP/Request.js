var http = require('http'),
    IncomingMessage = http.IncomingMessage,

    util = require('util'),
    url = require('url'),
    mixin = require('merge-descriptors')
;


/**
 * Constructs an HTTP request
 *
 * @name Concerto.Component.HTTP.Request
 * @class
 */
var Request = module.exports = function(req) {
  /**
   * The HTTP version sent by the client.
   *
   * @name Concerto.Component.HTTP.Request#httpVersion
   * @public
   * @member {string}
   */
  this.httpVersion = '';

  /**
   * The HTTP major version sent by the client.
   *
   * @name Concerto.Component.HTTP.Request#httpVersionMajor
   * @public
   * @member {string}
   */
  this.httpVersionMajor = '';

  /**
   * The HTTP minor version sent by the client.
   * 
   * @name Concerto.Component.HTTP.Request#httpVersionMinor
   * @public
   * @member {string}
   */
  this.httpVersionMinor = '';

  /**
   * The request method.
   *
   * @name Concerto.Component.HTTP.Request#method
   * @public
   * @member {String}
   */
  this.method = '';

  /**
   * The request URL string
   * 
   * @name Concerto.Component.HTTP.Request#url
   * @public
   * @member {String}
   */
  this.url = '';

  /**
   * The querystring, extracted from the URL
   * 
   * @name Concerto.Component.HTTP.Request#querystring
   * @public
   * @member {String}
   */
  this.querystring = '';

  /**
   * The path name, extracted from the URL
   * 
   * @name Concerto.Component.HTTP.Request#path
   * @public
   * @member {String}
   */
  this.path = '';

  /**
   * The net.Socket instance associated with the connection
   * 
   * @name Concerto.Component.HTTP.Request#socket
   * @public
   * @member {net.Socket}
   */
  this.socket = {};

  if(req instanceof IncomingMessage)
    this.buildFromIncomingMessage(req);
}

util.inherits(Request, IncomingMessage);

/**
 * Hydrates your object from an `http.IncomingMessage` instance
 * @param  {http.IncomingMessage} req The IncomingMessage
 * @return {Request}                  `this`, for chaining purposes
 */
Request.prototype.buildFromIncomingMessage = function(req) {
  // Put req in this
  mixin(this, req);

  // And parse url
  var parsed = url.parse(req.url, true); // true, for parsed query, ie. in {}
  this.querystring = parsed.search;
  this.query = parsed.query;
  this.path = parsed.pathname;
};