process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../server.js');
const conn = require('../../../db/index.js');

describe('GET /notes', () => {
  before((done) => {
    conn.connect()
      .then(() => done())
      .catch((err) => done(err));
    })
  
  after((done) => {
    conn.close()
      .then(() => done())
      .catch((err) => done(err));
  })

  //A dummy user will be registered for this unit test, and a login attempt will be made, expecting an object with "success" property with a "true" boolean.
  it('OK, getting user "barbarbar" which will be registered for this unit test', (done) => {
    request(app).post('/api/users/register')
      .send({ name: 'barbarbar', email: "baroo@gmail.com", password: "123456", password2: '123456' })
      .then((res) => {
        request(app).post('/api/users/login')
          .send({ email: "baroo@gmail.com", password: "123456" })
          .then((res) => {
          const body = res.body;
          expect(body.success).equals(true);
          done();
        })
      })
      .catch((err) => done(err));
  });
});