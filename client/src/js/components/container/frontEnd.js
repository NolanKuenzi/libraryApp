import React, { useState, useEffect } from 'react';
import axios from 'axios';
import regeneratorRuntime, { async } from 'regenerator-runtime';
import ApiResponses from './apiResponses';
import UserStories from '../presentational/userStories';
import getCookie from '../../controllers/getCookie';

const trStyle = {
  backgroundColor: 'rgb(127, 220, 235)',
};

const FrontEnd = () => {
  const [apiRes, setApiRes] = useState(false);
  const [usrStories, setUsrStories] = useState(false);
  const [getBkList, setGetBkList] = useState(true);
  const [bookList, setBookList] = useState([]);
  const [renderBk, setRenderBk] = useState([]);
  const [bkTitle, setBkTitle] = useState('');
  const [txtArea, setTxtArea] = useState('');
  const [errDiv, setErrDiv] = useState('');

  const toggle = event => {
    if (event.target.id === 'apiResToggler') {
      if (apiRes === false) {
        setApiRes(true);
      } else {
        setApiRes(false);
      }
    }
    if (event.target.id === 'userStoriesToggler') {
      if (usrStories === false) {
        setUsrStories(true);
      } else {
        setUsrStories(false);
      }
    }
  };
  const signOut = async () => {
    try {
      await axios.get('http://localhost:3000/api/logout');
      document.cookie = 'email=erased; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      document.cookie = 'token=erased; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      window.location.href = 'http://localhost:3000/';
    } catch (error) {
      window.location.href = `http://localhost:3000/api/error?status=500&errMessage=${error}`;
    }
  };
  const errFunc = error => {
    setBkTitle('');
    setBookList([]);
    setRenderBk([]);
    setErrDiv(`${error}`);
  };
  const getData = async () => {
    try {
      const request = await axios.get('http://localhost:3000/api/books?axios=true', {
        withCredentials: true,
      });
      setBkTitle('');
      setErrDiv('');
      setBookList(request.data.slice(0));
      if (renderBk.length > 0) {
        setRenderBk(request.data.filter(item => item._id === renderBk[0]._id));
      }
    } catch (error) {
      errFunc(error);
    }
  };
  const addBk = async event => {
    event.preventDefault();
    try {
      await axios.post(
        'http://localhost:3000/api/books?axios=true',
        {
          bookTitle: bkTitle,
          email: getCookie('email'),
        },
        {
          withCredentials: true,
        }
      );
      getData();
    } catch (error) {
      if (
        (error.response.data !== undefined &&
          error.response.data === 'Please fill out Book Title field') ||
        error.response.data === 'Book already exists in your collection'
      ) {
        alert(error.response.data);
        return;
      }
      errFunc(error);
    }
  };
  const selectBk = event => {
    event.stopPropagation();
    setRenderBk(bookList.filter(item => item._id === event.target.id));
  };
  const deleteFunc = async event => {
    event.preventDefault();
    try {
      await axios.delete(`http://localhost:3000/api/books/${event.target.id}`, {
        data: {
          email: getCookie('email'),
        },
        withCredentials: true,
      });
      getData();
    } catch (error) {
      errFunc(error);
    }
  };
  const deleteAllFunc = async () => {
    try {
      await axios.delete('http://localhost:3000/api/books', {
        data: {
          email: getCookie('email'),
        },
        withCredentials: true,
      });
      getData();
    } catch (error) {
      errFunc(error);
    }
  };
  const commentFunc = async event => {
    event.preventDefault();
    try {
      await axios.post(
        `http://localhost:3000/api/books/${renderBk[0]._id}?axios=true`,
        {
          comment: txtArea,
        },
        {
          withCredentials: true,
        }
      );
      setTxtArea('');
      getData();
    } catch (error) {
      errFunc(error);
    }
  };
  const cancelFunc = () => {
    setRenderBk([]);
    setTxtArea('');
  };
  useEffect(() => {
    if (getBkList === true) {
      getData();
      setGetBkList(false);
    }
  }, []); // eslint-disable-line
  return (
    <div>
      <h1>ISQA Project - Personal Library</h1>
      <div id="email_signOut">
        <div id="emailDiv">
          <span>{getCookie('email')}</span>
        </div>
        <div id="signOutDiv" onClick={() => signOut()}>
          <span>Sign Out</span>
        </div>
      </div>
      <div id="togglerDiv">
        <div id="userStoriesToggleDiv">
          <h3 id="userStoriesToggler" onClick={event => toggle(event)}>
            User Stories <span className="arrow">{usrStories === false ? '▼' : '▲'}</span>
          </h3>
        </div>
        <div id="apiResToggleDiv">
          <h3 id="apiResToggler" onClick={event => toggle(event)}>
            Test API Responses <span className="arrow">{apiRes === false ? '▼' : '▲'}</span>
          </h3>
        </div>
      </div>
      <div id="toggledComponents">
        <div>{usrStories === false ? null : <UserStories />}</div>
        <div>{apiRes === false ? null : <ApiResponses />}</div>
      </div>
      <div id="frontEndSection">
        <form onSubmit={event => addBk(event)}>
          <input
            type="text"
            id="submit_input"
            placeholder="New Book Title"
            value={bkTitle}
            onChange={event => setBkTitle(event.target.value)}
          ></input>
          <button type="submit" id="submit_button">
            Submit New Book!
          </button>
        </form>
        <div id="displayBooks">
          <span id="displaySpan">Select a book to see it's details and comments</span>
          {errDiv === '' ? null : <div id="errDiv">{errDiv}</div>}
          <div id="tableDiv">
            {bookList.length === 0 ? null : (
              <table>
                <tbody>
                  {bookList.map(item => (
                    <tr key={`tr-${item._id}`}>
                      <td
                        key={`td1-${item._id}`}
                        className="bookListLi"
                        id={item._id}
                        style={
                          renderBk.length !== 0 && item._id === renderBk[0]._id ? trStyle : null
                        }
                        onClick={event => selectBk(event)}
                      >
                        <i key={`i-${item._id}`} id={item._id} onClick={event => selectBk(event)}>
                          {item.title}
                        </i>{' '}
                        <span
                          key={`span-${item._id}`}
                          id={item._id}
                          onClick={event => selectBk(event)}
                        >
                          Comments: {item.commentCount}{' '}
                        </span>
                      </td>
                      <td key={`td2-${item._id}`}>
                        <button
                          id={item._id}
                          type="button"
                          className="delBtn"
                          key={`btn-${item._id}`}
                          onClick={event => deleteFunc(event)}
                          data-testid={`btn-${item._id}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <br />
          <button type="button" id="delBksBtn" onClick={() => deleteAllFunc()}>
            Delete All Books
          </button>
        </div>
      </div>
      <div id="displayBkDiv">
        {renderBk.length === 0 ? null : (
          <div id="displayBk">
            <h2>{renderBk[0].title}</h2>
            <div id="commentDiv">
              <h3>Comments:</h3>
              <ul id="commentsUl">
                {renderBk[0].comments.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <form onSubmit={event => commentFunc(event)}>
                <textarea
                  id="commentBox"
                  placeholder="Add Comment"
                  value={txtArea}
                  onChange={event => setTxtArea(event.target.value)}
                ></textarea>
                <br />
                <button type="submit">Add Comment</button>
              </form>
            </div>
            <div id="cancelBtnDiv">
              <button type="button" onClick={() => cancelFunc()}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FrontEnd;
