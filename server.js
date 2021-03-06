/**
 * New node file
 */
var express = require('express');
var passport = require('passport');
var strategy = require('./lib/setup-passport');
var app = express();
var port = 3000;

app.set('view engine', 'jade');

app.configure(function () {
  this.use(express.cookieParser());
  this.use(express.session({ secret: 'shhhhhhhhh' }));
  
  this.use(passport.initialize());
  this.use(passport.session());
  
  this.use(express.static(__dirname + '/public'));
  this.use(app.router);
});

app.get('/', function (req, res) {
    res.render("index", {
    	clientId: 'dy9ftINKZSRP5ysJiuE9s1UQu7AanMyP',
        user: JSON.stringify(req.user, 0, 2)
    });
});

app.get('/callback', 
  passport.authenticate('auth0', { failureRedirect: '/failure' }), 
  function(req, res) {
    if (!req.user) {
      throw new Error('user null');
    }
    res.redirect("/");
  }
);

app.get('/failure', function (req, res) {
  res.send('user didn\'t grant permissions');
});

app.listen(port, function () {
  console.log('listening in http://localhost:' + port);
});