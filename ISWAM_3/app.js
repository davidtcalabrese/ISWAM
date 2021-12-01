// imports
const express = require('express');
const bodyParser = require('body-parser');
const util = require('./util');

// get instance of express
const app = express();
// needed for the form I think
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 5000;

// static files
app.use(express.static('/public'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/img', express.static(__dirname + '/public/img'));

// set views - pass data to these mostly static html fields 
// and fill in the blanks using EJS templating
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', ['*']);
  next();
});

app.use(bodyParser.json());

// form delivers zip code to this post route
app.post('/', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // grab zip code
  const zip = req.body.zip;
  // pass to individual controller functions for alert 
  let weatherData = await util.getWeather(zip);
  let alertData = await util.getAlerts(zip, 1);

  /**
   * set values for the variables used with EJS as the 
   * 2nd argument to render()
   * first arg is the view its being sent to 
   */
  res.render('index', {
    event: alertData[0],
    severity: alertData[1],
    description: alertData[2],
    starts: alertData[3],
    ends: alertData[4],
    description: weatherData[0],
    city: weatherData[1],
    state: weatherData[2],
    temperature: weatherData[3],
    humidity: weatherData[4],
    icon: weatherData[5],
  });
});

app.get('/', (req, res) => {
  res.render('index', {
    event: '',
    severity: '',
    starts: '',
    ends: '',
    city: '',
    state: '',
    temperature: '',
    humidity: '',
    description: '',
    icon: '',
  });
});

// start server 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
