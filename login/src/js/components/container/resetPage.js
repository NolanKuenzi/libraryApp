import React, { useState } from 'react';
import axios from 'axios';
import regeneratorRuntime, { async } from 'regenerator-runtime';

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

const ResetPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const submitFunc = async event => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await axios.put('http://localhost:3000/api/updatePassword', {
        email: getCookie('email'),
        password,
      });
      const request2 = await axios.post('http://localhost:3000/api/authenticate', {
        email: getCookie('email'),
        password,
      });
      document.cookie = `email=${getCookie('email')}`;
      document.cookie = `token=${request2.data}`;
      window.location.href = 'http://localhost:3000/api/homepage';
    } catch (error) {
      if (error.response !== undefined) {
        alert(error.response.data);
        return;
      }
      alert(error);
    }
  };
  return (
    <div id="resetDiv">
      <div className="formDiv">
        <span className="formHeader">
          <b>Reset Password for: {getCookie('email')}</b>
        </span>
        <br />
        <br />
        <form onSubmit={event => submitFunc(event)}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={event => setPassword(event.target.value)}
          ></input>
          <br />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={event => setConfirmPassword(event.target.value)}
          ></input>
          <br />
          <button type="submit">Reset</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPage;
