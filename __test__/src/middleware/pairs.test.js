'use strict';

import pairs from '../../../src/middleware/pairs';


describe('pairs function', () => {

  it('returns emty array for an empty list', () => {
    let list = '';
    let paired = pairs(list);
    expect(paired.count).toBe(0);
  });

  it('returns random pairs for an even number list of names', () => {
    let list = ['name', 'anna', 'aaron', 'michael'];
    let paired = pairs(list);
    // console.log(paired);
    expect(paired.count).toBe(2);
  });

  it('returns random pairs and for an odd number list, adds the last name to the last pair', () => {
    let list = ['name', 'anna', 'aaron', 'michael', 'extra'];
    let paired = pairs(list);
    // console.log(paired.results[1]);
    expect(paired.count).toBe(2);
    expect(paired.results[1].length).toBe(3);
  });

});