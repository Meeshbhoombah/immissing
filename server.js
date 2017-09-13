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
var makeBot = botkit.slackbot({debug: true})

// BOT: DAILY SIGN IN
// Create recurrence rule to execute everyday between M - F at 9:00 AM
var signInTime = new schedule.RecurrenceRule();
signInTime.dayOfWeek = 1-5;
signInTime.hour = 9;
signInTime.minute = 0;

var endSignInTime = signInTime;
endSignInTime.minute = 45;

var startSignIn = schedule.scheduleJob(signInTime, function() {
  makeBot.startPrivateConversation(message, {
    attachments:[
      {
        title: 'Do you want to interact with my buttons?',
        callback_id: '123',
        attachment_type: 'default',
        actions: [
            {
                "name":"yes",
                "text": "Yes",
                "value": "yes",
                "type": "button",
            },
            {
                "name":"no",
                "text": "No",
                "value": "no",
                "type": "button",
            }
        ]
      }
    ]
  });
});

var endSignIn = schedule.scheduleJob(endSignInTime, function() {
  startSignIn.cancel(true)
});

// BOT: /immissing [date] [class] [note]

// BOT: /imlate [class]

// BOT: /absences

// BOT: Jade only - /attendance
