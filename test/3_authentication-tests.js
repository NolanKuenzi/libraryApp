const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

  describe('Authentication tests', function() {
    it('POST /api/authenticate - Authentication sends 200 response', function() {
      return chai.request(server)
     .post('/api/authenticate')
     .send({
       email: 'testUser@yahoo.com',
       password: 'password1'
      })
      .then(function(res) {
        assert.equal(res.status, 200);
      })
    })
    it('POST /api/authenticate - Authentication with un-registered email fails', function() {
        return chai.request(server)
       .post('/api/authenticate')
       .send({
         email: 'notRegistered@yahoo.com',
         password: 'password1'
        })
        .catch(function(res) {
          assert.equal(res.status, 400);
          assert.equal(res.response.error.text, '"Incorrect email or password"');
        })
      })
      it('POST /api/authenticate - Authentication with an incorrect password fails', function() {
        return chai.request(server)
       .post('/api/authenticate')
       .send({
          email: 'testUser@yahoo.com',
          password: 'wrongPass'
        })
        .catch(function(res) {
          assert.equal(res.status, 400);
          assert.equal(res.response.error.text, '"Incorrect password"')
        })
      })
  });