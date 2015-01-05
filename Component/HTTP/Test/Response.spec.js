var http = require('http'),
    ServerResponse = http.ServerResponse,
    Response = require('../Response')
;

describe('Concerto', function() {

  describe('Component', function() {

    describe('HTTP', function() {

      describe('Response', function() {
        
        it('should extends http.ServerResponse', function() {
          var req = new Response();
          req.should.be.instanceOf(ServerResponse);
        });

      });

    });

  });

});
