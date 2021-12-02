const { processAlert, isSevereEnough, getCodeFromCoords, getCoordsFromZip, getAlertFromCode, getAlertFields } = require('../controllers/alertFunctions.js');


const init = async () => {
  // const [lat, long] = await getCoordsFromZip("53217");
  // console.log(`lat: ${lat}`);
  // console.log(`long: ${long}`);
  // const code = await getCodeFromCoords("43.1409", "-87.9073");
  // console.log(`code: ${code}`);
  // const alertData = await getAlertFromCode("PRZ001");
  // // const alertData = await getAlertFromCode("WIZ060");
  // console.log(`alert: ${alertData}`);
  // const alertFields = await getAlertFields(alertData);
  // console.log(`alertFields: ${alertFields}`);

  // const severity = alertData.properties.severity;
  // console.log(`Severity: ${severity}`);

  // if (alertData == -1  || !(isSevereEnough(severity, 1))) {
  //   console.log("either alertData == -1 or severity threshold has not been passed");
  // } else {
  //   console.log("alert Data is not -1 and severity exceeds threshold");
  // }
  // console.log(`isSevereEnough('Moderate', '1'): ${isSevereEnough('Moderate', '1')}`);

  // console.log(`alertData == -1: ${alertData == -1}`);



  const alert = await processAlert("00850", "1");
  // const alert = await processAlert("53217", "1");
  console.log(alert);

}

init();