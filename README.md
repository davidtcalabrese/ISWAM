# ISWAM
## IoT Severe Weather Alert Monitor

This app communicates with a few different APIs to access weather and emergency notifications from the NWS. 

ISWAM consists of two parts, a JavaScript SPA that takes in a zip code and some optional parameters from a user, then consumes a few REST APIs for information about the current weather and any possible alerts. This information is parsed, formatted and displayed in a browser back to the user. The other component is a ESP32 microcontroller which exposes its own REST API to receive POST requests from the SPA to display the same information on an LCD screen and, in the case of alerts, as a signal to a ring of connected LEDs. 

## APIs used
* [National Weather Service API ](https://www.weather.gov/documentation/services-web-api)
  * alert from UGC endpoint: /alerts/active/zone/{zoneId}
  * UGC from coordinates endpoint: https://api.weather.gov/points/{lat},{long}
* [Weatherbit.io API](https://www.weatherbit.io/api)
  * weather from zipcode endpoint: https://api.weatherbit.io/v2.0/current/&postal_code={zip}&country=US
* [Zippopatmus](https://www.zippopotam.us/)
  * Geographic coordinates from zipcode endpoint: http://api.zippopotam.us/us/${zip}

## Hardware used
