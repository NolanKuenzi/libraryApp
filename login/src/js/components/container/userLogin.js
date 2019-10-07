import React, { useState } from 'react';
import axios from 'axios';
import regeneratorRuntime, { async } from 'regenerator-runtime';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const submitFunc = async event => {
    event.preventDefault();
    try {
      await axios.post('https://mysterious-reaches-14293.herokuapp.com/api/login', {
        email,
        password,
      });
      const request2 = await axios.post(
        'https://mysterious-reaches-14293.herokuapp.com/api/authenticate',
        {
          email,
          password,
        }
      );
      document.cookie = `email=${email}`;
      document.cookie = `token=${request2.data}`;
      window.location.href = 'https://mysterious-reaches-14293.herokuapp.com/api/homepage';
    } catch (error) {
      if (error.response !== undefined) {
        alert(error.response.data);
        return;
      }
      alert(error);
    }
  };
  return (
    <div>
      <div className="formDiv">
        <span className="formHeader">
          <b>Login:</b>
        </span>
        <br />
        <br />
        <form onSubmit={event => submitFunc(event)} name="userLoginForm">
          <input
            name="Email"
            placeholder="E-mail"
            onChange={event => setEmail(event.target.value)}
            value={email}
          ></input>
          <br />
          <input
            type="password"
            placeholder="Password"
            onChange={event => setPassword(event.target.value)}
            value={password}
          ></input>
          <br />
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
