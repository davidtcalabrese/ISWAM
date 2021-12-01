const Weather = require('./Weather');
const Alert = require('./Alert');

/**
 * Creates PostRequest object to send to ESP32 API with data to display on current weather.
 *
 * @param {string} city - The city in for weather data.
 * @param {string} state - The state city is in.
 * @param {string} tempInF - The temperature in fahrenheit.
 * @param {string} humidity - The relative humidity in degrees.
 * @param {string} description - A short description of the current weather.
 * @returns
 */
 const buildWeatherPost = (city, state, tempInF, humidity, description) => {
  const location = `${city}, ${state}`;
  const tempHumidity = `${tempInF}°F - ${humidity}% humidity`;
  const summary = `${description}`;

  // all LED numbers set to 0 - lights should not be on for weather.
  return new PostRequest(0, 0, 0, 0, 0, 0, location, tempHumidity, summary);
};

/**
 * Creates a PostRequest object out of data retrieved from API.
 *
 * @param {string} event - name of alert.
 * @param {string} start - time alert takes effect.
 * @param {string} end -  time to which alert is in effect.
 * @returns {PostRequest} a PostRequest object ready to be sent to ESP32.
 */
const buildAlertPost = (event, start, end) => {
  const alertMsg = `Alert: ${event}`;
  const startString = `Starts: ${start}`;
  const endString = `Ends: ${end}`;
  const moreInfo = 'More info: weather.gov';

  return new PostRequest(255, 255, 255, 1, 1000, 1000, alertMsg, startString, endString, moreInfo);
};

/**
 * Formats a date time object.
 *
 * @param {Datetime} datetime - A datetime object.
 * @returns {string} formatted with date and time as MM/dd, hh:mm am/pm.
 */
const formatDateTime = datetime => {
  const day = datetime.getDate();
  const month = datetime.getMonth() + 1;
  const hours24 = datetime.getHours();
  const minutes = datetime.getMinutes();

  const ampm = hours24 >= 12 ? 'pm' : 'am';
  const hours12 = hours24 % 12;
  const hoursFormatted = hours12 ? hours12 : 12; // if hours evaluates to 0 it should be 12
  const minutesFormatted = minutes === 0 ? '00' : minutes; // no single digit minute values

  return `${month}/${day}, ${hoursFormatted}:${minutesFormatted}${ampm}`;
};

/**
 * Initializes the XHR process for weather data.
 *
 * @param {string} zip zip code fetched from form.
 */
 const getWeather = async function (zip) {

  const weather = new Weather();
  const data = await weather.processWeather(zip);

  return data;
};

/**
 * Initializes the XHR process for alerts.
 *
 * @param {string} zip zip code fetched from form.
 * @param {string} severity severity level fetched from form.
 */
const getAlerts = async function (zip, severity) {

  const alert = new Alert();
  const data = await alert.processAlert(zip, severity);

  return data;
};

// /**
//  * Initializes app by accessing form fields and passing them to checkWeatherAndAlerts.
//  *
//  * @author David Calabrese <david.thomas.calabrese@gmail.com>
//  */
// const init = function () {
//   const zip = getZip();
//   const severity = getSeverity();
//   checkWeatherAndAlerts(zip, severity);
// };

// document.querySelector('#submit').addEventListener('click', init);

// module.exports = {
//   checkWeatherAndAlerts: checkWeatherAndAlerts,
// }

exports.getWeather = getWeather;    
exports.getAlerts = getAlerts;    
exports.formatDateTime = formatDateTime;    
