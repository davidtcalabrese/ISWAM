# ISWAM Puck Embedded Hardware and Software

## Introduction

ISWAM system consists of a cloud based server component, a user interface which runs in a local web browser, and an embedded display
deivce called the Puck. This document describes the Puck's design and construction.

The Puck needed to be small, battery powered (at least for short periods of time), connect to the Internet via WiFi, display data
to a user and most importantly be very fast to prototype. The entire Puck conception through final version construction happend in 
less than 10 days of evening work.

Many software and hardware components were chosen to reduce time risk of the project. This included starting with a processor and
software ecosystem with mature WiFi and networking support as well as availability of inexpensive and small development boards
that included the processor, display, battery and USB functions.

The ESP32 processor from Espressif fit the bill and so was chosen for the processor. Existing example code that illustrated similar
functionality to what was needed for ISWAM was used as a starting point. A compact develompent board was bought on Amazon for rapid
shipment, as well as a ring of addressable LEDs, battery and other components.

- Picture of finished Puck -

## Block Diagram

The Puck consists of the TTGO board (continaing ESP32 processor, Flash, battery charger chip and battery connector, IPS 1.14 inch
display and USB C connector for charging, programming ande debug), a ring of 16 WS2812 LEDs, BME280 digital pressure/temperature/humidity
sensor, small LiPo battery pack, on/off switch, DC-DC power supply and level shifter.

- Block diagram showing all of the above pieces-

The DC-DC boost board is required because the WS2812 LEDs need 5V, and when under battery power 5V pin from the TTGO board only supplies
about 3.7V (from the battery). So the battery voltage is run through the boost converter before powering the LEDs so they will always get
5V no matter if the Puck is on USB or battery power.

The on/off switch is a latch-on/latch-off type, and it breaks the connection with the battery. This means that the battery can only charge
if the on/off switch is turned on and the USB connector is getting 5V.

The USB connection on the TTGO board is utilized for powering the system, providing battery charging power, and serial communications
with the PC (for programming and serial I/O while running as a debug output).

## Schematic

- Simple schematic showing connection of all of the hardware -

## Mecanical Construction

All of the electronics in the Puck were soldered to a protoboard using point to point wiring. The stack of components then sit down inside a 3D printed housing. 
The housing consists of two parts - a top and bottom piece. The IPS screen was separated from the TTGO and a 3D printed spacer was
added between it and the board. This allows the display pannel to sit almost flush with the top of the Puck, increasing readability.

The TTGO board and the sensor board are both mounted on headers with sockets in the protoboard so that they can be replaced with identical
units if they ever develop faults.

The thre lines to the LED ring us a small 0.1" header and socket so that the the LEDs can be disconnected from the protoboard for ease of
disassembly.

## Software

PlatformIO is used a an extension within Visual Studio Code to compile and download new images to the Puck. Several libraries (listed below) 
are used for standard ESP32 WiFi, networking, JSON parsing, sensor communication and display communication. The default ESP32 FreeRTOS is used
by the libraries to manage system resources.

- Simple software flowchart for the Puck -

Using the Webserver library, the Puck code presents sevarl URL endpoints on its webserver interface for any client to connect to as it's API.
The endpoints that display information on the LEDs or screen (/led, /lcd, /icon) are used with HTTP POST requests, where simple JSON data
is sent in the body of the request. The Puck software parses the JSON data and applies it to the LEDs or display.

The other endpoints (/temperature, /humidity, /pressure, /env) all report back sensor data if an HTTP GET request is made to them.

During system initalization, two RTOS tasks 

## How to build

### Software

### Hardware

## Hardware Links

## Software Links

The ESP32 code started from this example: [ESP32 Rest API Server](https://www.survivingwithandroid.com/esp32-rest-api-esp32-api-server/)


## JUNK

![Web server running on ESP8266](https://github.com/survivingwithandroid/ESP32-Rest-API-Server/blob/master/img/esp32-rest-api-server.png)
