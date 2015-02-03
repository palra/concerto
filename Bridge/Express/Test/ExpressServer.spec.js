var request = require('supertest'),
    express = require('express'),
    ExpressServer = require('../ExpressServer'),
    ExpressRequest = require('../ExpressRequest'),
    ExpressResponse = require('../ExpressResponse')
;

describe('Concerto', function() {

  describe('Bridge', function() {

    describe('Express', function() {

      describe('ExpressServer', function() {
      
        it('should expose ExpressJS\' API', function(done) {
          var srv = new ExpressServer();
          request(srv.listen())
            .get('/')
            .expect(404, function() {
              srv.close(done);
            })
          ;
        });

        it('should expose request and response prototypes', function(done) {
          ExpressServer.prototype.request.should.be.eql(ExpressRequest);
          ExpressServer.prototype.response.should.be.eql(ExpressResponse);

          ExpressServer.prototype.request.foo = function() {};

          ExpressServer.prototype.response.send = function() {
            express.response.send.call(this, 'foo');
          };

          var srv = new ExpressServer();
          srv.get('/', function(req, res) {
            req.foo.should.be.a.Function;
            res.send('bar');
          });

          request(srv.listen())
            .get('/')
            .expect('foo')
            .expect(200, function() {
              srv.close(done);
            })
          ;
        });

      });

    });

  });

});