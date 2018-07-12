'use strict';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
// import cookieParser from 'cookie-parser';

import router from './api/api.js';

let app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(cookieParser());

app.use(router);
// app.use(profileRouter);
// app.use(upload);
// app.use(noBody);
// app.use(imageRouter);

// app.use(notFound);
// app.use(noAuth);
// app.use(errorHandler);

let server = false;

module.exports = {
  start: (port) => {
    if(!server) {
      server = app.listen(port, (err) => {
        if(err) { throw err; }
        console.log('Server running on ' + port);
      });
    } else {
      console.log('Server is already running');
    }
  },
  stop: () => {
    server.close(() => {
      console.log('Server has closed');
    });
  },
  server: app,
};