/**
 * A function for sending POST requests via fetch.
 * 
 * @param {string} url - address to which request is being sent.
 * @param {object} data - Object version of what will be the 
 *                        body of the POST request.  
 * @returns 
 */
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST',  
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)  
  });
  return response.json();
} 

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
 * Finds matching icon for current weather.
 * 
 * @param {string} desc - The weather description from API.
 * @returns {string} The path to the correct icon in project/static/images.
 */
 const getIconFromDescription = desc => {
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

  const iconPaths = [];
  iconArray.forEach(item => {
    if (desc === item.Description.toLowerCase()) {
      const icons = item.Icons.split(', ');

      icons.forEach(icon => {
        icon = `${icon}.png`;
        iconPaths.push(icon);
      });
    
    };
  });

  const iconPath = getDayOrNightIcon(iconPaths)

  return iconPath;
}

/**
 *  Checks if a severity threshold level has been saved to session storage.
 *  If it has it returns the value, otherwise returns a 1 for "all levels".
 *
 * @returns {number} Severity level as an integer between 1 and 5.
 */
 const getSeverity = () => {
  const severity = sessionStorage.getItem('severity') || 1;

  return severity;
};

/**
 *  Checks if a color has been saved to session storage. If it has 
 *  it returns the value. Otherwise gets default color (white).
 *
 * @returns {string} String representing a color.
 */
 const getColor = () => {
  const color = sessionStorage.getItem('color') || "FFFFFF";

  return color;
};