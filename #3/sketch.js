function setup() {
  createCanvas(300, 150);
  frameRate(15);
}

function draw() {
  background(0);
 
 
  fill(255,255,0);      //fill the circle yellow
  circle(75,75, 125);   // circle
 
  fill(0);              //fill black
  beginShape();         //began vertex shape triangle
 
  vertex(0,0);          //vertexs
  vertex(0, 150);
  vertex(75,75);
 
  endShape();
 
fill(255,0,0);
 arc(225, 75, 120, 120, PI, 0);

  noStroke();
  rect(165, 70, 120, 65);
 
  fill(255);
  circle(195, 75, 40)
  circle(255, 75, 40)
 
  fill(0,0, 255)
  circle(195, 75, 25)
  circle(255, 75, 25)
 
 
 
  fill(255);
  text(mouseX + ", " + mouseY, mouseX, mouseY);
}