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

  // Hassan - registering a dummy user and testing to have the returned JSON obect have properties of id, email, name and password.
  it('OK, registering a new user works', (done) => {
    request(app).post('/api/users/register')
      .send({ name: "foobarbarbar", username: "foofoo", email: "foobarbarbar@gmail.com", password: "Test123", password2: "Test123"})
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('_id');
        expect(body).to.contain.property('email');
        expect(body).to.contain.property('password');
        expect(body).to.contain.property('name');
        expect(body).to.contain.property('username');
        done();
      });
  });

  // Hassan - trying to register a user with unmatched passwords, expecting an error in return
  it('Fail, second password must match first', (done) => {
    request(app).post('/api/users/register')
      .send({ name: "foobarbarbar", username: "foofoo", email: "foobarbarbar@gmail.com", password: "Test123", password2: "Test1234"})
      .then((res) => {
        const body = res.body;
        expect(body.password2).equals('Passwords must match');
        done();
      });
  });

  // Erik - trying to register a user with insufficient length of password, expecting an error in return
  it('Fail, insufficient password length of 6', (done) => {
    request(app).post('/api/users/register')
      .send({ name: "foobarbarbar", username: "foofoo", email: "foobarbarbar@gmail.com", password: "Test1", password2: "Test1"})
      .then((res) => {
        const body = res.body;
        expect(body.password).equals('Password must be at least 6 characters');
        done();
      });
  });

  // Nanako - providing wrong email for registration
  it('Fail, invalid email at register', (done) => {
    request(app).post('/api/users/register')
      .send({ name: "foobarbarbar", username: "foofoo", email: "foobarbarbarmail.com", password: "Test123", password2: "Test123"})
      .then((res) => {
        const body = res.body;
        expect(body.email).equals('Email is invalid');
        done();
      });
  });

  // Nanako - having less than 1 character in name when registering
  it('Fail, invalid name (too short) at register', (done) => {
    request(app).post('/api/users/register')
      .send({ name: "f", username: "foofoo", email: "foobarbarbar@gmail.com", password: "Test123", password2: "Test123"})
      .then((res) => {
        const body = res.body;
        expect(body.name).equals('Name must be between 2 and 30 characters');
        done();
      });
  });

  // Erik - trying to register a user with an empty name field, expecting an error in return
  it('Fail, name is required', (done) => {
    request(app).post('/api/users/register')
      .send({ name: "", username: "foofoo", email: "foobarbarbar@gmail.com", password: "Test123", password2: "Test123"})
      .then((res) => {
        const body = res.body;
        expect(body.name).equals('Name field is required');
        done();
      });
  });

  // Nanako - having more than 30 characters in name when registering
  it('Fail, invalid name (too long) at register', (done) => {
    request(app).post('/api/users/register')
      .send({ name: "foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo", username: "foofoo", email: "foobarbarbar@gmail.com", password: "123456", password2: "123456"})
      .then((res) => {
        const body = res.body;
        expect(body.name).equals('Name must be between 2 and 30 characters');
        done();
      });
  });

  // Christy - password must contain a capital letter when registering
  it('Fail, password must contain capital letter', (done) => {
    request(app).post('/api/users/register')
      .send({ name: "Christy", username: "foofoo", email: "foobarbarbar@gmail.com", password: "test123", password2: "test123"})
      .then((res) => {
        const body = res.body;
        expect(body.password).equals('Password must contain a capital letter');
        done();
      });
  });

  // Christy  - password must contain at least one number when registering
  it('Fail, password must contain at least one number', (done) => {
    request(app).post('/api/users/register')
      .send({ name: "Christy", username: "foofoo", email: "foobarbarbar@gmail.com", password: "Testtest", password2: "Testtest"})
      .then((res) => {
        const body = res.body;
        expect(body.password).equals('Password must contain a number');
        done();
      });
  });

  // Christy  - username must be alphanumeric when registering
  it('Fail, username must be alphanumeric', (done) => {
    request(app).post('/api/users/register')
      .send({ name: "Christy", username: "christy%$", email: "foobarbarbar@gmail.com", password: "Test123", password2: "Test123"})
      .then((res) => {
        const body = res.body;
        expect(body.username).equals('Username must be alphanumeric');
        done();
      });
  });

  //Christy - password and username cannot be the same
  it('Fail, password and username cannot match', (done) => {
    request(app).post('/api/users/register')
      .send({ name: "Christy", username: "Test123", email: "foobarbarbar@gmail.com", password: "Test123", password2: "Test123"})
      .then((res) => {
        const body = res.body;
        expect(body.password).equals('Password field cannot equal username');
        done();
      });
  });




});
