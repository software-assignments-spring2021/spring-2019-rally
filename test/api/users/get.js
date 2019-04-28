process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../server.js');
const conn = require('../../../db/index.js');
require("supertest").agent(app.listen());


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
      .send({ name: 'barbarbar', username: "foofoo", email: "baroo@gmail.com", password: "Test123", password2: "Test123" })
      .then((res) => {
        request(app).post('/api/users/login')
          .send({ email: "baroo@gmail.com", password: "Test123", username: "foofoo" })
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
      .send({ name: 'barbarbar', email: "baroo@gmail.com", username: "foofoo",})
      .then((res) => {
        request(app).post('/api/users/login')
          .send({ email: "", password: "Test123", username: "foofoo" })
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
      .send({ name: 'barbarbar', username: "foofoo", email: "baroo@gmail.com", password: "Test123", password2: "Test123" })
      .then((res) => {
        request(app).post('/api/users/login')
          .send({ email: "baroo@gmail.com", password: "", username: "foofoo" })
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
      .send({ name: 'barbarbar', username: "foofoo", email: "baroo@gmail.com", password: "Test123", password2: "Test123" })
      .then((res) => {
        request(app).post('/api/users/login')
          .send({ email: "bar@gmail.com", password: "Test123", username: "foofoo" })
          .then((res) => {
          const body = res.body;
          expect(body.success).equals(undefined);
          expect(body.email).equals('User not found');
          done();
        })
      })
      .catch((err) => done(err));
  });

  //Ryan - a dummy user will be registered, a login attempt will be made, and a request to find a user through JWT is sent and expects a user object
  it('OK, getting user "barbarbar" which will be registered for this unit test', (done) => {
    request(app).post('/api/users/register')
      .send({ name: 'barbarbar', username: "foofoo", email: "baroo@gmail.com", password: "Test123", password2: "Test123" })
      .then((res) => {
        request(app).post('/api/users/login')
          .send({ email: "baroo@gmail.com", password: "Test123" })
          .then((res) => {
            request(app).get('/api/users/current')
            .set('Authorization', res.body.token)
            .then((res) => {
              const body = res.body;
              expect(body).to.contain.property('id');
              expect(body).to.contain.property('email');
              expect(body).to.contain.property('name');
              done();
            });
        })
      })
      .catch((err) => done(err));
  });

  // //Ryan - a dummy user will be registered, a login attempt will be made, and a request to find the rallies of the user is attempted and error is returned
  it('Fail, getting rallies of user "barbarbar" without any rallies created', (done) => {
    request(app).post('/api/users/register')
      .send({ name: 'barbarbar', username: "foofoo", email: "baroo@gmail.com", password: "Test123", password2: "Test123" })
      .then((res) => {
        request(app).post('/api/users/login')
          .send({ email: "baroo@gmail.com", password: "Test123" })
          .then((res) => {
            request(app).get('/api/users/current')
            .set('Authorization', res.body.token)
            .then((res) => {
              request(app).get('/api/rally/get')
              .send({owners: res.body.id})
               .then((res) => {
                  const body = res.body;
                  expect(body.norally).equals(undefined);
                  done();
               });
          })
        })
      })
      .catch((err) => done(err));
  });



});
