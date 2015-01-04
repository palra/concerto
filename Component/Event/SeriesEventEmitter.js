var EventEmitter = require('events').EventEmitter,
    eventHelpers = require('./EventEmitterHelpers'),
    util = require('util'),
    async = require('async'),
    _ = require('lodash')
;

/**
 * Constructor for a async.series-based event emitter.
 * 
 * @class
 * @classdesc Base class for event emitters, with 
 * [async.series]{@link https://github.com/caolan/async#series}.
 * @name Concerto.Component.Event.SeriesEventEmitter
 */
var SeriesEventEmitter = module.exports = function SeriesEventEmitter() {
  EventEmitter.apply(this, arguments);
};

util.inherits(SeriesEventEmitter, EventEmitter);

SeriesEventEmitter.prototype.emit = eventHelpers.emitOverride;

/**
 * Runs the listeners of `name` in series, each one running once the previous
 * has returned something (or not). If any functions in the series pass an error
 * to its callback, no more function are run, and `callback` is immediately
 * called with the value of the error. Otherwise, `callback` receives an array of
 * results when all listeners did their work.
 * Yes, I just copy-pasted {@link https://github.com/caolan/async#series}, again.
 *
 * @param {string} name Name of the event
 * @param {...mixed} [param] Parameters passed to the listeners
 * @param {Concerto.Component.Event.SeriesEventEmitter~eventEndCallback} [callback] End propagation callback
 * @name Concerto.Component.Event.SeriesEventEmitter#series
 * @method
 */
SeriesEventEmitter.prototype.series = function(name, callback) {
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
      eventHelpers.asyncApply(this, newListener, params, callback);
    }
  }, emitter);

  async.series(listeners, callback);
}

/**
 * End propagation callback for SeriesEventEmitters.
 * @callback Concerto.Component.Event.SeriesEventEmitter~eventEndCallback
 * @param {mixed} err An error object, if any
 * @param {mixed[]} [params] Optional return value(s) of the last listener
 */

/**
 * Used internally in order to create sub-classes
 *
 * @private
 * @static
 * @name Concerto.Component.Event.SeriesEventEmitter.mixin
 */
SeriesEventEmitter.mixin = function() {
  this.series = SeriesEventEmitter.prototype.series;
  this.emit = SeriesEventEmitter.prototype.emit;
};