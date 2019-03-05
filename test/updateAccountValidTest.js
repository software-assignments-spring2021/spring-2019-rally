// Written by Nanako Chung
// Team: Rally
// Test: update account with valid new fields (should return successfully)
process.env.NODE_ENV = 'test';

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

  it('Trying to post account info to Mongo', (done) => {
    request(app).post('/register')
      .send({ name: 'MrGuy', email: "MrGuy@gmail.com", password: "1234567" })
      .then((res) => {
        const body = res.body;
        console.log("THIS IS BODY: ",body);
        expect(body).to.contain.property('name');
        expect(body).to.contain.property('email');
        expect(body).to.contain.property('password');
        done();
      })
      .catch((err) => done(err));
  });
});

describe('GET /register', () => {
  it('should receive a status code of 200 with login', function(done) {
    request(app).get('/register')
        .auth('MrGuy', '1234567')
        .expect(200, done);
  });
});