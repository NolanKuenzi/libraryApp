import React from 'react';
import Footer from './footer';

const UserStories = () => (
  <div id="userStoriesDiv">
    <h4>User Stories:</h4>
    <ol>
      <li>Nothing from my website will be cached in my client as a security measure.</li>
      <li>
        I will see that the site is powered by 'PHP 4.2.0' even though it isn't as a security
        measure.
      </li>
      <li>
        I can post a title to /api/books to add a book and returned will be the object with the
        title and a unique _id.
      </li>
      <li>
        I can get /api/books to retrieve an array of all books containing title, _id, {'&'} comment
        count.
      </li>
      <li>
        I can get /api/books/{'_id'} to retrieve a single object of a book containing title, _id,{' '}
        {'&'} an array of comments (empty array if no comments present).
      </li>
      <li>
        I can post a comment to /api/books/{'_id'} to add a comment to a book and returned will be
        the books object similar to get /api/books/{'_id'}.
      </li>
      <li>
        I can delete /api/books/{'_id'} to delete a book from the collection. Returned will be
        'delete successful' if successful.
      </li>
      <li>If I try to request a book that doesn't exist I will get a 'no book exists' message.</li>
      <li>
        I can send a delete request to /api/books to delete all books in the database. Returned will
        be 'complete delete successful' if successful.
      </li>
      <li>All 6 functional tests requiered are complete and passing.</li>
    </ol>
    <div id="tableDiv">
      <table>
        <tbody>
          <tr>
            <td className="tbleStyles">
              <b>API</b>
            </td>
            <td className="tbleStyles">
              <b>GET</b>
            </td>
            <td className="tbleStyles">
              <b>POST</b>
            </td>
            <td className="tbleStyles">
              <b>DELETE</b>
            </td>
          </tr>
          <tr>
            <td className="tbleStyles">
              <b>/api/books</b>
            </td>
            <td>list all books</td>
            <td>add new book</td>
            <td>delete all books</td>
          </tr>
          <tr>
            <td className="tbleStyles">
              <b>/api/books/1234</b>
            </td>
            <td>show books 1234</td>
            <td>add comment to 1234</td>
            <td>delete 1234</td>
          </tr>
        </tbody>
      </table>
    </div>
    <Footer />
  </div>
);

export default UserStories;
