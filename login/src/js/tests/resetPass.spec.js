import React from 'react';
import { render, cleanup } from '@testing-library/react';
import ResetPage from '../components/container/resetPage';

afterEach(cleanup);

describe('<ResetPage /> component', () => {
  it('Displays default data', () => {
    const { container } = render(<ResetPage />);
    const resetDiv = container.querySelector('[id="resetDiv"]');
    expect(resetDiv.textContent).toContain('Reset Password');
  });
});
