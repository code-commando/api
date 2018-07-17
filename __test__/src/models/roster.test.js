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

  it('mockRequest should exist', () => {
    expect(mockRequest).toBeDefined();
  });

  it('GET roster returns an object with count and array of student names', () => {
    let name1 = {name: 'first last', classCode: '401n5'};
    return mockRequest
      .post(ROSTER_URL)
      .send(name1)
      .then(data => {
        console.log('JSFOIFE', data.body);
        return mockRequest
          .get(ROSTER_URL)
          .then(response => {
            expect(response.body.results[0]).toBe('first last');
          });
      });
  });






});