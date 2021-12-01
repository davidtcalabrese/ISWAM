import { checkWeatherAndAlerts } from './util.js';
import express from 'express';
import cors from 'cors';
import { Alert } from './Alert.js';
import { Weather } from './Weather.js';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 4000;

app.get('/', (req, res) => {
  res.send("Hi ")
})

app.post('/submit-zip', (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const zip = req.body.zip;
  // checkWeatherAndAlerts(zip);
  console.log(`zip: ${zip}`);
  // res.end(zip);
})


app.listen(PORT, () => {
  console.log(`app listening at http://localhost:${PORT}`);
})