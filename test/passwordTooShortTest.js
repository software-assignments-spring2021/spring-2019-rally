// Written by Erik Law
// Team: Rally
// Trying to enter password that is too short (less than 6 characters)

process.env.NODE_ENV = 'test';

var assert = require('assert');

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server.js');
const conn = require('../index.js');

describe('POST /current', () => {
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

  it('OK, password long enough', (done) => {
    request(app).post('/current')
      .send({ name: 'Erik', email: "el2392@nyu.edu", password: "123456" })
      .then((res) => {
        const body = res.body;
        assert(body.password.length > 6);
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, password not long enough', (done) => {
    request(app).post('/current')
      .send({ name: 'Erik' })
      .then((res) => {
        const body = res.body;
        expect(body.errors.text.name)
          .to.equal('ValidatorError')
        done();
      })
      .catch((err) => done(err));
  });

})




