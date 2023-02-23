let sounds = new Tone.Players
({
  "bonk" : "sounds/bonk.mp3",
  "fart" : "sounds/fart.mp3",
  "laugh" : "sounds/laugh.mp3",
  "yo" : "sounds/yo.mp3"
})

const delay = new Tone.FeedbackDelay("8n", 0.5);
const chorus = new Tone.Chorus(5, 3.5, .03);
const synth = new Tone.PolySynth();

let soundNames = ["bonk", "fart", "laugh", "yo"];
let buttons = [];

let dSlide;
let fSlide;


function setup() 
{
  createCanvas(400, 400);

  sounds.connect(delay);
  delay.toDestination();

  soundNames.forEach((word, index) => 
  {
    buttons[index] = createButton(word);
    buttons[index].position(10, (index + 1) * 50);
    buttons[index].mousePressed(() => buttonSound(word));
  })

  dSlide = createSlider(0., 1., 0.5, 0.05);
  dSlide.mouseReleased(() =>
  {
    delay.delayTime.value = dSlide.value();
  })

  fSlide = createSlider(0., 1., 0.5, 0.05);
  fSlide.mouseReleased(() => 
  {
    delay.feedback.value = fSlide.value();
  })
}

function draw() 
{
  background('green');
  textAlign(CENTER);
  textSize(20);

  push();
  fill(0);
  text("PRESS BUTTONS TO PLAY SOUNDS", width/2, 20);
  pop();

  
  text("Delay ", 40, 380);
  text("Feedback ", 190, 380);
}

function buttonSound(whichSound)
{
  sounds.player(whichSound).start();
}