/**
 * Initializes app by accessing form fields and passing them to
 * node app through a post request.
 * 
 * It receives back an object containing all of the variables that 
 * will be interpolated into HTML and pushed to DOM.
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
    displayAlert(data);
  } else { // otherwise display the green check 
    displayNoAlert();
  } 
  // display the current weather either way
  displayWeather(data);
};

document.querySelector('#submit').addEventListener('click', init);