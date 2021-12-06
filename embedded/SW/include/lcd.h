/**
  ******************************************************************************
  * @file    lcd.h
  * @author  Brian Schmalz
  * @brief   Header file for LCD module
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
#ifndef __LCD_H__
#define __LCD_H__

/* Includes ------------------------------------------------------------------*/

/* Exported types ------------------------------------------------------------*/ 

/* Exported constants --------------------------------------------------------*/

/* Exported macros -----------------------------------------------------------*/

/* Exported variables --------------------------------------------------------*/

/* Exported functions --------------------------------------------------------*/

/**
  * @brief  Display the 'Waiting for data' message on the display
  * @param  none
  * @retval none
  */
void lcd_DisplayWaiting(void);

/**
  * @brief  Display the IP address on the display
  * @param  none
  * @retval none
  */
 void lcd_DisplayIP(void);

/**
  * @brief  Print the four strings as four lines of text on the display
  * @param  text1 : First line of text
  * @param  text2 : Second line of text
  * @param  text3 : Third line of text
  * @param  text4 : Fourth line of text
  * @retval none
  */
void lcd_printTextLines(const char * text1, const char * text2, const char * text3, const char * text4);

/**
  * @brief  Initialize the LCD module
  * @param  none
  * @retval none
  */
void lcd_Init(void);

#endif /* __LCD_H__ */

/**************** (C) COPYRIGHT Brian Schmalz *****END OF FILE****/
