#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <FreeRTOS.h>

#include <Adafruit_BME280.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_NeoPixel.h>

#include <TFT_eSPI.h> // Graphics and font library for ST7735 driver chip
#include <SPI.h>

#include "a02d_smoke_64.h"

const char *SSID = "SchmalzHaus-KickAss";
const char *PWD = "bac4bac4ac";

#define NUM_OF_LEDS 16
#define PIN 27

#define LEDEffectSolid      0 // no effect (solid colors)
#define LEDEffectBlink      1 // blinking (all LEDs do same thing)
#define LEDEffectSwirl      3 // swirl (circular dimming effect)

// Holds the global state of the current LED effect.
uint8_t LEDEffect = LEDEffectSolid;

// Global variables for LED effects. Used in runLEDEffects()
uint32_t LEDBlinkTimer;
uint32_t LEDBlinkOnReloadMS;
uint32_t LEDBlinkOffReloadMS;
uint8_t LEDBlinkState;
uint8_t LEDRed;
uint8_t LEDGreen;
uint8_t LEDBlue;

// Web server running on port 80
WebServer server(80);
 
// Sensor
//Adafruit_BME280 bme;

// Neopixel LEDs strip
Adafruit_NeoPixel pixels(NUM_OF_LEDS, PIN, NEO_GRB + NEO_KHZ800);
 
// JSON data buffer
StaticJsonDocument<500> jsonDocument;
char buffer[500];
 
// env variable
float temperature;
float humidity;
float pressure;

TFT_eSPI tft = TFT_eSPI();  // Invoke library, pins defined in User_Setup.h


// Run function for LED Effects task
void runLEDEffects(void * parameter)
{
   for (;;) {
    switch (LEDEffect)
    {
      case LEDEffectSolid:
      default:
        // Nothing to do for solid color case
        LEDBlinkState = false;
        LEDBlinkTimer = 0;
        break;

      case LEDEffectBlink:
        if (LEDBlinkTimer)
        {
          LEDBlinkTimer--;
        }
        if (!LEDBlinkTimer)
        {
          if (LEDBlinkState)
          {
            LEDBlinkState = false;
            LEDBlinkTimer = LEDBlinkOffReloadMS;
            pixels.fill(pixels.Color(0, 0, 0));
            delay(1);
            pixels.show();
          }
          else
          {
            LEDBlinkState = true;
            LEDBlinkTimer = LEDBlinkOnReloadMS;
            pixels.fill(pixels.Color(LEDRed, LEDGreen, LEDBlue));
            delay(1);
            pixels.show();
          }
        }
        break;

      case LEDEffectSwirl:

        break;
    }
    vTaskDelay(portTICK_PERIOD_MS);
  }
}

// Update the LED effects code to use new colors and new effect
void changeLEDEffect(uint8_t red, uint8_t green, uint8_t blue, uint8_t newEffect, uint32_t onTime, uint32_t offTime)
{
  LEDEffect = newEffect;

  switch(LEDEffect)
  {
    case LEDEffectSolid:
    default:
      pixels.fill(pixels.Color(red, green, blue));
      delay(30);
      pixels.show();
      break;

    case LEDEffectBlink:
      pixels.fill(pixels.Color(red, green, blue));
      delay(30);
      pixels.show();
      LEDBlinkState = true;
      LEDBlinkOffReloadMS = offTime;
      LEDBlinkOnReloadMS = onTime;
      LEDBlinkTimer = LEDBlinkOnReloadMS;
      break;
    
    case LEDEffectSwirl:

      break;
  }
  LEDRed = red;
  LEDGreen = green;
  LEDBlue = blue;
}
 
void connectToWiFi() {
  Serial.print("Connecting to ");
  Serial.println(SSID);
  
  WiFi.begin(SSID, PWD);
  
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500); 
    // we can even make the ESP32 to sleep
  }
 
  Serial.print("Connected. IP: ");
  Serial.println(WiFi.localIP());
}
 
void create_json(char *tag, float value, char *unit) { 
  jsonDocument.clear(); 
  jsonDocument["type"] = tag;
  jsonDocument["value"] = value;
  jsonDocument["unit"] = unit;
  serializeJson(jsonDocument, buffer);
  Serial.println("Buffer:");
  Serial.println(buffer);  
}
 
void add_json_object(char *tag, float value, char *unit) {
  JsonObject obj = jsonDocument.createNestedObject();
  obj["type"] = tag;
  obj["value"] = value;
  obj["unit"] = unit; 
}

void read_sensor_data(void * parameter) {
   for (;;) {
     //temperature = bme.readTemperature();
     //humidity = bme.readHumidity();
     //pressure = bme.readPressure() / 100;
     Serial.println("Read sensor data");
 
     // delay the task
     vTaskDelay(60000 / portTICK_PERIOD_MS);
   }
}
 
void getTemperature() {
  char tag[] = "temperature";
  char unit[] = "°C";
  Serial.println("Get temperature");
  create_json(tag, temperature, unit);
  server.send(200, "application/json", buffer);
}
 
void getHumidity() {
  char tag[] = "humidity";
  char unit[] = "%";
  Serial.println("Get humidity");
  create_json(tag, humidity, unit);
  server.send(200, "application/json", buffer);
}
 
void getPressure() {
  char tag[] = "pressure";
  char unit[] = "mBar";
  Serial.println("Get pressure");
  create_json(tag, pressure, unit);
  server.send(200, "application/json", buffer);
}
 
