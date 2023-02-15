let spriteSheet;

let walkingAnimation;

let animations = [];

const GameState =           // initialzes the constructor with Start, playing, and gameover  
{
  Start: "Start",
  Playing: "Playing",
  GameOver: "GameOver"
};

let game = { score: 0, maxScore: 0, maxTime: 30, elapsedTime: 0, totalSprites: 0, state: GameState.Start, targetSprite: 2 };    //set max time to 30 secs 

function preload() 
{
    spriteSheet = loadImage("assets/Ant.png");        // loads the image from folder
}

function setup() 
{
  createCanvas(400, 400);
  imageMode(CENTER);
  angleMode(DEGREES);

  reset();
}

function reset() 
{
  game.elapsedTime = 0;
  game.score = 0;
  game.totalSprites = random(10,30);

  animations = [];
  for(let i=0; i < game.totalSprites; i++) 
  {
    animations[i] = new WalkingAnimation(spriteSheet, 32, 80 , random(50, 350), random(50,350), 4, .2, 6, random([0,1]));     // loading the image with a x and y range of the spritesheet  
  }                                                                                                                           // creating the sprites from random cords with a animation lenght of 4 and speed to .2
}

function draw() 
{
  switch(game.state)                          
  {
    case GameState.Playing:
      background(220);
  
      for(let i=0; i < animations.length; i++) 
      {
          animations[i].draw();
      }

      fill(0);                                                    // game score
      textSize(40);
      text(game.score,20,40);
      let currentTime = game.maxTime - game.elapsedTime;
      text(ceil(currentTime), 300,40);
      game.elapsedTime += deltaTime / 1000;

      if (currentTime < 0)
        game.state = GameState.GameOver;
      break;
    case GameState.GameOver:                                        // Game over screen
      game.maxScore = max(game.score,game.maxScore);

      background(0);
      fill(255);
      textSize(40);
      textAlign(CENTER);
      text("Game Over!",200,200);
      textSize(35);
      text("Score: " + game.score,200,270);
      text("Max Score: " + game.maxScore,200,320);
      break;
    case GameState.Start:                                     // start screen
      background(0);
      fill(255);
      textSize(50);
      textAlign(CENTER);
      text("Ant Squish",200,200);
      textSize(30);
      text("Press Any Key to Start",200,300);
      break;
  }
  
}

function keyPressed() 
{
  switch(game.state) 
  {
    case GameState.Start:
      game.state = GameState.Playing;
      break;
    case GameState.GameOver:
      reset();
      game.state = GameState.Playing;
      break;
  }
}

function mousePressed() 
{
  switch(game.state) 
  {
    case GameState.Playing:
      for (let i=0; i < animations.length; i++) 
      {
        let contains = animations[i].contains(mouseX,mouseY);
        if (contains) 
        {
          if (animations[i].moving != 0)
          {
            animations[i].stop();
            game.score += 1;
          }
        } 
      }
  }
}


class WalkingAnimation 
{
  constructor(spritesheet, sw, sh, dx, dy, animationLength, speed, framerate, vertical = false, offsetX = 0, offsetY = 0)
  {
    this.spritesheet = spritesheet;
    this.sw = sw;
    this.sh = sh;
    this.dx = dx;
    this.dy = dy;
    this.u = 0;
    this.v = 0;
    this.animationLength = animationLength;
    this.currentFrame = 0;
    this.moving = 1;
    this.xDirection = 1;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.speed = speed;
    this.framerate = framerate*speed;
    this.vertical = vertical;
  }


  draw() 
  {

    // if (this.moving != 0)
    //   this.u = this.currentFrame % this.animationLength;
    // else
    //   this.u = 0;

    this.u = (this.moving != 0) ? this.currentFrame % this.animationLength : this.u;
    push();
    translate(this.dx,this.dy);
    if (this.vertical)
      rotate(90);
    scale(this.xDirection,1);
    

    //rect(-26,-35,50,70);        //showing the rectange of each clickable sprite

    image(this.spritesheet,0,0,this.sw,this.sh,this.u*this.sw+this.offsetX,this.v*this.sh+this.offsetY,this.sw,this.sh);
    pop();
    let proportionalFramerate = round(frameRate() / this.framerate);
    if (frameCount % proportionalFramerate == 0) 
    {
      this.currentFrame++;
    }
  
    if (this.vertical)
    {
      this.dy += this.moving*this.speed;
      this.move(this.dy,this.sw / 4,height - this.sw / 4);
    }
    else 
    {
      this.dx += this.moving*this.speed;
      this.move(this.dx,this.sw / 4,width - this.sw / 4);
    }

// checking if the game score is increaing make the speed increase
    
    if(game.score == 1 && this.speed < 2.5)
    {
      this.speed += 1;
    }
    else if (game.score == 2 && this.speed < 3.5)
    {
      this.speed += 2;
    }
    else
    {
      this.speed == 3;
    }
  }




  move(position,lowerBounds,upperBounds)          //movement of the sprites
  {
    if (position > upperBounds)
    {
      this.moveLeft();
    } else if (position < lowerBounds)
    
    {
      this.moveRight();
    }
  }

  moveRight() 
  {
    this.moving = 1;
    this.xDirection = 1;
    this.v = 0;
  }

  moveLeft() 
  {
    this.moving = -1;
    this.xDirection = -1;
    this.v = 0;
  }

  keyPressed(right, left)
  {
    if (keyCode === right)
    {
      
      this.currentFrame = 1;
    } else if (keyCode === left)
    
    {

      this.currentFrame = 1;
    }
  }

  keyReleased(right,left)
  {
    if (keyCode === right || keyCode === left)
    {
      this.moving = 0;
    }
  }

  contains(x,y)                 // the dead or clicked sprite
  {
    //rect(-26,-35,50,70);    // to show reactange of dead ant
    let insideX = x >= this.dx - 26 && x <= this.dx + 25;
    let insideY = y >= this.dy - 35 && y <= this.dy + 35;
    return insideX && insideY;
  }

  stop()
  {
    this.moving = 0;        // setting the frame that the dead ant is on 
    this.u = 5; 
    
  }
  
}