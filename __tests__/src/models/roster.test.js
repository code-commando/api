'use strict';

require('dotenv').config();
require('babel-register');

import {
  Mockgoose,
} from 'mockgoose';
import mongoose from 'mongoose';

import supertest from 'supertest';
import {
  server,
} from '../../../src/app.js';

const ROSTER_URL = '/api/v1/roster';


const mockRequest = supertest(server);

jest.setTimeout(60000);

const mockgoose = new Mockgoose(mongoose);


afterAll((done) => {
  mongoose.disconnect().then(() => {
    console.log('disconnected');
    done();
  }).catch((err) => {
    console.error(err);
    done();
  });
});

beforeAll((done) => {
  console.log('before all console');
  
  mockgoose.prepareStorage().then(() => {
    mongoose.connect('mongodb://localhost/lab_17').then(() => {
      done();
    });
  });
});

afterEach((done) => {
  console.log('after each done');
  mockgoose.helper.reset().then(done);
});


describe('api routes for roster', () => {

  // beforeEach((done) => {
// need to add the auth post before each to login and be able to access all these
  // });


  it('GET roster returns an object with count and array of student names', () => {
    let name1 = {name: 'first last', classCode: '401n5'};
    return mockRequest
      .post(ROSTER_URL)
      .send(name1)
      .then(() => {
        return mockRequest
          .get(`${ROSTER_URL}?classCode=401n5`)
          .then(response => {
            expect(response.body.results[0]).toBe('first last');
          });
      });
  });

  it('POST roster adds new student to the roster', () => {
    let name1 = {name: 'first last', classCode: '401n5'};
    return mockRequest
      .post(ROSTER_URL)
      .send(name1)
      .then(response => {
        expect(response.body.name).toBe('first last');
      });
  });

  it('PUT roster updates the student info', () => {
    let name1 = {name: 'first last', classCode: '401n5'};
    return mockRequest
      .post(ROSTER_URL)
      .send(name1)
      .then(data => {
        return mockRequest
          .put(`${ROSTER_URL}/${data.body._id}`)
          .send({name: 'nota name'})
          .then(response => {
            expect(response.body.name).toBe('nota name');
          });
      });
  });

  it('PUT roster updates all the student info (when you change just the name, it also updates sortable name and short name', () => {
    let name1 = {name: 'first last', classCode: '401n5'};
    return mockRequest
      .post(ROSTER_URL)
      .send(name1)
      .then(data => {
        return mockRequest
          .put(`${ROSTER_URL}/${data.body._id}`)
          .send({name: 'nota name'})
          .then(response => {
            expect(response.body.sortable_name).toBe('name, nota');
          });
      });
  });

  it('DELETE roster removes a student from the list', () => {
    let name1 = {name: 'first last', classCode: '401n5'};
    return mockRequest
      .post(ROSTER_URL)
      .send(name1)
      .then(data => {
        return mockRequest
          .delete(`${ROSTER_URL}/${data.body._id}`)
          .then(response => {
            expect(response.body).toContain('has been removed');
          });
      });
  });




});