'use strict';
import superagent from 'superagent';
const authorize = (req) => {

  let code = req.query.code;

  console.log('(1 Got code from Github)', code);

  return superagent.get('https://github.com/login/oauth/access_token')
    .send({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.API_URL + '/oauth',
      state: process.env.SECRET,
    })
    .then(response => {
      let gitHubToken = response.body.access_token;
      console.log('(2) got a token from Github response body', response.body);
      console.log('(2) got a token from Github', gitHubToken);
      return gitHubToken;
    })
    .then(token => {
      console.log('TOKEN:', token);
      return superagent.get(`https://api.github.com/user?access_token=${token}`)
        .then(response => {
          let user = response.body;
          console.log('(3) Got User info');
          return user;
        });
    });
//     .then(user => {
//       console.log('(4) Create Account ');
//     })
//     .then(loggedInUser => {
//       console.log('(5) we did it');
//       return loggedInUser.generateToken();
//     })
//     .catch(error => error);
// };

};
export default { authorize };