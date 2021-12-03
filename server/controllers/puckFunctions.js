const axios = require('axios');

/**
 * A function for sending POST requests to the Puck via axios
 * 
 * @param {object} data - Object version of what will be the 
 *                        body of the POST request.  
 */
 const postDataLCD = async data => {
  // Default options are marked with *
  const options = {
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'text/plain',
      'Connection': 'keep-alive'
    }
  };
  axios.post('http://192.168.1.178/lcd', data, options);
} 

exports.postDataLCD = postDataLCD;