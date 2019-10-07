import React, { useState } from 'react';
import axios from 'axios';
import regeneratorRuntime, { async } from 'regenerator-runtime';

const ForgotPass = () => {
  const [emailAddress, setEmailAddress] = useState('');
  const submitFunc = async event => {
    event.preventDefault();
    try {
      const request = await axios.post('http://localhost:3000/api/setReset', {
        email: emailAddress,
      });
      document.cookie = `email=${emailAddress}`;
      document.cookie = `token=${request.data}`;
      alert(`Reset email sent to ${emailAddress}`);
      setEmailAddress('');
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
          <b>Reset:</b>
        </span>
        <br />
        <br />
        <form onSubmit={event => submitFunc(event)}>
          <input
            placeholder="E-mail"
            onChange={event => setEmailAddress(event.target.value)}
            value={emailAddress}
          ></input>
          <br />
          <button type="submit" id="resetBtn">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPass;
