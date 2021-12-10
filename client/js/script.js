/**
 ******************************************************************************
 * @file    script.js - Functions for running client side functionality. 
 * @author David Calabrese <david.thomas.calabrese@gmail.com>
 *
 * See https://github.com/davidtcalabrese/ISWAM for full information
 *
 ******************************************************************************
 * @license
 * The MIT License (MIT)
 * Copyright © 2021 Brian Schmalz, David Calabrese
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the “Software”),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 ******************************************************************************
 */

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
  
  const data = await postData('http://localhost:3300/', 
          { zip: zip, severity: severityThreshold, color: color })
          .catch(error => console.log('error', error));

  if (data.alertPresent) {
    // if there's an alert, build alert card and display it
    displayAlert(data);
  } else {
    // otherwise display the green check
    displayNoAlert();
  }
  // display the current weather either way
  displayWeather(data);

}
document.querySelector('#submit').addEventListener('click', init);
