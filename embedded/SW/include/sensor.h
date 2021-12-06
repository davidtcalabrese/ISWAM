/**
  ******************************************************************************
  * @file    sensor.h
  * @author  Brian Schmalz
  * @brief   Public header file for sensor module
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
#ifndef __SENSOR_H__
#define __SENSOR_H__

/* Includes ------------------------------------------------------------------*/

/* Exported types ------------------------------------------------------------*/ 

/* Exported constants --------------------------------------------------------*/

/* Exported macros -----------------------------------------------------------*/

/* Exported variables --------------------------------------------------------*/

/* Exported functions --------------------------------------------------------*/

/**
  * @brief  Return current temperature
  * @param  none
  * @retval Latest temperature reading as float
  */
float sensor_GetTemperature(void);

/**
  * @brief  Return current pressure
  * @param  none
  * @retval Latest pressure reading as float
  */
float sensor_GetPressure(void);

/**
  * @brief  Return current humidity
  * @param  none
  * @retval Latest humidity reading as float
  */
float sensor_GetHumidity(void);

/**
  * @brief  Initialize sensor module.
  * @param  none
  * @retval none
  */
void sensor_Init(void);

#endif /* __SENSOR_H__ */

/**************** (C) COPYRIGHT Brian Schmalz *****END OF FILE****/
