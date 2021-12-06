
/**
  ******************************************************************************
  * @file    led.h
  * @author  Brian Schmalz
  * @brief   Header file for LED module
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

/* Define to prevent recursive inclusion -------------------------------------*/
#ifndef __LED_H__
#define __LED_H__

/* Includes ------------------------------------------------------------------*/
#include <stdint.h>

/* Exported types ------------------------------------------------------------*/ 

/* Exported constants --------------------------------------------------------*/

/* Exported macros -----------------------------------------------------------*/

/* Exported variables --------------------------------------------------------*/

/* Exported functions --------------------------------------------------------*/

/**
  * @brief  Set new LED effect
  * @param  red : From 0 to 255 - red brightness
  * @param  green : From 0 to 255 - blue brightness
  * @param  blue : From 0 to 255 - gree brightness
  * @param  newEffect : 0 = Turn LEDs off
  * @param  newEffect : 1 = Blink (use onTime and offTime)
  * @param  onTime : in milliseconds, used when newEffect = 1. Time LEDs stay on
  * @param  offTime : in milliseconds, used when newEffect = 1. Time LEDs stay off
  * @retval none
  */
void led_changeEffect(uint8_t red, uint8_t green, uint8_t blue, uint8_t newEffect, uint32_t onTime, uint32_t offTime);

/**
  * @brief  Initialize the LED module
  * @param  none
  * @retval none
  */
void led_Init(void);

#endif /* __LED_H__ */

/**************** (C) COPYRIGHT Brian Schmalz *****END OF FILE****/
