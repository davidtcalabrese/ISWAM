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

  const weatherData = await getWeatherFields(weatherDataRaw);
  sendWeatherToPuck(weatherData); // send to puck

  return weatherData; // send to browser
};

/**
 * Creates the body of the POST request to the PUCK and then sends it. 
 * 
 * @param {array} weatherData - The values to be included in POST body. 
 */
const sendWeatherToPuck = weatherData => {
  // create body of POST request to PUCK, format is [desc, city, state, temp, rh]
  const LCDPost = buildPuckPost(weatherData[1], weatherData[2], weatherData[3], weatherData[4], weatherData[0]);
  postDataLCD(LCDPost); // send POST request
};

/**
 * Accesses weather data from weatherbit API for zip code.
 *
 * @param {string} zip - A zip code.
 */
const getWeatherFromZip = async zip => {
  const API_KEY = config.API_KEY;
  const URL = `https://api.weatherbit.io/v2.0/current?postal_code=${zip}&country=US&key=${API_KEY}`;

  const resp = await axios.get(URL);
  const data = await resp.data;
  const weatherData = data.data[0];

  return weatherData;
};

/**
 * Sets Weather object properties from JSON response.
 *
 * @param {object} properties - Corresponds to response.data.
 */
const getWeatherFields = properties => {
  const propArr = [];
  propArr.push(properties.weather.description);
  propArr.push(properties.city_name);
  propArr.push(properties.state_code);
  propArr.push(+((properties.temp * 9) / 5 + 32).toFixed(0)); // conver to deg F
  propArr.push(properties.rh);

  return propArr;
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
 * @returns
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
