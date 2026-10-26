---
title: Servo Motor | VEX V5 - C++ API
description: Reference documentation for the servo class in VEX V5 C++. Includes constructors, functions, parameters, notes, and usage examples.
---

```{highlight} cpp
:linenothreshold: 5
```

# Servo Motor

```{contents}
:local: true
```


## Introduction

The <code>servo</code> class is used to control and configure a V5 3-Wire Servo Motor. The V5 3-Wire Servo Motor provides position-based control within a fixed range of motion.

![The VEX 3-Wire Servo Motor](/_static/img/motion/servo.png)

## Class Constructors

```cpp
servo( triport::port& port );
```

## Class Destructor

Destroys the <code>servo</code> object and releases associated resources.

```cpp
~servo();
```

## Parameters

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>port</code> | <code>triport::port&</code> | The 3-Wire Port that the Servo Motor is connected to, written as <code>Brain.ThreeWirePort.X</code> or <code>ExpanderName.X</code>, where <code>X</code> is the port letter (for example, <code>Brain.ThreeWirePort.A</code> or <code>Expander1.A</code>). |

## Notes

- A [Brain](../Brain/index.md) or 3-Wire Expander must be created first before they can be used to create an object with the <code>servo</code> class constructor.

## Example

```cpp
// Create the servo instance on 3-Wire Port A
servo myServo = servo(Brain.ThreeWirePort.A);
```

## Member Functions

The <code>servo</code> class includes the following member functions:

- [<code>setPosition</code>](#setposition) — Moves the servo motor to a specified position.

Before calling any <code>servo</code> member functions, a <code>servo</code> instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
Servo configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create the servo instance on 3-Wire Port A
servo myServo = servo(Brain.ThreeWirePort.A);
```

### setPosition

```{vexcode}
id: v5_motion_servo_set_position
```

Moves the servo motor to a specified position.

![A diagram of a servo motor showing the degrees that it can rotate, from 100 on the left to 50 in the center, to 0 on the far right.](/_static/img/motion/servo-diagram.png)

<span style="font-size: 1.5rem;">
  Available Functions
</span>

> **__1__ —** Sets the servo position using a percentage value.
> ```cpp
> void setPosition(
>  int32_t value,
>  percentUnits units );
> ```

> **__2__ —** Sets the servo position using rotation units.
> ```cpp
> void setPosition(
>  double value,
>  rotationUnits units );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>value</code> | <code>int32_t</code> | The servo position value when using percentage units. |
| <code>value</code> | <code>double</code> | The servo position value when using rotation units. |
| <code>units</code> | <code>percentUnits</code> | The position unit: <code>percent</code> / <code>pct</code> — percent |
| <code>units</code> | <code>rotationUnits</code> | The position unit:<ul><li><code>deg</code> / <code>degrees</code> — degrees</li><li><code>turns</code> / <code>rev</code> — revolutions</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- When using percentage units, the valid range is 0 – 100%.
- A servo begins each project by automatically centering itself at 50 degrees before completing any movements.
- When using rotation units, the servo will move to the absolute position specified.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Set the servo position to 10 percent
myServo.setPosition(10, percent);

// Set the servo position to 45.5 degrees
myServo.setPosition(45.5, degrees);

// Set the servo position to 90 degrees
myServo.setPosition(90, degrees);
```