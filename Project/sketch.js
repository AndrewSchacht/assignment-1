// youtube link - https://www.youtube.com/watch?v=tIuWrb-CJpU
// github link - https://github.com/AndrewSchacht/csc2463/tree/main/Project
// there are some parts of the code that were an speed function, but i could not get it to work with the joystick

let synth1, synth2, synth3;
let catchSound;
let gameOverSound;
let backgroundMusic;
let backgroundSequence;

let gameState = "start";
let playerX;
const playerY = 400;
const playerWidth = 50;
const playerHeight = 50;
let objects = [];
let score = 0;
let lives = 3;
let timer = 30;
let objectInterval = 1500;
let lastObjectTime = 0;
let startTime;
let lastSpeedUpTime = 0;
let gameOverSoundPlayed = false;
let spaceKeyPressed = false;


let connectButton;
let port;
let reader;
let writer;
let xPos;
let previousXPos;
let yPos;
let buttonState;
let speedupButtonState;

function startAudioContext() {
  Tone.start();
  console.log('Audio context started');
  if (Tone.context.state !== 'running') {
    Tone.context.resume();
  }
}

window.addEventListener('click', startAudioContext);

let sounds = new Tone.Players({
  "catchSound": "sounds/catchSound.wav",
}).toDestination();

function setup() {
  createCanvas(500, 500);
  playerX = width / 2;

  if ("serial" in navigator) 
  {
    // The Web Serial API is supported
    connectButton = createButton("connect");
    connectButton.position(420, 460);
    connectButton.mousePressed(connect);
  }


  // Initialize background synthesizer
  backgroundSynth = new Tone.PolySynth();

  // Adjust the volume of the background music
  backgroundSynth.volume.value = -20; // Use a more negative value to decrease the volume
  backgroundSynth.toDestination();

  // Initialize synthesizers
synth1 = new Tone.Synth().toDestination();
synth2 = new Tone.FMSynth().toDestination();
synth3 = new Tone.Synth().toDestination();

// Set the volume for synth1 and synth2
synth1.volume.value = 5; // Increase the volume by setting a less negative value (e.g., -10)
synth2.volume.value = -1; // Increase the volume by setting a less negative value (e.g., -10)

  // Initialize speedup synthesizer
  speedupSynth = new Tone.AMSynth({
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.1,
      release: 0.5,
    },
  }).toDestination();

  // Initialize modulation
  modulator = new Tone.LFO(5, -1200, 1200).start();
  modulator.connect(synth1.detune);

  // Add PingPongDelay effect to synth1
  let delay = new Tone.PingPongDelay("16n", 0.02).toDestination();
  synth1.connect(delay);

  // Initialize miss sound event
  missSoundEvent = new Tone.ToneEvent((time) => {
    synth1.triggerAttackRelease("C4", "8n", time);
    synth2.triggerAttackRelease("G4", "8n", time + 0.1);
  });

  // Initialize gameOver sound event
  gameOverSoundEvent = new Tone.ToneEvent((time) => {
    synth3.triggerAttackRelease("F3", "8n", time);
  });


  // Create a sequence for background music
  backgroundSequence = new Tone.Sequence(
    (time, note) => {
      backgroundSynth.triggerAttackRelease(note, "8n", time);
    },

    [ "A4", "C4", "E4", "B4", "A3" ],
    "8n"
  );

  backgroundSequence.loop = true;
  startBackgroundMusic();

  Tone.Transport.start();
}

