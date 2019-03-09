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

  // Hassan - a dummy user will be registered for this unit test, and a login attempt will be made, expecting an object with "success" property with a "true" boolean.
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

  // Nanako - a dummy user will be registered for this unit test, and a login attempt will be made without email, expecting an object with "success" property with a "false" boolean.
  it('Fail, logging in without email', (done) => {
    request(app).post('/api/users/login')
      .send({ name: 'barbarbar', email: "baroo@gmail.com"})
      .then((res) => {
        request(app).post('/api/users/login')
          .send({ email: "", password: "123456" })
          .then((res) => {
            const body = res.body;
            expect(body.email).equals('Email field is required');
            done();
        })
      })
      .catch((err) => done(err));
  });

  // Erik - a dummy user will be registered for this unit test, and a login attempt will be made, expecting an object with no "success" property and an error concerning the password requirement.
  it('Fail, trying to login into user "barbarbar" without password field', (done) => {
    request(app).post('/api/users/register')
      .send({ name: 'barbarbar', email: "baroo@gmail.com", password: "123456", password2: '123456' })
      .then((res) => {
        request(app).post('/api/users/login')
          .send({ email: "baroo@gmail.com", password: "" })
          .then((res) => {
          const body = res.body;
          expect(body.success).equals(undefined);
          expect(body.password).equals('Password field is required');
          done();
        })
      })
      .catch((err) => done(err));
  });

  // Erik - a dummy user will be registered for this unit test, and a login attempt will be made, expecting an object with no "success" property and an error of the user not being found.
  it('Fail, trying to login into user "barbarbar" with an invalid email', (done) => {
    request(app).post('/api/users/register')
      .send({ name: 'barbarbar', email: "baroo@gmail.com", password: "123456", password2: '123456' })
      .then((res) => {
        request(app).post('/api/users/login')
          .send({ email: "bar@gmail.com", password: "123456" })
          .then((res) => {
          const body = res.body;
          expect(body.success).equals(undefined);
          expect(body.email).equals('User not found');
          done();
        })
      })
      .catch((err) => done(err));
  });
});