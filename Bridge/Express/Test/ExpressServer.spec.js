var ExpressServer = require('../ExpressServer'),
    ExpressRequest = require('../ExpressRequest'),
    ExpressResponse = require('../ExpressResponse'),
    express = require('express'),
    appProto = require('express/lib/application')
;

describe('Concerto', function () {
  
  describe('Bridge', function () {
    
    describe('Express', function () {
      
      describe('ExpressServer', function () {
        
        it('should extends express.js', function() {
          ExpressServer.prototype.should.have.properties(appProto);
        });

        it('should expose express.js\' api', function() {
          var server = new ExpressServer();
          server.init.should.be.a.Function;
          server.listen.should.be.a.Function;
        });

        it('should have our custom request and response', function () {
          var server = new ExpressServer();
          server.request.should.be.eql(ExpressRequest);
          server.response.should.be.eql(ExpressResponse);
        });

        it('should allow custom request and response constructors', function () {
          var server = new ExpressServer();
          var MyReq = server.request = function MyReq() { this.foo = 'bar' };

          server.request.should.be.eql(MyReq);
        });

      });

    });

  });

});