const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
require('jsdom-global')();

chai.use(chaiHttp);

  describe('Reset tests', function() {
    it('POST /api/setReset - Reset sends 200 response', async function() {
      return chai.request(server)
      .post('/api/setReset')
      .send({
        email: 'testUser@yahoo.com'
      })
      .then(function(res) {
        assert.equal(res.status, 200);
        document.cookie = `token=${res.body}`;
      })
    })
    it('POST /api/setReset - Empty email field fails', function() {
      return chai.request(server)
      .post('/api/setReset')
      .send({
        email: ''
      })
      .catch(function(res) {
        assert.equal(res.status, 400);
        assert.equal(res.response.error.text, '"Please fill out E-mail field"');
      })
    })
    it('POST /api/setReset - Unregistered email fails', function() {
      return chai.request(server)
      .post('/api/setReset')
      .send({
        email: 'wrongEmail@gmail.com'
      })
      .catch(function(res) {
        assert.equal(res.status, 404);
        assert.equal(res.response.error.text, '"User not found"');
      })
    })
    // updatePassword route 
   it('PUT /api/updatePassword - Setting new password returns 200 response', function() {
      return chai.request(server)
      .put('/api/updatePassword')
      .set('Cookie', document.cookie)
      .send({
        email: 'testUser@yahoo.com',
        password: 'password2'
      })
      .then(function(res) {
        assert.equal(res.status, 200);
      })
    })
    it('PUT /api/updatePassword - Empty password field fails', function() {
      return chai.request(server)
      .put('/api/updatePassword')
      .send({
        email: 'testUser@yahoo.com',
        password: ''
      })
      .catch(function(res) {
        assert.equal(res.status, 400);
        assert.equal(res.response.error.text, '"Please fill out Password field"');
      })
    })
    it('PUT /api/updatePassword - Unregistered email fails', function() {
      return chai.request(server)
      .put('/api/updatePassword')
      .send({
        email: 'notAUser@gmail.com',
        password: 'password2'
      })
      .catch(function(res) {
        assert.equal(res.status, 500);
      })
    })
    // Authentication w/ new password
   it('POST /api/authenticate - Authentication with new passoword sends 200 response', function() {
      return chai.request(server)
      .post('/api/authenticate')
      .send({
        email: 'testUser@yahoo.com',
        password: 'password2'
      })
      .then(function(res) {
        assert.equal(res.status, 200);
        document.cookie = `token=${res.body}`;
      })
    })
    it('POST /api/authenticate - Authentication with old password fails', function() {
      return chai.request(server)
      .post('/api/authenticate')
      .send({
        email: 'testUser@yahoo.com',
        password: 'password1'
      })
      .catch(function(res) {
        assert.equal(res.status, 400);
        assert.equal(res.response.error.text, '"Incorrect password"');
      })
    })
  });