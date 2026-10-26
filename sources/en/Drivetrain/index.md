---
title: drivetrain | VEX V5 - C++ API
description: Reference documentation for the drivetrain class in VEX V5 C++. Includes constructors, functions, parameters, notes, and member functions.
---

```{highlight} cpp
:linenothreshold: 5
```

# Drivetrain

## Introduction

The <code>drivetrain</code> class controls how a robot drives and turns. A drivetrain is made of motors and wheels that work together to move the robot.

A <code>drivetrain</code> does not use an [Inertial Sensor](../Smart_Port_Devices/Inertial_Sensor.md), [Gyro Sensor](../3-Wire_Devices/Gyro.md), or [GPS Sensor](../Smart_Port_Devices/GPS_Sensor.md) for heading-based or rotation-based turns. It can drive forward or reverse and turn left or right, but it cannot turn to a specific heading or rotation. For heading-based and rotation-based turns, use the [<code>smartdrive</code>](smartdrive.md) class.

## Derived Classes

The <code>drivetrain</code> class serves as a base class for the following derived classes:

- [<code>smartdrive</code>](smartdrive.md) - This class adds Inertial Sensor, GPS Sensor, or Gyro Sensor support to enable heading-based and rotation-based turns.

## Class Constructors

> **__1__ -** Creates a drivetrain using existing <code>motor_group</code> objects for the left (<code>&l</code>) and right (<code>&r</code>) sides.
> ```cpp
> drivetrain(
>     motor_group      &l,
>     motor_group      &r,
>     double           wheelTravel = 320,
>     double           trackWidth = 320,
>     double           wheelBase = 130,
>     distanceUnits    unit = mm,
>     double           externalGearRatio = 1.0 );
> ```

> **__2__ -** Creates a drivetrain using existing <code>motor</code> objects for the left (<code>&l</code>) and right (<code>&r</code>) sides.
> ```cpp
> drivetrain(
>     motor            &l,
>     motor            &r,
>     double           wheelTravel = 320,
>     double           trackWidth = 320,
>     double           wheelBase = 130,
>     distanceUnits    unit = mm,
>     double           externalGearRatio = 1.0 );
> ```


## Class Destructor

Destroys the <code>drivetrain</code> object and releases associated resources.

```cpp
virtual ~drivetrain();
```

## Parameters

| Parameter | Type | Description |
|:---------:|:----:|:------------|
| <code>&l</code> / <code>&r</code> | <code>motor_group</code> / <code>motor</code> | The left and right motors or motor groups. Both parameters must use the same type: either two <code>motor_group</code> objects or two <code>motor</code> objects.|
| <code>wheelTravel</code> | <code>double</code> | The circumference of the drivetrain wheels. The default is <code>320</code>. |
| <code>trackWidth</code> | <code>double</code> | The distance between the left and right wheels. The default is <code>320</code>. |
| <code>wheelBase</code> | <code>double</code> | The distance between the front and back wheels. The default is <code>130</code>. |
| <code>unit</code> | <code>distanceUnits</code> | The unit for <code>wheelTravel</code>, <code>trackWidth</code>, and <code>wheelBase</code>: <code>mm</code> (millimeters, default) or <code>inches</code>. |
| <code>externalGearRatio</code> | <code>double</code> | The gear ratio used to adjust drive distances if gears are used. The default is <code>1.0</code>. |

## Example

```cpp
// Create the left and right motor objects
motor leftMotor = motor(PORT1, false);
motor rightMotor = motor(PORT9, true);

// Create the drivetrain object
drivetrain myDrivetrain = drivetrain(
    leftMotor,  // left motor object
    rightMotor, // right motor object
    259.34,     // wheelTravel
    320,        // trackWidth
    40,         // wheelBase
    mm,         // unit
    1.0 );      // externalGearRatio
```

## Member Functions

The <code>drivetrain</code> class includes the following member functions:

