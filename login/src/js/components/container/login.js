import React, { useState, useEffect } from 'react';
import UserLogin from './userLogin';
import Register from './register';
import ForgotPass from './forgotPass';
import ResetPage from './resetPage';

const Login = () => {
  const [signIn, setSignIn] = useState(true);
  const [signUp, setSignUp] = useState(false);
  const [forgotPass, setForgotPass] = useState(false);
  const [resetPage, setResetPage] = useState(false);
  const resetPath = window.location.pathname.replace(/\//, '');
  const signFunc = event => {
    if (forgotPass === true) {
      setForgotPass(false);
    }
    if (event.target.innerText === 'Sign In ▼' || event.target.innerText === 'Sign In ▲') {
      if (resetPage === true) {
        setResetPage(false);
      }
      if (signUp === true) {
        setSignUp(false);
      }
      if (signIn === true) {
        setSignIn(false);
      } else {
        setSignIn(true);
      }
    }
    if (event.target.innerText === 'Sign Up ▼' || event.target.innerText === 'Sign Up ▲') {
      if (resetPage === true) {
        setResetPage(false);
      }
      if (signIn === true) {
        setSignIn(false);
      }
      if (signUp === false) {
        setSignUp(true);
      } else {
        setSignUp(false);
      }
    }
  };
  const forgotPassFunc = () => {
    if (resetPage === true) {
      setResetPage(false);
    }
    if (signIn === true) {
      setSignIn(false);
    }
    if (signUp === true) {
      setSignUp(false);
    }
    setForgotPass(true);
  };
  useEffect(() => {
    if (resetPath === 'api/resetPassword') {
      setSignIn(false);
      setSignUp(false);
      setForgotPass(false);
      setResetPage(true);
    }
  }, [resetPath]);
  return (
    <div>
      <h1>ISQA Project - Personal Library</h1>
      <div id="loginDiv">
        <div id="signInUpDiv">
          <div className="signSpan" data-testid="testSignIn" onClick={event => signFunc(event)}>
            <span>
              Sign In <span className="arrow">{signIn === false ? '▼' : '▲'}</span>
            </span>
          </div>
          <div className="signSpan" onClick={event => signFunc(event)}>
            <span>
              Sign Up <span className="arrow">{signUp === false ? '▼' : '▲'}</span>
            </span>
          </div>
        </div>
        {signIn === true ? <UserLogin /> : null}
        {signUp === true ? <Register /> : null}
        {forgotPass === true ? <ForgotPass /> : null}
        {resetPage === true ? <ResetPage /> : null}
      </div>
      <div id="forgotPasswordDiv">
        <span id="forgotPasswordTxt" onClick={() => forgotPassFunc()}>
          Forgot Password
        </span>
      </div>
    </div>
  );
};

export default Login;
