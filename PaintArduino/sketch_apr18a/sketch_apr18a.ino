//Youtube link - https://www.youtube.com/watch?v=lh9-_NFUgcg


const int potPinX = A0;
const int potPinY = A1;
const int joystickSwitchPin = 2;
const int ledPin = LED_BUILTIN;

int potValueX = 0;
int potValueY = 0;
int joystickSwitchState = 0;

void setup() {
  pinMode(joystickSwitchPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  potValueX = analogRead(potPinX);
  potValueY = analogRead(potPinY);
  joystickSwitchState = digitalRead(joystickSwitchPin);
  joystickSwitchState = !joystickSwitchState;

  Serial.print(potValueX);
  Serial.print(",");
  Serial.print(potValueY);
  Serial.print(",");
  Serial.println(joystickSwitchState);

  // Check for incoming serial commands
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();

    // Turn on the LED when the "LED_ON" command is received
    if (command == "LED_ON") {
      digitalWrite(ledPin, HIGH);
    }
    // Turn off the LED when the "LED_OFF" command is received
    else if (command == "LED_OFF") {
      digitalWrite(ledPin, LOW);
    }
  }

  delay(50);
}
