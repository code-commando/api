'use strict';

import superagent from 'superagent';


export default class ReadMe {
  static findOne(day, jwt, apiUrl) {
    return ReadMe.fetch(day, jwt, apiUrl)
      .then(README => {
        return README;
      });
  }

  static fetch(day, jwt, apiUrl) {
    return superagent.get(apiUrl)
      .set({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt}` })
      .then(data => {
        return superagent.get(data.body[parseInt(day._id) - 1].url)
          .set({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt}` })
          .then(contents => {
            for (let i = 0; i < contents.body.length; i++) {
              if (contents.body[i].name.split('.')[0] === 'README') {
                return superagent.get(contents.body[i].download_url)
                  .set({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt}` })
                  .then(README => {
                    return README.text;
                  });
              }
            }
          });
      });
  }
}