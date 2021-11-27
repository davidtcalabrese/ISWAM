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
    this._city = properties.city_name;
    this._state = properties.state_code;
    this._temperature = +((properties.temp * 9) / 5 + 32).toFixed(0);
    this._humidity = properties.rh;
    this._description = properties.weather.description;
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
    weather.setWeatherFields(weatherData);
    weather.displayWeather();
  }


  /**
   * Accesses weather object properties and inserts them into HTML template to display to DOM.
   */
  displayWeather = () => {
    const output = document.querySelector('#weather-output');
  
    const iconPath = getIconFromDescription(this._description);
    const weatherDisplay = `
        <div class="card mt-2 p-2" id="weather-card" style="width: 19rem;">
          <img src="${iconPath}" class="card-img-top" alt="">
          <div class="card-body">
            <h5 class="card-title">${this._city}, ${this._state}</h5>
            <p class="card-text">${this._temperature}°F </p>
            <p class="card-text">${this._humidity}% humidity</p>
            <p class="card-text">${this._description}</p>
          </div>
        </div>
    `;
    
    document.querySelector("#filler").classList.add("d-none");
    output.innerHTML = weatherDisplay;
  };
}