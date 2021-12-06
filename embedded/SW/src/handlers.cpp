#include <Arduino.h>
#include <WiFi.h>
#include <FreeRTOS.h>
#include <ArduinoJson.h>
#include <WebServer.h>
#include "sensor.hpp"
#include "led.h"
#include "lcd.h"

// Web server running on port 80
WebServer server(80);

// JSON data buffer
StaticJsonDocument<500> jsonDocument;
char buffer[500];

void create_json(char *tag, float value, char *unit) 
{ 
  jsonDocument.clear(); 
  jsonDocument["type"] = tag;
  jsonDocument["value"] = value;
  jsonDocument["unit"] = unit;
  serializeJson(jsonDocument, buffer);
  Serial.println("Buffer:");
  Serial.println(buffer);  
}
 
void add_json_object(char *tag, float value, char *unit) 
{
  JsonObject obj = jsonDocument.createNestedObject();
  obj["type"] = tag;
  obj["value"] = value;
  obj["unit"] = unit; 
}

void getTemperature(void) 
{
  char tag[] = "temperature";
  char unit[] = "°C";
  Serial.println("Get temperature");
  create_json(tag, sensor_GetTemperature(), unit);
  server.send(200, "application/json", buffer);
}
 
void getHumidity(void) 
{
  char tag[] = "humidity";
  char unit[] = "%";
  Serial.println("Get humidity");
  create_json(tag, sensor_GetHumidity(), unit);
  server.send(200, "application/json", buffer);
}
 
void getPressure(void) 
{
  char tag[] = "pressure";
  char unit[] = "mBar";
  Serial.println("Get pressure");
  create_json(tag, sensor_GetPressure(), unit);
  server.send(200, "application/json", buffer);
}
 
void getEnv(void) 
{
  char tag1[] = "temperature";
  char tag2[] = "humidity";
  char tag3[] = "pressure";
  char unit1[] = "°C";
  char unit2[] = "%";
  char unit3[] = "mBar";
  Serial.println("Get env");
  jsonDocument.clear();
  add_json_object(tag1, sensor_GetTemperature(), unit1);
  add_json_object(tag2, sensor_GetHumidity(), unit2);
  add_json_object(tag3, sensor_GetPressure(), unit3);
  serializeJson(jsonDocument, buffer);
  server.send(200, "application/json", buffer);
}

void handlePostLED(void) 
{
  if (server.hasArg("plain") == false) 
  {
    //handle error here
    return;
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

  Serial.println("LED Packet:");
  Serial.print("Red: ");
  Serial.print(red);
  Serial.print(" Green: ");
  Serial.print(green);
  Serial.print(" Blue: ");
  Serial.print(blue);
  Serial.print(" Effect: ");
  Serial.print(effect);
  Serial.print(" onTime: ");
  Serial.print(onTime);
  Serial.print(" offTime: ");
  Serial.println(offTime);

  led_changeEffect(red, green, blue, effect, onTime, offTime);

  // Respond to the client
  server.send(200, "application/json", "{}");
}
 

void handlePostLCD(void) 
{
  if (server.hasArg("plain") == false) 
  {
    //handle error here
    return;
  }

  String body = server.arg("plain");
  Serial.println(body);
  deserializeJson(jsonDocument, body);
  
  // Get RGB components
  const char* text1 = jsonDocument["text1"];
  const char* text2 = jsonDocument["text2"];
  const char* text3 = jsonDocument["text3"];
  const char* text4 = jsonDocument["text4"];

  Serial.println("LCD Text Packet:");
  Serial.print("text1: ");
  Serial.println(text1);
  Serial.print("text2: ");
  Serial.println(text2);
  Serial.print("text3: ");
  Serial.println(text3);
  Serial.print("text4: ");
  Serial.println(text4);

  // Actually print the lines of text out on the LCD
  lcd_printTextLines(text1, text2, text3, text4);

  // Respond to the client
  server.send(200, "application/json", "{}");
}


void handlePostIcon(void) 
{
  if (server.hasArg("plain") == false) 
  {
    //handle error here
    return;
  }

  String body = server.arg("plain");
  Serial.println(body);
  deserializeJson(jsonDocument, body);
  
  // Get RGB components
  const char* iconName = jsonDocument["icon"];
  int xCoord = jsonDocument["x"];
  int yCoord = jsonDocument["y"];
 
  // To be filled in later:
  // Use iconName, x and y coordinates to draw a grpahic on the screen
//  tft.pushImage(1, 60, 64, 64, a02d_smoke_64);

  // Respond to the client
  server.send(200, "application/json", "{}");
}

// setup API resources
void handlers_Init(void) 
{
  server.on("/temperature", getTemperature);
  server.on("/pressure", getPressure);
  server.on("/humidity", getHumidity);
  server.on("/env", getEnv);
  server.on("/led", HTTP_POST, handlePostLED);
  server.on("/lcd", HTTP_POST, handlePostLCD);
  server.on("/icon", HTTP_POST, handlePostIcon);
 
  // start server
  server.begin();
}

void handlers_Run(void)
{
  server.handleClient();
}