#include <Arduino.h>
#include <WiFi.h>
#include <FreeRTOS.h>
#include <TFT_eSPI.h> // Graphics and font library for ST7735 driver chip
#include <SPI.h>


// Include graphic/icon array header files here
#include "a02d_smoke_64.h"


TFT_eSPI tft = TFT_eSPI();  // Invoke library, pins defined in User_Setup.h


void lcd_DisplayIP(void)
{
  tft.fillScreen(TFT_BLACK);
  tft.setTextFont(4);
  tft.setCursor (8, 40);
  tft.print("My IP address:");
  tft.setCursor (8, 70);
  tft.print(WiFi.localIP());
}

void lcd_DisplayWaiting(void)
{
  tft.fillScreen(TFT_BLACK);
  tft.setCursor (8, 40);
  tft.print("Waiting for data");

  // Swap the colour byte order when rendering
  tft.setSwapBytes(true);
}

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