---
title: Smart Port Devices | VEX V5 - C++ API
description: Explore the C++ API reference for Smart Port Devices in VEXcode with VEX V5. Learn how to use VEX sensors such as Distance, Optical, GPS, and Rotation to make your robot responsive and autonomous.
---

# Smart Port Devices

Smart Port Devices connect directly to the V5 Brain through its Smart Ports. These devices expand your robot's capabilities by enabling sensing, motion control, and advanced feedback systems.

Smart Port sensors provide real-time environmental and motion data that your robot can use for decision-making and control.

- [**Inertial Sensor**](./Inertial_Sensor) - Track heading, rotation, and acceleration for precise movement and orientation.
- [**Rotation Sensor**](./Rotation_Sensor) - Measure rotational position, direction, and speed.
- [**Distance Sensor**](./Distance_Sensor) - Measure the distance between the sensor and nearby objects.
- [**Optical Sensor**](./Optical_Sensor) - Detect color, brightness, and proximity to objects.
- [**GPS Sensor**](./GPS_Sensor) - Determine the robot's position and heading on the field relative to the GPS Field Code.
- [**AI Vision Sensor**](./AI_Vision_Sensor) - Detect and classify objects using AI-based vision processing.
- [**Vision Sensor**](./Vision_Sensor) - Detect and track color signatures within its field of view.

In addition to the devices listed above, V5 Smart Motors also connect through Smart Ports. See the [**Motors and Motor Controllers**](../Motors_and_MotorControllers/index.md) documentation for motor-specific APIs.

```{toctree}
:caption: Sensing
:titlesonly: true
:hidden:

./Inertial_Sensor
./Rotation_Sensor
./Distance_Sensor
./Optical_Sensor
./GPS_Sensor
./AI_Vision_Sensor
./Vision_Sensor
```
