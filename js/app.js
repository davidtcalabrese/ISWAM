'use strict';

/**
 * Initializes app by accessing form fields and passing them to checkWeatherAndAlerts.
 * 
 * @author David Calabrese <david.thomas.calabrese@gmail.com>
 */
const init = async function () {
  const zip = getZip();
  checkWeatherAndAlerts(zip, 1);
};
