'use strict';

import requireAll from 'require-dir';
const models = requireAll('../models');

export default (req, res, next) => {
  try{
    let model = req && req.params && req.params.model;
    if(model && models[model] && models[model].default) {
      req.model = models[model].default;
      next();
    }
    else{
      throw 'Not Found';
    }
  }
  catch(err) {
    throw err;
  }
};
