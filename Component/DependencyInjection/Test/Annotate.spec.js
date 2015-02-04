var annotate = require('../Annotate');

describe('Concerto', function(){
    
    describe('Component', function() {
        
       describe('DependencyInjection', function() {
           
           describe('Annotate', function() {
               
               it('should extract dependencies from argument list', function() {
                    var fn = function(foo, bar, bàz) {};
                    annotate(fn).should.be.eql(['foo', 'bar', 'bàz']);
                    annotate.isInjectable(fn).should.be.true;
               });
               
               it('should extract dependencies from $inject', function() {
                    var fn = function(foo, bar, bàz) {};
                    fn.$inject = ['a', 'b', 'bàz'];
                    annotate(fn).should.be.eql(['a', 'b', 'bàz']);
                    annotate.isInjectable(fn).should.be.true;
               });
               
               it('should extract dependencies from array', function() {
                    var fn = ['a', 'b', 'bàz', function(foo, bar, bàz) {}];
                    annotate(fn).should.be.eql(['a', 'b', 'bàz']);
                    annotate.isInjectable(fn).should.be.true;
               });
               
           });
           
       });
        
    });
    
});