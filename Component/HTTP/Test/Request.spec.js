var http = require('http'),
    ClientRequest = http.ClientRequest,
    Request = require('../Request')
;

describe('Concerto', function() {

  describe('Component', function() {

    describe('HTTP', function() {

      describe('Request', function() {
        
        it('should extends http.ClientRequest', function() {
          var req = new Request();
          req.should.be.instanceOf(ClientRequest);
        });

      });

    });

  });

});
