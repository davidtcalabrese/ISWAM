/**
 * Takes all of the parameters fetched by API to display a a weather in DOM
 * 
 * @param {string} description - short (2-5 words) summary of current weather
 * @param {string} city - city corresponding to zip code
 * @param {string} state - state corresponding to zip code
 * @param {string} temperature - current temperature in zip code in degrees Fahrenheit
 * @param {string} humidity - current relative humidity in zip code as percentage 
 */
 const displayWeather = (description, city, state, temperature, humidity) => {
  const iconPath = getIconFromDescription(description.toLowerCase());
  const weatherDisplay = `
      <h2 class="display-5 text-center small" id="weather-header">Weather</h2>
      <div class="container d-flex align-items-center justify-content-center flex-column">
        <div class="card mt-2 p-2" id="weather-card" style="width: 19rem;">
          <img src="images/${iconPath}" class="card-img-top" alt="">
          <div class="card-body">
            <h5 class="card-title">${city}, ${state}</h5>
            <p class="card-text">${temperature}°F </p>
            <p class="card-text">${humidity}% humidity</p>
            <p class="card-text">${description}</p>
          </div>
        </div>
      </div>
    `;
  document.querySelector('#weather-output').innerHTML = weatherDisplay;
};

/**
 * Accesses alert object properties and inserts them into HTML template to display to DOM.
 * 
 * @param {string} event - type of alert (eg tropical storm, wind advisory, etc) 
 * @param {string} severity - seriousness of event (minor > moderate > extreme > severe)  
 * @param {string} description - details about event 
 * @param {string} starts - time alert takes effect 
 * @param {string} ends - time until alert expires
 */
 const displayAlert = (event, severity, description, starts, ends) => {
  const alertDisplay = `
      <h2 class="display-5 text-center small" id="alert-header">Alerts</h2>
      <div class="container d-flex align-items-center justify-content-center flex-column">
          <div class="card mt-2" id="alert-card"  style="width: 19rem;">
            <img src="./images/alert-icon.png" id="triangle" class="card-img-top" alt="alert">
            <div class="card-body">
              <h5 class="card-title text-danger" id="alert-title" 
                  title="${description}"> ${event} <i class="fas fa-mouse-pointer"></i></h5>
              <p class="card-text mb-0">Severity: ${severity}</p>
              <p class="card-text mb-0">Starts: ${starts}</p>
              <p class="card-text">Ends: ${ends}</p>
            </div>
          </div>
        </div>
      `;
  document.querySelector('#alert-output').innerHTML = alertDisplay;
};

/**
 * Displays an "all good" HTML template element to DOM.
 */
 const displayNoAlert = () => {
  const noAlertDisplay = `
  <h2 class="display-5 text-center small" id="alert-header">No Alerts</h2>
  <div class="container d-flex align-items-center justify-content-center flex-column">
      <div class="card mt-2 d-flex align-items-center justify-content-center flex-column" id="alert-card" style="width: 19rem;">
      <img src="images/checked.png" id="all-good" class="card-img-top" alt="check mark">
        <div class="card-body">
        <h5 class="card-title" id="no-alert-body">No alerts for your area at your selected severity level</h5>
        </div>
      </div>
    </div>
      `;
  document.querySelector('#alert-output').innerHTML = noAlertDisplay;
};

/**
 * Fetches zip from form data and returns.
 *
 * @returns {string} The entered zip code.
 */
const getZip = () => {
  const zip = document.querySelector('#zip').value;

  return zip;
};

document.querySelector("#submit").addEventListener('click', getZip);