async function serialRead() {
  let previousScore = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      reader.releaseLock();
      break;
    }
    let vals = value.split(',');
    if (vals.length === 4) { // Check if there are 4 values
      xPos = map(Number(vals[0]), 0, 1023, 0, width);
      yPos = map(Number(vals[1]), 0, 1023, 0, height);
      buttonState = Number(vals[2]);
      speedupButtonState = Number(vals[3]); // Store the speedup button state
    }

    // Check if the score has increased
    if (score > previousScore) {
      flashLED(); // Flash the LED
      previousScore = score;
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

function startBackgroundMusic() {
  backgroundSequence.start();
}


function stopBackgroundMusic() {
  backgroundSequence.stop();
}

function draw() {
  background(220);

  if (gameState === "start") {
    startGameScene();
  } else if (gameState === "playing") {
    playingGameScene();
  } else if (gameState === "gameOver") {
    gameOverScene();
  }
}



function startGameScene() {
  textSize(30);
  textAlign(CENTER);
  text("Catch the Falling Objects", width / 2, height / 2 - 50);
  textSize(18);
  text("Press down on the JoyStick button to Start", width / 2, height / 2);

  // Start the game scene
if (typeof buttonState !== 'undefined' && buttonState === 1) {
  gameState = "playing";
  resetGame();
}

}

function playMissSound() {
  synth1.triggerAttackRelease("C2", "8n");
}

function playspeedupSound() {
  let currentTime = millis();
  let timeDifference = currentTime - lastSpeedUpTime;
  if (timeDifference > 100) { // Set a threshold of 100 milliseconds
    speedupSynth.triggerAttackRelease("A4", "8n");
    lastSpeedUpTime = currentTime;
  }
}


function playingGameScene() {
  background(220);

  textSize(20);
  text("Time: " + timer, 40, 30);
  let scoreText = "Score: " + score;
  text(scoreText, width - textWidth(scoreText) - 20, 30);
  text("Lives: " + lives, 40, height - 30);

  let elapsedMillis = millis() - startTime;
  let remainingTime = 30 - int(elapsedMillis / 1000);
  let interval = map(remainingTime, 30, 0, 1500, 500);

  timer = remainingTime;
 
  if (millis() - lastObjectTime > objectInterval) {
    let obj = {
      x: random(width),
      y: 0,
      size: map(timer, 30, 0, 20, 50),
      color: color(random(255), random(255), random(255))
    };
    objects.push(obj);
    lastObjectTime = millis();
    objectInterval = interval;
  }

  // move and display falling objects
  for (let i = objects.length - 1; i >= 0; i--) {
    let obj = objects[i];
    obj.y += map(obj.size, 20, 50, 5, 15); // scale object speed based on size
    fill(obj.color);
    circle(obj.x, obj.y, obj.size);
    if (obj.y > height) { // remove object if it goes out of screen
      objects.splice(i, 1);
      lives--; // reduce player's lives if they miss an object
      console.log("miss sound played"); 
      playMissSound(); // play miss sound effect
    }
    else if (dist(obj.x, obj.y, playerX, playerY) < (obj.size + playerWidth) / 2) { // check collision with player
      objects.splice(i, 1);
      score++; // increase player's score if they catch an object
      console.log("catch sound played"); 
      sounds.player("catchSound").start();
    }
    if (typeof writer !== 'undefined') {
      let encoder = new TextEncoder();
      let data = new TextEncoder().encode(score + '\n');
      writer.write(data); // Send the score to the LED

  }  
  }

  // display player
  fill(0, 255, 0);
  rect(playerX - playerWidth / 2, playerY - playerHeight / 2, playerWidth, playerHeight);

  let speed = 2;
  const xPosChangeThreshold = 10;
  
    if (typeof xPos !== 'undefined' && typeof yPos !== 'undefined') {
      playerX = xPos;
    }
  
    if (typeof xPos !== 'undefined' && typeof previousXPos !== 'undefined' && Math.abs(xPos - previousXPos) > xPosChangeThreshold) {
      playspeedupSound(); // Play synthesized speedup sound
      previousXPos = xPos;
    }

  // end game if timer reaches zero or player loses all lives
  if (timer == 0 || lives == 0) {
    gameState = "gameOver"; // change game state to gameOver
  }
}


function gameOverScene() {
  if (!gameOverSoundPlayed) {
    gameOverSoundEvent.start(); // Change this line to use synthesized gameOver sound
    gameOverSoundPlayed = true;
    stopBackgroundMusic(); // stop background music when the game ends
  }

  textSize(30);
  textAlign(CENTER);
  text("Game Over", width / 2, height / 2 - 50);
  text("Final Score: " + score, width / 2, height / 2);
  textSize(20);
  text("Press down on the JoyStick button to Restart", width / 2, height / 2 + 50);

  // Reset the game in the game over scene
if (typeof buttonState !== 'undefined' && buttonState === 1) {
  gameState = "playing";
  resetGame();
}

}

function flashLED() {
  if (typeof writer !== 'undefined') {
    let encoder = new TextEncoder();
    let turnOn = encoder.encode('255\n'); // Turn on the LED
    writer.write(turnOn);
    setTimeout(() => {
      let turnOff = encoder.encode('0\n'); // Turn off the LED after a short delay
      writer.write(turnOff);
    }, 100);
  }
}


function resetGame() {
  objects = [];
  score = 0;
  lives = 3;
  timer = 30;
  objectInterval = 1500;
  lastObjectTime = 0;
  startTime = millis();
  gameOverSoundPlayed = false;
  startBackgroundMusic(); // start background music when the game starts or restarts
  Tone.Transport.start();
  previousXPos = null; // set previousXPos to null when the game restarts
  if (typeof writer !== 'undefined') {
    let data = new TextEncoder().encode('0\n'); // Turn off the LED when the game restarts
    writer.write(data);
  }
}
