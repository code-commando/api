const nock = require('nock');


// let day = 2;

const scope = nock('https://api.github.com')
  .persist()
  .get('/repos/code-commando/sample-class/contents/')
  .reply(200, {
    'count':500,
    'results':
    [
      'https://raw.githubusercontent.com/code-commando/sample-class/master/01-node-ecosystem/2ndReadMe.js, file:2ndReadMe.js, sha: 8387799fa8b09c58bb5351767b08d1769b905f53', 
    ],
    'classCode': '401n5',

  });

module.exports = scope;