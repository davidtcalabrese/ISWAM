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
 * list of UGCs to for which to get zip codes 
 * etAllAlerts.js will print a list of these to a file called alert_UGCs.txt.
 * Each request costs .05 cents so that's why they are not read directly from
 * the file. Just copy over how ever many you want. 
 */
const UGCs = [
  'AKZ226', 
  'AKZ223', 
  'AKZ225', 
  'AKZ224', 
  'MTZ065', 
  'MIZ086', 
  'MNZ003', 
  'WYZ004', 
  'MTZ005', 
  'MTZ008', 
  'MTZ012', 
  'MTZ007', 
  'PRZ008', 
  'PRZ013', 
  'PRZ002', 
  'MTZ001', 
  'MTZ003', 
  'MTZ002', 
  'ALZ051', 
  'MTZ009', 
  'WYZ107', 
  'WYZ101', 
  'WYZ115', 
  'WYZ106', 
  'WYZ116', 
  'WYZ115', 
  'WYZ106', 
  'WYZ116', 
  'NYZ001', 
  'NYZ019', 
  'HIZ001', 
  'HIZ003', 
  'CAZ034', 
  'WYZ010', 
  'WYZ002', 
  'WYZ019', 
  'WYZ015', 
  'WYZ017', 
  'WYZ016', 
  'WYZ010', 
  'AKZ209', 
  'AKZ219', 
  'AKZ207', 
  'WYZ108', 
  'NDZ004', 
  'NDZ001', 
  'MTZ021', 
  'MTZ060', 
  'MTZ018', 
  'MTZ016', 
  'MTZ017', 
  'MTZ059', 
  'MNZ010', 
  'MNZ011', 
  'MNZ001', 
  'MTZ010', 
  'MTZ012', 
  'PRZ005', 
  'PRZ001', 
  'HIZ028', 
  'HIZ022', 
  'HIZ028', 
  'HIZ001', 
  'AKZ207', 
  'AKZ209', 
  'CAZ034', 
  'MTZ009', 
  'MTZ008', 
  'CAZ006', 
  'MTZ016', 
  'MTZ018', 
  'WYZ107', 
  'WYZ106', 
  'WYZ116', 
  'HIZ028', 
  'HIZ028', 
  'AKZ217', 
  'AKZ207',   
] 


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