**Actions - Move and turn the robot.**
- [<code>drive</code>](#drive) - Moves the robot forward or reverse forever.
- [<code>driveFor</code>](#drivefor) - Moves the robot forward or reverse for a specific distance.
- [<code>turn</code>](#turn) - Turns the robot left or right forever.
- [<code>turnFor</code>](#turnfor) - Turns the robot left or right for a specific number of degrees.
- [<code>stop</code>](#stop) - Stops the robot's movement.

**Settings - Adjust drivetrain settings.**
- [<code>setDriveVelocity</code>](#setdrivevelocity) - Tells the robot how fast to drive.
- [<code>setTurnVelocity</code>](#setturnvelocity) - Tells the robot how fast to turn.
- [<code>setStopping</code>](#setstopping) - Tells how the robot will stop moving: by braking, coasting, or holding.
- [<code>setTimeout</code>](#settimeout) - Sets how many seconds the robot will try to finish a movement.

**Values - Check movement status.**
- [<code>isDone</code>](#isdone) - Returns whether the robot is finished moving, as a Boolean value.
- [<code>isMoving</code>](#ismoving) - Returns whether the robot is moving, as a Boolean value.
- [<code>velocity</code>](#velocity) - Returns how fast the robot is driving.
- [<code>current</code>](#current) - Returns how much electrical current the drivetrain is using.
- [<code>power</code>](#power) - Returns how quickly the drivetrain is using energy.
- [<code>torque</code>](#torque) - Returns how much torque the drivetrain is using.
- [<code>efficiency</code>](#efficiency) - Returns how efficiently the drivetrain is using power.
- [<code>temperature</code>](#temperature) - Returns how warm the drivetrain is.
- [<code>voltage</code>](#voltage) - Returns the electrical voltage supplied to the drivetrain.

Before calling any <code>drivetrain</code> member functions, a <code>drivetrain</code> object must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
Drivetrain configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create the left and right motor objects
motor leftMotor = motor(PORT1, false);
motor rightMotor = motor(PORT9, true);

// Create the drivetrain object
drivetrain myDrivetrain = drivetrain(
    leftMotor,  // left motor object
    rightMotor, // right motor object
    259.34,     // wheelTravel
    320,        // trackWidth
    40,         // wheelBase
    mm,         // unit
    1.0 );      // externalGearRatio
```

## Actions
### drive

```{vexcode}
id: v5_drivetrain_drive
```

<code>drive</code> moves the robot forward or reverse forever. The robot will continue to move until it is given another action, like turning or stopping. For RPM or DPS, the limit is changed by the gear ratio of the drivetrain.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ -** Drives using the currently [configured drive velocity](#setdrivevelocity).
> ```cpp
> void drive(
>     directionType dir );
> ```

> **__2__ -** Drives at the specified velocity.
> ```cpp
> void drive(
>     directionType dir,
>     double        velocity,
>     velocityUnits units );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>dir</code>   | <code>directionType</code>  | The direction the robot moves: <code>forward</code> or <code>reverse</code>.     |
| <code>velocity</code>   | <code>double</code>  | The velocity to drive with from 0% to 100% when using <code>velocityUnits::pct</code>, from 0 to 600 rpm when using <code>rpm</code>, or from 0 to 3600 degrees per second when using <code>dps</code>. If no velocity is provided, the robot drives at the current drive velocity.     |
| <code>units</code>   | <code>velocityUnits</code>  | The velocity unit: <code>velocityUnits::pct</code> (percent), <code>rpm</code> (rotations per minute), or <code>dps</code> (degrees per second).     |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- <code>drive</code> is non-waiting; the project will continue executing the next line of code immediately after the call.
- The drivetrain will continue moving until [<code>stop</code>](#stop) is called or another drivetrain movement function (such as [<code>driveFor</code>](#drivefor) or [<code>turn</code>](#turn)) is executed.
- Functions such as [<code>isDone</code>](#isdone) and [<code>isMoving</code>](#ismoving) are not applicable to <code>drive</code>, since it does not use target-based movement (doesn't have a <code>distance</code> parameter).

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Drive forward and back
myDrivetrain.drive(forward);
wait(2, seconds);
myDrivetrain.drive(reverse, 25, rpm);
wait(2, seconds);
myDrivetrain.stop();
```

### driveFor

```{vexcode}
id: v5_drivetrain_drive_for
```

<code>driveFor</code> moves the robot forward or reverse for a specific distance. The project will wait until the robot is done moving before the next line of code runs by default. For RPM or DPS, the limit is changed by the gear ratio of the drivetrain.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>


> **__1__ -** Drives in the specified direction for a distance using the currently [configured drive velocity](#setdrivevelocity).
> ```cpp
> bool driveFor(
>     directionType dir,
>     double        distance,
>     distanceUnits units,
>     bool          waitForCompletion = true );
> ```

> **__2__ -** Drives in a direction dependent on the distance using the currently [configured drive velocity](#setdrivevelocity).
> ```cpp
> bool driveFor(
>     double        distance,
>     distanceUnits units,
>     bool          waitForCompletion = true );
> ```

> **__3__ -** Drives in a direction dependent on the distance at the specified velocity.
> ```cpp
> bool driveFor(
>     double        distance,
>     distanceUnits units,
>     double        velocity,
>     velocityUnits units_v,
>     bool          waitForCompletion = true );
> ```

> **__4__ -** Drives in the specified direction for a distance at the specified velocity.
> ```cpp
> bool driveFor(
>     directionType dir,
>     double        distance,
>     distanceUnits units,
>     double        velocity,
>     velocityUnits units_v,
>     bool          waitForCompletion = true );
> ```


<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>dir</code>   | <code>directionType</code>  | The direction the robot moves: <code>forward</code> or <code>reverse</code>.     |
| <code>distance</code>   | <code>double</code>  | The distance the robot drives.     |
| <code>units</code>   | <code>distanceUnits</code>  | The distance unit: <code>mm</code> (millimeters), <code>inches</code>, or <code>cm</code> (centimeters).     |
| <code>velocity</code>   | <code>double</code>  | The velocity to drive with from 0% to 100% when using <code>velocityUnits::pct</code>, from 0 to 600 rpm when using <code>rpm</code>, or from 0 to 3600 degrees per second when using <code>dps</code>. If no velocity is provided, the robot drives at the current drive velocity.     |
| <code>units_v</code>   | <code>velocityUnits</code>  | The velocity unit: <code>velocityUnits::pct</code> (percent), <code>rpm</code> (rotations per minute), or <code>dps</code> (degrees per second).     |
| <code>waitForCompletion</code>   | <code>bool</code>  | <code>true</code> (default) makes the project wait until the robot is done moving before the next line of code runs. <code>false</code> makes the next line of code run right away.     |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns whether the robot reached the target distance, as a Boolean value.

- <code>true</code> - The robot reached the target distance.
- <code>false</code> - The robot did not finish the movement, or the function returned before the movement completed because <code>waitForCompletion</code> was set to <code>false</code>.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Executing another drivetrain movement function (such as [<code>drive</code>](#drive) or [<code>turnFor</code>](#turnfor)) while <code>driveFor</code> is in progress will interrupt the current movement.
- Because <code>driveFor</code> is target-based (uses a <code>distance</code> parameter), functions such as [<code>isDone</code>](#isdone) and [<code>isMoving</code>](#ismoving) work with <code>driveFor</code>.

<span style="font-size: 1.5rem; " >
  Examples
</span>

```cpp
// Drive 200 mm, then back 200 mm
myDrivetrain.driveFor(forward, 200, mm);
myDrivetrain.driveFor(reverse, 200, mm);
```

### turn

```{vexcode}
id: v5_drivetrain_turn
```

<code>turn</code> turns the robot left or right forever. The robot will continue to turn until it is given another action, like driving or stopping. For RPM or DPS, the limit is changed by the gear ratio of the drivetrain.

<span style="font-size: 1.5rem; " >
  Available Functions
</span>

> **__1__ -** Turns using the currently [configured turn velocity](#setturnvelocity).
> ```cpp
> void turn(
>     turnType dir );
> ```

> **__2__ -** Turns at the specified velocity.
> ```cpp
> void turn(
>     turnType     dir,
>     double       velocity,
>     velocityUnits units );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>


| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>dir</code>   | <code>turnType</code>  | The direction the robot turns: <code>left</code> or <code>right</code>.     |
| <code>velocity</code>   | <code>double</code>  | The velocity to turn with from 0% to 100% when using <code>velocityUnits::pct</code>, from 0 to 600 rpm when using <code>rpm</code>, or from 0 to 3600 degrees per second when using <code>dps</code>. If no velocity is provided, the robot turns at the current turn velocity.     |
| <code>units</code>   | <code>velocityUnits</code>  | The velocity unit: <code>velocityUnits::pct</code> (percent), <code>rpm</code> (rotations per minute), or <code>dps</code> (degrees per second).     |


<span style="font-size: 1.5rem; ">
  Return Values
</span>
This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- <code>turn</code> is non-waiting; the project will continue executing the next line of code immediately after the call.
- The drivetrain will continue turning until [<code>stop</code>](#stop) is called or another drivetrain movement function (such as [<code>turnFor</code>](#turnfor) or [<code>drive</code>](#drive)) is executed.
- Functions such as [<code>isDone</code>](#isdone) and [<code>isMoving</code>](#ismoving) are not applicable to <code>turn</code>, since it does not use target-based movement (doesn't have an <code>angle</code> parameter).

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Turn right, then left, then stop
myDrivetrain.turn(right);
wait(2, seconds);
myDrivetrain.turn(left);
wait(2, seconds);
myDrivetrain.stop();
```

### turnFor

```{vexcode}
id: v5_drivetrain_turn_for
```

<code>turnFor</code> turns the robot left or right for a specific number of degrees. The turn is relative to the current position of the robot. The project will wait until the robot is done turning before the next line of code runs by default. For RPM or DPS, the limit is changed by the gear ratio of the drivetrain.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ -** Turns for the specified angle using the currently [configured turn velocity](#setturnvelocity).
> ```cpp
> bool turnFor(
>     double        angle,
>     rotationUnits units,
>     bool          waitForCompletion = true );
> ```

> **__2__ -** Turns in the specified direction for an angle using the currently [configured turn velocity](#setturnvelocity).
> ```cpp
> bool turnFor(
>     turnType      dir,
>     double        angle,
>     rotationUnits units,
>     bool          waitForCompletion = true );
> ```

> **__3__ -** Turns for the specified angle at the specified velocity.
> ```cpp
> bool turnFor(
>     double        angle,
>     rotationUnits units,
>     double        velocity,
>     velocityUnits units_v,
>     bool          waitForCompletion = true );
> ```

> **__4__ -** Turns in the specified direction for an angle at the specified velocity.
> ```cpp
> bool turnFor(
>     turnType      dir,
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
| <code>dir</code>   | <code>turnType</code>  | The direction the robot turns: <code>left</code> or <code>right</code>.     |
| <code>angle</code>   | <code>double</code>  | The angle the robot turns.     |
| <code>units</code>   | <code>rotationUnits</code>  | The turn unit: <code>deg</code> (degrees), <code>rev</code> (revolutions), or <code>raw</code> (raw units). One revolution is equal to 360 degrees.     |
| <code>velocity</code>   | <code>double</code>  | The velocity to turn with from 0% to 100% when using <code>velocityUnits::pct</code>, from 0 to 600 rpm when using <code>rpm</code>, or from 0 to 3600 degrees per second when using <code>dps</code>. If no velocity is provided, the robot turns at the current turn velocity.     |
| <code>units_v</code>   | <code>velocityUnits</code>  | The velocity unit: <code>velocityUnits::pct</code> (percent), <code>rpm</code> (rotations per minute), or <code>dps</code> (degrees per second).     |
| <code>waitForCompletion</code>   | <code>bool</code>  | <code>true</code> (default) makes the project wait until the robot is done turning before the next line of code runs. <code>false</code> makes the next line of code run right away.     |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns whether the robot reached the target angle, as a Boolean value.

- <code>true</code> - The robot reached the target angle.
- <code>false</code> - The robot did not finish the turn, or the function returned before the turn completed because <code>waitForCompletion</code> was set to <code>false</code>.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Executing another drivetrain movement function (such as [<code>turn</code>](#turn) or [<code>drive</code>](#drive)) while <code>turnFor</code> is in progress will interrupt the current movement.
- Because <code>turnFor</code> is target-based (uses an <code>angle</code> parameter), functions such as [<code>isDone</code>](#isdone) and [<code>isMoving</code>](#ismoving) work with <code>turnFor</code>.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Turn right then left
myDrivetrain.turnFor(right, 90, degrees);
wait(1, seconds);
myDrivetrain.turnFor(left, 90, degrees);
```

### stop

```{vexcode}
id: v5_drivetrain_stop
```

<code>stop</code> stops the robot's movement. If a stopping mode is provided, it controls how the robot stops for this function call.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ -** Stops the drivetrain using the currently configured [stopping mode](#setstopping).
> ```cpp
> void stop();
> ```

> **__2__ -** Stops the drivetrain using the specified brake mode.
> ```cpp
> void stop(
>     brakeType mode );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>mode</code>   | <code>brakeType</code>  | How the robot will stop:<ul><li><code>brake</code> - Stops immediately.</li><li><code>coast</code> - Slows to a stop.</li><li><code>hold</code> - Stops immediately and holds the wheels' position.</li></ul>     |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.


<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Drive forward, then coast to a stop
myDrivetrain.setDriveVelocity(100, percent);
myDrivetrain.drive(forward);
wait(2, seconds);
myDrivetrain.stop(coast);
```

## Mutators
### setDriveVelocity

```{vexcode}
id: v5_drivetrain_set_drive_velocity
```

<code>setDriveVelocity</code> tells the robot how fast to drive. A higher percentage makes the robot drive faster and a lower percentage makes the robot drive slower. For RPM, the limit is changed by the gear ratio of the drivetrain.

Every project begins with the robot driving at 50% velocity by default.

**Note:** A higher velocity makes the robot drive faster, but it may be less precise. A lower velocity makes the robot drive slower, but it can be more precise.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void  setDriveVelocity(
  double velocity,
  velocityUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>


| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>velocity</code>   | <code>double</code>  | The velocity to drive with from 0% to 100% when using <code>velocityUnits::pct</code>, from 0 to 600 rpm when using <code>rpm</code>, or from 0 to 3600 degrees per second when using <code>dps</code>.     |
| <code>units</code>   | <code>velocityUnits</code>  | The velocity unit: <code>velocityUnits::pct</code> (percent), <code>rpm</code> (rotations per minute), or <code>dps</code> (degrees per second).     |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The drive velocity applies to all subsequent drivetrain movement functions (such as [<code>drive</code>](#drive) and [<code>driveFor</code>](#drivefor)) unless a specific velocity is provided in the function call.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Drive forward, then coast to a stop
myDrivetrain.setDriveVelocity(100, percent);
myDrivetrain.drive(forward);
wait(2, seconds);
myDrivetrain.stop(coast);
```

### setTurnVelocity

```{vexcode}
id: v5_drivetrain_set_turn_velocity
```

<code>setTurnVelocity</code> tells the robot how fast to turn. A higher percentage makes the robot turn faster and a lower percentage makes the robot turn slower.

Every project begins with the robot turning at 50% velocity by default.

**Note:** A higher velocity makes the robot turn faster, but it may be less precise. A lower velocity makes the robot turn slower, but it can be more precise.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void  setTurnVelocity(
  double velocity,
  velocityUnits units );
```
<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>velocity</code> | <code>double</code> | The velocity to turn with from 0% to 100% when using <code>velocityUnits::pct</code>, from 0 to 600 rpm when using <code>rpm</code>, or from 0 to 3600 degrees per second when using <code>dps</code>. |
| <code>units</code>   | <code>velocityUnits</code>  | The velocity unit: <code>percent</code> or <code>pct</code> (percent), <code>rpm</code> (rotations per minute), or <code>dps</code> (degrees per second).     |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The turn velocity applies to all subsequent drivetrain turning functions (such as [<code>turn</code>](#turn) and [<code>turnFor</code>](#turnfor)) unless a specific velocity is provided in the function call.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Try default, slow, then fast
myDrivetrain.turnFor(right, 360, degrees);
wait(1, seconds);
myDrivetrain.setTurnVelocity(20, percent);
myDrivetrain.turnFor(right, 360, degrees);
wait(1, seconds);
myDrivetrain.setTurnVelocity(100, percent);
myDrivetrain.turnFor(right, 360, degrees);
```

### setStopping

```{vexcode}
id: v5_drivetrain_set_stopping
```

<code>setStopping</code> sets how the robot will stop moving: by braking, coasting, or holding.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void setStopping(
  brakeType mode );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>mode</code>   | <code>brakeType</code>  | How the robot will stop:<ul><li><code>brake</code> - Stops immediately.</li><li><code>coast</code> - Slows to a stop.</li><li><code>hold</code> - Stops immediately and holds the wheels' position.</li></ul>     |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The stopping mode applies to all subsequent [<code>stop</code>](#stop) calls unless a specific stopping mode is provided in the function call.

### setTimeout

```{vexcode}
id: v5_drivetrain_set_timeout
```

<code>setTimeout</code> sets how many seconds the robot will try to finish a movement. If the robot cannot finish in that time, it will stop trying and move on to the next line of code. This keeps the robot from getting stuck on a movement.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void  setTimeout(
  int32_t time,
  timeUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>time</code> | <code>int32_t</code> | The amount of time the robot can try to finish a movement. This should be a positive whole number. |
| <code>units</code>   | <code>timeUnits</code>  | The unit of time: <code>sec</code> (seconds) or <code>msec</code> (milliseconds).     |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The timeout only applies to target-based drivetrain movement functions (such as [<code>driveFor</code>](#drivefor) and [<code>turnFor</code>](#turnfor)).

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Start turning if driving takes too long
myDrivetrain.setTimeout(1, seconds);
myDrivetrain.driveFor(forward, 25, inches);
myDrivetrain.turnFor(right, 90, degrees);
```

## Getters

### isDone

```{vexcode}
id: v5_drivetrain_is_done
```

<code>isDone</code> returns whether the robot is finished moving, as a Boolean value. This can be used to control the timing of other behaviors based on the robot's movement.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
bool isDone( void );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

- <code>true</code> - The robot is finished moving.
- <code>false</code> - The robot is still moving.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- <code>isDone</code> is compatible with target-based drivetrain movements (functions that move to a target, such as [<code>driveFor</code>](#drivefor) and [<code>turnFor</code>](#turnfor)).
- <code>isDone</code> is not compatible with functions such as [<code>drive</code>](#drive) and [<code>turn</code>](#turn), since they do not use target-based movement.

### isMoving

```{vexcode}
id: v5_drivetrain_is_moving
```

<code>isMoving</code> returns whether the robot is moving, as a Boolean value. This can be used to control the timing of other behaviors based on the robot's movement.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
virtual bool isMoving( void );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

- <code>true</code> - The robot is moving.
- <code>false</code> - The robot is not moving.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- <code>isMoving</code> is compatible with target-based drivetrain movements (functions that move to a target, such as [<code>driveFor</code>](#drivefor) and [<code>turnFor</code>](#turnfor)).
- <code>isMoving</code> is not compatible with functions such as [<code>drive</code>](#drive) and [<code>turn</code>](#turn), since they do not use target-based movement.

### velocity

```{vexcode}
id: v5_drivetrain_velocity
```

<code>velocity</code> returns how fast the robot is driving.

A positive value means the robot is driving forward. A negative value means the robot is driving in reverse.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double velocity(
  velocityUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>


| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>units</code>   | <code>velocityUnits</code>  | The velocity unit: <code>percent</code> or <code>pct</code> (percent), <code>rpm</code> (rotations per minute), or <code>dps</code> (degrees per second).     |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns the drivetrain velocity as a <code>double</code> in the selected unit.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Show velocity before and during motion
Brain.Screen.print("Resting: %f", myDrivetrain.velocity(percent));
myDrivetrain.drive(forward, 100, velocityUnits::pct);
wait(1, seconds);
Brain.Screen.newLine();
Brain.Screen.print("Moving: %f", myDrivetrain.velocity(percent));
myDrivetrain.stop();
```

### current

```{vexcode}
id: v5_drivetrain_current
```

<code>current</code> returns how much electrical current the drivetrain is using. Current is the amount of electricity flowing through the drivetrain. It can be returned in amps (amperes) or as a percentage, depending on the unit.

A higher current value means the drivetrain is using more electrical current. This can happen when the robot is pushing against an object or trying to move when it is stuck.

This can be used to check if the drivetrain is struggling during a movement. If current stays high, the drivetrain may get warmer or use power less efficiently.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ -** Returns the drivetrain's electrical current in amperes.
> ```cpp
> double current(
>     currentUnits units = currentUnits::amp );
> ```

> **__2__ -** Returns the drivetrain's electrical current as a percentage of maximum.
> ```cpp
> double current(
>     percentUnits units );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>units</code>   | <code>currentUnits</code>  | The unit to return current in: <code>amp</code> (amps, default).     |
| <code>units</code>   | <code>percentUnits</code>  | The unit to return current in: <code>percent</code> or <code>pct</code>.     |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns the drivetrain current as a <code>double</code> in the selected unit.

### power

```{vexcode}
id: v5_drivetrain_power
```

<code>power</code> returns how much power the drivetrain is using, measured in watts. Power shows how quickly the drivetrain is using energy.

A higher power value means the drivetrain is using energy faster. This can happen when the robot is pushing against an object or trying to move when it is stuck.

This can be used to compare movements or check if the drivetrain is struggling. If power stays high, the drivetrain may get warmer or use energy less efficiently.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double power(
  powerUnits units = powerUnits::watt );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>units</code>   | <code>powerUnits</code>  | The power unit: <code>watt</code> (watts, default).     |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns drivetrain power as a <code>double</code> in watts.

### torque

```{vexcode}
id: v5_drivetrain_torque
```

Torque shows how hard the drivetrain can push or pull while the wheels spin.

<code>torque</code> returns how much torque the drivetrain is using, measured in Newton-meters (Nm) or inch-pounds (InLb).

A higher torque value means the drivetrain is pushing or pulling harder. This can happen when the robot is pushing against an object or trying to move when it is stuck.

This can be used to check if the drivetrain is struggling or to compare how much push different movements need.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double torque(
  torqueUnits units = torqueUnits::nm );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>units</code>   | <code>torqueUnits</code>  | The unit to return torque in: <code>Nm</code> (newton meters, default) or <code>InLb</code> (inch pounds).     |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns drivetrain torque as a <code>double</code> in the selected unit.

### efficiency

```{vexcode}
id: v5_drivetrain_efficiency
```

<code>efficiency</code> returns how efficiently the drivetrain is using power, as a percentage from 0% to 100%.

Efficiency shows how much of the drivetrain's power is being used for movement. A higher efficiency value means more of the drivetrain's power is being used to move. A lower efficiency value can happen when the drivetrain is working hard but not moving much, like when the robot is stuck or pushing against an object.

This can be used to compare movements or check if the drivetrain is wasting power instead of using it for movement.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>


```cpp
double efficiency(
  percentUnits units = percentUnits::pct );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>units</code>   | <code>percentUnits</code>  | The unit to return efficiency in: <code>percent</code> or <code>pct</code> (default).    |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns drivetrain efficiency as a <code>double</code> in the selected unit.

### temperature

```{vexcode}
id: v5_drivetrain_temperature
```

<code>temperature</code> returns the average temperature of the drivetrain as a percentage from 0% to 100%.

Temperature shows how warm the drivetrain motors are. A higher temperature means the motors are getting warmer while they work. The motors should stay below 55Â°C to keep working at full performance.

If the motors get too hot, they will lower their maximum current to protect themselves. At 70Â°C, the motors will stop running until they cool down.

This can be used to check if the drivetrain is getting too hot during repeated movements, long runs, or when it is pushing against an object.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double temperature(
  percentUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>


| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>units</code>   | <code>percentUnits</code>  | The unit to return temperature in: <code>percent</code> or <code>pct</code>.     |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns the average drivetrain temperature as a <code>double</code> in the selected unit.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- A returned value of <code>50%</code> indicates that the average motor temperature is approximately <code>45Â°C</code> (<code>113Â°F</code>).
- The typical operating temperature range for the drivetrain is approximately <code>20Â°C</code> (<code>68Â°F</code>) to <code>70Â°C</code> (<code>158Â°F</code>).

### voltage

<code>voltage</code> returns the electrical voltage supplied to the drivetrain.

Voltage is the electrical pressure supplied to the drivetrain motors. This can be used with current and power values to understand how the drivetrain is using electrical energy.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double  voltage(
  voltageUnits units = voltageUnits::volt );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>units</code>   | <code>voltageUnits</code>  | The unit to return voltage in: <code>volt</code> (volts, default) or <code>voltageUnits::mV</code> (millivolts).     |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns drivetrain voltage as a <code>double</code> in the selected unit.

```{toctree}
:caption: drivetrain Derived Classes
:titlesonly: true
:hidden:

./smartdrive
```
