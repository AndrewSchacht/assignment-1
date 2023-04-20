let connectButton;
let port;
let writer, reader;
let encoder = new TextEncoder();
let decoder = new TextDecoder();
let sensorData = {};

let xPos = 0;
let yPos = 0;
let buttonState = 0;
let buttonPressed = false;

let synth = new Tone.PolySynth().connect(Tone.Master);

let sounds = new Tone.Players(
  {
    red: "sounds/red.wav",
    orange: "sounds/orange.ogg",
    yellow: "sounds/yellow.wav",
    green: "sounds/green.wav",
    lightblue: "sounds/lightblue.wav",
    blue: "sounds/blue.wav",
    pink: "sounds/pink.wav",
    tan: "sounds/tan.wav",
    brown: "sounds/brown.wav",
    white: "sounds/white.wav",
    black: "sounds/black.wav",
  },
  () => 
  {
    console.log("Sounds loaded");
  }
  ).toDestination();


let colorSound;
const now = Tone.now();
const delay = new Tone.FeedbackDelay("4n", 0);
let soundNames = ["red", "orange", "yellow", "green", "lightblue", "blue", "pink", "tan", "brown", "white", "black"];
let buttons = [];
let clickCount = 0;
let sequence1, simpSynth;
let bgMelody = ["D5", "F4", "D3" , "F5", "D2", "D4", "D3" , "D5"];
let toneStart = 0;

function setup() 
{

  createCanvas(800, 800);
  background(240);

  if ("serial" in navigator) 
  {
    // The Web Serial API is supported
    connectButton = createButton("connect");
    connectButton.position(10, 10);
    connectButton.mousePressed(connect);
  }

  sounds.connect(delay);
  delay.toDestination();

  const simpSynth = new Tone.Synth(
    {
    oscillator: {type: "sawtooth"},
    envelope: {attack: 1, decay: 0, sustain: 1, release: 10}
    }
    ).toDestination();
    simpSynth.volume.value = -35;

  sequence1 = new Tone.Sequence(function(time, note) {
    simpSynth.triggerAttackRelease(note, 0.5);
  }, bgMelody, '8n');
  Tone.Transport.bpm.value = 100;
  Tone.Transport.start();
  Tone.Transport.loop = false;
  Tone.Transport.loopStart = 0;
  Tone.Transport.loopEnd = '3:0:0';

  soundNames.forEach((word, index) => 
  {
    buttons[index] = createButton(word);
    buttons[index].position(3, index * 34 + 6);
    buttons[index].mousePressed(() => buttonSound(word))
  });

  melody();
}

async function serialRead() 
{
  while (true) 
  {
    const { value, done } = await reader.read();
    if (done) 
    {
      reader.releaseLock();
      break;
    }
    let vals = value.split(',');
    if (vals.length === 3) 
    {
      xPos = map(Number(vals[0]), 0, 1023, 0, width);
      yPos = map(Number(vals[1]), 0, 1023, 0, height);
      buttonState = Number(vals[2]);
    }
  }
}

async function connect() 
{
  port = await navigator.serial.requestPort();
  await port.open({ baudRate: 9600 });

  writer = port.writable.getWriter();

  reader = port.readable
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(new TransformStream(new LineBreakTransformer()))
  .getReader();

  serialRead();
}

class LineBreakTransformer 
{
  constructor() 
  {
    // A container for holding stream data until a new line.
    this.chunks = "";
  }

  transform(chunk, controller) 
  {
    this.chunks += chunk; 
    const lines = this.chunks.split("\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) 
  {
    // When the stream is closed, flush any remaining chunks out.
    controller.enqueue(this.chunks);
  }
}

var colors = ['red', 'orange', 'yellow', 'green', 'lightblue', 'blue', 'pink', 'tan', 'brown', 'white', 'black'];
var selectedColor = 'red';

let drawing = false;

let prevXPos = 0;
let prevYPos = 0;

function draw() 
{
  // Check if the joystick button is pressed
  if (buttonState === 1 && !drawing) 
  {
    drawing = true;

    // Send the "LED_ON" command to the Arduino to turn on the LED
    writer.write(encoder.encode("LED_ON\n"));
  } 
  
  else if (buttonState === 0 && drawing) 
  {
    drawing = false;

    // Send the "LED_OFF" command to the Arduino to turn off the LED
    writer.write(encoder.encode("LED_OFF\n"));
  }
    
  for (var i = colors.length - 1; i >= 0; i--) 
  {
    var color = colors[i];
    showButton(color, 6, 3+i*33);
  }

  if (buttonState === 1 && !buttonPressed)
   {
    buttonPressed = true;
    handleButtonPress();
  } 
  
  else if (buttonState === 0) {
    buttonPressed = false;
  }

  if (drawing) 
  {
    strokeWeight(5);
    stroke(selectedColor);
    line(prevXPos, prevYPos, xPos, yPos);
  }

  // Store the current x and y positions as previous positions for the next loop
  prevXPos = xPos;
  prevYPos = yPos;
}

function handleButtonPress() 
{
  let currentColor = selectedColor;
  let pitch;


  if (currentColor == 'red') 
  {
    pitch = "D2";
    colorSound = "D3";
    synth.triggerAttackRelease("D3", "4n");
  } 
  else if (currentColor == 'orange') 
  {
    pitch = "E2";
    colorSound = "E3";
    synth.triggerAttackRelease("E3", "4n");
  } 
  else if (currentColor == 'yellow')
  {
    pitch = "F2";
    colorSound = "F3";
    synth.triggerAttackRelease("F3", "4n");
  } 
  else if (currentColor == 'green') 
  {
    pitch = "G2";
    colorSound = "G3";
    synth.triggerAttackRelease("G3", "4n");
  } 
  else if (currentColor == 'lightblue') 
  {
    pitch = "A3";
    colorSound = "A4";
    synth.triggerAttackRelease("A4", "4n");
  } 
  else if (currentColor == 'blue') 
  {
    pitch = "B3";
    colorSound = "B4";
    synth.triggerAttackRelease("B4", "4n");
  } 
  else if (currentColor == 'pink') 
  {
    pitch = "C3";
    colorSound = "C4";
    synth.triggerAttackRelease("C4", "4n");
  } 
  else if (currentColor == 'tan') 
  {
    pitch = "D3";
    colorSound = "D4";
    synth.triggerAttackRelease("D4", "4n");
  } 
  else if (currentColor == 'brown') 
  {
    pitch = "E3";
    colorSound = "E4";
    synth.triggerAttackRelease("E4", "4n");
  } 
  else if (currentColor == 'white') 
  {
    pitch = "F3";
    colorSound = "F4";
    synth.triggerAttackRelease("F4", "4n");
  } 
  else if (currentColor == 'black') 
  {
    pitch = "G3";
    colorSound = "G4";
    synth.triggerAttackRelease("G4", "4n");
  }
}

function melody() 
{
  sequence1.start();
}

function buttonSound(whichSound)
{
  sounds.start(whichSound);
}


function showButton(col, x, y) 
{
  noStroke();
  fill(col);
  square(x, y, 40);

  if (dist(x, y, xPos, yPos) < 40 && buttonPressed) 
  {
    selectedColor = col;
  }
}