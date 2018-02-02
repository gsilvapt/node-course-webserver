/**
 * Third-party modules
 */
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');


// Constant defined to be used by Heroku
const PORT = process.env.PORT || 3000;

var app = express(); // Defines a new Express application

// Registers partials and other parts of express middleware
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`

  console.log(log);
  fs.appendFile('server.log', log + '\n', (error) => {
    if (error) {
      console.log('Cannot acces specified file.');
    };
  });
  next();
})

// This bit, since it does not have any next() method, it will block the rest
// of the code to run. Good for maintenance parts.
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
})

app.get('/', (req, res) => {
  // res.send('<h1>Hello Express</h1>');
  res.render('home.hbs', {
    pageTitle: 'Home page',
    welcomeMessage: 'Some welcome message',
  })
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects Page',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to fullfill request.'
  });
})

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});