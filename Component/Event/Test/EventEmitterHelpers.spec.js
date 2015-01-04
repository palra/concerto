var EventEmitterHelpers = require('../EventEmitterHelpers'),
    WaterfallEventEmitter = require('../WaterfallEventEmitter'),
    ParallelEventEmitter = require('../ParallelEventEmitter'),
    SeriesEventEmitter = require('../SeriesEventEmitter'),
    EventEmitter = require('events').EventEmitter
;

describe('Concerto', function() {

  describe('Component', function() {

    describe('Event', function() {

      describe('EventEmitterHelpers', function() {

        describe('.asyncApply', function() {
          
          it('should not break callback convention (async)', function(done) {
            var ctx = {foo: 'bar'};
            var listener = function(arg1, callback) {
              this.should.be.eql(ctx);
              process.nextTick(function() {
                callback(null, arg1 * 2);
              });
            };

            EventEmitterHelpers.asyncApply(ctx, listener, [5], function(err, res) {
              (err === null).should.be.true;
              res.should.be.eql(10);
              done();
            });

          });

          it('should transform `args` to an array if not already done', function(done) {
            EventEmitterHelpers.asyncApply(this, function(arg1) {
              return arg1 * 2;
            }, 6, function(err, res) {
              (err === null).should.be.true;
              res.should.be.eql(12);
              done();
            });

          });

          it('should not break callback convention (sync)', function(done) {
            var ctx = {foo: 'bar'};
            var goodListener = function(arg1) {
              this.should.be.eql(ctx);
              return 10;
            };

            var badListener = function(arg1) {
              this.should.be.eql(ctx);
              return new Error('wut ?');
            };

            EventEmitterHelpers.asyncApply(ctx, goodListener, [5], function(err, res) {
              (err === null).should.be.true;
              res.should.be.eql(10);

              EventEmitterHelpers.asyncApply(ctx, badListener, [5], function(err, res) {
                err.should.be.instanceOf(Error);
                err.should.have.property('message', 'wut ?');
                done();
              });
            });

          });

          it('should make a synchronous function truly async', function(done) {
            var ctx = {foo: 'bar'};
            var outScopeVar = 0;
            var listener = function(arg1, arg2) {
              this.should.be.eql(ctx);
              outScopeVar = 1;
              return arg1 * arg2;
            };

            EventEmitterHelpers.asyncApply(ctx, listener, [5, 2], function(err, res) {
              (err === null).should.be.true;
              outScopeVar.should.be.eql(1);
              res.should.be.eql(10);
              done();
            });

            outScopeVar.should.be.eql(0);

          });

        });

        describe('.implementEmitter', function() {

            it('should extend an emitter with its constructor', function() {
              function MyEmitter() {
                EventEmitter.apply(this, arguments);
              }

              EventEmitterHelpers.implementEmitter(MyEmitter, WaterfallEventEmitter);
              (new MyEmitter()).should.be.an.instanceOf(EventEmitter);
              (new MyEmitter()).should.be.an.instanceOf(WaterfallEventEmitter);
            });

            it('should extend an emitter with its name', function() {
              (function() {
                function MyEmitter() {
                  EventEmitter.apply(this, arguments);
                }

                EventEmitterHelpers.implementEmitter(MyEmitter, 'waterfall');
                (new MyEmitter()).should.be.an.instanceOf(EventEmitter);
                (new MyEmitter()).should.be.an.instanceOf(WaterfallEventEmitter);
              })();

              (function() {
                function MyEmitter() {
                  EventEmitter.apply(this, arguments);
                }

                EventEmitterHelpers.implementEmitter(MyEmitter, 'Parallel');
                (new MyEmitter()).should.be.an.instanceOf(EventEmitter);
                (new MyEmitter()).should.be.an.instanceOf(ParallelEventEmitter);
              })();

              (function() {
                function MyEmitter() {
                  EventEmitter.apply(this, arguments);
                }

                EventEmitterHelpers.implementEmitter(MyEmitter, 'SerIEs');
                (new MyEmitter()).should.be.an.instanceOf(EventEmitter);
                (new MyEmitter()).should.be.an.instanceOf(SeriesEventEmitter);
              })();
                
            });

            it('should extend multiple emitters', function() {
              function MyEmitter() {
                EventEmitter.apply(this, arguments);
              }

              EventEmitterHelpers.implementEmitter(MyEmitter, 'waterfall', SeriesEventEmitter, 'Parallel');
              (new MyEmitter()).should.be.an.instanceOf(EventEmitter);
              (new MyEmitter().isInstance(WaterfallEventEmitter)).should.be.true;
              (new MyEmitter().isInstance(SeriesEventEmitter)).should.be.true;
              (new MyEmitter().isInstance(ParallelEventEmitter)).should.be.true;

              (new MyEmitter()).should.have.properties('waterfall', 'parallel', 'series');
                
            });

        });

      });

    });

  });

});
