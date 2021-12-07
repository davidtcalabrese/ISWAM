/**
 * Takes all of the parameters fetched by API to display weather in DOM.
 * 
 * @param {Object} data - Contains all of the variables to be interpolated into the HTML.
 */
const displayWeather = data => {
  const iconPath = getIconFromDescription(data.description.toLowerCase());
  const weatherDisplay = `
      <h2 class="display-5 text-center small" id="weather-header">Weather</h2>
      <div class="container d-flex align-items-center justify-content-center flex-column">
        <div class="card mt-2 p-2" id="weather-card" style="width: 19rem;">
          <img src="images/${iconPath}" class="card-img-top" alt="">
          <div class="card-body">
            <h5 class="card-title">${data.city}, ${data.state}</h5>
            <p class="card-text">${data.temp}°F </p>
            <p class="card-text">${data.humidity}% humidity</p>
            <p class="card-text">${data.description}</p>
          </div>
        </div>
      </div>
    `;
  document.querySelector('#weather-output').innerHTML = weatherDisplay;
};

/**
 * Accesses alert object properties and inserts them into HTML template to display to DOM.
 * 
 * @param {Object} data - Contains all of the variables to be interpolated into the HTML.
 */
const displayAlert = data => {
  const alertDisplay = `
      <h2 class="display-5 text-center small" id="alert-header">Alerts</h2>
      <div class="container d-flex align-items-center justify-content-center flex-column">
          <div class="card mt-2" id="alert-card"  style="width: 19rem;">
            <img src="./images/alert-icon.png" id="triangle" class="card-img-top" alt="alert">
            <div class="card-body">
              <h5 class="card-title text-danger" id="alert-title" 
                  title="${data.alertDescription}"> ${data.event} <i class="fas fa-mouse-pointer"></i></h5>
              <p class="card-text mb-0">Severity: ${data.severity}</p>
              <p class="card-text mb-0">Starts: ${data.start}</p>
              <p class="card-text">Ends: ${data.end}</p>
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

document.querySelector('#submit').addEventListener('click', getZip);