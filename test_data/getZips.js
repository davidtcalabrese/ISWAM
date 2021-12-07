import fetch from 'node-fetch';
import * as fs from 'fs';
import readline from 'readline';
import { config } from './test_config.js';

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
 * @param {string} UGC 
 */
const printZips = async function (UGC) {
  const coords = await getCoordsFromUGC(UGC);
  const zip = await getZipFromCoords(coords);

  if (typeof zip === 'undefined') {
    return;
  }
  if (zip.length !== 5) {
    return;
  } 

  const line = `${zip}\n`;

  fs.appendFile('zips.txt', line, err => {
    if (err) {
      console.log(err);
    } else {
      console.log('line added');
    }
  });
};

/**
 * Prints header row for CSV file single time. Then loops through 
 * UGC array, passing each to printUGCCoordsAndZipAsCSV
 */
const readUGCs = async function () {
  // read in all UGCs line by line
  const fileStream = fs.createReadStream('alert_UGCs.txt');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const UGC of rl) {
    printZips(UGC);
  }
};

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

    const code = alert.properties.geocode.UGC[0] + " \n";

    fs.appendFile('alert_UGCs.txt', code, err => {
      if (err) { console.log(err); } 
      else { console.log('UGC added'); }
    });
  }

  readUGCs();
};

getAllAlerts();

