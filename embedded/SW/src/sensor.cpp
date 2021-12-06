/**
  ******************************************************************************
  * @file    sensor.cpp
  * @author  Brian Schmalz
  * @brief   Temp/pressure/hmidity sensor module
  * 
  * See https://github.com/davidtcalabrese/ISWAM for full information
  *
  ******************************************************************************
  * @attention
  * 
  * The MIT License (MIT)
  * Copyright © 2021 Brian Schmalz, David Calabrese
  * Permission is hereby granted, free of charge, to any person obtaining a 
  * copy of this software and associated documentation files (the “Software”), 
  * to deal in the Software without restriction, including without limitation 
  * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
  * and/or sell copies of the Software, and to permit persons to whom the 
  * Software is furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in 
  * all copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
  * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
  * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
  * DEALINGS IN THE SOFTWARE.
  *
  ******************************************************************************
  */ 

/* Includes ------------------------------------------------------------------*/
#include <Arduino.h>
#include <WiFi.h>
#include <FreeRTOS.h>
#include <Adafruit_BME280.h>
#include <Adafruit_Sensor.h>
#include "sensor.h"

/* Private typedef -----------------------------------------------------------*/

/* Private define ------------------------------------------------------------*/

/* Private macro -------------------------------------------------------------*/

/* Private variables ---------------------------------------------------------*/

// Sensor variables
/// NOTE: Using globals to share data with a task is not good practice (i.e. posible non-atomic access
/// to the values).
/// TODO: Switch to RTOS functions like message buffers to move data between tasks, or use semiphores
/// to protect access to these globals
float temperature;
float humidity;
float pressure;

// Sensor
Adafruit_BME280 bme;

// Set true if we intialized the sensor properly
uint8_t UsingBME;

/* Public variables ----------------------------------------------------------*/

/* Private function prototypes -----------------------------------------------*/


/* Private functions ---------------------------------------------------------*/

/**
  * @brief  Sensor reading task. Runs continually. Read sensor every 60s.
  * @param  parameter : ignored
  * @retval none
  */
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

/* Public functions ---------------------------------------------------------*/

// See header file for documentation block
float sensor_GetTemperature(void)
{
  return temperature;
}

// See header file for documentation block
float sensor_GetHumidity(void)
{
  return humidity;
}

// See header file for documentation block
float sensor_GetPressure(void)
{
  return pressure;
}

// See header file for documentation block
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
