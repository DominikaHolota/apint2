var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var about = require ('./routes/about');
var contact = require('./routes/contact');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/about',about);
app.use('/contact', contact);

app.post('/contact/send', (req,res) => {
  //add mail body
  const output = `
    <p>You have a new message!</p>
    <h3>Contact details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>E-mail: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;


    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'liniuszka.nazwa.pl',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
          user: 'express@liniuszka.pl', // generated ethereal user
          pass: 'Aplikacjeinternetowe2' // generated ethereal password
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Domi" <express@liniuszka.pl>', // sender address
      to: 'express@liniuszka.pl, ' + req.body.email, // list of receivers
      subject: 'A message from contact form on your website', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);


      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

      res.render('contact', {msg: 'Message has been sent.'});
    });

  console.log(output);
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
