import fetch from 'node-fetch';
import * as fs from 'fs';
import { config } from './test_config.js';


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
 * list of UGCs to for which to get zip codes 
 * etAllAlerts.js will print a list of these to a file called alert_UGCs.txt.
 * Each request costs .05 cents so that's why they are not read directly from
 * the file. Just copy over how ever many you want. 
 */
const UGCs = [
  'PRZ010', 
  'VIZ001', 
  'VIZ002',   
];

/**
 * Takes in a UGC, calls API to get coordinates, passes those coordinates
 * to another API to get zip code. Prints out all three to a file called
 * UGC_coords_zip_CSV.txt.
 * 
 * @param {string} UGC 
 */
const printUGCCoordsAndZipAsCSV = async function (UGC) {
  const coords = await getCoordsFromUGC(UGC);
  const zip = await getZipFromCoords(coords);

  const line = `${UGC}\t${coords}\t${zip}\n`;

  fs.appendFile('UGC_coords_zip_CSV.txt', line, err => {
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
const printCSVPrep = async function () {
  const header = "UGC\tCoordinates\tZip \n";

  fs.appendFile('UGC_coords_zip_CSV.txt', header, err => {
    if (err) {
      console.log(err);
    } else {
      console.log('Header row added.');
    }
  });

  UGCs.forEach(UGC => {
    printUGCCoordsAndZipAsCSV(UGC);
  });
};

printCSVPrep();

