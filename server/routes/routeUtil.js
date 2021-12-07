const { processWeather } = require('../controllers/weatherFunctions.js');
const { processAlert } = require('../controllers/alertFunctions.js');

/**
 * Passes weather and alert API parameters (in form of request object) to the functions which
 * control the process of fetching the data, processing it and returning it to be displayed. 
 * 
 * @param {Object} req - The POST request sent from client.  
 * @returns {Object} - The weather API response and alert API response if there is an alert. 
 */
const callApis = async req => {
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

  return response;
}

exports.callApis = callApis;