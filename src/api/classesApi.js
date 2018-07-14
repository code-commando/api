'use strict';


import express from 'express';

const router = express.Router();

import modelfinder from '../middleware/modelHelper.js';
router.param('model', modelfinder);

let url = '/api/v1/classes/';

let sendJSON = (res, data) => {
  res.status(200);
  res.json(data);
};

router.get(url, (req, res) => {
  req.model.find({})
    .then(data => 
      sendJSON(res, data, next))
    .catch(next);
});

router.get(`${url}${id}`, (req, res, next) => {
  req.model.findById(req.params.id)
    .then(data => {
      if (data === null) {
        res.status(404).send('unfound');
      } else {
        sendJSON(res, data);
      }
    }).catch(next);
});

router.post(url, (req, res, next) => {
  let record = new req.model(req.body);
  record.save()
    .then(data => {
      sendJSON(res, data);
    }).catch(next);
});

