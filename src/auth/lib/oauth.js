'use strict';
import superagent from 'superagent';
import User from '../../models/user';
const authorize = (req) => {

  let code = req.query.code;
  let gitHubToken;
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
      gitHubToken = response.body.access_token;
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
    })
    .then(user => {
      let newUser = {
        user: user.login,
        jwt: gitHubToken,
      };
      console.log(newUser);
      console.log('(4) Create Account ');
      return User.createFromOAuth(newUser);
    })
    .then(newUser => {
      console.log('5. user model created, making token');
      return newUser.generateToken();
    });
};

export default { authorize };