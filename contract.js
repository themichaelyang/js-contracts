// doesn't work with rest parameters
function guardParameters(fn) {
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

// consider changing to take in fn, contract
// so contracts can be duplicated
function defineFunction(definition) {
  return (...params) => {
    // also doesnt work with rest params
    if (definition.fn.length !== params.length) {
      throw new Error("Incorrect number of parameters.");
    }

    if (guardParameters(definition.input)(...params)) {
      let result = definition.fn(...params);

      if (guardParameters(definition.output)(result)) { // but doesn't work for mutable data
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

// maybe should use a chainable definition instead of nested
let createMultiplyBy = defineFunction({
  fn: (value) => {
    return defineFunction({
      fn: (x) => {
        return x * value;
      },
      input: (x) => { return isNumber(x); },
      output: (out) => { return isNumber(out); }
    });
  },
  input: (input) => {
    return isNumber(input);
  },
  output: (result) => {
    return isFunction(result);
  }
});

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
