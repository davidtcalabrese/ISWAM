const axios = require('axios');

/**
 * A function for sending POST requests to the Puck via axios
 *
 * @param bject} data - Object version of what will be the
 *                        body of the POST request.
 */
const postDataLCD = async data => {
  // Default options are marked with *
  const options = {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'text/plain',
      Connection: 'keep-alive',
    },
  };
  axios.post('http://192.168.1.178/lcd', data, options);
};

/**
 * A function for sending POST requests to the Puck via axios.
 * The /led endpoint controls the behavior of the Puck's LEDs.
 *
 * @param data - Data that will be body of POST request.
 */
const postDataLED = async data => {
  // Default options are marked with *
  const options = {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'text/plain',
      Connection: 'keep-alive',
    },
  };
  axios.post('http://192.168.1.178/led', data, options);
};

exports.postDataLCD = postDataLCD;
exports.postDataLED = postDataLED;
