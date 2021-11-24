/**
 * Class representing the POST request that will be sent to ESP32.
 */
class PostRequest {
  /**
   * Create a postRequest.
   * @param {number} red - An rgb value for red .
   * @param {number} green - An rgb value for green.
   * @param {number} blue - An rgb value for blue.
   * @param {number} blink - Integer to determine light blink pattern.
   * @param {number} onTime - Integer to determine length of blink time on.
   * @param {number} offTime - Integer to determine length of blink time off.
   * @param {string} text1 - Text field 1 - depends on type of POST. 
   * @param {string} text2 - Text field 2 - depends on type of POST.
   * @param {string} text3 - Text field 3 - depends on type of POST.
   * @param {string} text4 - Text field 4 - depends on type of POST.
   */
  constructor(red, green, blue, blink, onTime, offTime, text1, text2, text3, text4) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.blink = blink;
    this.onTime = onTime;
    this.offTime = offTime;
    this.text1 = text1;
    this.text2 = text2;
    this.text3 = text3;
    this.text4 = text4;
  }
}

