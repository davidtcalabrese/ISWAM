/**
 * Gets the user input for severity on settings page and sets in session storage
 */
 const setSeverity = () => {
  const severity = document.querySelector('#severity').value;

  sessionStorage.setItem('severity', severity);
};

document.querySelector('#save').addEventListener('click', setSeverity);