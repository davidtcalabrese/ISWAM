/**
 * Gets the user input for severity on settings page and sets in session storage
 */
 const setSeverity = () => {
  const severity = document.querySelector('#severity').value;

  sessionStorage.setItem('severity', severity);
};

/**
 * Gets the user input for severity on settings page and sets in session storage
 */
 const setLightColor = () => {
  const color = document.querySelector('#light-color').value;

  sessionStorage.setItem('color', color);
};

document.querySelector('#save').addEventListener('click', setSeverity);
document.querySelector('#light-color').addEventListener('click', setLightColor);