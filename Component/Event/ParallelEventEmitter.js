var EventEmitter = require('events').EventEmitter,
    eventHelpers = require('./EventEmitterHelpers'),
    util = require('util'),
    async = require('async'),
    _ = require('lodash')
;

/**
 * Constructor for a async.parallel-based event emitter.
 * 
 * @class
 * @classdesc Base class for event emitters, with 
 * [async.parallel]{@link https://github.com/caolan/async#parallel}.
 * @name Concerto.Component.Event.ParallelEventEmitter
 */
var ParallelEventEmitter = module.exports = function ParallelEventEmitter() {
  EventEmitter.apply(this, arguments);
};

util.inherits(ParallelEventEmitter, EventEmitter);

ParallelEventEmitter.prototype.emit = eventHelpers.emitOverride;

/**
 * Runs the listeners of `name` in parallel, without waiting until the previous
 * function has completed. If any of the functions pass an error to its callback,
 * the main `callback` is immediately called with the value of the error. Once
 * the listeners finished their work, the results are passed to the final 
 * `callback` as an array.
 * Yes, I just copy-pasted {@link https://github.com/caolan/async#parallel}, again.
 *
 * @name Concerto.Component.Event.ParallelEventEmitter#parallel
 * @method
 * 
 * @param {string} name Name of the event
 * @param {...mixed} [param] Parameters passed to the listeners
 * @param {Concerto.Component.Event.ParallelEventEmitter~eventEndCallback} [callback] End propagation callback
 */
ParallelEventEmitter.prototype.parallel = function(name, callback) {
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

  async.parallel(listeners, callback);
}

/**
 * End propagation callback for ParallelEventEmitters.
 * @callback Concerto.Component.Event.ParallelEventEmitter~eventEndCallback
 * @param {mixed} err An error object, if any
 * @param {mixed[]} [params] Optional return value(s) of the last listener
 */

/**
 * Used internally in order to create sub-classes
 *
 * @private
 * @static
 * @name Concerto.Component.Event.ParallelEventEmitter.mixin
 */
ParallelEventEmitter.mixin = function() {
  this.parallel = ParallelEventEmitter.prototype.parallel;
  this.emit = ParallelEventEmitter.prototype.emit;
};