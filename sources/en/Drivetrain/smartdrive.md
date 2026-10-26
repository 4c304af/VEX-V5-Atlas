---
title: smartdrive | VEX V5 - C++ API
description: Reference documentation for the smartdrive class in VEX V5 C++. Includes constructors, functions, parameters, notes, and member functions.
---

```{highlight} cpp
:linenothreshold: 5
```

# smartdrive

```{contents}
:local: true
```

## Introduction

The <code>smartdrive</code> class controls how a robot drives and turns using motors, wheels, and a sensor. A <code>smartdrive</code> can use an [Inertial Sensor](../Smart_Port_Devices/Inertial_Sensor.md), [Gyro Sensor](../3-Wire_Devices/Gyro.md), or [GPS Sensor](../Smart_Port_Devices/GPS_Sensor.md) to track heading and rotation.

A <code>smartdrive</code> uses the sensor to help the robot move and turn precisely. At the start of each project, the drivetrain calibrates the sensor automatically. Keep the robot still for about 2 seconds during calibration, so the robot can move and turn correctly.

The <code>smartdrive</code> class is based on the [<code>drivetrain</code>](index.md) class. It can use the same drive and turn functions as [<code>drivetrain</code>](index.md), and it also adds sensor-based functions like <code>turnToHeading</code> and <code>turnToRotation</code>.

## Class Constructors

> **__1__ —** Creates a smartdrive using existing <code>motor_group</code> objects for the left (<code>&l</code>) and right (<code>&r</code>) sides, along with an Inertial Sensor, Gyro Sensor, or GPS Sensor.
> ```cpp
> smartdrive(
>     motor_group     &l,
>     motor_group     &r,
>     inertial        &g,
>     double          wheelTravel = 320,
>     double          trackWidth  = 320,
>     double          wheelBase   = 130,
>     distanceUnits   unit = mm,
>     double          externalGearRatio = 1.0 );
> ```

> **__2__ —** Creates a smartdrive using existing <code>motor</code> objects for the left (<code>&l</code>) and right (<code>&r</code>) sides, along with an Inertial Sensor, Gyro Sensor, or GPS Sensor.
> ```cpp
> smartdrive(
>     motor           &l,
>     motor           &r,
>     inertial        &g,
>     double          wheelTravel = 320,
>     double          trackWidth  = 320,
>     double          wheelBase   = 130,
>     distanceUnits   unit = mm,
>     double          externalGearRatio = 1.0 );
> ```


## Class Destructor

Destroys the <code>smartdrive</code> object and releases associated resources.

```cpp
~smartdrive();
```

## Parameters

The sensor parameter can be an <code>inertial</code>, <code>gyro</code>, or <code>gps</code> object.

| Parameter | Type | Description |
|:---:|:---:|:----|
| <code>&l</code> / <code>&r</code> | <code>motor_group</code> / <code>motor</code> | References to existing <code>motor</code> or <code>motor_group</code> instances. Both parameters must be of the same type: either two <code>motor_group</code> instances or two <code>motor</code> instances. The <code>&l</code> parameter refers to the left motor or motor group, and <code>&r</code> refers to the right motor or motor group.|
| <code>&g</code> | <code>gyro&</code> | A reference to an existing <code>gps</code>, <code>gyro</code>, or <code>inertial</code> instance. |
| <code>wheelTravel</code> | <code>double</code> | The circumference of the drivetrain wheels. The default is <code>320</code>. |
| <code>trackWidth</code> | <code>double</code> | The distance between the left and right wheels. The default is <code>320</code>. |
| <code>wheelBase</code> | <code>double</code> | The distance between the front and back wheels. The default is <code>130</code>. |
| <code>unit</code> | <code>distanceUnits</code> | The unit for <code>wheelTravel</code>, <code>trackWidth</code>, and <code>wheelBase</code>: <code>mm</code> (millimeters, default) or <code>inches</code>. |
| <code>externalGearRatio</code> | <code>double</code> | The gear ratio used to adjust drive distances if gears are used. The default is <code>1.0</code>. |

## Example

```cpp
/* This constructor is required when using VS Code.
Drivetrain configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create the left and right motor instances
motor leftMotor = motor(PORT1, false);
motor rightMotor = motor(PORT9, true);

// Create the inertial instance
inertial myInertial = inertial(PORT3);

// Create the smartdrive instance
smartdrive myDrivetrain = smartdrive(
    leftMotor,  // left motor object
    rightMotor, // right motor object
    myInertial, // inertial object
    259.34,     // wheelTravel
    320,        // trackWidth
    40,         // wheelBase
    mm,         // unit
    1.0 );      // externalGearRatio
```

