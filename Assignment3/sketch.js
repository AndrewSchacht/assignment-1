let spriteSheet;  // declare the spritesheet image files
let greenSheet;

let walkingAnimation; // declare the walking animation varaible
let walkingAnimation2;
let greenWalkingAnimation;


function preload() 
{
  spriteSheet = loadImage("assets/SpelunkyGuy.png");    // loading the image on the file
  greenSheet = loadImage("assets/green.png");
}

function setup() 
{
  createCanvas(400, 400);
  imageMode(CENTER);


  walkingAnimation = new WalkingAnimation(spriteSheet,80,80,200,200,9);     //constructor sheet with varables 
  walkingAnimation2 = new WalkingAnimation(spriteSheet,80,80,100,100,9);    // 2nd splucky going top left opposite direction
  greenAnimation = new WalkingAnimation(greenSheet,80,80,300,300,9);
}

function draw()     // actual function to draw
{
  background(220);
  
  walkingAnimation.draw();
  walkingAnimation2.draw();
  greenAnimation.draw();
}

function keyPressed() {
  walkingAnimation.keyPressed(RIGHT_ARROW,LEFT_ARROW);      // the function used track the user's right and left arrow on keyboard
  walkingAnimation2.keyPressed(LEFT_ARROW,RIGHT_ARROW);     // for other guy and green the order is reverced to flip the movement
  greenAnimation.keyPressed(LEFT_ARROW,RIGHT_ARROW);
}

function keyReleased() {
  walkingAnimation.keyReleased(RIGHT_ARROW,LEFT_ARROW);
  walkingAnimation2.keyReleased(LEFT_ARROW,RIGHT_ARROW);
  greenAnimation.keyReleased(LEFT_ARROW,RIGHT_ARROW);
}

class WalkingAnimation {
  constructor(spritesheet, sw, sh, dx, dy, animationLength, offsetX = 0, offsetY = 0) {
    this.spritesheet = spritesheet;
    this.sw = sw;     //width of image
    this.sh = sh;     //height of image
    this.dx = dx;     //x position of image 
    this.dy = dy;     //y position of image 
    this.u = 0; 
    this.v = 0;
    this.animationLength = animationLength;
    this.currentFrame = 0;
    this.moving = 0;
    this.xDirection = 1;   // which direction the char. is facing - for left and + for right 
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  draw() {              //draw function acually makes sprites move 


    this.u = (this.moving != 0) ? this.currentFrame % this.animationLength : 0;
    push();
    translate(this.dx,this.dy);     
    scale(this.xDirection,1);   // this makes charater use the moving left or right animations
  
    image(this.spritesheet,0,0,this.sw,this.sh,this.u*this.sw+this.offsetX,this.v*this.sh+this.offsetY,this.sw,this.sh);
    pop();
    if (frameCount % 6 == 0) {
      this.currentFrame++;
    }
  
    this.dx += this.moving;
  }

  keyPressed(right, left) {           //mapping the keypressed function to if right arrow pressed move at moving = 1 speed 
    if (keyCode === right) {
      this.moving = 1;
      this.xDirection = 1;
      this.currentFrame = 1;
    } else if (keyCode === left) {    //else use left arrow and go -1 direction (left) at moving left 1 speed
      this.moving = -1;
      this.xDirection = -1;
      this.currentFrame = 1;
    }
  }

  keyReleased(right,left) {                       // edge case statement to say if not hold right or left arrow set movement to 0
    if (keyCode === right || keyCode === left) {
      this.moving = 0;
    }
  }
}