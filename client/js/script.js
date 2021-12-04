/**
 * Initializes app by accessing form fields and passing them to
 * node app through a post request.
 * 
 * It receives back the variables that are interpolated in HTML
 * elements and pushed to DOM.
 *
 * @author David Calabrese <david.thomas.calabrese@gmail.com>
 */
 const init = async () => {
  // get zip from form
  const zip = getZip();
  // check local storage for severity and color options
  const severityThreshold = getSeverity();
  const color = getColor();

  const data = await postData("http://localhost:3300/", 
      {zip: zip, severity: severityThreshold, color: color});
    
  if (data.alertPresent) { // if there's an alert, build alert card and display it
    displayAlert(data.event, data.severity, data.alertDescription, data.start, data.end);
  } else { // otherwise display the green check for 
    displayNoAlert();
  } 
  // display the current weather either way
  displayWeather(data.description, data.city, data.state, data.temp, data.humidity);
};

document.querySelector('#submit').addEventListener('click', init);