## Member Functions

The <code>smartdrive</code> class includes the following member functions:

**Actions — Turn the robot using heading or rotation.**
- [<code>turnToHeading</code>](#turntoheading) — Turns the robot to face a specific heading from -359 to 359 degrees. The robot will turn the shortest direction to reach the target heading.
- [<code>turnToRotation</code>](#turntorotation) — Turns the robot to a specific rotation.
- [<code>calibrateDrivetrain</code>](#calibratedrivetrain) — Calibrates the drivetrain's configured [Inertial Sensor](../Smart_Port_Devices/Inertial_Sensor.md), [Gyro Sensor](../3-Wire_Devices/Gyro.md), or [GPS Sensor](../Smart_Port_Devices/GPS_Sensor.md).

**Settings — Adjust heading and rotation values.**
- [<code>setHeading</code>](#setheading) — Changes the robot's current heading to a new heading.
- [<code>setRotation</code>](#setrotation) — Changes the robot's current rotation to a new rotation.

**Values — Check heading and rotation.**
- [<code>heading</code>](#heading) — Returns the robot's current heading from 0 to 359 degrees.
- [<code>rotation</code>](#rotation) — Returns the robot's current rotation.

A <code>smartdrive</code> can also use the inherited member functions from [<code>drivetrain</code>](index.md), such as <code>drive</code>, <code>driveFor</code>, <code>turn</code>, <code>turnFor</code>, <code>stop</code>, <code>isDone</code>, and <code>isMoving</code>.

Before calling any <code>smartdrive</code> member functions, a <code>smartdrive</code> instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
Drivetrain configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create the left and right motor instances
motor leftMotor = motor(PORT1, false);
motor rightMotor = motor(PORT9, true);

// Create the inertial instance
inertial myInertial = inertial(PORT3);

// Create the smartdrive instance
smartdrive myDrivetrain = smartdrive(
    leftMotor,  // left motor object
    rightMotor, // right motor object
    myInertial, // inertial object
    259.34,     // wheelTravel
    320,        // trackWidth
    40,         // wheelBase
    mm,         // unit
    1.0 );      // externalGearRatio
```

### turnToHeading

```{vexcode}
id: v5_drivetrain_turn_to_heading
```

A heading is the direction the robot is facing, measured in degrees. <code>turnToHeading</code> turns the robot to face a specific heading from -359 to 359 degrees. The robot will turn the shortest direction to reach the target heading.

The robot's starting heading is 0 degrees.

The project will wait until the robot is done turning before the next line of code runs.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Turns the drivetrain to the specified heading using the currently [configured turn velocity](index.md#setturnvelocity).
> ```cpp
> bool turnToHeading(
>     double        angle,
>     rotationUnits units,
>     bool          waitForCompletion = true );
> ```

> **__2__ —** Turns the drivetrain to the specified heading at the specified velocity.
> ```cpp
> bool turnToHeading(
>     double        angle,
>     rotationUnits units,
>     double        velocity,
>     velocityUnits units_v,
>     bool          waitForCompletion = true );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>angle</code>   | <code>double</code>  | The direction the robot should face, in degrees. This can be from -359 to 359 when using <code>deg</code> or <code>degrees</code>.     |
| <code>units</code>   | <code>rotationUnits</code>  | The rotation unit: <code>deg</code> (degrees), <code>rev</code> (revolutions), or <code>raw</code> (raw units). One revolution is equal to 360 degrees.     |
| <code>velocity</code>   | <code>double</code>  | The velocity to turn with from 0% to 100% when using <code>velocityUnits::pct</code>, from 0 to 600 rpm when using <code>rpm</code>, or from 0 to 3600 degrees per second when using <code>dps</code>. If no velocity is provided, the robot turns at the current turn velocity.     |
| <code>units_v</code>   | <code>velocityUnits</code>  | The velocity unit: <code>velocityUnits::pct</code> (percent), <code>rpm</code> (rotations per minute), or <code>dps</code> (degrees per second).     |
| <code>waitForCompletion</code>   | <code>bool</code>  | <code>true</code> (default) makes the project wait until the robot is done turning before the next line of code runs. <code>false</code> makes the next line of code run right away.     |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns whether the robot reached the target heading, as a Boolean value.

- <code>true</code> — The robot reached the target heading.
- <code>false</code> — The robot did not finish the turn, or the function returned before the turn completed because <code>waitForCompletion</code> was set to <code>false</code>.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Executing another drivetrain movement function (such as [<code>turn</code>](index.md#turn) or [<code>drive</code>](index.md#drive)) while <code>turnToHeading</code> is in progress will interrupt the current movement.
- Because <code>turnToHeading</code> is target-based (uses an <code>angle</code> parameter), functions such as [<code>isDone</code>](index.md#isdone) and [<code>isMoving</code>](index.md#ismoving) work with <code>turnToHeading</code>.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Face the new 0 degrees
myDrivetrain.setHeading(90, degrees);
myDrivetrain.turnToHeading(0, degrees);
```

### turnToRotation

```{vexcode}
id: v5_drivetrain_turn_to_rotation
```

<code>turnToRotation</code> turns the robot to a specific rotation.

Rotation is how much the robot has turned, measured in degrees or revolutions. At the beginning of a project, the rotation value is set to 0 degrees. Rotation can also be set using the [<code>setRotation</code>](#setrotation) function.

Rotation values are absolute. This means the direction of the turn depends on the robot's current rotation. Turning right increases the rotation, and turning left decreases the rotation.

For example, if the robot starts at 0 degrees and you turn to a rotation of 720 degrees, it will turn right twice. If you then turn to a rotation of 360 degrees, it will turn left once, because 360 is less than 720.

The project will wait until the robot is done turning before the next line of code runs.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Turns the drivetrain to the specified rotation using the currently [configured turn velocity](index.md#setturnvelocity).
> ```cpp
> bool turnToRotation(
>     double        angle,
>     rotationUnits units,
>     bool          waitForCompletion = true );
> ```

> **__2__ —** Turns the drivetrain to the specified rotation at the specified velocity.
> ```cpp
> bool turnToRotation(
>     double        angle,
>     rotationUnits units,
>     double        velocity,
>     velocityUnits units_v,
>     bool          waitForCompletion = true );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>angle</code>   | <code>double</code>  | The rotation value that the robot will turn to.     |
| <code>units</code>   | <code>rotationUnits</code>  | The rotation unit: <code>deg</code> (degrees), <code>rev</code> (revolutions), or <code>raw</code> (raw units). One revolution is equal to 360 degrees.     |
| <code>velocity</code>   | <code>double</code>  | The velocity to turn with from 0% to 100% when using <code>velocityUnits::pct</code>, from 0 to 600 rpm when using <code>rpm</code>, or from 0 to 3600 degrees per second when using <code>dps</code>. If no velocity is provided, the robot turns at the current turn velocity.     |
| <code>units_v</code>   | <code>velocityUnits</code>  | The velocity unit: <code>velocityUnits::pct</code> (percent), <code>rpm</code> (rotations per minute), or <code>dps</code> (degrees per second).     |
| <code>waitForCompletion</code>   | <code>bool</code>  | <code>true</code> (default) makes the project wait until the robot is done turning before the next line of code runs. <code>false</code> makes the next line of code run right away.     |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns whether the robot reached the target rotation, as a Boolean value.

- <code>true</code> — The robot reached the target rotation.
- <code>false</code> — The robot did not finish the turn, or the function returned before the turn completed because <code>waitForCompletion</code> was set to <code>false</code>.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Executing another drivetrain movement function (such as [<code>turn</code>](index.md#turn) or [<code>drive</code>](index.md#drive)) while <code>turnToRotation</code> is in progress will interrupt the current movement.
- Because <code>turnToRotation</code> is target-based (uses an <code>angle</code> parameter), functions such as [<code>isDone</code>](index.md#isdone) and [<code>isMoving</code>](index.md#ismoving) work with <code>turnToRotation</code>.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Spin counterclockwise for 2 turns, then face forward
myDrivetrain.setRotation(720, degrees);
myDrivetrain.turnToRotation(0, degrees);
```

### calibrateDrivetrain

```{vexcode}
id: v5_drivetrain_calibrate_drivetrain
```

<code>calibrateDrivetrain</code> calibrates the Inertial Sensor, Gyro Sensor, or GPS Sensor configured with the smartdrive.

Calibration helps the sensor measure movement correctly. Keep the robot still for about 2 seconds during calibration. If the robot moves during calibration, the sensor may not measure movement correctly.

The project will wait until calibration is done before the next line of code runs.

<code>calibrateDrivetrain</code> is generated automatically by VEXcode when a drivetrain is configured with an Inertial Sensor, GPS Sensor, or Gyro Sensor. It is provided as part of the project source and is not part of the VEX V5 C++ API.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void calibrateDrivetrain();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The robot calibrates automatically at the start of each project.
- Keep the robot still for about 2 seconds during calibration.

<span style="font-size: 1.5rem; ">
  Function Implementation
</span>

The following is the auto-generated implementation of <code>calibrateDrivetrain</code> created by VEXcode:

```cpp
bool vexcode_initial_drivetrain_calibration_completed = false;
void calibrateDrivetrain() {
  wait(200, msec);
  Brain.Screen.print("Calibrating");
  Brain.Screen.newLine();
  Brain.Screen.print("Inertial");
  DrivetrainInertial.calibrate();
  while (DrivetrainInertial.isCalibrating()) {
    wait(25, msec);
  }
  vexcode_initial_drivetrain_calibration_completed = true;
  // Clears the screen and returns the cursor to row 1, column 1.
  Brain.Screen.clearScreen();
  Brain.Screen.setCursor(1, 1);
}
```

### setHeading

```{vexcode}
id: v5_drivetrain_set_heading
```

A heading is the direction the robot is facing, measured in degrees. <code>setHeading</code> changes the robot's current heading to a new heading value.

For example, if the robot has turned to face right, setting the heading to 0 degrees makes that right-facing position the new 0 degrees. Then the robot can turn to other positions based on that new heading.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void  setHeading(
  double value,
  rotationUnits units);
```
<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>value</code>   | <code>double</code>  | The heading value to set for the robot. This can be from -359 to 359 when using <code>deg</code> or <code>degrees</code>.     |
| <code>units</code>   | <code>rotationUnits</code>  | The heading unit: <code>deg</code> (degrees), <code>rev</code> (revolutions), or <code>raw</code> (raw units). One revolution is equal to 360 degrees.     |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Face the new 0 degrees
myDrivetrain.setHeading(90, degrees);
myDrivetrain.turnToHeading(0, degrees);
```

### setRotation

```{vexcode}
id: v5_drivetrain_set_rotation
```

Rotation is how much the robot has turned, measured in degrees or revolutions. At the beginning of a project, the rotation value is set to 0 degrees. <code>setRotation</code> changes the robot's current rotation to a new value.

For example, if the robot has made two full turns to the right, its rotation value will be 720 degrees. Setting the rotation to 0 degrees will reset that rotation from 720 to 0 degrees. Then the robot can turn to rotations based on that new value.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void  setRotation(
  double value,
  rotationUnits units);
```
<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>value</code>   | <code>double</code>  | The rotation value to set for the robot.     |
| <code>units</code>   | <code>rotationUnits</code>  | The heading unit: <code>deg</code> (degrees), <code>rev</code> (revolutions), or <code>raw</code> (raw units). One revolution is equal to 360 degrees.     |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Spin counterclockwise for 2 turns, then face forward
myDrivetrain.setRotation(720, degrees);
myDrivetrain.turnToRotation(0, degrees);
```

### heading

```{vexcode}
id: v5_drivetrain_heading
```

A heading is the direction the robot is facing, measured in degrees. <code>heading</code> returns the robot's current heading from 0 to 359 degrees.

The robot's starting heading is 0 degrees.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double heading( rotationUnits units = rotationUnits::deg );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>units</code>   | <code>rotationUnits</code>  | Optional. The unit to return heading in: <code>degrees</code>, <code>deg</code> (default), <code>rev</code>, or <code>raw</code>. One revolution is equal to 360 degrees.     |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns the robot's current heading as a <code>double</code> in the selected unit.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Show heading before and after turning
Brain.Screen.print("Before: %f", myDrivetrain.heading(degrees));
myDrivetrain.turnFor(right, 90, degrees);
wait(1, seconds);
Brain.Screen.newLine();
Brain.Screen.print("After: %f", myDrivetrain.heading(degrees));
myDrivetrain.stop();
```

### rotation

```{vexcode}
id: v5_drivetrain_rotation
```

Rotation is how much the robot has turned, measured in degrees or revolutions. At the beginning of a project, the rotation value is set to 0 degrees. <code>rotation</code> returns the robot's current rotation.

Turning right increases the rotation, and turning left decreases the rotation. For example, making two full turns to the right will return a rotation of 720 degrees.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double rotation( rotationUnits units = rotationUnits::deg );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>units</code>   | <code>rotationUnits</code>  | Optional. The unit to return rotation in: <code>degrees</code>, <code>deg</code> (default), <code>rev</code>, or <code>raw</code>. One revolution is equal to 360 degrees.     |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns the robot's current rotation as a <code>double</code> in the selected unit.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Show rotation before and after turning
Brain.Screen.print("Before: %f", myDrivetrain.rotation(degrees));
myDrivetrain.turnFor(right, 90, degrees);
wait(1, seconds);
Brain.Screen.newLine();
Brain.Screen.print("After: %f", myDrivetrain.rotation(degrees));
myDrivetrain.stop();
```
