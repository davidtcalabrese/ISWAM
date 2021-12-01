import { Alert } from './Alert.js';
import { Weather } from './Weather.js';

/**
 * Initializes the XHR process for alert and weather data.
 *
 * @param {string} zip zip code fetched from form.
 * @param {string} severity severity level fetched from form.
 */
 const checkWeatherAndAlerts = async function (zip, severity) {
  const weather = new Weather();
  const alert = new Alert();
  const weatherData = weather.processWeather(zip);
  const alertData = alert.processAlert(zip, severity);

  const dataArray = [];
  dataArray.push(weatherData);
  dataArray.push(alertData);

  return dataArray;
};

/**
 * Formats a date time object.
 *
 * @param {Datetime} datetime - A datetime object.
 * @returns {string} formatted with date and time as MM/dd, hh:mm am/pm.
 */
 const formatDateTime = datetime => {
  const day = datetime.getDate();
  const month = datetime.getMonth() + 1;
  const hours24 = datetime.getHours();
  const minutes = datetime.getMinutes();

  const ampm = hours24 >= 12 ? 'pm' : 'am';
  const hours12 = hours24 % 12;
  const hoursFormatted = hours12 ? hours12 : 12; // if hours evaluates to 0 it should be 12
  const minutesFormatted = minutes === 0 ? '00' : minutes; // no single digit minute values

  return `${month}/${day}, ${hoursFormatted}:${minutesFormatted}${ampm}`;
};

/**
 * For each type of weather code there are two icons available, one for the day and one for night.
 * This function determines the current time and returns the day icon if its between 6AM and 6PM,
 * otherwise it returns the night icon.
 *
 * @param {array} iconArray - An array of icon descriptions, codes and png name.
 * @returns {string} A path to weather icon which should be displayed.
 */
const getDayOrNightIcon = iconArray => {
  const now = new Date();
  const hour = now.getHours();
  if (hour <= 17 && hour >= 6) {
    return iconArray[0];
  } else {
    return iconArray[1];
  }
};

/**
 * Each object in this array corresponds to one of 32 possible weather events
 * that could be returned from weatherbit API. Each event has two corresponding 
 * icons, one for day and one for night.
 */
 const iconArray = [
  {
    Code: 200,
    Description: 'Thunderstorm with light rain',
    Icons: 't01d, t01n',
  },
  {
    Code: 201,
    Description: 'Thunderstorm with rain',
    Icons: 't02d, t02n',
  },
  {
    Code: 202,
    Description: 'Thunderstorm with heavy rain',
    Icons: 't03d, t03n',
  },
  {
    Code: 230,
    Description: 'Thunderstorm with light drizzle',
    Icons: 't04d, t04n',
  },
  {
    Code: 231,
    Description: 'Thunderstorm with drizzle',
    Icons: 't04d, t04n',
  },
  {
    Code: 232,
    Description: 'Thunderstorm with heavy drizzle',
    Icons: 't04d, t04n',
  },
  {
    Code: 233,
    Description: 'Thunderstorm with Hail',
    Icons: 't05d, t05n',
  },
  {
    Code: 300,
    Description: 'Light Drizzle',
    Icons: 'd01d, d01n',
  },
  {
    Code: 301,
    Description: 'Drizzle',
    Icons: 'd02d, d02n',
  },
  {
    Code: 302,
    Description: 'Heavy Drizzle',
    Icons: 'd03d, d03n',
  },
  {
    Code: 500,
    Description: 'Light Rain',
    Icons: 'r01d, r01n',
  },
  {
    Code: 501,
    Description: 'Moderate Rain',
    Icons: 'r02d, r02n',
  },
  {
    Code: 502,
    Description: 'Heavy Rain',
    Icons: 'r03d, r03n',
  },
  {
    Code: 511,
    Description: 'Freezing rain',
    Icons: 'f01d, f01n',
  },
  {
    Code: 520,
    Description: 'Light shower rain',
    Icons: 'r04d, r04n',
  },
  {
    Code: 521,
    Description: 'Shower rain',
    Icons: 'r05d, r05n',
  },
  {
    Code: 522,
    Description: 'Heavy shower rain',
    Icons: 'r06d, r06n',
  },
  {
    Code: 600,
    Description: 'Light snow',
    Icons: 's01d, s01n',
  },
  {
    Code: 601,
    Description: 'Snow',
    Icons: 's02d, s02n',
  },
  {
    Code: 602,
    Description: 'Heavy Snow',
    Icons: 's03d, s03n',
  },
  {
    Code: 610,
    Description: 'Mix snow/rain',
    Icons: 's04d, s04n',
  },
  {
    Code: 611,
    Description: 'Sleet',
    Icons: 's05d, s05n',
  },
  {
    Code: 612,
    Description: 'Heavy sleet',
    Icons: 's05d, s05n',
  },
  {
    Code: 621,
    Description: 'Snow shower',
    Icons: 's01d, s01n',
  },
  {
    Code: 622,
    Description: 'Heavy snow shower',
    Icons: 's02d, s02n',
  },
  {
    Code: 623,
    Description: 'Flurries',
    Icons: 's06d, s06n',
  },
  {
    Code: 700,
    Description: 'Mist',
    Icons: 'a01d, a01n',
  },
  {
    Code: 711,
    Description: 'Smoke',
    Icons: 'a02d, a02n',
  },
  {
    Code: 721,
    Description: 'Haze',
    Icons: 'a03d, a03n',
  },
  {
    Code: 731,
    Description: 'Sand/dust',
    Icons: 'a04d, a04n',
  },
  {
    Code: 741,
    Description: 'Fog',
    Icons: 'a05d, a05n',
  },
  {
    Code: 751,
    Description: 'Freezing Fog',
    Icons: 'a06d, a06n',
  },
  {
    Code: 800,
    Description: 'Clear sky',
    Icons: 'c01d, c01n',
  },
  {
    Code: 801,
    Description: 'Few clouds',
    Icons: 'c02d, c02n',
  },
  {
    Code: 802,
    Description: 'Scattered clouds',
    Icons: 'c02d, c02n',
  },
  {
    Code: 803,
    Description: 'Broken clouds',
    Icons: 'c03d, c03n',
  },
  {
    Code: 804,
    Description: 'Overcast clouds',
    Icons: 'c04d, c04n',
  },
  {
    Code: 900,
    Description: 'Unknown Precipitation',
    Icons: 'u00d, u00n',
  },
];

/**
 * Finds matching icon for current weather.
 * 
 * @param {string} desc - The weather description from API.
 * @returns {string} The path to the correct icon in project/static/images.
 */
const getIconFromDescription = desc => {
  const iconPaths = [];
  iconArray.forEach(item => {
    if (desc === item.Description.toLowerCase()) {
      const icons = item.Icons.split(', ');

      icons.forEach(icon => {
        icon = `../static/images/${icon}.png`;
        iconPaths.push(icon);
      });
    
    };
  });

  const iconPath = getDayOrNightIcon(iconPaths)

  return iconPath;
}


export { checkWeatherAndAlerts, formatDateTime, getIconFromDescription }