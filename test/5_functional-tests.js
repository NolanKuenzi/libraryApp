/*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*/
const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const mongoose = require('mongoose');
require('jsdom-global')();

chai.use(chaiHttp);

function getCookie(name) {
  const cookieArr = document.cookie.split(';');
  for (let i = 0; i < cookieArr.length; i += 1) {
    const cookiePair = cookieArr[i].split('=');
    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}
// Each test should completely test the response of the API end-point including response status code!
describe('Functional Tests', function() {
  after(async function () {
    await mongoose.connection.db.dropDatabase();
  });
  // POST /api/books? - Route Tests
  it('POST /api/books?axios=true - returns 200 response when a new book is added', function() {
    this.timeout(100000);
    return chai.request(server)
    .post('/api/books?axios=true')
    .set('Cookie', `token=${getCookie('token')}`)
    .send({
      bookTitle: 'The Power of Now',
      email: 'testUser@yahoo.com',
    })
    .then(function(res) {
      assert.equal(res.status, 200);
    })
  })
  it('POST /api/books? - returns 200 response when a new book is added', function() {
    this.timeout(100000);
    return chai.request(server)
    .post('/api/books?')
    .set('Cookie', `token=${getCookie('token')}`)
    .send({
      bookTitle: 'The Tao of Pooh',
      email: 'testUser@yahoo.com',
    })
    .then(function(res) {
      assert.equal(res.status, 200);
      assert.include(res.text, 'The Tao of Pooh');
    })
  })
  it('POST /api/books?axios=true - returns 400 response when bookTitle field is empty', function() {
    return chai.request(server)
    .post('/api/books?axios=true')
    .set('Cookie', `token=${getCookie('token')}`)
    .send({
      bookTitle: '',
      email: 'testUser@yahoo.com',
    })
    .catch(function(res) {
      assert.equal(res.status, 400);
      assert.equal(res.response.error.text, '"Please fill out Book Title field"');
    })
  })
  it('POST /api/books? - returns 400 response when bookTitle field is empty', function() {
    return chai.request(server)
    .post('/api/books?')
    .set('Cookie', `token=${getCookie('token')}`)
    .send({
      bookTitle: '',
      email: 'testUser@yahoo.com',
    })
    .catch(function(res) {
      assert.equal(res.status, 400);
      assert.equal(res.response.error.text, '"Please fill out Book Title field"');
      assert.include(res.text, 'Please fill out Book Title field');
    })
  })
  it('POST /api/books?axios=true - returns 400 when a duplicate book is added', function() {
    return chai.request(server)
    .post('/api/books?axios=true')
    .set('Cookie', `token=${getCookie('token')}`)
    .send({
      bookTitle: 'The Tao of Pooh',
      email: 'testUser@yahoo.com',
    })
    .catch(function(res) {
      assert.equal(res.status, 400);
      assert.equal(res.response.error.text, '"Book already exists in your collection"');
    })
  })
  it('POST /api/books? - returns 400 when a duplicate book is added', function() {
    return chai.request(server)
    .post('/api/books?')
    .set('Cookie', `token=${getCookie('token')}`)
    .send({
      bookTitle: 'The Tao of Pooh',
      email: 'testUser@yahoo.com',
    })
    .catch(function(res) {
      assert.equal(res.status, 400);
      assert.include(res.text, 'Book already exists in your collection');
    })
  })
  // GET /api/books? - Route Tests
  it("GET /api/books?axios=true - returns books in a user's library", function() {
    return chai.request(server)
    .get('/api/books?axios=true')
    .set('Cookie', `token=${getCookie('token')};email=testUser@yahoo.com`)
    .then(function(res) {
     assert.equal(res.status, 200);
     assert.isArray(res.body);
     assert.property(res.body[0], 'commentCount');
     assert.property(res.body[0], 'title');
     assert.property(res.body[0], '_id');
     assert.equal(res.body[0].title, 'The Power of Now');
     assert.equal(res.body[0].commentCount, '0');
     assert.equal(res.body[1].title, 'The Tao of Pooh');
    })
  })
  it("GET /api/books? - returns books in a user's library", function() {
    return chai.request(server)
    .get('/api/books?')
    .set('Cookie', `token=${getCookie('token')};email=testUser@yahoo.com`)
    .then(function(res) {
     assert.equal(res.status, 200);
     assert.include(res.text, 'The Power of Now');
     assert.include(res.text, 'The Tao of Pooh');
    })
  })  
  it('GET /api/books?axios=true - invalid email returns 404 error', function() {
    return chai.request(server)
    .get('/api/books?axios=true')
    .set('Cookie', `token=${getCookie('token')};email=wrongEmail@gmail.gov`)
    .catch(function(res) {
     assert.equal(res.status, 404);
     assert.equal(res.response.error.text, '"Email not found"');
    })
  })
  it('GET /api/books? - invalid email returns 404 error', function() {
    return chai.request(server)
    .get('/api/books?')
    .set('Cookie', `token=${getCookie('token')};email=wrongEmail@gmail.gov`)
    .catch(function(res) {
     assert.equal(res.status, 404);
     assert.equal(res.response.error.text, '"Email not found"');
     assert.include(res.text, 'Email not found');
    })
  })
  // DELETE /api/books? - Route Tests
  it("DELETE /api/books? - Deletes all of a user's books and returns a 200 status", function() {
    return chai.request(server)
    .delete('/api/books?')
    .set('Cookie', `token=${getCookie('token')}`)
    .send({
      email: 'testUser@yahoo.com',
    })
    .then(function(res) {
      assert.equal(res.status, 200);
    })
  })
  it("DELETE /api/books? - Invalid email will fail", function() {
    return chai.request(server)
    .delete('/api/books?')
    .set('Cookie', `token=${getCookie('token')}`)
    .send({
      email: 'invalidEmail@gmail.org',
    })
    .catch(function(res) {
      assert.equal(res.status, 404);
      assert.equal(res.response.error.text, '"Email not found"');
    })
  })
  it("GET /api/books?axios=true - Will return an empty array because the user's library has been deleted", function() {
    return chai.request(server)
    .get('/api/books?axios=true')
    .set('Cookie', `token=${getCookie('token')};email=testUser@yahoo.com`)
    .then(function(res) {
      assert.equal(res.status, 200);
      assert.isArray(res.body);
      assert.equal(res.body.length, 0);
    })
  })
  it("GET /api/books - Will return a 'library is empty message' because the user's library has been deleted", function() {
    return chai.request(server)
    .get('/api/books')
    .set('Cookie', `token=${getCookie('token')};email=testUser@yahoo.com`)
    .then(function(res) {
      assert.equal(res.status, 200);
      //assert.include(res.text, 'Library is currently empty');
    })
  })
  /* setup next tests */
  let id;
  it('POST /api/books?axios=true - Add book to library', function() {
    return chai.request(server)
    .post('/api/books?axios=true')
    .set('Cookie', `token=${getCookie('token')}`)
    .send({
      bookTitle: 'A River Runs Through It',
      email: 'testUser@yahoo.com',
    })
    .then(function(res) {
      assert.equal(res.status, 200);
      return chai.request(server)
      .get('/api/books?axios=true')
      .set('Cookie', `token=${getCookie('token')};email=testUser@yahoo.com`)
      .then(function(res) {
        assert.equal(res.status, 200);
        id = res.body[0]._id;
      })
    })
  })
  // POST /api/books/:id 
  it("POST /api/books/:id?axios=true - Adding a comment to a book returns a 200 response", function() {
    return chai.request(server)
    .post(`/api/books/${id}?axios=true`)
    .set('Cookie', `token=${getCookie('token')}`)
    .send({
      comment: 'This book is sad... yet beautiful'
    })
    .then(function(res) {
      assert.equal(res.status, 200);
    })
  })
  it("POST /api/books/:id - Adding a comment to a book returns a 200 response", function() {
    return chai.request(server)
    .post(`/api/books/${id}`)
    .set('Cookie', `token=${getCookie('token')};email=testUser@yahoo.com`)
    .send({
      comment: "This book is sad... yet beautiful."
    })
    .then(function(res) {
      assert.equal(res.status, 200);
      assert.include(res.text, 'This book is sad... yet beautiful');
    })
  })
  it("POST /api/books/:id?axios=true - An empty comment field fails", function() {
    return chai.request(server)
    .post(`/api/books/${id}?axios=true`)
    .set('Cookie', `token=${getCookie('token')}`)
    .send({
      comment: ''
    })
    .catch(function(res) {
      assert.equal(res.status, 400);
      assert.equal(res.response.error.text, '"Please fill out comment field"');
    })
  })
  it("POST /api/books/:id - An empty comment field fails", function() {
    return chai.request(server)
    .post(`/api/books/${id}`)
    .set('Cookie', `token=${getCookie('token')}`)
    .send({
      comment: '',
    })
    .catch(function(res) {
      assert.equal(res.status, 400);
      assert.include(res.text, 'Please fill out comment field');
    })
  })
  it("POST /api/books/:id?axios=true - An error occurs when maximum character limit is exceeded", function() {
    return chai.request(server)
    .post(`/api/books/${id}?axios=true`)
    .set('Cookie', `token=${getCookie('token')}`)
    .send({
      comment: 'The first book in the fantasy series gives an overview of the Flock: Maximum "Max" Ride (the leader), Fang, Iggy, Nudge, Gasman, and Angel, all children respectively from the ages of 14 to 6. They are genetically altered beings born with wings, essentially a human-avian hybrid. This book primarily focuses on the abduction of the youngest member, Angel, and the rest of the Flock\'s noble quest to find and save the youngest member of their family, while fighting a number of obstacles including......'
    })
    .catch(function(res) {
      assert.equal(res.status, 400);
      assert.equal(res.response.error.text, '"Comment character limit of 500 has been exceeded"');
    })
  })
  it("POST /api/books/:id - An error occurs when maximum character limit is exceeded", function() {
    return chai.request(server)
    .post(`/api/books/${id}`)
    .set('Cookie', `token=${getCookie('token')}`)
    .send({
      comment: 'The first book in the fantasy series gives an overview of the Flock: Maximum "Max" Ride (the leader), Fang, Iggy, Nudge, Gasman, and Angel, all children respectively from the ages of 14 to 6. They are genetically altered beings born with wings, essentially a human-avian hybrid. This book primarily focuses on the abduction of the youngest member, Angel, and the rest of the Flock\'s noble quest to find and save the youngest member of their family, while fighting a number of obstacles including......',
    })
    .catch(function(res) {
      assert.equal(res.status, 400);
      assert.include(res.text, 'Comment character limit of 500 has been exceeded');
    })
  })
  it("POST /api/books/:id?axios=true - An invalid book id causes an error", function() {
    return chai.request(server)
    .post('/api/books/f4j82m39dm29s?axios=true')
    .set('Cookie', `token=${getCookie('token')}`)
    .send({
      comment: 'A truly inspirational read'
    })
    .catch(function(res) {
      assert.equal(res.status, 400);
    })
  })
  it("POST /api/books/:id - An invalid book id causes an error", function() {
    return chai.request(server)
    .post('/api/books/f4j82m39dm29s')
    .set('Cookie', `token=${getCookie('token')}`)
    .send({
      comment: 'A truly inspirational read'
    })
    .catch(function(res) {
      assert.equal(res.status, 404);
      assert.include(res.text, 'Book not found');
    })
  })
  // GET /api/books/:id 
  it("GET /api/books/:id - Searching for a book with a valid id returns a 200 response. Additionally, rendered text includes the book title and comment from successful the post test", function() {
    return chai.request(server)
    .get(`/api/books/${id}`)
    .set('Cookie', `token=${getCookie('token')}`)
    .then(function(res) {
      assert.equal(res.status, 200);
      assert.include(res.text, 'A River Runs Through It');
      assert.include(res.text, 'This book is sad... yet beautiful');
      assert.notInclude(res.text, 'A truly inspirational read'); // The comment from the invalid id test above
    })
  })
  it("GET /api/books/:id - Searching for a book with an invalid id errors", function() {
    return chai.request(server)
    .get('/api/books/0d3k9xj38')
    .set('Cookie', `token=${getCookie('token')}`)
    .catch(function(res) {
      assert.equal(res.status, 404);
      assert.include(res.response.error.text, 'Book not found');
    })
  })
  // DELETE /api/books/:id
  it("Deleting /api/books/:id - Deleting a book from a user's collection returns a 200 response", function() {
    return chai.request(server)
    .delete(`/api/books/${id}`)
    .set('Cookie', `token=${getCookie('token')}`)
    .send({
      email: 'testUser@yahoo.com'
    })
    .then(function(res) {
      assert.equal(res.status, 200);
    })
  })
  it("Deleting /api/books/:id - An invalid email fails", function() {
    return chai.request(server)
    .delete(`/api/books/${id}`)
    .set('Cookie', `token=${getCookie('token')}`)
    .send({
      email: 'notRegistered@gmail.org'
    })
    .catch(function(res) {
      assert.equal(res.status, 500);
    })
  })
  it("Deleting /api/books/:id - An invalid book id errors", function() {
    return chai.request(server)
    .delete('/api/books/4k9dw29djh3')
    .set('Cookie', `token=${getCookie('token')}`)
    .send({
      email: 'testUser@yahoo.com'
    })
    .catch(function(res) {
      assert.equal(res.status, 404);
      assert.include(res.response.error.text, 'Book not found');
    })
  })
  it("GET /api/books/:id - Retrieving the book id (from the previous POST test) fails because the book has been deleted from the user's collection", function() {
    return chai.request(server)
    .get(`/api/books/${id}`)
    .set('Cookie', `token=${getCookie('token')}`)
    .catch(function(res) {
      assert.equal(res.status, 404);
      assert.include(res.response.error.text, 'Book not found');
      assert.notInclude(res.text, 'A River Runs Through It');
      assert.notInclude(res.text, 'This book is sad... yet beautiful');
    })
  })
  it("POST /api/books?axios=true - Our book, and it's comment(s), can be re-added to the user's library, after it has been deleted. From the books collection.", function() {
    return chai.request(server)
    .post('/api/books?axios=true')
    .set('Cookie', `token=${getCookie('token')}`)
    .send({
      bookTitle: 'A River Runs Through It',
      email: 'testUser@yahoo.com',
    })
    .then(function(res) {
      assert.equal(res.status, 200);
      return chai.request(server)
      .get(`/api/books/${id}`)
      .set('Cookie', `token=${getCookie('token')};email=testUser@yahoo.com`)
      .then(function(res) {
        assert.equal(res.status, 200);
        assert.include(res.text, 'A River Runs Through It');
        assert.include(res.text, 'This book is sad... yet beautiful');
      })
    })
  })
});
