var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var botkit = require('botkit');
var schedule = require('node-schedule');
// var flash = require('express-flash');
var MongoStore = require('connect-mongo/es5')(session);
// var passport = require('passport');
var secret = require('./config/secret');
var app = express();
// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

mongoose.connect(secret.database, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
});

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secret.secretKey,
  store: new MongoStore({ url: secret.database, autoReconnect: true})
}));

app.listen(secret.port, function(err) {
  if (err) throw err;
  console.log("Server is Running on port " + secret.port);
});

// BOT: SET UP
var controller = botkit.slackbot({debug: true})

// BOT: DAILY SIGN IN
// Bot sends message everyday, M - F at 9:00 AM, closes Sign In at 9:45 AM
let startTime = new Date('0 9 * # 1-5')
let endTime = new Date('45 9 * # 1-5')
