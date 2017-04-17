'use strict';

function defineFunction(definition) {
  return (...params) => {
    // will prevent rest variables -- use lists instead?
    if (definition.func.length !== params.length) {
      throw new Error("Incorrect number of parameters.");
    }

    if (definition.input(...params)) {
      let result = definition.func(...params);

      if (definition.output(result)) { // but doesn't work for mutable data
        return result;
      }
      else {
        throw new Error("Output contract violation.");
      }

    }
    else {
      throw new Error("Input contract violation.");
    }

  }
}

function checkParameters(fn) {
  return (...parameters) => {
    if (fn.length !== parameters.length) {
      throw new Error("Incorrect number of parameters.");
    }
    else {
      let results = fn(...parameters);
      return results;
    }
  }
}

let contractChecking = true;

// for reusable contracts, maybe the signature should be
// define(contracts, fn)
function define(definition) {
  if (definition.input() === false && contractChecking) {
    throw new Error('Input contract violation.');
  }

  if (definition.output() === false && contractChecking) {
    throw new Error('Output contract violation.');
  }

  return checkParameters(definition.fn);
}

let add1 = defineFunction({
  // contracts expect booleans -- but should they instead expect errors?
  // therefore contract breaks would be more contextual
  // also consider improving this syntax
  input: (input) => { return isNumber(input); },
  output: (output) => { return isNumber(output); },
  func: (value) => {
    return value + 1;
  }
});

// this syntax is still kind of messy
let multiply = function(x, y) {
  let func = (x, y) => { return x * y };

  return define({
    input: () => { return isNumber(x) && isNumber(y) },
    output: () => { return isNumber(func(x, y)) },
    fn: func
  })(...arguments);
}

// higher order function test
// too many nested functions
let createMultiplyBy = function(value) {
  let unguardedCreateMultiplyBy = (val) => {

    let multiplyBy = function(x) {
      let unguardedMultiplyBy = (x) => {
        return x * val;
      }

      return define({
        input: () => { return isNumber(x); },
        output: () => {
          return isNumber(unguardedMultiplyBy(x));
        },
        fn: unguardedMultiplyBy
      })(...arguments);
    };

    return multiplyBy;

  };

  return define({
    input: () => {
      return isNumber(value);
    },
    output: () => {
      return isFunction(unguardedCreateMultiplyBy(value));
    },
    fn: unguardedCreateMultiplyBy
  })(...arguments);
};

exports.createMultiplyBy = createMultiplyBy;

function isFunction(value) {
  return (typeof value) === 'function';
}

// check if is a primitive number
// all number values including the infinities
// but not NaN
function isNumber(value) {
  if (Number.isNaN(value)) {
    return false;
  }
  else {
    return (typeof value) === 'number';
  }
}
