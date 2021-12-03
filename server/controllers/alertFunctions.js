const axios = require('axios');
const config = require('../config.js').config;

/**
 * Checks if there is an alert for entered zip code and that the alert's severity surpasses severity threshold
 * set by user, if it does it calls displayAlert to add alert to DOM, otherwise, calls
 * displayNoAlert, which adds thumbs up sign to DOM.
 *
 * @param {string} zip - The zip code of user.
 * @param {string} severityThreshold - Desired severity threshold (default is all levels).
 * @param {string} color - Color of alert lights (default white).
 */
const processAlert = async (zip, severityThreshold, color) => {
  // get data needed for requests
  const alertData = await getAlertFromZip(zip);

  if (alertData == -1) {
    return -1;
  }
  const severity = alertData.severity;
  if (!isSevereEnough(severity, severityThreshold)) {
    return -1;
  }

  const data = getAlertFields(alertData);

  const [redHex, greenHex, blueHex] = parseColor(color);
  const LEDPost = buildLEDPost(redHex, greenHex, blueHex);
  const LCDPost = buildLCDPost(data);
  // todo: function to send POST to puck
  return data;
};

/**
 * Creates an object that will become the POST request sent to the Puck's LEDs.
 * 
 * @param {string} redHex - The hex value of red color component.
 * @param {string} greenHex - The hex value of green color component.
 * @param {string} blueHex - The hex value of blue color component.
 * @returns object which will be sent to Puck as body of POST request.
 */
const buildLEDPost = (redHex, greenHex, blueHex) => {
  return `{ 
    "red": ${redHex},
    "green": ${greenHex},
    "blue": ${blueHex},
    "effect": 0,
    "onTime": 250,
    "offTime": 250
  }
`;
}

/**
 * Creates an object out of data retrieved from API that will 
 * become the POST request sent to the Puck's LCD screen.
 *
 * @param {string} event - name of alert.
 * @param {string} start - time alert takes effect.
 * @param {string} end -  time to which alert is in effect.
 * @returns - An object to be sent to Puck as body of POST request.
 */
 const buildLCDPost = data => {
  const alertMsg = `Alert: ${data[0]}`;
  const startString = `Starts: ${data[3]}`;
  const endString = `Ends: ${data[4]}`;

  return `{ 
    "text1": ${alertMsg},
    "text2": ${startString},
    "text3": ${endString},
    "text4": ""
  }
`;
};

/**
 * Takes a six digit hex color and returns an array of individual
 * colors for red, green and blue.
 *
 * @param {string} color - Six digit hex value for alert LED color.
 */
const parseColor = color => {
  const red = color.substring(0, 2);
  const green = color.substring(2, 4);
  const blue = color.substring(4);

  return [red, green, blue];
};

/**
 * Accesses the Weatherbit API, retrieves alert for area or -1 if no alert.
 *
 * @param {string} zip a zip code identifying a region
 * @returns alert object from api or -1 if no alert
 */
const getAlertFromZip = async zip => {
  const API_KEY = config.API_KEY;
  const resp = await axios.get(`https://api.weatherbit.io/v2.0/alerts?country=US&postal_code=${zip}&key=${API_KEY}`);
  const data = await resp.data;
  const alert = data.alerts[0];

  // return -1 if no alert for zip
  if (typeof alert === 'undefined') {
    return -1;
  } // otherwise return the alert
  return alert;
};

/**
 * Pulls alert object properties from JSON response, pushes into array.
 *
 * @param {object} alertProperties - Object from API, corresponds to response.features.
 */
const getAlertFields = alertProperties => {
  const alertProps = [];
  const event = alertProperties.title;
  const eventParsed = parseEvent(event);
  alertProps.push(eventParsed);
  alertProps.push(alertProperties.severity);
  alertProps.push(alertProperties.description);
  const startTime = alertProperties.onset_local;
  const endTime = alertProperties.expires_local;
  // format date and time nicer
  alertProps.push(formatDateTime(new Date(startTime)));
  alertProps.push(formatDateTime(new Date(endTime)));

  return alertProps;
};

/**
 * Takes a long string containing event title and grabs just the title.
 *
 * @param {string} event - Type of alert, corresponds to reponse.alerts.title .
 * @returns {string} - The title of the event.
 */
const parseEvent = event => {
  const endIndex = event.indexOf('issued');
  return event.substr(0, endIndex - 1);
};

/**
 * Determines if alert should be displayed by checking severity level against severity threshold.
 *
 * @param {string} severityThreshold - One of five levels of severity NWS ranks their alerts.
 * @returns {boolean} If alert if as severe or more severe than threshold returns true, else false.
 */
const isSevereEnough = (severity, severityThreshold) => {
  // default is 1 in case severity doens't come back so alert will display
  let eventSeverityAsNumber;
  switch (severity) {
    case 'Watch':
      eventSeverityAsNumber = 1;
      break;
    case 'Advisory':
      eventSeverityAsNumber = 2;
      break;
    case 'Warning':
      eventSeverityAsNumber = 3;
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
  const minutesFormatted = minutes < 10 ? '00' : minutes; // no single digit minute values

  return `${month}/${day}, ${hoursFormatted}:${minutesFormatted}${ampm}`;
};

exports.processAlert = processAlert;
