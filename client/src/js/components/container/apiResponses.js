import React, { useState } from 'react';
import axios from 'axios';
import regeneratorRuntime, { async } from 'regenerator-runtime';
import getCookie from '../../controllers/getCookie';

const ApiResponses = () => {
  const [id, setId] = useState('');
  const [comment, setComment] = useState('');
  return (
    <div>
      <div id="apiResDiv">
        <div className="apiResFormDiv">
          <span id="apiResTitle1">
            <b>Test post to /api/books</b>
          </span>
          <br />
          <br />
          <span>Book Title:</span>
          <form action="https://mysterious-reaches-14293.herokuapp.com/api/books" method="post">
            <input className="apiResInputs" type="text" name="bookTitle"></input>
            <input
              type="hidden"
              name="email"
              value={getCookie('email') !== null ? getCookie('email') : undefined}
            ></input>
            <br />
            <button type="submit" className="apiResBtns">
              Submit
            </button>
          </form>
        </div>
        <div className="apiResFormDiv">
          <form
            action={`https://mysterious-reaches-14293.herokuapp.com/api/books/${id}`}
            method="post"
          >
            <span id="apiResTitle2">
              <b>Test post to /api/books/{'{bookid}'}</b>
            </span>
            <br />
            <br />
            <span>BookId to comment on:</span>
            <br />
            <input
              className="apiResInputs"
              type="text"
              value={id}
              onChange={event => setId(event.target.value)}
            ></input>
            <br />
            <span>Comment:</span>
            <br />
            <input
              className="apiResInputs"
              name="comment"
              type="text"
              value={comment}
              onChange={event => setComment(event.target.value)}
            ></input>
            <br />
            <button type="submit" className="apiResBtns">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApiResponses;
