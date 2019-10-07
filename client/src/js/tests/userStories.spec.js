import React from 'react';
import { render, cleanup } from '@testing-library/react';
import UserStories from '../components/presentational/userStories';

afterEach(cleanup);

describe('<UserStories Component />', () => {
  test('It displays the default text', () => {
    const { container } = render(<UserStories />);
    const userStoriesDiv = container.querySelector('[id="userStoriesDiv"]');
    expect(userStoriesDiv.textContent).toContain(
      `I can post a title to /api/books to add a book and returned will be the object with the title and a unique _id.`
    );
    expect(userStoriesDiv.textContent).toContain(
      `I can post a comment to /api/books/_id to add a comment to a book and returned will be the books object similar to get /api/books/_id.`
    );
    expect(userStoriesDiv.textContent).toContain(
      `I can send a delete request to /api/books to delete all books in the database. Returned will be 'complete delete successful' if successful.`
    );
  });
  test('It displays table data', () => {
    const { container } = render(<UserStories />);
    const tableDiv = container.querySelector('[id="tableDiv"]');
    expect(tableDiv.textContent).toContain('POST');
    expect(tableDiv.textContent).toContain('/api/books');
    expect(tableDiv.textContent).toContain('add comment to 1234');
  });
});
