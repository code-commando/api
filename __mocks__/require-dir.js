'use strict';

import roster from '../src/models/roster';

export default (dir) => {

  const fakeMongo = {
    find: () => Promise.resolve([]),
    findById: () => Promise.resolve({}),
    save: data => Promise.resolve(data),
    findByIdAndUpdate: () => Promise.resolve({}),
    findByIdAndDelete: () => Promise.resolve({}),
  };

  if(typeof dir !== 'string') {
    return {};
  }
  return {
    'foo': {default: fakeMongo},
    'roster': {default: roster},
  };
};
