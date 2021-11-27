class UI {
  /**
   * Accesses weather object properties and inserts them into HTML template to display to DOM.
   */
  displayWeather = (description, city, state, temperature, humidity, description) => {
    const iconPath = getIconFromDescription(description);
    const weatherDisplay = `
      <h2 class="display-5 text-center small" id="weather-header">Weather</h2>
      <div class="container d-flex align-items-center justify-content-center flex-column">
        <div class="card mt-2 p-2" id="weather-card" style="width: 19rem;">
          <img src="${iconPath}" class="card-img-top" alt="">
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
   */
  displayAlert = (description, event, severity, starts, ends) => {
    const alertDisplay = `
      <h2 class="display-5 text-center small" id="alert-header">Alerts</h2>
      <div class="container d-flex align-items-center justify-content-center flex-column">
          <div class="card mt-2" id="alert-card"  style="width: 19rem;">
            <img src="../static/images/alert-icon.png" id="triangle" class="card-img-top" alt="alert">
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
  displayNoAlert = () => {
    const noAlertDisplay = `
        <div class="mt-5" id="alert-card"   style="width: 19rem;">
          <img src="../static/images/like.png" id="all-good" class="card-img-top" alt="alert">
          <div class="card-body">
            <h5 class="card-title">No alerts for your area at your selected severity level</h5>
          </div>
        </div>
      `;

    document.querySelector('#alert-output').innerHTML = noAlertDisplay;
  };

  /**
   * Gets the user input for severity and color on settings page
   * and sets or resets these variables in session storage.
   */
  updateUserSettings = () => {
    const severity = document.querySelector('#severity').value;
    const color = document.querySelector('#light-color').value;

    sessionStorage.setItem('severity', severity);
    sessionStorage.setItem('color', color);

    const confirmationMsg = `
      <div class="col">
        <p class="text-center text-success">Your settings have been saved.</p>
      </div>
    `;

    document.querySelector('#confirmation').innerHTML = confirmationMsg;
  };

  /**
   * Fetches zip from form data and returns.
   *
   * @returns {string} The entered zip code.
   */
  getZip = () => {
    const zip = document.querySelector('#zip').value;

    return zip;
  };
}

document.querySelector('#save').addEventListener('click', updateUserSettings);
document.querySelector('#submit').addEventListener('click', init);