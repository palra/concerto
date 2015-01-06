/**
 * @readOnly
 * @name Concerto.Component.HTTP.Method
 * @enum {String}
 */
require('methods').forEach(function(method) {
  Object.defineProperty(exports, method.toUpperCase(), {
    value: method.toLowerCase(),
    enumerable: true,
    writable: false,
    configurable: false
  });  
});