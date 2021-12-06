/**
  ******************************************************************************
  * @file    led.cpp
  * @author  Brian Schmalz
  * @brief   LED control/display module
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
#include <Adafruit_NeoPixel.h>
#include <FreeRTOS.h>
#include "led.h"

/* Private typedef -----------------------------------------------------------*/

/* Private define ------------------------------------------------------------*/

#define NUM_OF_LEDS 16
#define PIN 27

#define LEDEffectSolid      0 // no effect (solid colors)
#define LEDEffectBlink      1 // blinking (all LEDs do same thing)
#define LEDEffectSwirl      3 // swirl (circular dimming effect)

/* Private macro -------------------------------------------------------------*/

/* Private variables ---------------------------------------------------------*/

/// NOTE: Using globals to share data with a task is not good practice (i.e. posible non-atomic access
/// to the values).
/// TODO: Switch to RTOS functions like message buffers to move data between tasks, or use semiphores
/// to protect access to these globals

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

// Neopixel LEDs strip
Adafruit_NeoPixel pixels(NUM_OF_LEDS, PIN, NEO_GRB + NEO_KHZ800);

/* Public variables ----------------------------------------------------------*/

/* Private function prototypes -----------------------------------------------*/

/* Private functions ---------------------------------------------------------*/

/**
  * @brief  LED Effects Task. Runs continually. Based on selected effect, do
  *         blinking or whatever is necessary
  * @param  parameter : ignored
  * @retval none
  */
void RunEffects(void * parameter)
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
        /// TODO: Implemenent LED Swirl effect
        break;
    }
    // Wait for just 1 ms
    vTaskDelay(portTICK_PERIOD_MS);
  }
}

/* Public functions ---------------------------------------------------------*/

// See header file for documentation block
void led_changeEffect(uint8_t red, uint8_t green, uint8_t blue, uint8_t newEffect, uint32_t onTime, uint32_t offTime)
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

// See header file for documentation block
void led_Init(void) 
{
  // Initialize Neopixel
  pixels.begin();
  led_changeEffect(0, 0, 0, LEDEffectSolid, 0, 0);

  xTaskCreate(
    RunEffects,    
    "LED Effects",   // Name of the task (for debugging)
    1000,            // Stack size (bytes)
    NULL,            // Parameter to pass
    2,               // Task priority
    NULL             // Task handle
  );
}
