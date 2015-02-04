var _ = require('lodash');

var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;


function assertArgFn(arg, name, acceptArrayAnnotation) {
  if (acceptArrayAnnotation && _.isArray(arg)) {
      arg = arg[arg.length - 1];
  }

  if(!_.isFunction(arg)) {
    throw new Error('Argument '+name+' is not a function, got '+
      (arg && typeof arg === 'object' ? arg.constructor.name || 'Object'
        : typeof arg)
    );
  }
  
  return arg;
}

var annotate = module.exports = function (fn) {
  var $inject,
      fnText,
      argDecl,
      last;

  if (_.isFunction(fn)) {
    if (!($inject = fn.$inject)) {
      $inject = [];
      if (fn.length) {
        fnText = fn.toString().replace(STRIP_COMMENTS, '');
        argDecl = fnText.match(FN_ARGS);
        argDecl[1].split(FN_ARG_SPLIT).forEach(function(arg) {
          arg.replace(FN_ARG, function(all, underscore, name) {
            $inject.push(name);
          });
        });
      }
      fn.$inject = $inject;
    }
  } else if (_.isArray(fn)) {
    last = fn.length - 1;
    assertArgFn(fn[last], 'fn');
    $inject = fn.slice(0, last);
  } else {
    assertArgFn(fn, 'fn', true);
  }
  return $inject;
};

annotate.isInjectable = function(fn) {
  return _.isFunction(fn) || (_.isArray(fn) && _.isFunction(fn[fn.length-1]));
};