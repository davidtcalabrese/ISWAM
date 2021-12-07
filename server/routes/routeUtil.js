const { processWeather } = require('../controllers/weatherFunctions.js');
const { processAlert } = require('../controllers/alertFunctions.js');

/**
 * Takes a function to be executed at a regular interval for a set amount of time. 
 * 
 * @param {Function} fn - A callback function to be executed at specified interval until timeout. 
 * @param {number} timeout - Duration in seconds for which function should called at intervals. 
 * @param {number} interval - The number of seconds between function calls.
 * @param {Object} req - The POST request sent from client.  
 */
const pollFunc = (fn, timeout, interval, req) => {
  var startTime = (new Date()).getTime();
  interval = (interval * 1000) || 1000;
  timeout = (timeout * 1000);

  (function p() {
      fn(req);
      if (((new Date).getTime() - startTime ) <= timeout)  {
          setTimeout(p, interval);
      }
  })();
}

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

exports.pollFunc = pollFunc;
exports.callApis = callApis;