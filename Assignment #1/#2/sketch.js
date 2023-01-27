function setup() {
     
    // Create Canvas of given size
    createCanvas(300, 300);
 
}
 
function draw() {
     
    background('white');
   
  //right cicle
  fill(0,255,0,50);
    // Draw a circle
    circle(200, 175, 150);
   
   
  noFill();
  noStroke ();
 
  //left circle
  fill(0,0,255,50);
    // Draw a circle
    circle(100, 175, 150);
   
  //top circle
  fill(255,0,0,50);
    // Draw a circle
    circle(150, 100, 150);
   
}