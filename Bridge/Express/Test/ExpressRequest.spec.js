var BaseRequest = require('../../../Component/HTTP/Request'),
    ExpressRequest = require('../ExpressRequest'),
    express = require('express'),
    appProto = require('express/lib/application')
;

describe('Concerto', function () {

  describe('Bridge', function () {

    describe('Express', function () {

      describe('ExpressRequest', function () {

        it('should extends Concerto.Component.HTTP.Request', function() {
          var req = new ExpressRequest();
          req.should.be.instanceOf(BaseRequest);
        });

      });

    });

  });

});