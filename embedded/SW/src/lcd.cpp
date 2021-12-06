/**
  ******************************************************************************
  * @file    lcd.cpp
  * @author  Brian Schmalz
  * @brief   LCD control/display module
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
#include <TFT_eSPI.h> // Graphics and font library for ST7735 driver chip
#include <SPI.h>


// Include graphic/icon array header files here
#include "a02d_smoke_64.h"

/* Private typedef -----------------------------------------------------------*/

/* Private define ------------------------------------------------------------*/

/* Private macro -------------------------------------------------------------*/

/* Private variables ---------------------------------------------------------*/

TFT_eSPI tft = TFT_eSPI();  // Invoke library, pins defined in User_Setup.h

/* Public variables ----------------------------------------------------------*/

/* Private function prototypes -----------------------------------------------*/


/* Private functions ---------------------------------------------------------*/

/* Public functions ---------------------------------------------------------*/

// See header file for documentation block
void lcd_DisplayIP(void)
{
  tft.fillScreen(TFT_BLACK);
  tft.setTextFont(4);
  tft.setCursor (8, 40);
  tft.print("My IP address:");
  tft.setCursor (8, 70);
  tft.print(WiFi.localIP());
}

// See header file for documentation block
void lcd_DisplayWaiting(void)
{
  tft.fillScreen(TFT_BLACK);
  tft.setCursor (8, 40);
  tft.print("Waiting for data");

  // Swap the colour byte order when rendering
  tft.setSwapBytes(true);
}


// See header file for documentation block
void lcd_printTextLines(const char * text1, const char * text2, const char * text3, const char * text4)
{
  tft.fillScreen(TFT_BLACK);
  tft.setTextFont(4);
  tft.setTextColor(TFT_YELLOW, TFT_BLACK);
#define LINE_HEIGHT 36
  tft.setCursor (1, 1);
  tft.print(text1);
  tft.setCursor (1, LINE_HEIGHT);
  tft.print(text2);
  tft.setCursor (1, 2 * LINE_HEIGHT);
  tft.print(text3);
  tft.setCursor (1, 3 * LINE_HEIGHT);
  tft.print(text4);
}

// See header file for documentation block
void lcd_Init(void)
{
  tft.init();
  tft.setRotation(1);
  tft.fillScreen(TFT_BLACK);

  tft.setTextColor(TFT_YELLOW, TFT_BLACK); // Note: the new fonts do not draw the background colour
  tft.setTextFont(4);
  tft.setCursor (8, 40);
  tft.print("Connecting to WiFi");
}