/**
 * Class representing a summary of current weather data for user's zip code.
 */
class Weather {
  /**
  * Accesses weather data from weatherbit API for zip code.
  * 
  * @param {string} zip - A zip code.
  */
  getWeatherFromZip = async zip => {
    const API_KEY = config.API_KEY;
    const URL = `https://api.weatherbit.io/v2.0/current?postal_code=${zip}&country=US&key=${API_KEY}`;
  
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };
  
    const response = await fetch(URL, requestOptions).catch(error => console.log('error', error));
    const data = await response.json();
    const weatherData = data.data[0];

    return weatherData;
  }

  /**
   * Sets Weather object properties from JSON response.
   * 
   * @param {object} properties - Corresponds to response.data. 
   */
  setWeatherFields = properties => {
    const propArr = [];
    propArr.push(properties.weather.description);
    propArr.push(properties.city_name);
    propArr.push(properties.state_code);
    propArr.push(+((properties.temp * 9) / 5 + 32).toFixed(0));
    propArr.push(properties.rh);

    return propArr;
  }

  /**
   * Accesses weather data from weatherbit.io API, creates weather object
   * and sets its fields and displays weather summary to DOM.
   * 
   * @param {string} zip - The zip code of user. 
   */
  processWeather = async zip => {
    const weather = new Weather();
    const weatherData = await weather.getWeatherFromZip(zip);

    const [description, city, state, temp, rh] = weather.setWeatherFields(weatherData);

    displayWeather(description, city, state, temp, rh);
  }
}