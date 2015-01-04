var EventEmitter = require('events').EventEmitter,
    eventHelpers = require('./EventEmitterHelpers'),
    util = require('util'),
    async = require('async'),
    _ = require('lodash')
;

/**
 * Constructor for a async.waterfall-based event emitter.
 * 
 * @class
 * @classdesc Base class for event emitters, with 
 * [async.waterfall]{@link https://github.com/caolan/async#waterfall}.
 * @name Concerto.Component.Event.WaterfallEventEmitter
 */
var WaterfallEventEmitter = module.exports = function WaterfallEventEmitter() {
  EventEmitter.apply(this, arguments);
};

util.inherits(WaterfallEventEmitter, EventEmitter);

WaterfallEventEmitter.prototype.emit = eventHelpers.emitOverride;

/**
 * Runs the listeners of `name` in series, each passing their results to the 
 * next in the array. However, if any of the listeners returns or pass to their
 * callback an error, the next function is not executed, and the main `callback`
 * is immediately called with the error.
 * Yes, I just copy-pasted {@link https://github.com/caolan/async#waterfall}.
 *
 * @name Concerto.Component.Event.WaterfallEventEmitter#waterfall
 * @method
 * 
 * @param {string} name Name of the event
 * @param {...mixed} [param] Parameters passed to the first listener
 * @param {Concerto.Component.Event.WaterfallEventEmitter~eventEndCallback} [callback] End propagation callback
 */
WaterfallEventEmitter.prototype.waterfall = function(name, callback) {
  var args = Array.prototype.slice.call(arguments);
  callback = args[args.length-1];
  var emitter = this;
  var params;

  if(typeof callback === 'function')
    params = args.slice(1, args.length - 1);
  else {
    callback = function(){};
    params = args.slice(1);
  }

  var listeners = _.map(this.listeners(name), function(listener, index) {
    var newListener = eventHelpers.handleOnce(emitter, name, listener);
    if(typeof newListener.removeWrapper === 'function')
      newListener.removeWrapper();

    return function(callback) {
      var args = Array.prototype.slice.call(arguments);
      callback = args[args.length - 1];
      var paramsToListener = args.slice(0, -1);

      var argsToListener = paramsToListener;
      if(index == 0)
        argsToListener = params;

      eventHelpers.asyncApply(this, newListener, argsToListener, callback);
    }
  }, emitter);

  async.waterfall(listeners, callback);
}

/**
 * End propagation callback for WaterfallEventEmitters.
 * @callback Concerto.Component.Event.WaterfallEventEmitter~eventEndCallback
 * @param {mixed} err An error object, if any
 * @param {...mixed} [params] Optional return value(s) of the last listener
 */


/**
 * Used internally in order to create sub-classes
 *
 * @private
 * @static
 * @name Concerto.Component.Event.WaterfallEventEmitter.mixin
 */
WaterfallEventEmitter.mixin = function() {
  this.waterfall = WaterfallEventEmitter.prototype.waterfall;
  this.emit = WaterfallEventEmitter.prototype.emit;
};