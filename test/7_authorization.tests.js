const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
require('jsdom-global')();
chai.use(chaiHttp);
// tests for withAuth middleWare function
  it('POST /api/books?axios=true - request fails when no authorization token is provided.', function() {
    return chai.request(server)
    .post('/api/books?axios=true')
    //.set('Cookie', `token=${getCookie('token')}`)
    .send({
      bookTitle: 'The Power of Now',
      email: 'testUser@yahoo.com',
    })
    .catch(function(res) {
      assert.equal(res.status, 401);
      assert.equal(res.response.error.text, '"Unauthorized: Please Login to Continue"');
    })
  })
  it('POST /api/books? - request fails when no authorization token is provided.', function() {
    return chai.request(server)
    .post('/api/books?')
    //.set('Cookie', `token=${getCookie('token')}`)
    .send({
      bookTitle: 'The Power of Now',
      email: 'testUser@yahoo.com',
    })
    .catch(function(res) {
      assert.equal(res.status, 401);
      assert.include(res.text, 'Unauthorized: Please Login to Continue');
    })
  })
  it('POST /api/books?axios=true - request fails when an authorization token is invalid.', function() {
    return chai.request(server)
    .post('/api/books?axios=true')
    .set('Cookie', 'token=3k0k39dnd9mcedjnotTheRightToken39d8dm38dji9d')
    .send({
      bookTitle: 'The Power of Now',
      email: 'testUser@yahoo.com',
    })
    .catch(function(res) {
      assert.equal(res.status, 401);
      assert.equal(res.response.error.text, '"Unauthorized: Invalid Credentials, Please try again"');
    })
  })
  it('POST /api/books? - request fails when an authorization token is invalid.', function() {
    return chai.request(server)
    .post('/api/books?')
    .set('Cookie', 'token=3k0k39dnd9mcedjnotTheRightToken39d8dm38dji9d')
    .send({
      bookTitle: 'The Power of Now',
      email: 'testUser@yahoo.com',
    })
    .catch(function(res) {
      assert.equal(res.status, 401);
      assert.equal(res.text, 'Unauthorized: Invalid Credentials, Please try again');
    })
  })