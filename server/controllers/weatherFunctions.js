const axios = require('axios');
const config = require('../config.js').config;
const { postDataLCD } = require('../controllers/puckFunctions');

/**
 * Accesses weather data from weatherbit.io API, creates weather object
 * and sets its fields and displays weather summary to DOM.
 *
 * @param {string} zip - The zip code of user.
 */
const processWeather = async zip => {
  const weatherDataRaw = await getWeatherFromZip(zip);

  const weatherProps = await getWeatherFields(weatherDataRaw);
  sendWeatherToPuck(weatherProps); // send to puck

  return weatherProps; // send to browser
};

/**
 * Creates the body of the POST request to the PUCK and then sends it. 
 * 
 * @param {array} props - The values to be included in POST body. 
 */
const sendWeatherToPuck = props => {
  // create body of POST request to PUCK
  const LCDPost = buildPuckPost(props.city, props.state, props.temp, props.humidity, props.description);
  postDataLCD(LCDPost); // send POST request
};

/**
 * Accesses weather data from weatherbit API for zip code.
 *
 * @param {string} zip - A zip code.
 * @returns {Object} - JSON data from API response.
 */
const getWeatherFromZip = async zip => {
  const API_KEY = config.API_KEY;
  const URL = `https://api.weatherbit.io/v2.0/current?postal_code=${zip}&country=US&key=${API_KEY}`;

  const resp = await axios.get(URL);
  const data = await resp.data;

  let weatherData;
  if (data.data !== undefined) {
    weatherData = data.data[0];
  }
  
  return weatherData;
};

/**
 * Creates object of weather properties from JSON response.
 *
 * @param {Object} response - Bulk of NWS API response.
 * @returns {Object} - An object will all relevant weather properties.
 */
const getWeatherFields = response => {
  const tempInF = +((response.temp * 9) / 5 + 32).toFixed(0);
  const weatherProps = {
    description: response.weather.description, 
    city: response.city_name,
    state: response.state_code,
    temp: tempInF, 
    humidity: response.rh
  }
  return weatherProps;
};

/**
 * Creates object to send as body of POST request to the Puck API.
 * Contains the data on current weather to display on LCD.
 *
 * @param {string} city - The city in for weather data.
 * @param {string} state - The state city is in.
 * @param {string} tempInF - The temperature in fahrenheit.
 * @param {string} humidity - The relative humidity in degrees.
 * @param {string} description - A short description of the current weather.
 * @returns {Object} - JSON object which will be body of POST request.
 */
const buildPuckPost = (city, state, tempInF, humidity, description) => {
  const location = `${city}, ${state}`;
  const tempHumidity = `${tempInF}F - ${humidity}% humidity`;
  const summary = `${description}`;

  return `{ 
            "text1": "${location}",
            "text2": "${tempHumidity}",
            "text3": "${summary}",
            "text4": ""
          }
  `;
};

exports.processWeather = processWeather;
