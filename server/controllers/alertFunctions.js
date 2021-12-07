const axios = require('axios');
const config = require('../config.js').config;
const { postDataLCD, postDataLED } = require('./puckFunctions');

/**
 * Checks if there is an alert for entered zip code and that the alert's severity 
 * surpasses severity threshold set by user, if it does it calls displayAlert to 
 * add alert to DOM, otherwise, calls displayNoAlert, which adds thumbs up sign to DOM.
 *
 * @param {string} zip - The zip code of user.
 * @param {string} severityThreshold - Desired severity threshold (default is all levels).
 * @param {string} color - Color of alert lights (default white).
 * @returns {Object} - Contains the alert values to send back to user.  
 */
const processAlert = async (zip, severityThreshold, color) => {
  // get json data needed from API
  const alertData = await getAlertFromZip(zip);

  if (!alertShouldBeDisplayed(alertData, severityThreshold)) {
    return -1;
  }
  // get desired values from JSON response
  const data = getAlertFields(alertData);
  sendAlertToPuck(data, color);

  return data;  // to be sent back to browser to render
};

/**
 * Prepares and sends two different POST requests to Puck. 
 * One controls the LEDs and the other controls the LCD.
 * 
 * @param {Array} data - Contains fields of alert values. 
 * @param {string} color - Desired color of alert LEDs.
 */
const sendAlertToPuck = (data, color) => {
  const secondsToDispayAlert = 5;
  const [red, green, blue] = parseColor(color);
  const LEDPost = buildLEDPost(red, green, blue, data.severity);
  const LCDPost = buildLCDPost(data);
  postDataLCD(LCDPost); // send data to Puck's LCD
  postDataLED(LEDPost); // send data to Puck's LEDs
  setTimeout(clearLEDs, secondsToDispayAlert * 1000); // clear LEDs 
}

/**
 * Returns true if an alert should be displayed. 
 * Must meet two conditions:
 *   - alert is active for area, and
 *   - alert severity is equal to or exceeds severity set by user.
 * @param {string} alertData - The JSON response containing alert data. 
 * @param {string} severityThreshold -  Desired severity threshold.
 * @returns {boolean} - If alert should be displayed, true, else false. 
 */
const alertShouldBeDisplayed = (alertData, severityThreshold) => {
  if (alertData == -1) { // check if there's an alert
    return false;
  }
  const alertSeverity = alertData.severity;
  if (!isSevereEnough(alertSeverity, severityThreshold)) {
    return false; // make sure its severe enough
  }

  return true;
}

/**
 * Creates an object that will become the POST request sent to the Puck's LEDs.
 * 
 * @param {string} red - The value of red color component.
 * @param {string} green - The value of green color component.
 * @param {string} blue - The value of blue color component.
 * @returns {Object} which will be sent to Puck as body of POST request.
 */
const buildLEDPost = (red, green, blue, severity) => {
  const [effect, onTime, offTime] = getEffect(severity);
  
  return `{ 
    "red": ${red},
    "green": ${green},
    "blue": ${blue},
    "blink": ${effect},
    "onTime":  ${onTime},
    "offTime": ${offTime}
  }
`;
}

/**
 * The behavior of the Puck's LEDs depends upon severity of the alert. This 
 * function takes in the severity and returns the appropriate values to send 
 * to the Puck's /led endpoint. 
 * 
 * @param {string} severity - The severity level of the alert. In level of
 *                            increasing severity: Watch, Advisory, Warning. 
 * @returns {Array} - The effect, onTime and offTime values for the body of 
 *                    the request to the Puck. 
 */
const getEffect = severity => {
  let effectArgs;
  switch (severity) {
    case 'Watch':
      effectArgs = [0, 0, 0];
      break;
    case 'Advisory':
      effectArgs = [1, 1000, 1000];
      break;
    case 'Warning':
      effectArgs = [1, 150, 150];
      break;
    default:
      effectArgs = [0, 0, 0];
  }

  return effectArgs;
}

/**
 * Turns off lights by sending POST to Puck resetting LEDs. 
 */
const clearLEDs = () => {
  const body = `
        { 
          "red": 0,
          "green": 0,
          "blue": 0,
          "effect":0,
          "onTime": 0,
          "offTime": 0
        }
  `;

  postDataLED(body);
}

/**
 * Creates an object out of data retrieved from API that will 
 * become the POST request sent to the Puck's LCD screen.
 * alertMsg string limited to 19 characters becaues that's all 
 * that will fit on Puck LCD.
 *
 * @param {string} event - name of alert.
 * @param {string} start - time alert takes effect.
 * @param {string} end -  time to which alert is in effect.
 * @returns {object} - An object to be sent to Puck as body of POST request.
 */
 const buildLCDPost = data => {
  const alertMsg = `${(data.event).substring(0, 19)}`;
  const startString = `Starts: ${data.start}`;
  const endString = `Ends: ${data.end}`;

  return `{ 
    "text1": "${alertMsg}",
    "text2": "${startString}",
    "text3": "${endString}",
    "text4": ""
  }
`;
};

/**
 * Takes three comma-separated numbers representing the rgb color
 * values and returns an array of individual colors.
 *
 * @param {string} color - Three RGB decimal values (0-255) for alert LED color.
 */
const parseColor = color => {
  const colorArr = color.split(',');

  return colorArr;
};

/**
 * Accesses the Weatherbit API, retrieves alert for area or -1 if no alert.
 *
 * @param {string} zip - A zip code identifying a region.
 * @returns {Object} - Alert object from api or -1 if no alert.
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
 * Creates object out of alert properties from JSON response.
 *
 * @param {object} alertProperties - JSON from API, corresponds to response.features.
 */
const getAlertFields = alertProperties => {
  const startTime = formatDateTime(new Date(alertProperties.onset_local));
  const endTime = formatDateTime(new Date(alertProperties.ends_local));
  const eventParsed = parseEvent(alertProperties.title);
  const props = {
    event: eventParsed,
    start: startTime, 
    end: endTime,
    alertDescription: alertProperties.description,
    severity: alertProperties.severity
  }

 return props;
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
