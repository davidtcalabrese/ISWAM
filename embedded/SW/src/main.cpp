#include <Arduino.h>
#include <WiFi.h>
#include <FreeRTOS.h>

#include "sensor.h"
#include "handlers.h"
#include "led.h"
#include "lcd.h"

// Credentials for the access point we want to connect to
const char *SSID = "casa calabrese";
const char *PWD = "calabre4";

void connectToWiFi(void) 
{
  Serial.print("Connecting to ");
  Serial.println(SSID);
  
  WiFi.begin(SSID, PWD);
  
  while (WiFi.status() != WL_CONNECTED) 
  {
    Serial.print(".");
    delay(500); 
    // we can even make the ESP32 to sleep
  }
 
  Serial.print("Connected. IP: ");
  Serial.println(WiFi.localIP());
}
 
void setup(void) 
{
  Serial.begin(9600);
  sensor_Init();
  lcd_Init();
  connectToWiFi();
  handlers_Init();
  lcd_DisplayIP();
  delay(4000);
  lcd_DisplayWaiting();
}
 
void loop(void) 
{
  handlers_Run();
}