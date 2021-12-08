# ISWAM
## IoT Severe Weather Alert Monitor ⛈️ 🚨 🌪️ 🚨 🌊

ISWAM's purpose is to inform users in real time about current weather conditions as well as any possible alerts. It consists of a full stack node  application that accesses and processes NWS alerts and live weather data, and then broadcasts it to the browser  as well as on an IoT device I'm calling "The Puck". The Puck is an ESP32 microcontroller with integrated  WiFi attached to a small LCD screen and a ring of colorful LEDs. It's enclosed in a 3d-printed plastic case that resembles a hockey puck. 

The front end receives a zip code from the user, sends it to a node application for processing, receives the response and displays it to the page. The node application receives the parameters from the user, and consumes various REST APIs to collect data on current weather conditions as well as any potential safety alerts. It then processes and formats the data, sending the results back to the front end as well as to The Puck which exposes its own API.   
 
### APIs used
* [National Weather Service API ](https://www.weather.gov/documentation/services-web-api)
  * alert from UGC endpoint: /alerts/active/zone/{zoneId}
  * UGC from coordinates endpoint: https://api.weather.gov/points/{lat},{long}
  * Coordinates from UGC endpoint (for testing): https://api.weather.gov/zones/forecast/{UGC}
* [Weatherbit.io API](https://www.weatherbit.io/api)
  * weather from zipcode endpoint: https://api.weatherbit.io/v2.0/current/&postal_code={zip}&country=US
* [Zippopatmus](https://www.zippopotam.us/)
  * Geographic coordinates from zipcode endpoint: http://api.zippopotam.us/us/${zip} 
  * Alert from zip codehttps://api.weatherbit.io/v2.0/alerts?country=US&postal_code={zip}
* [Google Maps Geocoding API](https://developers.google.com/maps/documentation/geocoding/start)
  * Used the reverse geocoding API for testing purposes, zip code from coordinates: https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{long}

### Flowchart
![ISWAM Flowchart](/client/images/flowchart.png)