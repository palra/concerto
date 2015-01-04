/**
 * @namespace EventEmitterHelpers
 * @memberOf Concerto.Component.Event
 *
 * @see [node-eventflow]{@link https://github.com/cpsubrian/node-eventflow},
 * theses methods comes from there, slightly modified.
 */

var _ = require('lodash'),
    modelo = require('modelo'),
    EventEmitter = require('events').EventEmitter
;

module.exports = {

  /**
   * Apply any function, the async way. If `fn` is not async then it will call
   * the `done` function asynchronously.
   *
   * @param thisArg The `this` binding of `fn`
   * @param {function} fn Function to be async
   * @param {array} args Arguments passed to the function
   * @param {function} done Callback function after `fn` finished his work
   * 
   * @memberOf Concerto.Component.Event.EventEmitterHelpers
   */
  asyncApply: function(thisArg, fn, args, done) {
    if(!Array.isArray(args)) {
      // Make args an Array if not
      args = [args];
    }
    
    // If the function is synchronous :
    if(fn.length <= args.length) {
      // Make `done` really async
      process.nextTick(function() {
        var result = fn.apply(thisArg, args);
        if (result instanceof Error) {
          done.call(thisArg, result);
        } else {
          done.call(thisArg, null, result);
        }
      });
    } else {
      // Else, add the callback to the arguments
      var newArgs = Array.prototype.concat.call(args, done);
      fn.apply(thisArg, newArgs);
    }
  },

  /**
   * Wraps a listener and make it .once compatible.
   * {@link https://github.com/joyent/node/blob/master/lib/events.js#L184-L199}
   * 
   * @param  {EventEmitter} emitter The event emitter of the listener
   * @param  {string} name The name of the event
   * @param  {function} listener The listener to wrap
   * @return {function} The compatible listener function
   * 
   * @memberOf Concerto.Component.Event.EventEmitterHelpers
   */
  handleOnce: function(emitter, name, listener) {
    // If not a .once listener then return it as is
    if(typeof listener.listener !== 'function')
      return listener;

    // Get the original listener
    var origListener = listener.listener;
    // Remove the listener when #removeWrapper is called
    origListener.removeWrapper = emitter.removeListener.bind(
      emitter, name, listener);
    
    return origListener;
  },

  /**
   * Make `Ctor` an `Emitter`
   * 
   * @param  {Function}        Ctor    Constructor to transform
   * @param  {Function|string} Emitter Emitter instance or name of the emitter
   */
  implementEmitter: function(Ctor, Emitter) {

    var args = [].slice.call(arguments, 1);
    var emitters = [];

    for(var i = 0; i < args.length; i++) {
      var emitter = args[i];
      if(_.isString(emitter)) {
        if(/Parallel/i.test(emitter))
          emitter = require('./ParallelEventEmitter');
        else if(/Series/i.test(emitter))
          emitter = require('./SeriesEventEmitter');
        else if(/Waterfall/i.test(emitter))
          emitter = require('./WaterfallEventEmitter');
        else
          throw new Error('Invalid emitter name, got `'+ emitter + '`');
      }
      
      if(_.isFunction(emitter)) {
          emitters.push(emitter);
      } else {
          throw new TypeError('Expected a constructor or an emitter name, got `'+Emitter+'`');
      }
    }

    modelo.inherits.apply(this, [Ctor].concat(emitters));
    
  },

  /**
   * @ignore
   */
  _emitOverride: function() {
    throw new Error(
      "Can't use emit() method, as waterfall event listeners are not "+
      "compatible with the classical event emitter"
    );
  }
};