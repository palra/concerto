var BaseResponse = require('../../../Component/HTTP/Response'),
    ExpressResponse = require('../ExpressResponse'),
    express = require('express'),
    appProto = require('express/lib/application')
;

describe('Concerto', function () {
  
  describe('Bridge', function () {
    
    describe('Express', function () {
      
      describe('ExpressResponse', function () {
        
        it('should extends Concerto.Component.HTTP.Response', function() {
          var req = new ExpressResponse();
          req.should.be.instanceOf(BaseResponse)
        })

      });

    });

  });

});