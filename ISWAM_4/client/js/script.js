/**
 * Initializes app by accessing form fields and passing them to checkWeatherAndAlerts.
 *
 * @author David Calabrese <david.thomas.calabrese@gmail.com>
 */
 const init = async () => {
  const zip = getZip();

  const data = await postData("http://localhost:3300/", {zip: zip, severity: 1});
  if (data.length === 5) { // No alert for zip code
    var [description, city, state, temp, humidity] = data;
    displayNoAlert();
  } else {
    var [event, severity, desc, starts, ends, description, city, state, temp, humidity] = data;
    displayAlert(event, severity, desc, starts, ends);
  }
  displayWeather(description, city, state, temp, humidity);
};

document.querySelector('#submit').addEventListener('click', init);