// create a new PolySynth and connect it to the master output
let synth = new Tone.PolySynth().connect(Tone.Master);

// create a new Players object and load the sound files
let sounds = new Tone.Players(
  {
  "red": "sounds/red.wav",
  "orange": "sounds/orange.ogg",
  "yellow": "sounds/yellow.wav",
  "green": "sounds/green.wav",
  "lightblue": "sounds/lightblue.wav",
  "blue": "sounds/blue.wav",
  "pink": "sounds/pink.wav",
  "tan": "sounds/tan.wav",
  "brown": "sounds/brown.wav",
  "white": "sounds/white.wav",
  "black": "sounds/black.wav",
});

// declare variables
let colorSound;
const now = Tone.now();
const delay = new Tone.FeedbackDelay("4n", 0);
let soundNames = ["red", "orange", "yellow", "green", "lightblue", "blue", "pink", "tan", "brown", "white", "black"];
let buttons = [];
let clickCount = 0;
let sequence1, simpSynth;
let bgMelody = ["D5", "F4", "D3" , "F5", "D2", "D4", "D3" , "D5"];
let toneStart = 0;

// function to draw a button
function showButton(col, x, y) 
{
  noStroke();
  fill(col);
  square(x, y, 40);
  // check if the mouse is pressed within the button's bounds
  if (dist(x, y, mouseX, mouseY) < 40 && mouseIsPressed) 
  {
    selectedColor = col;
  }
}

function setup() {
  createCanvas(800, 800);
  background(240);

  // connect the sounds to the delay effect and then to the master output
  sounds.connect(delay);
  delay.toDestination();

  // create a new Synth object and set its volume and other properties
  const simpSynth = new Tone.Synth(
    {
    oscillator: {type: "sawtooth"},
    envelope: {attack: 1, decay: 0, sustain: 1, release: 10}
    }).toDestination();
    simpSynth.volume.value = -35;

  // create a new sequence and start the transport
  sequence1 = new Tone.Sequence(function(time, note) {
    simpSynth.triggerAttackRelease(note, 0.5);
  }, bgMelody, '8n');
  Tone.Transport.bpm.value = 100;
  Tone.Transport.start();
  Tone.Transport.loop = false;
  Tone.Transport.loopStart = 0;
  Tone.Transport.loopEnd = '3:0:0';

  // create a button for each sound file and set its position and click event handler
  soundNames.forEach((word, index) => 
  {
    buttons[index] = createButton(word);
    buttons[index].position(3, index * 34 + 6);
    buttons[index].mousePressed(() => buttonSound(word))
  });

  // call the melody function to start playing the sequence
  melody();
}

// declare an array of color names and a variable to store the selected color
var colors = ['red', 'orange', 'yellow', 'green', 'lightblue', 'blue', 'pink', 'tan', 'brown', 'white', 'black'];
var selectedColor = 'red';

// check the selected color and trigger the corresponding note on the PolySynth
if (selectedColor == 'red') 
{

  synth.triggerAttackRelease("D3", "4n");
  colorSound = "D3";
}
else if (selectedColor == 'orange') 
{
  synth.triggerAttackRelease("E3", "4n");
  colorSound = "E3";
}
else if (selectedColor == 'yellow') 
{
  synth.triggerAttackRelease("F3", "4n");
  colorSound = "F3";
}
else if (selectedColor == 'lime') 
{
  synth.triggerAttackRelease("G3", "4n");
  colorSound = "G3";
}
else if (selectedColor == 'aqua') 
{
  synth.triggerAttackRelease("A4", "4n");
  colorSound = "A4";
}
else if (selectedColor == 'blue') 
{
  synth.triggerAttackRelease("B4", "4n");
  colorSound = "B4";
}
else if (selectedColor == 'magenta') 
{
  synth.triggerAttackRelease("C4", "4n");
  colorSound = "C4";
}
else if (selectedColor == 'tan') 
{
  synth.triggerAttackRelease("D4", "4n");
  colorSound = "D4";
}
else if (selectedColor == 'saddlebrown') 
{
  synth.triggerAttackRelease("E3", "4n");
  colorSound = "E4";
}
else if (selectedColor == 'white')
{
  synth.triggerAttackRelease("F4", "4n");
  colorSound = "F4";
}
else if (selectedColor == 'black') 
{
  synth.triggerAttackRelease("G4", "4n");
  colorSound = "G4";
}

// Define the draw function to render the colored buttons and handle mouse interactions
function draw() 
{
  // Loop through the array of colors in reverse order
  for (var i = colors.length - 1; i >= 0; i--) 
  {
    // Get the current color
    var color = colors[i];
    // Call the showButton function to render a button for this color
    showButton(color, 6, 3+i*33);
  }

  // If the mouse is pressed
  if (mouseIsPressed) 
  {
    // If the mouse is within a certain area of the canvas
    if (mouseX < 45 && mouseY < 375) 
    {
      // Fill the canvas with a light color
      fill(245);   
    } else 
    {
      // Otherwise, draw a line from the previous mouse position to the current position
      push();
      strokeWeight(10);
      stroke(selectedColor);
      line(pmouseX, pmouseY, mouseX, mouseY);
      pop();
    }
  }
}

// Define the melody function to start playing a sequence of sounds
function melody() 
{
  sequence1.start();
}

// Define the buttonSound function to play a specific sound
function buttonSound(whichSound) 
{
  sounds.player(whichSound).start();
}

// Define the mousePressed function to handle mouse clicks
function mousePressed() 
{
  // Get the currently selected color
  let currentColor = selectedColor;
  let pitch;
  // Depending on the selected color, set the pitch and colorSound variables and trigger a sound
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
