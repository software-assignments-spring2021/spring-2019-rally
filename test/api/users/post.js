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

  //Trying to register a user with unmatched passwords, expecting an error in return
  it('Fail, second password required', (done) => {
    request(app).post('/api/users/register')
      .send({ name: "foobarbarbar", email: "foobarbarbar@gmail.com", password: "123456", password2: "1234567"})
      .then((res) => {
        const body = res.body;
        expect(body.password2).equals('Passwords must match');
        done();
      });
  });

  //Trying to register a user with insufficient length of password, expecting an error in return
  it('Fail, insufficient password length of 6', (done) => {
    request(app).post('/api/users/register')
      .send({ name: "foobarbarbar", email: "foobarbarbar@gmail.com", password: "12345", password2: "12345"})
      .then((res) => {
        const body = res.body;
        expect(body.password).equals('Password must be at least 6 characters');
        done();
      });
  });


  //Trying to register a user with insufficient length username, expecting an error in return
  it('Fail, insufficient name length of 2', (done) => {
    request(app).post('/api/users/register')
      .send({ name: "f", email: "foobarbarbar@gmail.com", password: "123456", password2: "123456"})
      .then((res) => {
        const body = res.body;
        expect(body.name).equals('Name must be between 2 and 30 characters');
        done();
      });
  });

  //Trying to register a user with an empty name field, expecting an error in return
  it('Fail, name is required', (done) => {
    request(app).post('/api/users/register')
      .send({ name: "", email: "foobarbarbar@gmail.com", password: "123456", password2: "123456"})
      .then((res) => {
        const body = res.body;
        expect(body.name).equals('Name field is required');
        done();
      });
  });

});