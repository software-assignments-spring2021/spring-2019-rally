process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../../server.js');
const conn = require('../../../db/index.js');
require("supertest").agent(app.listen());


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

  //Ryan - username must not contain a space
  it('Fail, username must not contain a space', (done) => {
    request(app).post('/api/users/register')
      .send({ name: "Ryan", username: "Test1 23", email: "foobarbarbar@gmail.com", password: "Test123", password2: "Test123"})
      .then((res) => {
        const body = res.body;
        expect(body.username).equals('Username must not contain spaces');
        done();
      });
  });

  //Ryan - password field is required
  it('Fail, password field is required', (done) => {
    request(app).post('/api/users/register')
      .send({ name: "Ryan", username: "Test123", email: "foobarbarbar@gmail.com", password: "", password2: ""})
      .then((res) => {
        const body = res.body;
        expect(body.password).equals('Password field is required');
        done();
      });
  });

  //Ryan -  username must be between 6 and 30
  it('Fail, username must be between 6 and 30', (done) => {
    request(app).post('/api/users/register')
      .send({ name: "Ryan", username: "Test", email: "foobarbarbar@gmail.com", password: "Test123", password2: "Test123"})
      .then((res) => {
        const body = res.body;
        expect(body.username).equals('Username must contain between 6 and 30 characters');
        done();
      });
  });

  // Erik - a rally will be created and then checked to see if each of the fields is saved correctly
  // it('OK, logging in and creating a rally', (done) => {
  //   request(app).post('/api/users/login')
  //   .send({ email: "erik.law@nyu.edu", password: "Test123" })
  //   .then((res) => {
  //     request(app).post('/api/rally/create')
  //     .set('Authorization', res.body.token)
  //       .send({ name: 'Weekend Rally', owners: "5ca6ce10542f1f246054a708" })
  //         .then((res) => {
  //           const body = res.body;
  //             expect(body.name).equals('Weekend Rally');
  //             expect(body.owners).to.eql(["5ca6ce10542f1f246054a708"]);
  //             expect(body.members).to.eql([]);
  //             done();
  //           })
  //     .catch((err) => done(err));     
  //   });
  // });

  // // Ryan - a rally will be created and error expected because wrong user id
    // it('Fail, trying to create a rally without being logged in', (done) => {
  //   request(app).post('/api/users/login')
  //   .send({ email: "baroo@gmail.com", password: "Test123" })
  //   .then((res) => {
  //     request(app).post('/api/rally/create')
  //     .set('Authorization', res.body.token)
  //   //  console.log(res.body.token)

  //         .send({ name: 'Weekend Rally', owners: ['barbarbar'] })
  //             .then((res) => {
  //               const body = res.body;
  //               expect(body.nologin).equals('Please log in.');
  //               done();
  //             });
  //           })
  //     .catch((err) => done(err));     
  // });

   // Ryan - a rally will be created and expect rally object
   it('Ok, creating a new rally works', (done) => {
    request(app).post('/api/users/login')
    .send({ email: "baroo@gmail.com", password: "Test123" })
    .then((res) => {
      request(app).get('/api/users/current')
     // console.log(res.body.token)
      .set('Authorization', res.body.token)
      .then((res2) => {
        request(app).post('/api/rally/create')
        .set('Authorization', res.body.token)

       // console.log(res2.body.id)
        .send({ owners: res2.body.id, name: 'Test' })
            .then((res3) => {
             const body = res3.body;
            // console.log(body)
             expect(body).to.contain.property('owners');
             expect(body).to.contain.property('members');
             expect(body).to.contain.property('_id');
             expect(body).to.contain.property('name');
             expect(body).to.contain.property('__v');
             done();
          });
        })
      })
      .catch((err) => done(err));     
  });



   // Ryan - a rally will be created and expect rally object, then update the rally by adding an owner
   it('Ok, updating a new rally by adding an owner works', (done) => {
    request(app).post('/api/users/login')
    .send({ email: "baroo@gmail.com", password: "Test123" })
    .then((res) => {
      request(app).get('/api/users/current')
      .set('Authorization', res.body.token)
      .then((res2) => {
        request(app).post('/api/rally/create')
        .set('Authorization', res.body.token)
        .send({ owners: res2.body.id, name: 'Test', duration: "10" })
             .then((res3) => {
              request(app).get('/api/rally/get')
              .set('Authorization', res.body.token)
              .send(res2.body.id)
              .then((res4) => {
                request(app).post('/api/rally/update')
                .set('Authorization', res.body.token)
                .send({ name: 'Test', user: res2.body.id, _id: res4.body._id, members: 'wefoin2349', owners: 'wep4fo34tp34tm3' })
                    .then((res5) => {
                     const body = res5.body;
                     console.log("WHJA", res4.body)
                     done();
          });
        })
      })
          
        })
      })
      .catch((err) => done(err));     
  });

});
