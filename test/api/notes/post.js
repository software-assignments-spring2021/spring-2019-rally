process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../server.js');
const conn = require('../../../db/index.js');

describe('POST /api/users/register', () => {
  before((done) => {
    conn.connect()
      .then(() => done())
      .catch((err) => done(err));
  });

  after((done) => {
    conn.close()
      .then(() => done())
      .catch((err) => done(err));
  });

  //Registering a dummy user and testing to have the returned JSON obect have properties of id, email, name and password.
  it('OK, registering a new user works', (done) => {
    request(app).post('/api/users/register')
      .send({ name: "foobarbarbar", email: "foobarbarbar@gmail.com", password: "123456", password2: "123456"})
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('_id');
        expect(body).to.contain.property('email');
        expect(body).to.contain.property('password');
        expect(body).to.contain.property('name');    
        done();
      });
  });

  //Trying to register a user with unmatched passwords, expecting an eroor in return
  it('Fail, second password required', (done) => {
    request(app).post('/api/users/register')
      .send({ name: "foobarbarbar", email: "foobarbarbar@gmail.com", password: "123456"})
      .then((res) => {
        const body = res.body;
        expect(body.password2).equals('Passwords must match');
        done();
      });
  });

});