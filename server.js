'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
app.use(helmet());
app.use(helmet.noCache());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));

app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//app.use(cors({origin: '*'})); //USED FOR FCC TESTING PURPOSES ONLY!
app.use(cors({credentials: true, origin: 'http://localhost:8080'}));

app.use('/views', express.static(process.cwd() + '/views'));
app.set('view engine', 'pug');

const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true}).catch((error) => { console.log(error); });

//For FCC testing purposes
fccTestingRoutes(app);

apiRoutes(app);

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({"message" : err.name + ": " + err.message});
  }
});

app.use(function(error, req, res, next) {
  res.status(500).json(error);
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; //for unit/functional testing
