var SeriesEventEmitter = require('../SeriesEventEmitter');
    EventEmitter = require('events').EventEmitter
;

describe('Concerto', function() {

  describe('Component', function() {

    describe('Event', function() {

      describe('SeriesEventEmitter', function() {

        it('should inherit from EventEmitter', function() {
          var emitter = new SeriesEventEmitter();
          emitter.should.be.an.instanceOf(EventEmitter)
            .and.have.properties('on', 'once')
          ;
        });

        it('should throw an error when trying to call `emit`', function() {
          (function() {
            var emitter = new SeriesEventEmitter();
            emitter.emit('something');
          }).should.throwError();
        });

        it('should register listener with .on', function(done) {
          var emitter = new SeriesEventEmitter();

          emitter
            .on('foo', function(arg1, arg2, callback) {
              callback(null, arg1 + arg2);
            })
            .on('foo', function(arg1, arg2, callback) {
              callback(null, arg1 - arg2);
            })
            .series('foo', 1, 3, function(err, results) {
              results.should.be.eql([4, -2]);
              done();
            })
          ;

        });

        it('should register listener with .once', function(done) {
          var emitter = new SeriesEventEmitter();

          emitter
            .on('foo', function(arg1, callback) {
              callback(null, arg1+1);
            })
            .once('foo', function(arg1, callback) {
              callback(null, arg1*2);
            })
            .series('foo', 5, function(err, results) {
              results.should.be.eql([6, 10]);
              emitter.series('foo', 5, function(err, results) {
                results.should.be.eql([6]);
                done();
              });
            })
          ;

        });

        it('should pass parameters to the listeners', function(done) {
          var emitter = new SeriesEventEmitter();

          emitter
            .on('foo', function(nb, callback) {
              nb.should.be.eql(2);
              callback(null, nb+1);
            })
            .on('foo', function(nb, callback) {
              nb.should.be.eql(2);
              callback(null, nb*2);
            })
            .series('foo', 2, function(err, results) {
              results.should.be.eql([3, 4]);
              done();
            })
          ;

        });

        it('should manage synchronous and asynchronous listeners', function(done) {
          var emitter = new SeriesEventEmitter();

          emitter
            .on('foo', function(nb1, nb2) {
              nb1.should.be.eql(2);
              nb2.should.be.eql(3);
              return nb1 + nb2;
            })
            .on('foo', function(nb1, nb2, callback) {
              nb1.should.be.eql(2);
              nb2.should.be.eql(3);
              callback(null, nb1 * nb2);
            })
            .series('foo', 2, 3, function(err, results) {
              results.should.be.eql([5, 6]);
              done();
            })
          ;
          
        });

        it('should allow optional callback', function() {
          (function() {
            var emitter = new SeriesEventEmitter();
            emitter
              .on('foo', function(nb1, nb2) {
                nb1.should.be.eql(2);
                nb2.should.be.eql(3);
                return nb1 + nb2;
              })
              .on('foo', function(nb1, nb2, callback) {
                nb1.should.be.eql(2);
                nb2.should.be.eql(3);
                callback(null, nb1 * nb2);
              })
              .series('foo', 2, 3)
            ;
          }).should.not.throw();
          
        });

      });

    });

  });

});
