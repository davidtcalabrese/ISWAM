import fetch from 'node-fetch';
import * as fs from 'fs';

/**
 * Accesses every active NWS alert (on land), parses each into a simplified json format, 
 * and writes to alert_data.txt for test data. 
 */
const getAllAlerts = async function () {
  const URL = `https://api.weather.gov/alerts/active?status=actual&message_type=alert&region_type=land`;
  
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  const response = await fetch(URL, requestOptions).catch(error => console.log('error', error));
  const data = await response.json();
  const alertArray = data.features;

  // grab props: event, severity, description, onset, ends
  for (let alert of alertArray) {
    let alert_data = `
        {
          "properties": {
            "onset": "${alert.properties.onset}",
            "ends": "${alert.properties.ends}",
            "severity": "${alert.properties.severity}",
            "event": "${alert.properties.event}",
            "description": "${alert.properties.description}"
          }
      }
    `;

    const code = alert.properties.geocode.UGC[0] + " \n";

    fs.appendFile('alert_data.txt', alert_data, err => {
      if (err) { console.log(err); } 
      else { console.log('alert added'); }
    });

    fs.appendFile('alert_UGCs.txt', code, err => {
      if (err) { console.log(err); } 
      else { console.log('UGC added'); }
    });
  }
};

getAllAlerts();
