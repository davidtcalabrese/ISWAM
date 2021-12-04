const express = require('express');
const router = express.Router();
const { processWeather } = require('../controllers/weatherFunctions.js');
const { processAlert } = require('../controllers/alertFunctions.js');

/* GET home page. */
router.get('/', function(req, res, next) {});

router.post('/', async (req, res, next) => {
  const zip = req.body.zip;
  const severity = req.body.severity;
  const color = req.body.color;

  const weatherData = await processWeather(zip); 
  const alertData = await processAlert(zip, severity, color);

  if (alertData === -1) {
    var response = weatherData;
    response.alertPresent = false;
  } else {
    response = {...weatherData, ...alertData};
    response.alertPresent = true;
  }
  res.json(response);
});

module.exports = router;
