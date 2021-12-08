import fetch from 'node-fetch';
import * as fs from 'fs';
import axios from 'axios';

import { config } from './test_config.js';

let zipHasNoAlert = 0;
let zipIsUndefined = 0;
let totalAlerts = 0;
let totalZips = 0;

const printStats = () => {
  console.log('-------- Stats --------');
  console.log(`Undefined Zips: ${zipIsUndefined}`);
  console.log(`Zips with no alert: ${zipHasNoAlert}`);
  console.log(`Total alerts: ${totalAlerts}`);
  console.log(`Total zips: ${totalZips}`);
}

/**
 * This file contains functions for getting every zip code for
 * which there is an active alert.
 *
 * Run `node getZips` to get a list of zips written to text file.
 */

/**
 * Given a Universal Geographic Code (UGC), returns geographic coordinates.
 *
 * @param {string} UGC
 * @returns {string} geographic coordinates in format lat,long
 */
const getCoordsFromUGC = async function (UGC) {
  const URL = `https://api.weather.gov/zones/forecast/${UGC}`;

  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  const response = await fetch(URL, requestOptions).catch(error => console.log('error', error));
  const data = await response.json();
  let long, lat;

  if (typeof data.geometry === 'undefined') {
    return;
  }

  if (data.geometry.type == 'MultiPolygon') {
    [long, lat] = data.geometry.coordinates[0][0][0];
  } else {
    [long, lat] = data.geometry.coordinates[0][0];
  }

  const coords = lat.toFixed(5) + ',' + long.toFixed(5);

  return coords;
};

/**
 * Given a pair of geographic coordinates, returns a 5 digit zip code.
 *
 * @param {string} coords - geographic coordinates in format lat,long
 * @returns {string} a five digit zip vode
 */
const getZipFromCoords = async function (coords) {
  const API_KEY = config.GOOGLE_API_KEY;
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords}&key=${API_KEY}`;

  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  const response = await fetch(URL, requestOptions).catch(error => console.log('error', error));
  const data = await response.json();

  if (typeof data.results[0] === 'undefined') {
    return;
  }

  const address_components = data.results[0].address_components;
  for (const component of address_components) {
    if (component.types[0] === 'postal_code') {
      return component.long_name;
    }
  }

  // some UGCs do not have zip codes such as uninhabited islands
  return 'none';
};

/**
 * Takes in a UGC, calls API to get coordinates, passes those coordinates
 * to another API to get zip code. Prints zip codes to file named zips.txt.
 *
 * @param {array} arr - An array to write to file.
 */
const writeArrToFile = arr => {
  const writeStream = fs.createWriteStream('zips.txt');

  arr.forEach(item => writeStream.write(item + '\n'));
};

/**
 * Accesses the Weatherbit API, retrieves alert for area or -1 if no alert.
 *
 * @param {string} zip - A zip code identifying a region.
 * @returns {Object} - Alert object from api or -1 if no alert.
 */
const zipHasAlert = async zip => {
  const API_KEY = config.API_KEY;
  const resp = await axios.get(`https://api.weatherbit.io/v2.0/alerts?country=US&postal_code=${zip}&key=${API_KEY}`);
  const data = await resp.data;
  if (typeof data.alerts === 'undefined') {
    return false;
  }
  const alert = data.alerts[0];

  // return -1 if no alert for zip
  if (typeof alert === 'undefined') {
    return false;
  } // otherwise return the alert
  return true;
};

const callApis = async function (UGC) {
  const coords = await getCoordsFromUGC(UGC);
  const zip = await getZipFromCoords(coords);

  if (typeof zip === 'undefined') {
    zipIsUndefined++;
    return;
  }
  if (zip.length !== 5) {
    zipIsUndefined++;
    return;
  }
  if (!zipHasAlert(zip)) {
    zipHasNoAlert++;
    return;
  }
  return zip;
}

/**
 * 
 * @param {array} ugcArr - An array of Univeral Geographic Codes (UGCs)
 *                         in which an alert is presently active 
 */
const getZipArrFromUgcArr = async ugcArr => {
  const zips = [];
  for (const UGC of ugcArr) {
    const zip = await callApis(UGC);
    zips.push(zip);
  }
  console.log('array of zips');
  console.log('  |');
  console.log('  V');
  const uniqueZips = filterDuplicates(zips);
  console.log('array of unique zips');
  console.log('  |');
  console.log('  V');
  return uniqueZips;
}

const getAlertsArr = async () => {
  const URL = `https://api.weather.gov/alerts/active?status=actual&message_type=alert&region_type=land`;

  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  const response = await fetch(URL, requestOptions).catch(error => console.log('error', error));
  const data = await response.json();
  const alertArray = data.features;

  const alertUGCs = [];

  // grab props: event, severity, description, onset, ends
  for (let alert of alertArray) {
    const UGC = alert.properties.geocode.UGC[0];

    alertUGCs.push(UGC);
  }

  return alertUGCs;
}

/**
 * Removes duplicates from array. 
 * 
 * @param {array} zipArr - Array of zip codes (with duplilcates) 
 * @returns {array} - Array of zip codes (no duplilcates)
 */
const filterDuplicates = zipArr => [...new Set(zipArr)];

/**
 * Accesses every active NWS alert (on land), parses each into a simplified json format,
 * and writes to alert_data.txt for test data.
 */
const init = async function () {
  const ugcArr = await getAlertsArr();
  totalAlerts = ugcArr.length;
  console.log('array of UGCs');
  console.log('  |');
  console.log('  V');
  const zipArr = await getZipArrFromUgcArr(ugcArr);
  totalZips = zipArr.length;
  writeArrToFile(zipArr);
  printStats();
};



init();

// tests
// ---------- printStats ----------- 

// ---------- writeArrToFile -----------
const writeArrToFileShould = () => {
  const zipArr = [
    undefined, '97041',
    '36456',   '98261',
    '98363',   '70753',
    '81055',   '98262',
    '93535',   '91381',
    '97523',   '55604'
  ];
  
  writeArrToFile(zipArr);
}
// ---------- callApis -----------

// ---------- zipHasAlert -----------

// ---------- getZipArrFromUgcArr -----------
const getZipArrFromUgcArrShould = async () => {
  const ugcArr = ['WVC039', 'FLC091', 'ORZ011', 'AKZ025', 'ALZ056', 'AKZ213',
        'WAZ001', 'WAZ513', 'WAZ567', 'LAZ034', 'COZ074', 'WAZ503',
        'CAZ059', 'CAZ054', 'CAZ523', 'CAZ102', 'NVZ036', 'MNZ021'];

const zipArr = await getZipArrFromUgcArr(ugcArr);

console.log(zipArr);
}

// ---------- getAlertsArr -----------
const getAlertsArrShould = async () => {
  const alertArr = await getAlertsArr();
  console.log(alertArr);
}

// ---------- init -----------

// getZipArrFromUgcArrShould()
// writeArrToFileShould();