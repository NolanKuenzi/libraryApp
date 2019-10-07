// Complete the API routing below
'use strict';
//const expect = require('chai').expect;
//const MongoClient = require('mongodb').MongoClient;
//const ObjectId = require('mongodb').ObjectId;
//const MONGODB_CONNECTION_STRING = process.env.DB;
//const cors = require('cors');

require('dotenv').config();
const User = require('../models/user');
const Book = require('../models/books');
const jwt = require('jsonwebtoken');
const withAuth = require('../middleWare/withAuth');
const nodemailer = require('nodemailer');
const pug = require('pug');
const { body, sanitizeParam, sanitizeBody, validationResult } = require('express-validator');

module.exports = function (app) {

  app.route('/')
    .get(function (req, res) {
      res.sendFile(process.cwd() + '/views/index.html');
    })

  app.route('/api/homepage')
    .get(withAuth, function(req, res) {
      res.sendFile(process.cwd() + '/views/library.html');
    })

  app.route('/api/login')
    .post([
      body('email')
        .not().isEmpty().withMessage('Please fill out E-mail field')
        .trim()
        .isLength({max: 140}).withMessage('Email length of 140 characters has been exceeded'),
      sanitizeBody('email')
        .escape(),
      body('password')
        .not().isEmpty().withMessage('Please fill out Password field')
        .trim()
        .isLength({max: 140}).withMessage('Password length of 140 characters has been exceeded'),
      sanitizeBody('password')
        .escape()
    ], function(req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json(errors.array()[0].msg);
        return;
      } 
      res.sendStatus(200);
    })

  app.route('/api/register')
    .post([
      body('email')
        .not().isEmpty().withMessage('Please fill out E-mail field')
        .trim()
        .isLength({max: 140}).withMessage('Email length of 140 characters has been exceeded'),
      sanitizeBody('email')
        .escape(),
      body('password')
        .not().isEmpty().withMessage('Please fill out Password field')
        .trim()
        .isLength({max: 140}).withMessage('Password length of 140 characters has been exceeded'),
      sanitizeBody('password')
        .escape()
    ], function(req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json(errors.array()[0].msg);
        return;
      }
      const { email, password } = req.body;
      const newUser = new User({ email, password });
      newUser.save(function(err) {
        if (err) {
          if (err.errmsg.includes('E11000 duplicate key error collection') === true) {
            res.status(400).json('Email is already taken');
            return;
          }
          res.status(500).json(err);
          return;
        }
        res.sendStatus(200);
      });
    })

  app.route('/api/authenticate')
    .post(function(req, res) {
      const { email, password } = req.body;
      User.findOne({ email }, function(err, user) {
        if (err) {
          res.status(500).json(err);
        } else if (!user) {
          res.status(400).json('Incorrect email or password');
        } else {
            user.isCorrectPassword(password, function(err, same) {
            if (err) {
              res.status(500).json(err);
            } else if (!same) {
              res.status(400).json('Incorrect password');
            } else {
              const payload = { email };
              const token = jwt.sign(payload, process.env.SECRET, {
                expiresIn: '1h'
              });
              res.cookie('token', token, { httpOnly: true });
              res.status(200).json(token);
            }
          });
        }
      }); 
    })

  app.route('/api/logout')
    .get(function(req, res) {
      res.clearCookie('email');
      res.clearCookie('token');
      res.sendStatus(200);
    })

  app.route('/api/setReset')
    .post([
      body('email')
        .not().isEmpty().withMessage('Please fill out E-mail field')
        .trim()
        .isLength({max: 140}).withMessage('Email length of 140 characters has been exceeded'),
      sanitizeBody('email')
        .escape(),
    ], function(req, res, next) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json(errors.array()[0].msg);
        return;
      }
      const { email } = req.body;
      User.findOne({ email }).then(function(user) {
        if (user === null) {
          res.status(404).json('User not found');
          return;
        }
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'mr.nolank@gmail.com',
            pass: process.env.RESET,
          },
        });
        const mailOptions = {
          from: 'mr.nolank@gmail.com',
          to: email,
          subject: 'Library App Password Reset',
          text: 'Please note that this email will expire in one hour, after which you will have to request another reset email. Click the following link to reset your password: https://mysterious-reaches-14293.herokuapp.com/api/resetPassword',
        };
        const payload = { email: req.body.email };
        const token = jwt.sign(payload, process.env.SECRET, {
          expiresIn: '1h'
        });
        res.cookie('token', token, { httpOnly: true });
        transporter.sendMail(mailOptions, error => {
          if (error) {
            res.status(500).json(error);
            return;
          }
        });
        res.status(200).json(token);
      }).catch(function(error) {
        res.status(500).json(error);
      });
    })

  app.route('/api/resetPassword')
    .get(withAuth, function(req, res) {
      res.sendFile(process.cwd() + '/views/index.html');
    })

  app.route('/api/updatePassword')
    .put(withAuth, [
      body('password')
        .not().isEmpty().withMessage('Please fill out Password field')
        .trim()
        .isLength({max: 140}).withMessage('Password length of 140 characters has been exceeded'),
      sanitizeBody('password')
        .escape()
      ], function(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json(errors.array()[0].msg);
          return;
        }
        const { email, password } = req.body;
        User.find({ email }).then(function(user) {
          user[0].password = password;
          user[0].save().then(function(user) {
            res.sendStatus(200);
          }).catch(function(error) {
            res.status(500).json(error);
            return;
          })
        }).catch(function(error) {
          res.status(500).json(error);
        });
    })

  app.route('/api/books/?')
    .get(withAuth, function (req, res) {
      const email = req.cookies.email;
      User.findOne({ email }).then(function(user) {
        if (user === undefined || user === null) {
          if (req.query.axios === undefined) {
            res.render('error', {status: 404, errMessage: 'Email not found'});
          } else {
            res.status(404).json('Email not found');
          }
          return;
        }
        let rtrnArr = [];
        function filterBks(arr) {
          if (arr.length === 0) {
            return;
          }
          const usrBks = user.books.slice(0);
          usrBks.forEach(function(item) {
            if (JSON.stringify(item.bookId) === JSON.stringify(arr[0]._id)) {
              rtrnArr.push(arr[0]);
              return;
            }
          })
          filterBks(arr.slice(1));
        }
        Book.find({}).then(function(books) {
          const email = req.cookies.email;
          if (books.length === 0) {
            if (req.query.axios === undefined) {
              res.status(200).render('bookList', {email: email, library: [{title: 'Library is currently empty', commentCount: 0}]});
            }
            return;
          }
          let bkArr = books.slice(0);
          filterBks(bkArr);
          if (req.query.axios === undefined) {
            res.status(200).render('bookList', {email: email, library: rtrnArr.slice(0)});
            return;
          }
          if (req.query.axios === 'true') {
            res.status(200).json(rtrnArr.slice(0));
          }
        }).catch(function(error) {
          if (req.query.axios === undefined) {
            res.render('error', {status: 500, errMessage: error});
          } else {
            res.status(500).json(error);
          }
        })
      }).catch(function(error) {
        if (req.query.axios === undefined) {
          res.render('error', {status: 500, errMessage: error});
        } else {
          res.status(500).json(error);
        }
      })
    })

    .post(withAuth, [
      body('bookTitle')
        .not().isEmpty().withMessage('Please fill out Book Title field')
        .trim()
        .isLength({max: 140}).withMessage('Book title character limit of 140 has been exceeded'),
      sanitizeBody('bookTitle')
        .escape(),
    ], withAuth, function (req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        if (req.query.axios === undefined) {
          res.render('error', {status: 400, errMessage: errors.array()[0].msg});
          return;
        } else {
          res.status(400).json(errors.array()[0].msg);
          return;
        }
      }
      const { email, bookTitle } = req.body;
      const newBook = new Book({title: bookTitle});
      newBook.save().then(function(newBk) {
        User.findOne({ email }).then(function(user) {
          user.books.push({title: newBk.title, bookId: newBk._id});
          user.save().then(function(user) {
            if (req.query.axios === undefined) {
              res.render('newBook', {title: user.books[user.books.length - 1].title, id: user.books[user.books.length - 1].bookId});
              return;
            }
            if (req.query.axios === 'true') {
              res.sendStatus(200);
              return;
            }
          }).catch(function(error) {
            if (req.query.axios === undefined) {
              res.render('error', {status: 500, errMessage: error});
              return;
            } else {
              res.status(500).json(error);
              return;
            }
          })
        }).catch(function(error) {
          if (req.query.axios === undefined) {
            res.render('error', {status: 500, errMessage: error});
            return;
          } else {
            res.status(500).json(error);
            return;
          }
        })
      }).catch(function(error) {
        if (error.errmsg.includes('E11000 duplicate key error collection: test.books index')) {
          User.findOne({ email }).then(function(user) {
            const checkUsrBks = user.books.filter(item => item.title === bookTitle);
            if (checkUsrBks.length > 0) {
              if (req.query.axios === undefined) {
                res.render('error', {status: 400, errMessage: 'Book already exists in your collection'});
                return;
              } else {
                res.status(400).json('Book already exists in your collection');
                return;
              }
            }
            Book.findOne({ title: bookTitle }).then(function(bk) {
              user.books.push({title: bk.title, bookId: bk._id});
              user.save().then(function(user) {
                if (req.query.axios === undefined) {
                  res.render('newBook', {title: bk.title, id: bk._id});
                  return;
                }
                if (req.query.axios == 'true') {
                  res.sendStatus(200);
                  return;
                }
              }).catch(function(error) {
                if (req.query.axios === undefined) {
                  res.render('error', {status: 500, errMessage: error});
                  return;
                } else {
                  res.status(500).json(error);
                  return;
                }
              })
            }).catch(function(error) {
              if (req.query.axios === undefined) {
                res.render('error', {status: 500, errMessage: error});
                return;
              } else {
                res.status(500).json(error);
                return;
              }
            })
          }).catch(function(error) {
            if (req.query.axios === undefined) {
              res.render('error', {status: 500, errMessage: error});
              return;
            } else {
              res.status(500).json(error);
              return;
            }
          })
        } else {
          res.status(500).json(error);
        }
      })
    })

    .delete(withAuth, function(req, res) {
      const { email } = req.body;
      User.findOne({ email }).then(function(user) {
        if (user === null || user === undefined) {
          res.status(404).json('Email not found');
          return;
        }
        user.books.splice(0, user.books.length);
        user.save().then(function(user) {
          res.sendStatus(200);
        }).catch(function(error) {
          res.status(500).json(error);
        })
      }).catch(function(error) {
        res.status(500).json(error);
      })
    });

  app.route('/api/books/:id')
    .get(withAuth, [
      sanitizeParam('id')
      .escape(),
    ], function (req, res) {
      const bookId = req.params.id;
      Book.find({_id: bookId}).then(function(bk) {
      res.status(200).render("book", {"id": bk[0]._id, "title": bk[0].title, "comments": bk[0].comments.slice(0)});
      }).catch(function(error) {
        res.status(404).render("error", {status: 404, errMessage: "Book not found"});
      })
    })

    .post(withAuth, [
      sanitizeParam('id')
        .escape(),
      body('comment')
        .not().isEmpty().withMessage('Please fill out comment field')
        .trim()
        .isLength({max: 500}).withMessage('Comment character limit of 500 has been exceeded'),
      sanitizeBody('comment')
        .escape(),
    ], function(req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        if (req.query.axios === undefined) {
          res.render('error', {status: 400, errMessage: errors.array()[0].msg});
          return;
        } else {
          res.status(400).json(errors.array()[0].msg);
          return;
        }
      }
      const bookId = req.params.id;
      Book.find({ _id: bookId }).then(function(book) {
        book[0].commentCount += 1;
        book[0].comments.push(req.body.comment);
        book[0].save().then(function(book) {
          if (req.query.axios === undefined) {
            res.status(200).render('comments', {title: book.title, comments: book.comments.slice(0)});
            return;
          }
          if (req.query.axios == 'true') {
            res.sendStatus(200);
          }
        }).catch(function(error) {
          if (req.query.axios === undefined) {
            res.render('error', {status: 500, errMessage: error});
            return;
          } else {
            res.status(500).json(error);
            return;
          }                 
        })
      }).catch(function(error) {
        if (error.name !== 'CastError') {
          if (req.query.axios === undefined) {
            res.render('error', {status: 500, errMessage: error});
            return;
          } else {
            res.status(500).json(error);
            return;
          }
        } else {
          if (req.query.axios === undefined) {
            res.render('error', {status: 404, errMessage: 'Book not found'});
            return;
          } else {
            res.status(400).json(error);
            return;
          }
        }
      })
    })

    .delete(withAuth, function(req, res) {
      const { email } = req.body;
      User.findOne({ email }).then(function(user) {
        const findBk = user.books.find(function(ele) {
          return ele.bookId === req.params.id;
        });
        if (findBk === undefined) {
          res.status(404).json('Book not found');
          return;
        }
        user.books =  user.books.filter(item => item.bookId !== req.params.id);
        user.save().then(function(user) {
          res.sendStatus(200);
        }).catch(function(error) {
          res.status(500).json(error);
        })
      }).catch(function(error) {
        res.status(500).json(error);
      })
    });
    
    app.route('/api/error/?') 
    .get(function(req, res) {
      res.render('error', {status: req.query.status !== undefined ? req.query.status : 500, errMessage: req.query.errMessage !== undefined ? req.query.errMessage : 'Internal Server Error'});
    })
};
