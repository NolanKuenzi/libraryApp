import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import Login from '../components/container/login';

afterEach(cleanup);

describe('<Login /> component', () => {
  test('Initially renders default content & <UserLogin /> component', () => {
    const { container } = render(<Login />);
    const loginDiv = container.querySelector('[id="loginDiv"]');
    const forgotPasswordDiv = container.querySelector('[id="forgotPasswordDiv"]');
    expect(loginDiv.textContent).toContain('Sign In');
    expect(loginDiv.textContent).toContain('Sign Up');
    expect(forgotPasswordDiv.textContent).toContain('Forgot Password');
    /* <UserLogn /> component content */
    expect(loginDiv.textContent).toContain('Login');
    expect(loginDiv.textContent).toContain('Sign In');
  });
  test('Renders <UserLogin /> & <Register /> <ForgotPass /> components', () => {
    const { container, getByText, getByTestId } = render(<Login />);
    const loginDiv = container.querySelector('[id="loginDiv"]');
    const signIn = getByTestId('testSignIn');
    const signUp = getByText('Sign Up');
    const forgotPassword = getByText('Forgot Password');
    fireEvent.click(signUp, {
      target: { innerText: 'Sign Up ▼' },
    });
    expect(loginDiv.textContent).toContain('Register');
    fireEvent.click(signIn, {
      target: { innerText: 'Sign In ▼' },
    });
    expect(loginDiv.textContent).toContain('Login');
    expect(loginDiv.textContent).toContain('Sign In');
    fireEvent.click(forgotPassword);
    expect(loginDiv.textContent).toContain('Reset');
    expect(loginDiv.textContent).toContain('Reset Password');
  });
  test('It can display none of the three components', () => {
    const { container, getByText, getByTestId } = render(<Login />);
    const loginDiv = container.querySelector('[id="loginDiv"]');
    const signIn = getByTestId('testSignIn');
    const signUp = getByText('Sign Up');
    fireEvent.click(signUp, {
      target: { innerText: 'Sign Up ▼' },
    });
    expect(loginDiv.textContent).toContain('Register');
    fireEvent.click(signUp, {
      target: { innerText: 'Sign Up ▲' },
    });
    expect(loginDiv.textContent).not.toContain('Login');
    expect(loginDiv.textContent).not.toContain('Register');
    expect(loginDiv.textContent).not.toContain('Reset');
    expect(loginDiv.textContent).not.toContain('Reset Password');
    fireEvent.click(signIn, {
      target: { innerText: 'Sign In ▼' },
    });
    expect(loginDiv.textContent).toContain('Login');
    fireEvent.click(signIn, {
      target: { innerText: 'Sign In ▲' },
    });
    expect(loginDiv.textContent).not.toContain('Login');
    expect(loginDiv.textContent).not.toContain('Register');
    expect(loginDiv.textContent).not.toContain('Reset');
    expect(loginDiv.textContent).not.toContain('Reset Password');
  });
});
