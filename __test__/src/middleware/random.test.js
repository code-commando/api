'use strict';

import random from '../../../src/middleware/random';

describe('random name function', () => {

  it('returns one random name from a list', () => {
    let list = ['anna', 'aaron', 'michael'];
    let randomOne = random(list);
    // console.log(randomOne);
    expect(randomOne.count).toBe(1);
  });

});
