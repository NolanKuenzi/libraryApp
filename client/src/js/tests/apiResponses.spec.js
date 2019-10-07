import React from 'react';
import { render, cleanup } from '@testing-library/react';
import ApiResponses from '../components/container/apiResponses';

afterEach(cleanup);

describe('<ApiResponses Component />', () => {
  test('It displays default text', () => {
    const { container } = render(<ApiResponses />);
    const apiResDiv = container.querySelector('[id="apiResDiv"]');
    expect(apiResDiv.textContent).toContain('Test post to /api/books');
    expect(apiResDiv.textContent).toContain('Book Title:');
    expect(apiResDiv.textContent).toContain('Test post to /api/books/{bookid}');
    expect(apiResDiv.textContent).toContain('BookId to comment on:');
  });
});
