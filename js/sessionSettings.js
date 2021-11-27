/**
 * Gets the user input for severity on settings page and sets in session storage
 */
 const setSeverity = () => {
  const severity = document.querySelector('#severity').value;

  console.log(`In setSeverity. Severity: ${severity}`);

  sessionStorage.setItem('severity', severity);
};

document.querySelector('#save').addEventListener('click', setSeverity);