const { processAlert, isSevereEnough, getCodeFromCoords, getCoordsFromZip, getAlertFromCode, getAlertFields } = require('../controllers/alertFunctions.js');


const init = async () => {
  const [lat, long] = await getCoordsFromZip("53217");
  console.log(`lat: ${lat}`);
  console.log(`long: ${long}`);
  const code = await getCodeFromCoords("43.1409", "-87.9073");
  console.log(`code: ${code}`);
  const alertData = await getAlertFromCode("PRZ001");
  // const alertData = await getAlertFromCode("WIZ060");
  console.log(`alert: ${alertData}`);
  const alertFields = await getAlertFields(alertData);
  console.log(`alertFields: ${alertFields}`);

  const severity = alertData.properties.severity;
  console.log(`Severity: ${severity}`);

}

init();