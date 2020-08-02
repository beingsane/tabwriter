var express = require('express'),
  app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.set('port', process.env.PORT || 3000);

app.get('/', function (req, res) {
  res.render('index', { active: 'index' });
});

app.get('/about', function (req, res) {
  res.render('about', { active: 'about' });
});

app.get('*', function (req, res) {
  res.status(404).render('error404', { active: 'error404' });
});

app.listen(app.get('port'), function () {
  console.log('TabWriter initialized on port 3000');
});
