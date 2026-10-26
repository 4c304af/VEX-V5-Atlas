---
title: 3-Wire Devices | VEX V5 - C++ API
description: Explore the C++ API reference for 3-Wire Devices in VEXcode with VEX V5. Learn how to code sensors, motors, and actuators that connect to the three-pin ports on the V5 Brain.
---

# 3-Wire Devices

3-Wire devices connect to the three-pin ports on the V5 Brain. These devices include sensors, legacy motors, and actuators that communicate using simple analog or digital signals.

Below is a list of available 3-Wire devices:

- [**3-Wire Expander**](3-Wire_Expander.md) - A 3-Wire Expander adds additional 3-Wire ports when all of a Brain's built-in ports are in use.
- [**Accelerometer**](Accelerometer.md) - Detects acceleration and tilt along multiple axes to measure motion and orientation. The sensor includes a jumper that adjusts sensitivity between **2G** and **6G** ranges.
- [**Analog In**](AnalogIn.md) - Reads a continuous voltage signal from an analog 3-Wire sensor to report values across a range.
- [**Bumper Switch**](Bumper.md) -  A spring-loaded switch used for detecting collisions or impacts on the robot.
- [**Digital In**](DigitalIn.md) - Reads binary input signals (high or low) from external devices such as switches or sensors.
- [**Digital Out**](DigitalOut.md) - Sends binary output signals (high or low) to control external devices like LEDs or relays.
- [**Encoder**](Encoder.md) - Measures the relative rotational position and direction of a shaft to determine speed or distance traveled.
- [**Gyro Sensor**](Gyro.md) - The Gyro Sensor measures the heading and the rotation of the robot.
- [**LED Indicator**](LED.md) - Controls LED Indicators by turning them on or off.
- [**Light Sensor**](Light.md) - Measures the intensity of ambient light to detect brightness or contrast changes in the robot's environment.
- [**Limit Switch**](Limit.md) - A small switch that detects contact with objects or surfaces.
- [**Line Tracker**](Line.md) - Detects differences in light reflection, allowing the robot to follow lines on the field surface.
- [**Motor 393**](../Motors_and_MotorControllers/motor_393.md) - A legacy DC motor from VEX EDR systems.
- [**Object Sensor**](../CTE_Workcell/ObjectDetector.md) - Uses infrared reflection to detect whether an object is nearby, returning a digital signal when something is within range. Used with the CTE Workcell.
- [**Potentiometer**](Potentiometer.md) - Measures the angular position of a rotating shaft or mechanism. The sensor supports 270 degrees of rotation.
- [**V5 Pneumatics**](./Pneumatics.md) - Control the V5 Pneumatic Solenoid.
- [**Pulse Width Modulation (PWM)**](PWM.md) - Outputs a pulse-width-modulated control signal through a 3-Wire port to drive legacy motor controllers or servos.
- [**Range Finder**](Range_Finder.md) - Uses ultrasonic sound waves to measure the distance between the sensor and nearby objects.
- [**Servo Motor**](../Motors_and_MotorControllers/servo_motor.md) - A position-controlled motor used to rotate mechanisms to specific angles.
- [**Victor Motor**](../Motors_and_MotorControllers/victor_motor.md) - A legacy motor controller that takes a 3-Wire PWM signal from the Brain to control VEXpro/EDR DC motors that can't plug directly into Smart Ports.

```{toctree}
:caption: 3-Wire Devices
:titlesonly: true
:hidden:

./3-Wire_Expander
./Accelerometer
./AnalogIn
./Bumper
./DigitalIn
./DigitalOut
./Encoder
./Gyro
./LED
./Light
./Limit
./Line
../CTE_Workcell/ObjectDetector
./Potentiometer
./Pneumatics
./PWM
./Range_Finder
```
