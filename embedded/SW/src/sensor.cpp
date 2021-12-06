#include <Arduino.h>
#include <WiFi.h>
#include <FreeRTOS.h>
#include <Adafruit_BME280.h>
#include <Adafruit_Sensor.h>
#include "sensor.h"

// env variable
float temperature;
float humidity;
float pressure;

// Sensor
Adafruit_BME280 bme;

// Set true if we intialized the sensor properly
uint8_t UsingBME;

void readData(void * parameter) 
{
  for (;;) 
  {
    if (UsingBME) 
    {
      temperature = bme.readTemperature();
      humidity = bme.readHumidity();
      pressure = bme.readPressure() / 100;
    }
    Serial.print("Read sensor data: ");
    Serial.print(temperature);
    Serial.print(" deg F ");
    Serial.print(humidity);
    Serial.print(" %RH ");
    Serial.print(pressure);
    Serial.println(" mmHg");

    // delay the task
    vTaskDelay(60000 / portTICK_PERIOD_MS);
  }
}

float sensor_GetTemperature(void)
{
  return temperature;
}

float sensor_GetHumidity(void)
{
  return humidity;
}

float sensor_GetPressure(void)
{
  return pressure;
}

void sensor_Init(void)
{
  // Sensor setup
  if (!bme.begin(0x76)) 
  {
    Serial.println("Problem connecting to BME280");
    UsingBME = false;
  }
  else 
  {
    UsingBME = true;

    xTaskCreate(
      readData,
      "Read sensor data",   // Name of the task (for debugging)
      4000,            // Stack size (bytes)
      NULL,            // Parameter to pass
      1,               // Task priority
      NULL             // Task handle
    );
  }
}
