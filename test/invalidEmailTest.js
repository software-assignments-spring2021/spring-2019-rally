// Written by Christy Welch
// Team: 	Rally
// Test: 	check whether the system returns the proper response when
// 			a valid vs invalid email is entered.

process.env.NODE_ENV = 'test';

var assert = require('assert');

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../server.js');
const conn = require('../index.js');

describe('POST /register', () => {
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

  it('OK, registering a new user works!', (done) => {
    request(app).post('/register')
      .send({ 
        name: 'MrGuy', 
        email: "MrGuy@gmail.com", 
        password: "1234567" 
      })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('name');
        expect(body).to.contain.property('email');
        expect(body).to.contain.property('password');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, invalid email', (done) => {
    request(app).post('/register')
      .send({ email: 'not an email' })
      .then((res) => {
        const body = res.body;
        expect(body.errors.text.email)
          .to.equal('ValidatorError')
        done();
      })
      .catch((err) => done(err));
  });
})