/**
 * Gets the user input for severity and color on settings page
 * and sets or resets these variables in session storage.
 */
 const updateUserSettings = () => {
  const severity = document.querySelector('#severity').value;
  const color = document.querySelector('#light-color').value;
  const interval = document.querySelector('input[name="interval"]:checked').value;

  sessionStorage.setItem('severity', severity);
  sessionStorage.setItem('color', color);
  sessionStorage.setItem('interval', interval);

  const confirmationMsg = `
      <div class="col">
        <p class="text-center text-success">Your settings have been saved.</p>
      </div>
    `;

  document.querySelector('#confirmation').innerHTML = confirmationMsg;
};

document.querySelector('#save').addEventListener('click', updateUserSettings);