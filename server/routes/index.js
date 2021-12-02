const express = require('express');
const router = express.Router();
const { processWeather } = require('../controllers/weatherFunctions.js');
const { processAlert } = require('../controllers/alertFunctions.js');

/* GET home page. */
router.get('/', function(req, res, next) {});

router.post('/', async (req, res, next) => {
  const zip = req.body.zip;
  const weatherData = await processWeather(zip); 
  const alertData = await processAlert(zip, 1);

  if (alertData === -1) {
    var weatherAndAlertData = weatherData;
  } else {
    weatherAndAlertData = [...alertData, ...weatherData];
  }
  res.json(weatherAndAlertData);
});

module.exports = router;
