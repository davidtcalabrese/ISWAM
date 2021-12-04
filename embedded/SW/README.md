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

During system initalization, two RTOS tasks are started up - one for reading the sensor every 60 seconds, and the other for managing the 
LED state (primarily for the implementation of flashing). Also during system intialization the URL endpoints are added to the webserver
configuration.

The main loop() function simply waits for HTTP GET or POST requests on the defined API endpoints. When one is seen, the appropriate callback
function is called and the data processed appropraitely.

The various icon images are stored as arrays in header files and included at the top of the main.cpp file. The API provides a mechanism for 
selecting one of these icons and displaying it anywhere on the screen.

## How to build

### Software

* Install Visual Studio Code

* Install Git for Windows

* From within VSC, install the Platform IO extension. It takes a while, and will require a restart of VSC. Also allow the standard C/C++ extension pack to install.

* From the Platfrom IO Home window, select Open Project, then navigate to ISWAM/embedded/SW and choose that directory

* On left hand side of VSC, click on Platform IO (alien head). Then from Project Tasks window, select General->Build. 

* This should build all of the pieces of the project, and you should get a "Success" in the terminal window.

* To download the newly build image to the Puck, plug the Puck into the PC usign a USB C cable, then click the General->Upload task from the Project Tasks window. 
PlatformIO should be able to find the serial port that the Puck has created and upload the new image.

* To view the serial output from the Puck as it is running, connect a termainl emulator (like TeraTerm) to the serial port created by the Puck, and set it to 9600
baud. Be sure to disconnect from that serial port before attempting to upload to the Puck again.

### Hardware

* In the embedded/HW directory are all of the .stl files for the four 3D printed pieces. Slice them with
your choice of slicer and print on a 3D printer.

* Assemble the hardware pieces acording to the above schematic and pictures.

* Modify the TTGO board by carefully removing the display from the board (no need to 
unsolder the display flex), clean off the adhesive, then use double sided sticky
tape to adhere the display to the spacer and the spacer to the board.

* Insert the LED ring into the top Puck shell.

* Insert the rest of the electronics into the top of the Puck shell.

* Insert the on/off switch into the cutout in the side of the top shell piece.

* Attach the battery to the bottom of the electronics stack with double sided
sticky tape and foam.

* Press the bottom shell of the Puck into the top shell. If the LED ring is
properly sitting in the top shell, the bottom shell will hold the ring
tight against the top face of the Puck. The bottom shell should be a press fit
into the top shell.

* The assembled Puck can be placed into the holder for easier readability.s

## Hardware Links

These are the primary components used to construct the Puck:

* GitHub repo for ESP32 + Display board:
https://github.com/Xinyuan-LilyGO/TTGO-T-Display

* Product page for EPS32 + Display board:
http://www.lilygo.cn/prod_view.aspx?TypeId=50033&Id=1126&FId=t3:50033:3

* Amazon link for ESP32 + Display board:
https://www.amazon.com/gp/product/B099MPFJ9M/ref=ppx_yo_dt_b_asin_title_o09_s01?ie=UTF8&psc=1

* Temp/Pressure/Humdity sensor:
https://www.amazon.com/gp/product/B07V5CL3L8/ref=ppx_yo_dt_b_asin_title_o08_s00?ie=UTF8&psc=1

* LED Ring (16 LED version)
https://www.amazon.com/gp/product/B08LMZZK2Z/ref=ppx_yo_dt_b_asin_title_o09_s00?ie=UTF8&psc=1

* DC-DC step up converter:
https://www.amazon.com/gp/product/B089JYBF25/ref=ppx_yo_dt_b_asin_title_o00_s01?ie=UTF8&psc=1

* Level Shifter:
https://www.digikey.com/en/products/detail/texas-instruments/SN74LV1T125DBVR/4555571

* Power switch:
https://www.amazon.com/gp/product/B086L2GPGX/ref=ppx_yo_dt_b_asin_title_o00_s01?ie=UTF8&psc=1


## Software Links

* The ESP32 code started from this example: [ESP32 Rest API Server](https://www.survivingwithandroid.com/esp32-rest-api-esp32-api-server/)

* Sensor library: https://github.com/adafruit/Adafruit_BME280_Library, https://github.com/adafruit/Adafruit_Sensor

* LED (WS2812) Library: https://github.com/adafruit/Adafruit_NeoPixel

* LCD library:
https://github.com/Bodmer/TFT_eSPI

* Weather graphics from: https://www.weatherbit.io/api/codes

* Using this image converter to get to C arrays: http://www.rinkydinkelectronics.com/_t_doimageconverter565.php

## Contact Information

If you have any questions about this project, please contact David Calabrese: dCalabrese414@gmail.com or Brian Schmalz: brain@schmalzhaus.com