#include <Arduino.h>
#include <WiFi.h>
#include <FreeRTOS.h>
#include <Adafruit_NeoPixel.h>
#include <FreeRTOS.h>
#include "led.h"

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

// Neopixel LEDs strip
Adafruit_NeoPixel pixels(NUM_OF_LEDS, PIN, NEO_GRB + NEO_KHZ800);




// Run function for LED Effects task
void led_runEffects(void * parameter)
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

// Update the LED effects code to use new colors and new effect
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
 

void led_Init(void) 
{
  // Initialize Neopixel
  pixels.begin();
  led_changeEffect(0, 0, 0, LEDEffectSolid, 0, 0);

  xTaskCreate(
    led_runEffects,    
    "LED Effects",   // Name of the task (for debugging)
    1000,            // Stack size (bytes)
    NULL,            // Parameter to pass
    2,               // Task priority
    NULL             // Task handle
  );
}
