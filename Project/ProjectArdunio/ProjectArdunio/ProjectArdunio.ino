// Define the analog joystick pins
#define JOYSTICK_X A0
#define JOYSTICK_Y A1

// Define the joystick button and another button pin
#define JOYSTICK_BUTTON 8
#define ADDITIONAL_BUTTON 12

// Define the LED pin
#define LED_PIN LED_BUILTIN

// Variables to store joystick values
int xValue, yValue;

// Variables to store button states
int joystickButtonState, additionalButtonState;

void setup() {
  // Start the serial communication
  Serial.begin(9600);

  // Set the joystick button and the additional button pins as input
  pinMode(JOYSTICK_BUTTON, INPUT_PULLUP);
  pinMode(ADDITIONAL_BUTTON, INPUT_PULLUP);

  // Set the built-in LED pin as output
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  // Read the joystick values
  xValue = analogRead(JOYSTICK_X);
  yValue = analogRead(JOYSTICK_Y);

  // Read the button states
  joystickButtonState = digitalRead(JOYSTICK_BUTTON);
  additionalButtonState = digitalRead(ADDITIONAL_BUTTON);

  // Send the joystick values and button states to the computer
  Serial.print(xValue);
  Serial.print(",");
  Serial.print(yValue);
  Serial.print(",");
  Serial.print(joystickButtonState == HIGH ? 0 : 1);  // Send 0 if button is not pressed, 1 if it is pressed
  Serial.print(",");
  Serial.println(additionalButtonState == HIGH ? 0 : 1);  // Send 0 if button is not pressed, 1 if it is pressed

  // Check if there is data available to read
  if (Serial.available() > 0) {
    // Read the incoming data
    String scoreString = Serial.readStringUntil('\n');

    // Convert the string to an integer
    int score = scoreString.toInt();

    // Set the brightness of the built-in LED according to the score
    analogWrite(LED_PIN, map(score, 0, 100, 0, 255)); // Adjust the mapping as needed
  }

  // Add a small delay to reduce noise
  delay(10);
}
