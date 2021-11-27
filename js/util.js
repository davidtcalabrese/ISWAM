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
  const month = datetime.getMonth();
  const hours24 = datetime.getHours();
  const minutes = datetime.getMinutes();

  const ampm = hours24 >= 12 ? 'pm' : 'am';
  const hours12 = hours24 % 12;
  const hoursFormatted = hours12 ? hours12 : 12; // if hours evaluates to 0 it should be 12
  const minutesFormatted = minutes === 0 ? '00' : minutes; // no single digit minute values

  return `${month}/${day}, ${hoursFormatted}:${minutesFormatted}${ampm}`;
};

/**
 * For each type of weather code there are two icons available, one for the day and one for night.
 * This function determines the current time and returns the day icon if its between 6AM and 6PM,
 * otherwise it returns the night icon.
 *
 * @param {array} iconArray - An array of icon descriptions, codes and png name.
 * @returns {string} A path to weather icon which should be displayed.
 */
const getDayOrNightIcon = iconArray => {
  const now = new Date();
  const hour = now.getHours();
  if (hour <= 17 && hour >= 6) {
    return iconArray[0];
  } else {
    return iconArray[1];
  }
};


const getSeverity = () => {
  const severity = sessionStorage.getItem('severity') || 1;

  console.log(`In getSeverity. Severity: ${severity}`);

  return severity;
};

/**
 * Fetches form data and returns as array.
 *
 * @returns {string} The entered zip code.
 */
const getZip = () => {
  const zip = document.querySelector('#zip').value;

  return zip;
};

/**
 * Initializes the XHR process for alert and weather data.
 *
 * @param {string} zip zip code fetched from form.
 * @param {string} severity severity level fetched from form.
 */
const checkWeatherAndAlerts = async function (zip, severity) {
  const weather = new Weather();
  const alert = new Alert();
  weather.processWeather(zip);
  alert.processAlert(zip, severity);
};

document.querySelector('#submit').addEventListener('click', init);
