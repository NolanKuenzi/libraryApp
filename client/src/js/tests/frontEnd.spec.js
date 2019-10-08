import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup, fireEvent, waitForDomChange, act } from '@testing-library/react';
import regeneratorRuntime, { async } from 'regenerator-runtime'; /* eslint-disable-line */
import axios from 'axios';
import axiosMock from 'axios';
import FrontEnd from '../components/container/frontEnd';

jest.mock('axios');
afterEach(cleanup);

describe('<FrontEnd /> component', () => {
  test('It displays default text', async () => {
    await act(async () => {
      const { container } = render(<FrontEnd />);
      const frontEndSection = container.querySelector('[id="frontEndSection"]');
      expect(frontEndSection.textContent).toContain(
        `Select a book to see it's details and comments`
      );
    });
  });
  test('Can render <UserStories /> component', async () => {
    await act(async () => {
      const { container } = render(<FrontEnd />);
      const userStoriesToggler = container.querySelector('[id="userStoriesToggler"]');
      await act(async () => {
        fireEvent.click(userStoriesToggler);
      });
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
      const tableDiv = container.querySelector('[id="tableDiv"]');
      expect(tableDiv.textContent).toContain('POST');
      expect(tableDiv.textContent).toContain('/api/books');
      expect(tableDiv.textContent).toContain('add comment to 1234');
    });
  });
  test('Can render the <ApiResponses /> component', async () => {
    await act(async () => {
      const { container } = render(<FrontEnd />);
      const apiResToggler = container.querySelector('[id="apiResToggler"]');
      await act(async () => {
        fireEvent.click(apiResToggler);
      });
      const apiResDiv = container.querySelector('[id="apiResDiv"]');
      expect(apiResDiv.textContent).toContain('Test post to /api/books');
      expect(apiResDiv.textContent).toContain('Book Title:');
      expect(apiResDiv.textContent).toContain('Test post to /api/books/{bookid}');
      expect(apiResDiv.textContent).toContain('BookId to comment on:');
    });
  });
  test('Loads initial table data on page load', async () => {
    await act(async () => {
      const { container } = render(<FrontEnd />);
      await waitForDomChange();
      const tableDiv = container.querySelector('[id="tableDiv"]');
      expect(tableDiv.textContent).toContain('Great Expectations');
      expect(tableDiv.textContent).toContain('Comments: 0');
      expect(tableDiv.textContent).toContain('War and Peace');
      expect(tableDiv.textContent).toContain('Comments: 1');
    });
  });
  test('A new book is displayed when it is added to the library', async () => {
    await act(async () => {
      const { container } = render(<FrontEnd />);
      await waitForDomChange();
      const tableDiv = container.querySelector('[id="tableDiv"]');
      expect(tableDiv.textContent).not.toContain('The Scarlet Letter');
      const submit_input = container.querySelector('[id="submit_input"]');
      const submit_button = container.querySelector('[id="submit_button"]');
      fireEvent.change(submit_input, { target: { value: 'The Scarlet Letter' } });
      fireEvent.click(submit_button);
      axiosMock.get.mockResolvedValue({
        data: [
          {
            commentCount: 0,
            comments: [],
            _id: '5d807d9j37900a0kd4bab0e9',
            title: 'Great Expectations',
          },
          {
            commentCount: 1,
            comments: ['Life Changing'],
            _id: '4i807d9jbl200a0kd40pl0e9',
            title: 'War and Peace',
          },
          {
            commentCount: 0,
            comments: [],
            _id: 'jm307d9jblkj3a0kd40pl8mq',
            title: 'The Scarlet Letter',
          },
        ],
      });
      await waitForDomChange();
      expect(tableDiv.textContent).toContain('Great Expectations');
      expect(tableDiv.textContent).toContain('War and Peace');
      expect(tableDiv.textContent).toContain('The Scarlet Letter');
    });
  });
  test('A book is not displayed when it is deleted from the library', async () => {
    await act(async () => {
      const { container, getByTestId } = render(<FrontEnd />);
      axiosMock.get.mockResolvedValue({
        data: [
          {
            commentCount: 0,
            comments: [],
            _id: '5d807d9j37900a0kd4bab0e9',
            title: 'Great Expectations',
          },
          {
            commentCount: 1,
            comments: ['Life Changing'],
            _id: '4i807d9jbl200a0kd40pl0e9',
            title: 'War and Peace',
          },
          {
            commentCount: 0,
            comments: [],
            _id: 'jm307d9jblkj3a0kd40pl8mq',
            title: 'The Scarlet Letter',
          },
        ],
      });
      await waitForDomChange();
      const tableDiv = container.querySelector('[id="tableDiv"]');
      expect(tableDiv.textContent).toContain('The Scarlet Letter');
      const id = getByTestId('btn-jm307d9jblkj3a0kd40pl8mq');
      fireEvent.click(id);
      axiosMock.get.mockResolvedValue({
        data: [
          {
            commentCount: 0,
            comments: [],
            _id: '5d807d9j37900a0kd4bab0e9',
            title: 'Great Expectations',
          },
          {
            commentCount: 1,
            comments: ['Life Changing'],
            _id: '4i807d9jbl200a0kd40pl0e9',
            title: 'War and Peace',
          },
        ],
      });
      await waitForDomChange();
      expect(tableDiv.textContent).toContain('Great Expectations');
      expect(tableDiv.textContent).toContain('War and Peace');
      expect(tableDiv.textContent).not.toContain('The Scarlet Letter');
    });
  }); /*
  test('No books are displayed when the "Delete All Books" btn is clicked"', async () => {
    await act(async () => {
      const { container } = render(<FrontEnd />);
      await waitForDomChange();
      const tableDiv = container.querySelector('[id="tableDiv"]');
      expect(tableDiv.textContent).toContain('Great Expectations');
      expect(tableDiv.textContent).toContain('War and Peace');
      const delAllBtn = container.querySelector('[id="delBksBtn"]');
      fireEvent.click(delAllBtn);
      await waitForDomChange();
      expect(tableDiv.textContent).toContain('Great Expectations');
      expect(tableDiv.textContent).toContain('War and Peace');
    });
  }); */
  test('Details of a particular book are displayed when it is clicked on & the cancel btn removes the book details', async () => {
    await act(async () => {
      const { container, getByText } = render(<FrontEnd />);
      await waitForDomChange();
      const tdBk = getByText('War and Peace');
      fireEvent.click(tdBk);
      const displayBkDiv = container.querySelector('[id="displayBkDiv"');
      expect(displayBkDiv.innerHTML).not.toBe('');
      expect(displayBkDiv.textContent).toContain('War and Peace');
      expect(displayBkDiv.textContent).toContain('Comments');
      expect(displayBkDiv.textContent).toContain('Life Changing');
      const cancelBtn = getByText('Cancel');
      fireEvent.click(cancelBtn);
      expect(displayBkDiv.textContent).not.toContain('War and Peace');
      expect(displayBkDiv.textContent).not.toContain('Comments');
      expect(displayBkDiv.innerHTML).toBe('');
    });
  });
  test('A comment can be added to a book', async () => {
    await act(async () => {
      const { container, getByText } = render(<FrontEnd />);
      await waitForDomChange();
      const tdBk = getByText('War and Peace');
      fireEvent.click(tdBk);
      const displayBkDiv = container.querySelector('[id="displayBkDiv"');
      expect(displayBkDiv.textContent).not.toContain('Overrated');
      const addCommnet = getByText('Add Comment');
      const commentBox = container.querySelector('[id="commentBox"]');
      fireEvent.change(commentBox, { target: { value: 'Overrated' } });
      fireEvent.click(addCommnet);
      axiosMock.get.mockResolvedValue({
        data: [
          {
            commentCount: 0,
            comments: [],
            _id: '5d807d9j37900a0kd4bab0e9',
            title: 'Great Expectations',
          },
          {
            commentCount: 1,
            comments: ['Life Changing', 'Overrated'],
            _id: '4i807d9jbl200a0kd40pl0e9',
            title: 'War and Peace',
          },
        ],
      });
      expect(displayBkDiv.textContent).toContain('Overrated');
    });
  });
});
