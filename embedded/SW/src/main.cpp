/**
  ******************************************************************************
  * @file    main.cpp
  * @author  Brian Schmalz
  * @brief   Top level source code file for ISWAM Puck embedded code
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

#include "sensor.h"
#include "handlers.h"
#include "led.h"
#include "lcd.h"

/* Private typedef -----------------------------------------------------------*/

/* Private define ------------------------------------------------------------*/

/* Private macro -------------------------------------------------------------*/

/* Private variables ---------------------------------------------------------*/

// Credentials for the access point we want to connect to
/// TODO: Reeaaallly not ideal to store credentials in plan text in Github repo.
/// Switch this to a more secure method
const char *SSID = "casa calabrese";
const char *PWD = "calabre4";

/* Public variables ----------------------------------------------------------*/

/* Private function prototypes -----------------------------------------------*/


/* Private functions ---------------------------------------------------------*/

/**
  * @brief Connects to WiFi access point. Keeps trying forever.
  * @note  
  * @param none
  * @retval none
  */
void connectToWiFi(void) 
{
  Serial.print("Connecting to ");
  Serial.println(SSID);
  
  WiFi.begin(SSID, PWD);
  
  while (WiFi.status() != WL_CONNECTED) 
  {
    Serial.print(".");
    delay(500); 
  }
 
  Serial.print("Connected. IP: ");
  Serial.println(WiFi.localIP());
}
 
/* Public functions ---------------------------------------------------------*/

/**
  * @brief Arduino setup() function. Called once by Arduino core at boot
  * @note  
  * @param none
  * @retval none
  */
void setup(void) 
{
  // Initialize all the things.
  Serial.begin(9600);
  sensor_Init();
  lcd_Init();
  connectToWiFi();
  handlers_Init();
  // Display the IP address that DHCP gave to us on the LCD display for 4 seconds
  /// TODO: Add version string printout to IP display screen
  lcd_DisplayIP();
  delay(4000);
  // Print a 'waiting for data' message until something is sent to us
  lcd_DisplayWaiting();
}
 
/**
  * @brief Arduino loop() function. Called repeatedly by Arduino core during running
  * @note  
  * @param none
  * @retval none
  */
 void loop(void) 
{
  handlers_Run();
}