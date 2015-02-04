var _ = require('lodash');
var assert = require('assert');
var annotate = require('./Annotate');

// TODO : test this shit
module.exports = function createInjector() {
  var providerCache = {
    $provide: {}
  };
  var serviceCache = {};
  var INSTANTIATING = {}; /* Sort of flag indicating we are instanciating
  a service */
  var path = [];
  
  var joinStr = ' ← ';
  
  var providerInjector = createInternalInjector(providerCache, function(providerName, caller) {
    if(_.isString(caller)) {
      path.push(caller);
    }
    
    throw new Error('Unknown provider: '+path.join(joinStr));
  });
  var serviceInjector = createInternalInjector(serviceCache);
  
  var providerSuffix = 'Provider';
  
  /////////////////////////////
  //       Private API
  /////////////////////////////
  
  /*===========================
     $provide
  ===========================*/
  
  // Make use of `delegate` if the first argument is an object of keys and
  // values
  function supportObject(delegate) {
    return function(key, value) {
      if (_.isObject(key)) {
        _.forEach(key, _.rearg(delegate, 1, 0));
      } else {
        return delegate(key, value);
      }
    };
  }
  
  (function($provide){
    function provider(name, _provider) {
      assert.notEqual(name, 'hasOwnProperty',
        '`hasOwnProperty` is not a valid service name');
        
      if(annotate.isInjectable(_provider)) {
        _provider = providerInjector.instanciate(_provider);
      }
      
      assert(
        _.isFunction(_provider.$get),
        'The `'+name+'` provider must return a `$get` method'
      );
      
      providerCache[name+providerSuffix] = _provider;
      return providerCache[name+providerSuffix];
    }
    
    function factory(name, _factory) {
      return provider(name, {
        $get: function() {
          var result = serviceInjector.invoke(_factory, this);
          assert(
            _.isUndefined(result),
            '`'+name+'` factory must return a value'
          );
        }
      });
    }
    
    function service(name, _service) {
      return factory(name, function($injector) {
        return $injector.instanciate(_service);
      });
    }
    
    function value(name, _value) {
      return factory(name, _.constant(_value));
    }
    
    function constant(name, value) {
      assert.notEqual(name, 'hasOwnProperty',
        '`hasOwnProperty` is not a valid service name');
        
      providerCache[name] = value;
      serviceCache[name] = value;
    }
  
    function decorator(serviceName, decorFn) {
      var origProvider = providerInjector.get(serviceName + providerSuffix),
          orig$get = origProvider.$get;
  
      origProvider.$get = function() {
        var origService = serviceInjector.invoke(orig$get, origProvider);
        return serviceInjector.invoke(decorFn, null, {$delegate: origService});
      };
    }
    
  
    $provide.provider = supportObject(provider);
    $provide.factory = supportObject(factory);
    $provide.service = supportObject(service);
    $provide.value = supportObject(value);
    $provide.constant = supportObject(constant);
    $provide.decorator = decorator;
    
  })(providerCache.$provide);
  
  
  
  
  
  
  /*===========================
     Internal Injector
  ===========================*/
  
  function createInternalInjector(cache, factory) {
    
    function getDependency(dependencyName, caller) {
      // If the service already exists
      if(cache.hasOwnProperty(dependencyName)) {
        // and we don't have a circular dep
        assert.notStrictEqual(cache[dependencyName], INSTANTIATING,
          'Circular dependency found : '+
          dependencyName + joinStr + path.join(joinStr)
        );
        
        // Return the service
        return cache[dependencyName];
      } else {
        try {
          path.unshift(dependencyName);
          cache[dependencyName] = INSTANTIATING;
          cache[dependencyName] = factory(dependencyName, caller);
          return cache[dependencyName];
        } catch(err) {
          if(cache[dependencyName] === INSTANTIATING) {
            delete cache[dependencyName];
          }
          
          throw err;
        } finally {
          path.shift();
        }
      }
    }
    
    
    function invoke(fn, thisArg, locals, dependencyName) {
      if(typeof locals == 'string') {
        dependencyName = locals;
        locals = null;
      }
      
      var args = [],
          $inject = annotate(fn),
          length, i,
          key;

      for (i = 0, length = $inject.length; i < length; i++) {
        key = $inject[i];
        assert.notStrictEqual(
          typeof key, 'string',
          'Incorrect injection token : expected dependency name as a string,'+
          'got '+key
        );
        
        args.push(
          locals && locals.hasOwnProperty(key) ?
          locals[key] :
          getDependency(key, dependencyName)
        );
      }
      if (_.isArray(fn)) {
        fn = fn[length];
      }

      return fn.apply(thisArg, args);
    }
    
    
    function instanciate(Ctor, locals, dependencyName) {
      var instance = Object.create((_.isArray(Ctor) ? Ctor[Ctor.length - 1] : Ctor).prototype || null);
      var returnedValue = invoke(Ctor, instance, locals, dependencyName);

      return _.isObject(returnedValue) || _.isFunction(returnedValue) ? returnedValue : instance;
    }
    
    return {
      invoke: invoke,
      instanciate: instanciate,
      get: getDependency,
      annotate: annotate,
      has: function(name) {
        return providerCache.hasOwnProperty(name+providerSuffix) || cache.hasOwnProperty(name);
      }
    };
  }
  
  return providerInjector;
};