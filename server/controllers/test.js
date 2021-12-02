// const { processAlert, isSevereEnough, getCodeFromCoords, getCoordsFromZip, getAlertFromCode, getAlertFields } = require('../controllers/alertFunctions.js');
const { getWeatherFromZip } = require('../controllers/weatherFunctions.js');
const { processAlert, getAlertFromZip, getAlertFields } = require('../controllers/alertFunctionsNew.js');


const testAlertCalls = async () => {
 /* const [lat, long] = await getCoordsFromZip("53217");
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
  console.log(`Severity: ${severity}`); */

  // const alertData = processAlert("53217", 1); // no alert - works 
  const alertData = processAlert("00802", 1); // alert - doesn't work
  console.log(alertData);

}


const testWeatherCalls = async () => {
  const weatherResponse = await getWeatherFromZip("53217");
  console.log(weatherResponse);
}

const testNewAlertCalls = async () => {
  const alertDataRaw = await getAlertFromZip("13156");
  console.log(alertDataRaw);

  const alertData = await processAlert("13156", 1);
  console.log(alertData);
}

testNewAlertCalls();
// testAlertCalls();
// testWeatherCalls();


