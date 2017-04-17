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

let add1 = defineFunction({
  func: (a) => {
    return a + 1;
  },
  // contracts expect booleans -- but should they instead expect errors?
  // therefore contract breaks would be more contextual
  // also consider improving this syntax
  input: (a) => { return Number.isSafeInteger(a); },
  output: (out) => { return Number.isSafeInteger(out); }
});

exports.add = add1;
