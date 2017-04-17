function defineFunction(definition) {
  return (...params) => {
    if (definition.contracts.in(...params)) {
      let result = definition.func(...params);

      if (definition.contracts.out(result)) { // but doesn't work for mutable data
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
  contracts: {
    in: (a) => { return Number.isSafeInteger(a); },
    out: (out) => { return Number.isSafeInteger(out); }
  }
})
