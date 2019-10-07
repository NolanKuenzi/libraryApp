const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

  describe('Login tests', function() {
    it('POST /api/login - Returns a 200 status', function() {
      return chai.request(server)
      .post('/api/login')
      .send({
        email: 'testUser@yahoo.com',
        password: 'password1'
      })
      .then(function(res) {
        assert.equal(res.status, 200);
      })
    })
    it('POST /api/login - Empty field returns an error', function() {
      return chai.request(server)
      .post('/api/login')
      .send({
        email: 'testUser@yahoo.com',
        password: '',
      })
      .catch(function(res) {
        assert.equal(res.status, 400);
        assert.equal(res.response.error.text, '"Please fill out Password field"');
      })
    })
  });