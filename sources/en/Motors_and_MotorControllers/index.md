---
title: Motion | VEX V5 - C++ API
description: Explore the C++ API reference for Motion Devices in VEXcode with VEX V5. Learn how to code Motors, Motor Groups, Motor Controllers 55 and 29 (for Motor 393), Servo Motors, and Victor 883 Motor Controllers.
---

# Motors and Motor Controllers

Motion methods allow the V5 Brain to control different types of motors and motion devices by adjusting their speed, direction, and rotation.

Each device type rotates according to its configuration in the Devices window.

Below is a list of available devices:

- [**Motor and Motor Group**](motor_and_motor_group.md) - Controls a single V5 Smart Motor with built-in encoder feedback, precise motion control, and advanced movement features, or multiple V5 Smart Motors operating together as a synchronized unit with shared motion commands and settings.
- [**Motor Controller 55**](mc55.md) - Controls DC motors using variable voltage.
- [**Motor 393 (Motor Controller 29)**](motor_393.md) - A 2-wire DC motor controlled via a VEX 3-Wire Motor Controller 29.
- [**Victor 883**](victor_motor.md) - A legacy motor controller that takes a 3-Wire PWM signal from the Brain to control VEXpro/EDR DC motors that can't plug directly into Smart Ports.
- [**Servo Motor**](servo_motor.md) - A position-controlled 3-wire motor that rotates within a fixed range.

```{toctree}
:caption: Motion
:titlesonly: true
:hidden:

./motor_and_motor_group
./mc55
./motor_393
./victor_motor
./servo_motor
```
