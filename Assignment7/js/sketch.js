let initTone = true;
let pitch = 600

// Set up Tone
let osc = new Tone.AMOscillator(pitch, 'sine', 'sine').start();
let gain = new Tone.Gain().toDestination();
let pan = new Tone.Panner().connect(gain);
let ampEnv = new Tone.AmplitudeEnvelope({
  attack: 0.1,
  decay: 0.2,
  sustain: 1.0,
  release: 0.8
}).connect(pan);
osc.connect(ampEnv);

let noise = new Tone.Noise('pink').start();
let noiseEnv = new Tone.AmplitudeEnvelope({
  attack: 0.1,
  decay: 0.2,
  sustain: 1.0,
  release: 0.8
}).connect(gain);

let noiseFilter = new Tone.Filter(800, "highpass").connect(noiseEnv);
noise.connect(noiseFilter);

let isSpaceBarPressed = false;
let dangerImage;

// Set up LFO for siren sound
let lfo = new Tone.LFO({
  type: "sawtooth",
  min: pitch - 300,
  max: pitch + 000,
  frequency: .5
}).start();
lfo.connect(osc.frequency);

function preload() {
  dangerImage = loadImage('media/DangerSign.png');
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  if ((frameCount % 60) === 0) {
    pitch = 300;
  }

  if (isSpaceBarPressed) {
    ampEnv.triggerAttack();
    image(dangerImage, 0, 0, width, height);
  } else {
    ampEnv.triggerRelease();
  }

  text('press and hold any key to play the DANGER sound!', 50, 10);
}

function keyPressed() {
  if (keyCode === 32 && initTone === true) {
    console.log('key pressed');
    Tone.start();
    initTone = false;
  }
  isSpaceBarPressed = true;
}

function keyReleased() {
  isSpaceBarPressed = false;
}
