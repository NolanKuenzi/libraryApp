const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

  describe('Register tests', function() {
    it('POST /api/register - A user can be registered', function() {
      this.timeout(10000);
      return chai.request(server)
      .post('/api/register')
      .send({
        email: 'testUser@yahoo.com',
        password: 'password1'
      })
      .then(function(res) {
        assert.equal(res.status, 200);
      })
    })
    it('POST /api/register - Empty field returns an error', function() {
      return chai.request(server)
      .post('/api/register')
      .send({
        email: '',
        password: 'password1'
      })
      .catch(function (res) {
        assert.equal(res.status, 400);
        assert.equal(res.response.error.text, '"Please fill out E-mail field"');
      })
    })
    it('POST /api/register - Exceeding maximum number of allowed characters returns an error', function() {
      return chai.request(server)
      .post('/api/register')
      .send({
        email: 'rrrrrreeeeaallllllllyyyyllllllllloooooonnnnnnnggggggggeeeeeeeeemmmmmaaaaaaaaaiiiiiiillllllll@@@@gggggmmmmaaaiiiiillllll......ccccccooooommmmmm',
        password: 'password1'
      })
      .catch(function (res) {
        assert.equal(res.status, 400);
        assert.equal(res.response.error.text, '"Email length of 140 characters has been exceeded"');
      })
    })
    it('POST /api/register - Duplicate email addresses cannot be used', function() {
      return chai.request(server)
      .post('/api/register')
      .send({
        email: 'testUser@yahoo.com',
        password: 'dk40fj'
      })
      .catch(function(res) {
        assert.equal(res.status, 400);
        assert.equal(res.response.error.text, '"Email is already taken"');
      })
    })
  });

