const axios = require('axios');

/**
 * Prepares for alert API call by making some preliminary API calls, exchanging zip
 * code for coordinates and coordinates for a UGC code, then gets alert with code,
 * checks if there is an alert and that the alert's severity surpasses severity threshold
 * set by user, if it does it calls displayAlert to add alert to DOM, otherwise, calls
 * displayNoAlert, which adds thumbs up sign to DOM.
 *
 * @param {string} zip - The zip code of user.
 * @param {string} severityThreshold desired severity threshold (default is all levels).
 */
 const processAlert = async (zip, severityThreshold) => {
  // get data needed for requests

  const [lat, long] = await getCoordsFromZip(zip);
  const code = await getCodeFromCoords(lat, long);
  const alertData = await getAlertFromCode(code);

  if (alertData == -1  ) {
    console.log("-1");
    return -1;
  } 
  // const severity = alertData.properties.severity;
  const data = getAlertFields(alertData);
  return data;
 
  
  
  // if (isSevereEnough(severity, severityThreshold)) {
  //   return data;
  // } else {
  //   return -1;
  // }
};

/**
 * Accesses the NWS API, retrieves alert for area or -1 if no alert.
 *
 * @param {string} code a universal geographic code (UGC) identifying a region
 * @returns alert object from api or -1 if no alert
 */
const getAlertFromCode = async code => {
  const resp = await axios.get(`https://api.weather.gov/alerts/active/?status=actual&zone=${code}`);
  const data = await resp.data;

  const alert = data.features[0];

  // return -1 if no alert for UGC
  if (typeof alert === 'undefined') {
    return -1;
  }
  // otherwise return the alert
  return alert;
};

/**
 * Pulls alert object properties from JSON response, pushes into array.
 *
 * @param {object} alertProperties - Object from API, corresponds to response.features.
 */
const getAlertFields = alertProperties => {
  const alertProps = [];
  alertProps.push(alertProperties.properties.event);
  alertProps.push(alertProperties.properties.severity);
  alertProps.push(alertProperties.properties.description);
  const startTime = alertProperties.properties.onset;
  const endTime = alertProperties.properties.ends;
  // format date and time nicer
  alertProps.push(formatDateTime(new Date(startTime)));
  alertProps.push(formatDateTime(new Date(endTime)));

  return alertProps;
};

/**
 * Gets geographic coordinates from a zip code.
 *
 * @param {string} zip - A zip code.
 * @returns {Array} in format [latitude, longitude].
 */
const getCoordsFromZip = async function (zip) {
  const resp = await axios.get(`http://api.zippopotam.us/us/${zip}`);
  const data = await resp.data;

  const lat = data.places[0].latitude;
  const long = data.places[0].longitude;

  const coords = [];
  coords.push(lat);
  coords.push(long);
  return coords;
};

/**
 * Gets universal geographic code (UGC) from coordinates.
 *
 * @param {string or number} lat - the latitude of the user's zip code.
 * @param {string or number} long - the longitude of the user's zip code.
 * @returns {string} a universal geographic code (UGC).
 */
const getCodeFromCoords = async function (lat, long) {
  const resp = await axios.get(`https://api.weather.gov/points/${lat},${long}`);
  const data = await resp.data;
  const forecastZone = data.properties.forecastZone;
  const code = forecastZone.substr(forecastZone.length - 6);
  return code;
};

/**
 * Determines if alert should be displayed by checking severity level against severity threshold.
 *
 * @param {string} severityThreshold - One of five levels of severity NWS ranks their alerts.
 * @returns {boolean} If alert if as severe or more severe than threshold returns true, else false.
 */
const isSevereEnough = (severity, severityThreshold) => {
  // default is 1 in case severity doens't come back so alert will display
  let eventSeverityAsNumber = 1;
  switch (severity) {
    case 'Unknown':
      eventSeverityAsNumber = 1;
      break;
    case 'Minor':
      eventSeverityAsNumber = 2;
      break;
    case 'Moderate':
      eventSeverityAsNumber = 3;
      break;
    case 'Severe':
      eventSeverityAsNumber = 4;
      break;
    case 'Extrene':
      eventSeverityAsNumber = 5;
      break;
    default:
      eventSeverityAsNumber = 1;
  }
  return eventSeverityAsNumber >= severityThreshold;
};

/**
 * Formats a date time object.
 *
 * @param {Datetime} datetime - A datetime object.
 * @returns {string} - Date and time formatted as MM/dd, hh:mm am/pm.
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

exports.processAlert = processAlert;
exports.getCoordsFromZip = getCoordsFromZip;
exports.getAlertFromCode = getAlertFromCode;
exports.getAlertFields = getAlertFields;
exports.getCodeFromCoords = getCodeFromCoords;
exports.isSevereEnough = isSevereEnough;

