/**
 * Class representing a summary of alert data for user's zip code.
 */
class Alert {
  /**
   * Accesses the NWS API, retrieves alert for area or -1 if no alert.
   *
   * @param {string} code a universal geographic code (UGC) identifying a region
   * @returns alert object from api or -1 if no alert
   */
  getAlertFromCode = async code => {
    const URL = `https://api.weather.gov/alerts/active/?status=actual&zone=${code}`;

    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    const response = await fetch(URL, requestOptions).catch(error => console.log('error', error));
    const data = await response.json();
    const alert = data.features[0];

    // return -1 if no alert for UGC
    if (typeof alert === 'undefined') {
      return -1;
    }
    // otherwise return the alert
    return alert;
  };

  /**
   * Sets Alert object properties from JSON response.
   *
   * @param {object} alertProperties - Object from API correspond to response.features.
   */
  setAlertFields = alertProperties => {
    this._event = alertProperties.properties.event;
    this._severity = alertProperties.properties.severity;
    this._description = alertProperties.properties.description;
    const startTime = alertProperties.properties.onset;
    const endTime = alertProperties.properties.ends;
    // format date and time nicer
    this._starts = formatDateTime(new Date(startTime));
    this._ends = formatDateTime(new Date(endTime));
  };

  /**
   * Gets geographic coordinates from a zip code.
   *
   * @param {string} zip - A zip code.
   * @returns {Array} in format [latitude, longitude].
   */
  getCoordsFromZip = async function (zip) {
    const URL = `http://api.zippopotam.us/us/${zip}`;

    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    const response = await fetch(URL, requestOptions).catch(e => {
      console.log(e);
    });

    const data = await response.json();
    const lat = data.places[0].latitude;
    const long = data.places[0].longitude;

    const coords = [];
    coords.push(lat);
    coords.push(long);
    return coords;
  };

  /**
   * Gets universal geographic code (UGC) from coordinates.
   *
   * @param {string or number} lat - the latitude of the user's zip code.
   * @param {string or number} long - the longitude of the user's zip code.
   * @returns {string} a universal geographic code (UGC).
   */
  getCodeFromCoords = async function (lat, long) {
    const URL = `https://api.weather.gov/points/${lat},${long}`;

    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    const response = await fetch(URL, requestOptions).catch(e => console.log(e));

    const data = await response.json();
    const forecastZone = data.properties.forecastZone;
    const code = forecastZone.substr(forecastZone.length - 6);
    return code;
  };

  /**
   * Prepares for alert API call by making some preliminary API calls, exchanging zip
   * code for coordinates and coordinates for a UGC code, then gets alert with code,
   * checks if there is an alert and that the alert's severity surpasses severity threshold
   * set by user, if it does it calls displayAlert to add alert to DOM, otherwise, calls
   * displayNoAlert, which adds thumbs up sign to DOM.
   *
   * @param {string} zip - The zip code of user.
   * @param {string} severityThreshold desired severity threshold (default is all levels).
   */
  processAlert = async (zip, severityThreshold) => {
    const alert = new Alert();

    console.log(`In processAlert. Severity: ${severityThreshold}`);
    // get data needed for requests
    const [lat, long] = await alert.getCoordsFromZip(zip);
    const code = await alert.getCodeFromCoords(lat, long);

    const alertData = await alert.getAlertFromCode(code);
    if (alertData !== -1 && alert.isSevereEnough(severityThreshold)) {
      alert.setAlertFields(alertData);
      alert.displayAlert();
    } else {
      alert.displayNoAlert();
    }
  };

  /**
   * Determines if alert should be displayed by checking severity level against severity threshold.
   *
   * @param {string} severityThreshold - One of five levels of severity NWS ranks their alerts.
   * @returns {boolean} If alert if as severe or more severe than threshold returns true, else false.
   */
  isSevereEnough = severityThreshold => {
    // default is 1 in case severity doens't come back so alert will display
    let eventSeverityAsNumber = 1;

    switch (this._severity) {
      case 'Unknown':
        eventSeverityAsNumber = 1;
        break;
      case 'Minor':
        eventSeverityAsNumber = 2;
        break;
      case 'Moderate':
        eventSeverityAsNumber = 3;
        break;
      case 'Severe':
        eventSeverityAsNumber = 4;
        break;
      case 'Extrene':
        eventSeverityAsNumber = 5;
        break;
      default:
        eventSeverityAsNumber = 1;
    }
    return eventSeverityAsNumber >= severityThreshold;
  };

  /**
   * Accesses alert object properties and inserts them into HTML template to display to DOM.
   */
  displayAlert = () => {
    const alertDisplay = `
    <h2 class="display-5 text-center small" id="alert-header">Alerts</h2>
    <div class="container d-flex align-items-center justify-content-center flex-column">
        <div class="card mt-2" id="alert-card"  style="width: 19rem;">
          <img src="../static/images/alert-icon.png" id="triangle" class="card-img-top" alt="alert">
          <div class="card-body">
            <h5 class="card-title text-danger" id="alert-title" 
                title="${this._description}"> ${this._event} <i class="fas fa-mouse-pointer"></i></h5>
            <p class="card-text mb-0">Severity: ${this._severity}</p>
            <p class="card-text mb-0">Starts: ${this._starts}</p>
            <p class="card-text">Ends: ${this._ends}</p>
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
      <div class="mt-5" id="alert-card"   style="width: 18rem;">
        <img src="../static/images/like.png" id="all-good" class="card-img-top" alt="alert">
        <div class="card-body">
          <h5 class="card-title">No alerts for your area at your selected severity level</h5>
        </div>
      </div>
    `;

    document.querySelector('#alert-output').innerHTML = noAlertDisplay;
  };
}