void getEnv() {
  char tag1[] = "temperature";
  char tag2[] = "humidity";
  char tag3[] = "pressure";
  char unit1[] = "°C";
  char unit2[] = "%";
  char unit3[] = "mBar";
  Serial.println("Get env");
  jsonDocument.clear();
  add_json_object(tag1, temperature, unit1);
  add_json_object(tag2, humidity, unit2);
  add_json_object(tag3, pressure, unit3);
  serializeJson(jsonDocument, buffer);
  server.send(200, "application/json", buffer);
}

void handlePost() {
  if (server.hasArg("plain") == false) {
    //handle error here
  }

  String body = server.arg("plain");
  Serial.println(body);
  deserializeJson(jsonDocument, body);
  
  // Get RGB components
  int red = jsonDocument["red"];
  int green = jsonDocument["green"];
  int blue = jsonDocument["blue"];
  int effect = jsonDocument["blink"];
  int onTime = jsonDocument["onTime"];
  int offTime = jsonDocument["offTime"];
  const char* text1 = jsonDocument["text1"];
  const char* text2 = jsonDocument["text2"];
  const char* text3 = jsonDocument["text3"];
  const char* text4 = jsonDocument["text4"];

  Serial.println(text1);
  Serial.println(text2);
  Serial.println(text3);
  Serial.println(text4);

  changeLEDEffect(red, green, blue, effect, onTime, offTime);

  // Respond to the client
  server.send(200, "application/json", "{}");
}
 
 
// setup API resources
void setup_routing() {
  server.on("/temperature", getTemperature);
  server.on("/pressure", getPressure);
  server.on("/humidity", getHumidity);
  server.on("/env", getEnv);
  server.on("/led", HTTP_POST, handlePost);
 
  // start server
  server.begin();
}


void setup_task() {
  xTaskCreate(
    read_sensor_data,    
    "Read sensor data",   // Name of the task (for debugging)
    1000,            // Stack size (bytes)
    NULL,            // Parameter to pass
    1,               // Task priority
    NULL             // Task handle
  );
  xTaskCreate(
    runLEDEffects,    
    "LED Effects",   // Name of the task (for debugging)
    1000,            // Stack size (bytes)
    NULL,            // Parameter to pass
    1,               // Task priority
    NULL             // Task handle
  );
}
 
void setup() 
{
   Serial.begin(9600);
 
   // Sensor setup
//  if (!bme.begin(0x76)) {
//    Serial.println("Problem connecting to BME280");
//  }
  tft.init();
  tft.setRotation(1);
  tft.fillScreen(TFT_BLACK);

#if 0
  tft.setTextColor(TFT_YELLOW, TFT_BLACK); // Note: the new fonts do not draw the background colour
  tft.setTextFont(4);
  tft.setCursor (8, 40);
  tft.print("Connecting to WiFi ...");
  connectToWiFi();
  setup_task();
  setup_routing();  

  // Initialize Neopixel
  pixels.begin();
  changeLEDEffect(0,0,0,LEDEffectSolid, 0, 0);

  tft.fillScreen(TFT_BLACK);
  tft.setTextFont(4);
  tft.setCursor (8, 40);
  tft.print("My IP address:");
  tft.setCursor (8, 70);
  tft.print(WiFi.localIP());
  delay(4000);
#endif
  tft.fillScreen(TFT_WHITE);
  tft.setTextColor(TFT_BLACK, TFT_WHITE);
  tft.drawString("1 ABCDabcd1234", 1, 1, 1);
  tft.drawString("2 ABCDabcd1234", 1, 20, 2);
  tft.drawString("4 ABCDabcd1234", 1, 40, 4);
//  tft.drawString("8 ABCD 1234", 10, 80, 8);
//  tft.drawString("7 ABCDabcd1234", 1, 80, 7);
//  tft.drawString("8 ABCDabcd1234", 1, 100, 8);

  // Swap the colour byte order when rendering
  tft.setSwapBytes(true);

  // Draw the icons
  tft.pushImage(1, 60, 64, 64, a02d_smoke_64);


//  tft.setTextFont(2);
//  tft.fillRect(1,1,240,20, TFT_MAGENTA);
//  tft.setCursor (4, 3);
//  tft.setTextColor(TFT_YELLOW, TFT_MAGENTA); // Note: the new fonts do not draw the background colour
//  tft.print("Local Weather:");
//  tft.setTextColor(TFT_GREEN, TFT_BLACK); // Note: the new fonts do not draw the background colour
//  tft.setCursor (1, 24);
#define LINE_HEIGHT 20
#if 0
  tft.print("Text line 1. Abcdefg 1234567890 ab");
  tft.setCursor (1, 24 + LINE_HEIGHT);
  tft.print("Text line 2. Abcdefg 1234567890 ab");
  tft.setCursor (1, 24 + 2 * LINE_HEIGHT);
  tft.print("Text line 3. Abcdefg 1234567890 ab");
  tft.setCursor (1, 24 + 3 * LINE_HEIGHT);
  tft.print("Text line 4. Abcdefg 1234567890 ab");
  tft.setCursor (1, 24 + 4 * LINE_HEIGHT);
  tft.print("Text line 5. Abcdefg 1234567890 ab");
#endif
  delay(4000);
}
 
void loop() 
{
  server.handleClient();
}