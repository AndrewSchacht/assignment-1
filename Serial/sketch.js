//youtube - https://www.youtube.com/watch?v=saonGyiRRYs


let serial;
let latestData = "0";

function setup() {
  createCanvas(windowWidth, windowHeight);
  serial = new p5.SerialPort();
  serial.list();
  serial.open('COM3');
  serial.on('connected', serverConnected);
  serial.on('list', gotList);
  serial.on('data', gotData);
  serial.on('error', gotError);
  serial.on('open', gotOpen);
  serial.on('close', gotClose);
}

function serverConnected() {
  console.log("Connected to Server");
}

function gotList(thelist) {
  console.log("List of Serial Ports:");
  for (let i = 0; i < thelist.length; i++) {
    console.log(i + " " + thelist[i]);
  }
}

function gotOpen() {
  console.log("Serial Port is Open");
}

function gotClose(){
  console.log("Serial Port is Closed");
  latestData = "0";
}

function gotError(theerror) {
  console.log(theerror);
}

function gotData() {
  let currentString = serial.readLine();
  trim(currentString);
  if (!currentString) return;
  console.log(currentString);
  latestData = currentString;
}

function draw() {
  let val = map(latestData, 0, 1023, 0, 255); // Map the value of the photoresistor to a range of 0-255
  background(val); // Change the background color based on the value received from the photoresistor
}

function keyPressed() {
  if (key === ' ') {
    serial.write('1'); // Send a character '1' to Arduino to turn on the LED
  }
}

function keyReleased() {
  if (key === ' ') {
    serial.write('0'); // Send a character '0' to Arduino to turn off the LED
  }
}
