var WaterfallEventEmitter = require('../WaterfallEventEmitter');
    EventEmitter = require('events').EventEmitter
;

describe('Concerto', function() {

  describe('Component', function() {

    describe('Event', function() {

      describe('WaterfallEventEmitter', function() {

        it('should inherit from EventEmitter', function() {
          var emitter = new WaterfallEventEmitter();
          emitter.should.be.an.instanceOf(EventEmitter)
            .and.have.properties('on', 'once')
          ;
        });

        it('should throw an error when trying to call `emit`', function() {
          (function() {
            var emitter = new WaterfallEventEmitter();
            emitter.emit('something');
          }).should.throwError();
        });

        it('should register listener with .on', function(done) {
          var emitter = new WaterfallEventEmitter();

          emitter
            .on('foo', function(callback) {
              callback(null, 'yeah');
            })
            .on('foo', function(arg1, callback) {
              callback(null, arg1);
            })
            .waterfall('foo', function(err, arg1) {
              arg1.should.be.eql('yeah');
              done();
            })
          ;

        });

        it('should register listener with .once', function(done) {
          var emitter = new WaterfallEventEmitter();

          emitter
            .on('foo', function(callback) {
              callback(null, 'yeah');
            })
            .once('foo', function(arg1, callback) {
              callback(null, arg1 + ', whoo');
            })
            .waterfall('foo', function(err, arg1) {
              arg1.should.be.eql('yeah, whoo');
              emitter.waterfall('foo', function(err, arg1) {
                arg1.should.be.eql('yeah');
                done();
              });
            })
          ;

        });

        it('should pass parameters to the first listener', function(done) {
          var emitter = new WaterfallEventEmitter();

          emitter
            .on('foo', function(nb, callback) {
              callback(null, nb+1);
            })
            .on('foo', function(nb, callback) {
              callback(null, nb*2);
            })
            .waterfall('foo', 2, function(err, nb) {
              nb.should.be.eql(6);
              done();
            })
            ;

        });

        it('should manage synchronous and asynchronous listeners', function(done) {
          var emitter = new WaterfallEventEmitter();

          emitter
            .on('foo', function(nb1, nb2) {
              return nb1 + nb2;
            })
            .on('foo', function(nb, callback) {
              callback(null, nb*2);
            })
            .waterfall('foo', 2, 3, function(err, nb) {
              nb.should.be.eql(10);
              done();
            })
          ;
          
        });

        it('should allow optional callback', function() {
          (function() {
            var emitter = new WaterfallEventEmitter();
            emitter
              .on('foo', function(nb1, nb2) {
                return nb1 + nb2;
              })
              .on('foo', function(nb, callback) {
                callback(null, nb*2);
              })
              .waterfall('foo', 2, 3)
            ;

          }).should.not.throw();
        });

      });

    });

  });

});
