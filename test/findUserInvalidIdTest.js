//UNIT TEST WRITTEN BY RYAN CHO
//TEAM: RALLY

//Trying to find a user via invalid ID should return an error

process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../server.js');
const conn = require('../index.js');

describe('GET /current', () => {
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

  it('OK, getting user id works', (done) => {
    request(app).get('/current')
      .send({ _id: "asfasd", name: 'Ryan', email: "ryanmcho@gmail.com" })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('_id');
        expect(body).to.contain.property('name');
        expect(body).to.contain.property('email');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, invalid ID', (done) => {
    request(app).post('/current')
      .send({ name: 'Ryan' })
      .then((res) => {
        const body = res.body;
        expect(body.errors.text.name)
          .to.deep.equal('ValidatorError')
        done();
      })
      .catch((err) => done(err));
  });
})
