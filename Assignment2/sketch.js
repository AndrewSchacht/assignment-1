let red, orange, yellow, lightgreen, cyan, blue, violet, brown, white, black, activeColor;        
//color variables

function setup() 
{
  createCanvas(600, 600);     
  background(240);             // set to slightly darker white to see white
  
  red = new colorCube(2, 2, 30, 30, "red");
  orange = new colorCube(2, 35, 30, 30, "orange");
  yellow = new colorCube(2, 70, 30, 30, "yellow");
  lightgreen = new colorCube(2, 105, 30, 30, "lightgreen");
  cyan = new colorCube(2, 140, 30, 30, "cyan");
  blue = new colorCube(2, 175, 30, 30, "blue");
  violet = new colorCube(2, 210, 30, 30, "violet");
  brown = new colorCube(2, 245, 30, 30, "#794533");
  white = new colorCube(2, 280, 30, 30, "white");
  black = new colorCube(2, 315, 30, 30, "black");
  
  activeColor = 0; //set the default starting color to black
  
}

function draw() // function to start drawing a line
{ 
  if (mouseIsPressed)
  
  {
    drawing();
  }
  // color methods for color's appear and MousePressed
  
  red.appear();
  red.onMousePressed();
  
  orange.appear();
  orange.onMousePressed();
  
  yellow.appear();
  yellow.onMousePressed();
  
  lightgreen.appear();
  lightgreen.onMousePressed();
  
  cyan.appear();
  cyan.onMousePressed();
  
  blue.appear();
  blue.onMousePressed();
  
  violet.appear();
  violet.onMousePressed();
  
  brown.appear();
  brown.onMousePressed();
  
  white.appear();
  white.onMousePressed();
  
  black.appear();
  black.onMousePressed();
}


class colorCube //  x-axis, y-axis, width, height, and color
{
  constructor(x, y, w, h, color) 
  {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
  }

  appear() //acually makes the line on the canvas
  {
    noStroke();
    fill(this.color);
    rect(this.x, this.y, this.w, this.h);
  }

  onMousePressed() // checks if mouse is acually on the Cube, then changes color
  { 
    if (mouseIsPressed)
    {
      if (mouseX < 31) // 30 is w h of each cube
      {
        colorChange();
      }
    }
  }
}
// changes the color of the line based on the y value of each cube
function colorChange() 
{ 
  if (mouseY > 2 && mouseY < 35) { //changes the color based on the y vaule to the this.color value  
    activeColor = "red"; 
  } else if (mouseY > 35 && mouseY < 70) {
    activeColor = "orange";
  } else if (mouseY > 70 && mouseY < 105) {
    activeColor = "yellow";
  } else if (mouseY > 105 && mouseY < 140) {
    activeColor = "lightgreen";
  } else if (mouseY > 140 && mouseY < 175) {
    activeColor = "cyan";
  } else if (mouseY > 175 && mouseY < 210) {
    activeColor = "blue";
  } else if (mouseY > 210 && mouseY < 245) {
    activeColor = "violet";
  } else if (mouseY > 245 && mouseY < 280) {
    activeColor = "#794533";
  } else if (mouseY > 280 && mouseY < 315) {
    activeColor = "white";
  } else if (mouseY > 315 && mouseY < 350) {
    activeColor = "black";   
  }
}

function drawing() //draws
{ 
  if (mouseX > 30) //checks to make sure the cubes are always visable
  { stroke(activeColor); // curent drawing color
    strokeWeight(6); // weight ofline
    line(pmouseX, pmouseY, mouseX, mouseY); 
  }
}