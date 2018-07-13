'use strict';
// Desired Route: /api/v1/quiz/##
// Actual route: /api/v1/:model/:id


// router.get('/api/v1/:model', (req,res,next) => {
//   req.model.find({})
//     .then( data => sendJSON(res,data) )
//     .catch( next );
// });
module.exports = {
  browser: ''
};

router.get('/api/v1/:model/:id', (req,res,next) => {
  req.model.findOne({_id:req.params.id})
    .then( data => sendJSON(res,data) )
    .catch( next );
});
