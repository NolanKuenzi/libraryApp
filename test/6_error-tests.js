const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
require('jsdom-global')();

chai.use(chaiHttp);

describe('Error route tests', function() {
  it('/api/error/? - returns a 500 response when called without any queries', function() {
    return chai.request(server)
    .get('/api/error/?')
    .then(function(res) {
      assert.include(res.text, '500');
      assert.include(res.text, 'Internal Server Error');
    })
  })
  it("/api/error/?status=404&errMessage=\"test error message\" - Displays a query's status & errMessage when they are specified" , function() {
    return chai.request(server)
    .get('/api/error/?status=404&errMessage="test error message"')
    .then(function(res) {
      assert.include(res.text, '404');
      assert.include(res.text, 'test error message');
    })
  })
})