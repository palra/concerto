var http = require('http'),
    IncomingMessage = http.IncomingMessage,
    Request = require('../Request')
;

describe('Concerto', function() {

  describe('Component', function() {

    describe('HTTP', function() {

      describe('Request', function() {
        
        it('should extends http.IncomingMessage', function() {
          var req = new Request();
          req.should.be.instanceOf(IncomingMessage);
        });

      });

    });

  });

});
