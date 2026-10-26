---
title: Motor and Motor Group | VEX V5 - C++ API
description: Explore the C++ API reference for motors and motor groups in VEXcode V5. Find detailed descriptions for functions, parameters, and usage examples to code a motor or motor group.
---

# Motor and Motor Group

```{contents}
:local: true
```

## Introduction

Motors and motor groups control how parts of a robot move. A <code>motor</code> object controls one configured Smart Motor, while a <code>motor_group</code> object controls multiple configured Smart Motors together so they move in tandem. Motors and motor groups can be used to raise an arm, turn a claw, spin a wheel, or move another part of a build. Two or four motors can work together as a [drivetrain](../Drivetrain/index.md) to move and turn the whole robot.

Each motor or motor group is configured in the Devices window. Depending on the build, motor and motor group names can change. This page uses <code>Motor1</code> and <code>MotorGroup1</code> as example names. Replace them with your own configured names as needed.

```{image} /_static/img/motion/v5-forward.png
:alt: A VEX V5 Motor showing the forward direction indicated by a plus sign and an arrow indicating it is rotating left, or counterclockwise.
:class: w-25
```

```{image} /_static/img/motion/v5-reversed.png
:alt: A VEX V5 Motor showing the reverse direction indicated by a minus sign and an arrow indicating it is rotating right, or clockwise.
:class: w-25
```

By default, <code>forward</code> spins a motor counterclockwise, and <code>reverse</code> spins a motor clockwise. If a motor is set to reverse, those directions will be switched.

## Motor

### Class Constructors

> **__1__ —** Creates a <code>motor</code> object for the V5 Smart Motor connected to the specified Smart Port.
> The motor automatically uses the detected internal <code>gearSetting</code>.
> ```cpp
> motor(
>   int32_t index );
> ```

> **__2__ —** Creates a <code>motor</code> object on the specified Smart Port and optionally reverses its direction.
> The motor automatically uses the detected internal <code>gearSetting</code>.
> ```cpp
> motor(
>  int32_t index,
>  bool    reverse );
> ```

> **__3__ —** Creates a <code>motor</code> object on the specified Smart Port with the specified <code>gearSetting</code>.
> ```cpp
> motor(
>  int32_t     index,
>  gearSetting gears );
> ```

> **__4__ —** Creates a <code>motor</code> object on the specified Smart Port with the specified <code>gearSetting</code> and optional reversed direction.
> ```cpp
> motor(
>  int32_t     index,
>  gearSetting gears,
>  bool        reverse );
> ```

### Class Destructor

Destroys the <code>motor</code> object and releases associated resources.

```cpp
~motor();
```

### Parameters

| Parameter | Type | Description |
|:--:|:--:|--|
|  <code>index</code>  |  <code>int32_t</code> | The Smart Port that the motor is connected to, written as <code>PORTx</code>, where <code>x</code> is the port number (for example, <code>PORT1</code>). |
| <code>reverse</code> | <code>bool</code> | Sets whether the motor's spin direction is reversed:<ul><li><code>false</code> (default) — Does not reverse the motor's direction.</li><li><code>true</code> — Reverses the motor's direction.</li></ul> |
| <code>gears</code> | <code>gearSetting</code> | Specifies the internal gear cartridge ratio.<ul><li><code>ratio36_1</code> — The red 36:1 gear cartridge</li><li><code>ratio18_1</code> — The green 18:1 gear cartridge</li><li><code>ratio6_1</code> — The blue 6:1 gear cartridge</li></ul> |

### Notes

- Gear setting should match the physical cartridge installed in the motor.

### Example

```cpp
// Create the motor instance in Smart Port 1
motor LeftMotor = motor(PORT1);

// Creates the motor instance with different settings
motor RightMotor = motor(
  PORT2,      // Smart Port 2
  ratio18_1,  // Gear setting is 18
  true);
```

## Motor Group

### Class Constructors

```cpp
motor_group( motor &m1, Args&... m2 );
```


### Class Destructor

Destroys the <code>motor_group</code> object and releases associated resources.

```cpp
~motor_group();
```

### Parameters

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>m1</code> | <code>motor &</code> | The first motor added to the group. |
| <code>m2</code> | <code>motor &</code> | Additional motors added to the group. The maximum is four motors in one motor group. |

### Example

```cpp
// Create individual motor instances
motor LeftMotor  = motor(PORT1);
motor RightMotor = motor(PORT2);

// Create a motor group with both motors
motor_group DriveMotors = motor_group(LeftMotor, RightMotor);
```

## Member Functions

There are many ways to code motors and motor groups. Below is a list of all <code>motor</code> and <code>motor_group</code> member functions:

**Actions — Stop and spin motors and motor groups.**
- [<code>spin</code>](#spin) — Spins a motor or motor group forward or reverse forever.
- [<code>spinFor</code>](#spinfor) — Spins a motor or motor group for a specific distance or amount of time.
- [<code>spinToPosition</code>](#spintoposition) — Spins a motor or motor group to a specific position.
- [<code>stop</code>](#stop) — Stops a motor or motor group from spinning.

**Mutators — Adjust motor and motor group settings.**
- [<code>setPosition</code>](#setposition) — Changes the motor or motor group's current position to a new value.
- [<code>setVelocity</code>](#setvelocity) — Tells a motor or motor group how fast to spin.
- [<code>setStopping</code>](#setstopping) — Sets how a motor or motor group will stop moving: by braking, coasting, or holding.
- [<code>setMaxTorque</code>](#setmaxtorque) — Sets how hard a motor or motor group is allowed to push while spinning.
- [<code>setTimeout</code>](#settimeout) — Sets how much time a motor or motor group will try to finish a movement.

**Getters — Check motor and motor group status.**
- [<code>isDone</code>](#isdone) — Returns whether the motor or motor group is finished moving, as a Boolean value.
- [<code>isSpinning</code>](#isspinning) — Returns whether the motor or motor group is spinning, as a Boolean value.
- [<code>position</code>](#position) — Returns the motor or motor group's current position.
- [<code>velocity</code>](#velocity) — Returns how fast the motor or motor group is spinning.
- [<code>current</code>](#current) — Returns how much electrical current the motor or motor group is using.
- [<code>power</code>](#power) — Returns how much power the motor or motor group is using.
- [<code>torque</code>](#torque) — Returns how much torque the motor or motor group is using.
- [<code>efficiency</code>](#efficiency) — Returns how efficiently the motor or motor group is using power.
- [<code>temperature</code>](#temperature) — Returns the temperature of the motor or motor group.
- [<code>voltage</code>](#voltage) — Returns the electrical voltage supplied to the motor or motor group.
- [<code>direction</code>](#direction) — Returns the direction the motor or motor group is spinning.
- [<code>installed</code>](#installed) — Returns whether the motor or motor group is connected to the Brain.
- [<code>count</code>](#count) — Returns the number of motors in a motor group.


Before calling any <code>motor</code> or <code>motor_group</code> member functions, an instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
Motor and Motor Group configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create the motor instance in Smart Port 1
motor Motor1 = motor(PORT1);
```

## Actions
### spin

```{vexcode}
id: v5_motion_motor_spin
```

```{vexcode}
id: v5_motion_motor_spin_at_voltage
```

<code>spin</code> spins a motor or motor group forward or reverse forever. The motor or motor group will continue to spin until it is given another action, like spinning in a different direction or stopping.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

> **__1__ —** Spins the motor or motor group using the currently configured motor velocity.
> ```cpp
> void spin(
>  directionType dir );
> ```

> **__2__ —** Spins the motor or motor group at the specified velocity.
> ```cpp
> void spin(
>  directionType dir,
>  double        velocity,
>  velocityUnits units );
> ```

> **__3__ —** Spins the motor or motor group using the specified voltage.
> ```cpp
> void spin(
>  directionType dir,
>  double        voltage,
>  voltageUnits  units );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>dir</code> | <code>directionType</code> | The direction the motor or motor group spins: <code>forward</code> or <code>reverse</code>. |
| <code>velocity</code> | <code>double</code> | The velocity to spin with from 0% to 100% when using <code>percent</code>. |
| <code>units</code> | <code>velocityUnits</code> | The unit used to represent velocity:<ul><li><code>percent</code> / <code>pct</code> — percent</li><li><code>rpm</code> — rotations per minute</li><li><code>dps</code> — degrees per second</li></ul> |
| <code>voltage</code> | <code>double</code> | The voltage to spin with. A negative value spins opposite the given <code>dir</code>. |
| <code>units</code> | <code>voltageUnits</code> | The unit used to represent voltage:<ul><li><code>volt</code> — volts</li><li><code>voltageUnits::mV</code> — millivolts</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- This function is non-waiting and the project will continue executing immediately after the call.
- The motor or motor group will continue spinning until [<code>stop</code>](#stop) is called or another movement function is executed.
- Functions such as [<code>isDone</code>](#isdone) and [<code>isSpinning</code>](#isspinning) are not applicable to <code>spin</code>, since it does not use target-based movement (doesn't have a <code>rotation</code> or <code>time</code> parameter).

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Spin forward, then stop
Motor1.spin(forward);
wait(1, seconds);
Motor1.stop();
```

### spinFor

```{vexcode}
id: v5_motion_motor_spin_for
```

<code>spinFor</code> spins a motor or motor group for a specific distance or amount of time. A rotation-based spin is relative to the current position of the motor or motor group. By default, the project will wait until the motor or motor group is done spinning before the next line of code runs.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Spins for a specific distance at the velocity provided in the function call.
> ```cpp
> bool spinFor(
>  double        rotation,
>  rotationUnits units,
>  double        velocity,
>  velocityUnits units_v,
>  bool          waitForCompletion = true );
> ```

> **__2__ —** Accepts a direction parameter and spins for a specific distance at the velocity provided in the function call.
> ```cpp
> bool spinFor(
>  directionType dir,
>  double        rotation,
>  rotationUnits units,
>  double        velocity,
>  velocityUnits units_v,
>  bool          waitForCompletion = true );
> ```

> **__3__ —** Spins for a specific distance using the [currently configured motor velocity](#setvelocity).
> ```cpp
> bool spinFor(
>  double        rotation,
>  rotationUnits units,
>  bool          waitForCompletion = true );
> ```

> **__4__ —** Accepts a direction parameter and spins for a specific distance using the [currently configured motor velocity](#setvelocity).
> ```cpp
> bool spinFor(
>  directionType dir,
>  double        rotation,
>  rotationUnits units,
>  bool          waitForCompletion = true );
> ```

> **__5__ —** Spins for a specific amount of time at the velocity provided in the function call.
> ```cpp
> bool spinFor(
>  double        time,
>  timeUnits     units,
>  double        velocity,
>  velocityUnits units_v );
> ```

> **__6__ —** Accepts a direction parameter and spins for a specific amount of time at the velocity provided in the function call.
> ```cpp
> bool spinFor(
>  directionType dir,
>  double        time,
>  timeUnits     units,
>  double        velocity,
>  velocityUnits units_v );
> ```

> **__7__ —** Spins for a specific amount of time using the [currently configured motor velocity](#setvelocity).
> ```cpp
> bool spinFor(
>  double    time,
>  timeUnits units );
> ```

> **__8__ —** Accepts a direction parameter and spins for a specific amount of time using the [currently configured motor velocity](#setvelocity).
> ```cpp
> bool spinFor(
>  directionType dir,
>  double        time,
>  timeUnits     units );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>dir</code> | <code>directionType</code> | The direction the motor or motor group spins: <code>forward</code> or <code>reverse</code>. |
| <code>rotation</code> | <code>double</code> | The distance the motor or motor group spins. |
| <code>units</code> | <code>rotationUnits</code> | The rotation unit:<ul><li><code>deg</code> / <code>degrees</code> — degrees</li><li><code>turns</code> / <code>rev</code> — revolutions</li></ul> |
| <code>time</code> | <code>double</code> | The amount of time the motor or motor group spins for. |
| <code>units</code> | <code>timeUnits</code> | The unit of time:<ul><li><code>seconds</code> / <code>sec</code> — seconds</li><li><code>msec</code> — milliseconds</li></ul> |
| <code>velocity</code> | <code>double</code> | The velocity to spin with from 0% to 100% when using <code>percent</code>. |
| <code>units_v</code> | <code>velocityUnits</code> | The unit used to represent <code>velocity</code>:<ul><li><code>percent</code> / <code>pct</code> — percent</li><li><code>rpm</code> — rotations per minute</li><li><code>dps</code> — degrees per second</li></ul> |
| <code>waitForCompletion</code> | <code>bool</code> | <ul><li><code>true</code> (default) — Makes the project wait until the motor or motor group is done spinning before the next line of code runs.</li><li><code>false</code> — Makes the next line of code run right away.</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a Boolean value that shows whether the motor or motor group reached the target value.

<ul>
  <li><code>true</code> — The motor or motor group reached the target value.</li>
  <li><code>false</code> — The motor or motor group was not able to reach the target value or <code>waitForCompletion</code> is set to <code>false</code>.</li>
</ul>

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Executing another motor movement function (such as [<code>spin</code>](#spin) or [<code>stop</code>](#stop)) while <code>spinFor</code> is in progress will interrupt the current movement.
- Because <code>spinFor</code> is target-based (uses a <code>rotation</code> or <code>time</code> parameter), functions such as [<code>isDone</code>](#isdone) and [<code>isSpinning</code>](#isspinning) work with <code>spinFor</code>.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Spin 1 turn fast, then 1 turn slow
Motor1.spinFor(forward, 1, turns, true);
Motor1.spinFor(reverse, 1, turns, 20, velocityUnits::pct, true);
```

### spinToPosition

```{vexcode}
id: v5_motion_motor_spin_to_position
```

<code>spinToPosition</code> spins a motor or motor group to a specific position.

A motor or motor group's position is how far it has spun, measured in <code>degrees</code> or <code>turns</code>. One turn is equal to 360 degrees. At the beginning of a project, the motor or motor group position is set to 0 degrees. The motor or motor group position can also be set using the [<code>setPosition</code>](#setposition) function.

Position values are absolute. This means the direction of the spin depends on the motor or motor group's current position.

For example, if the motor or motor group starts at 0 degrees and spins to a position of 720 degrees, it will spin forward two turns. If it then spins to a position of 360 degrees, it will spin reverse one turn, because 360 is less than 720.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Spins to a specific position at the velocity provided in the function call.
> ```cpp
> bool spinToPosition(
>  double        rotation,
>  rotationUnits units,
>  double        velocity,
>  velocityUnits units_v,
>  bool          waitForCompletion = true );
> ```

> **__2__ —** Spins to a specific position using the [currently configured motor velocity](#setvelocity).
> ```cpp
> bool spinToPosition(
>  double        rotation,
>  rotationUnits units,
>  bool          waitForCompletion = true );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>rotation</code> | <code>double</code> | The position value the motor or motor group will spin to. |
| <code>units</code> | <code>rotationUnits</code> | The rotation unit:<ul><li><code>deg</code> / <code>degrees</code> — degrees</li><li><code>turns</code> / <code>rev</code> — revolutions</li></ul> |
| <code>velocity</code> | <code>double</code> | The velocity to spin with from 0% to 100% when using <code>percent</code>. |
| <code>units_v</code> | <code>velocityUnits</code> | The unit used to represent <code>velocity</code>:<ul><li><code>pct</code> — percent</li><li><code>rpm</code> — rotations per minute</li><li><code>dps</code> — degrees per second</li></ul> |
| <code>waitForCompletion</code> | <code>bool</code> | <ul><li><code>true</code> (default) — Makes the project wait until the motor or motor group is done spinning before the next line of code runs.</li><li><code>false</code> — Makes the next line of code run right away.</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a Boolean value that shows whether the motor or motor group started the requested target-based movement.

<ul>
  <li><code>true</code> — The motor or motor group begins the requested target-based movement.</li>
  <li><code>false</code> — The call fails or <code>waitForCompletion</code> is set to <code>false</code>.</li>
</ul>

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Executing another motor movement function (such as [<code>spin</code>](#spin) or [<code>spinFor</code>](#spinfor)) while <code>spinToPosition</code> is in progress will interrupt the current movement.
- Because <code>spinToPosition</code> is target-based (uses a <code>rotation</code> parameter), functions such as [<code>isDone</code>](#isdone) and [<code>isSpinning</code>](#isspinning) work with <code>spinToPosition</code>.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Spin forward, then go to 90°
Motor1.spin(forward);
wait(1, seconds);
Motor1.spinToPosition(90, degrees);
```

### stop

```{vexcode}
id: v5_motion_motor_stop
```

<code>stop</code> stops a motor or motor group from spinning.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Stops the motor or motor group using the [currently configured brake mode](#setstopping).
> ```cpp
> void stop();
> ```

> **__2__ —** Stops the motor or motor group using the brake mode provided in the function call.
> ```cpp
> void stop(
>   brakeType mode );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>mode</code> | <code>brakeType</code> | Optional. How the motor or motor group will stop:<ul><li><code>coast</code> — Slows to a stop.</li><li><code>brake</code> — Stops immediately.</li><li><code>hold</code> — Stops immediately and holds the motor or motor group position.</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Calling <code>stop</code> immediately stops any current motor or motor group movement.
- If no brake mode is specified, the motor or motor group uses the [currently configured brake mode](#setstopping).
- <code>stop</code> interrupts any active target-based movement (such as [<code>spinFor</code>](#spinfor) or [<code>spinToPosition</code>](#spintoposition)).

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Spin and coast to a stop
Motor1.setVelocity(100, percent);
Motor1.spin(forward);
wait(1, seconds);
Motor1.stop(coast);
```

## Mutators
### setPosition

```{vexcode}
id: v5_motion_motor_set_position
```

A motor or motor group's position is how far it has spun, measured in <code>degrees</code> or <code>turns</code>. One turn is equal to 360 degrees. <code>setPosition</code> changes the motor or motor group's current position to a new value.

For example, if a motor or motor group has spun to 180 degrees, setting the position to 0 degrees will reset that position from 180 to 0 degrees. Then the motor or motor group can spin to positions based on that new value.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void setPosition(
    double        value,
    rotationUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>value</code> | <code>double</code> | The position value to set for the motor or motor group. |
| <code>units</code> | <code>rotationUnits</code> | The position unit:<ul><li><code>deg</code> / <code>degrees</code> — degrees</li><li><code>turns</code> / <code>rev</code> — revolutions</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- After calling <code>setPosition</code>, subsequent calls to [<code>spinToPosition</code>](#spintoposition) will use the updated position as the reference.

### setVelocity

```{vexcode}
id: v5_motion_motor_set_velocity
```

<code>setVelocity</code> tells a motor or motor group how fast to spin. A higher percentage makes the motor or motor group spin faster and a lower percentage makes the motor or motor group spin slower.

Every project begins with each motor or motor group spinning at 50% velocity by default.

**Note:** A higher velocity makes the motor or motor group spin faster, but it may be less precise. A lower velocity makes the motor or motor group spin slower, but it can be more precise.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void setVelocity(
    double        velocity,
    velocityUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>velocity</code> | <code>double</code> | The velocity to spin with from 0% to 100% when using <code>percent</code>. |
| <code>units</code> | <code>velocityUnits</code> | The unit used to represent <code>velocity</code>:<ul><li><code>percent</code> / <code>pct</code> — percent</li><li><code>rpm</code> — rotations per minute</li><li><code>dps</code> — degrees per second</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Any subsequent motor movement function (such as [<code>spin</code>](#spin), [<code>spinFor</code>](#spinfor), or [<code>spinToPosition</code>](#spintoposition)) that does not explicitly specify a velocity will use this value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Try default, then slow, then fast
Motor1.spinFor(forward, 180, degrees);
wait(1, seconds);
Motor1.setVelocity(20, percent);
Motor1.spinFor(reverse, 180, degrees);
wait(1, seconds);
Motor1.setVelocity(100, percent);
Motor1.spinFor(forward, 180, degrees);
```

### setStopping

```{vexcode}
id: v5_motion_motor_set_stopping
```

<code>setStopping</code> sets how a motor or motor group will stop moving: by braking, coasting, or holding.

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

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>mode</code> | <code>brakeType</code> | How the motor or motor group will stop:<ul><li><code>coast</code> — Slows to a stop.</li><li><code>brake</code> — Stops immediately.</li><li><code>hold</code> — Stops immediately and holds the motor or motor group position.</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Any subsequent call to [<code>stop</code>](#stop) without a specified brake mode will use this value.

### setMaxTorque

```{vexcode}
id: v5_motion_motor_set_max_torque
```

Torque shows how hard a motor or motor group can push or pull while it spins.

<code>setMaxTorque</code> sets the most torque a motor or motor group is allowed to use.

A higher percentage lets the motor or motor group push harder, like when lifting a heavy object. A lower percentage limits how hard the motor or motor group can push. This can help protect the robot if the motor or motor group gets stuck or reaches the end of how far it can move.

Every project begins with each motor or motor group's torque at 50% by default.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>


> **__1__ —** Sets the maximum torque as a percentage of the motor’s or motor group's rated torque.
> ```cpp
> void setMaxTorque(
>  double       value,
>  percentUnits units );
> ```

> **__2__ —** Sets the maximum torque using physical torque units.
> ```cpp
> void setMaxTorque(
>  double      value,
>  torqueUnits units );
> ```

> **__3__ —** Sets the maximum torque by limiting motor current.
> ```cpp
> void setMaxTorque(
>  double       value,
>  currentUnits units );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>value</code> | <code>double</code> | The max torque the motor or motor group can use. |
| <code>units</code> | <code>percentUnits</code> | Specifies torque as a percentage: <code>percent</code> / <code>pct</code> — percent  |
| <code>units</code> | <code>torqueUnits</code> | Specifies torque in physical units such as:<ul><li><code>Nm</code> — Newton-meters</li><li><code>InLb</code> — inch-pounds</li></ul> |
| <code>units</code> | <code>currentUnits</code> | Specifies torque by limiting motor current:<ul><li><code>amp</code></li></ul>  |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- When using <code>currentUnits</code>, torque is limited by restricting how much electrical current the motor or motor group can use.

### setTimeout

```{vexcode}
id: v5_motion_motor_set_timeout
```

<code>setTimeout</code> sets how much time a motor or motor group will try to finish a movement. If the motor or motor group cannot finish in that time, it will stop trying and move on to the next line of code. This keeps the motor or motor group from getting stuck on a movement.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void setTimeout(
    int32_t   time,
    timeUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>time</code> | <code>int32_t</code> | The amount of time the motor or motor group can try to finish a movement. This must be a positive integer. |
| <code>units</code> | <code>timeUnits</code> | The unit of time:<ul><li><code>msec</code> — milliseconds</li><li><code>seconds</code> / <code>sec</code> — seconds</li></ul> |

<span style="font-size: 1.5rem;"> Return Values </span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The motor or motor group timeout is used to keep movements that do not reach their target position from stopping the execution of other commands in the stack.
- If the motor or motor group does not reach its target position before the timeout expires, it will stop trying and move on to the next line of code.
- The timeout applies to functions that have a target value such as [<code>spinFor</code>](#spinfor) and [<code>spinToPosition</code>](#spintoposition).

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Stop a long move after 1 second
Motor1.setTimeout(1, seconds);
Motor1.spinFor(forward, 2, turns);
Motor1.spinToPosition(0, degrees);
```

## Getters
### isDone

```{vexcode}
id: v5_motion_motor_is_done
```

<code>isDone</code> returns whether the motor or motor group is finished moving, as a Boolean value. This can be used to control the timing of other behaviors based on the motor or motor group's movement.

- <code>true</code> — The motor or motor group is finished moving.
- <code>false</code> — The motor or motor group is still moving.

This function works together with the following Motion functions that have the <code>waitForCompletion</code> parameter: [<code>spinFor</code>](#spinfor) and [<code>spinToPosition</code>](#spintoposition).

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
bool isDone();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns whether the motor or motor group is finished moving, as a Boolean value.

<ul>
  <li><code>true</code> — The motor or motor group is finished moving.</li>
  <li><code>false</code> — The motor or motor group is still moving.</li>
</ul>

<span style="font-size: 1.5rem; ">
  Notes
</span>

- <code>isDone</code> works together with the following Motion functions that have the <code>waitForCompletion</code> parameter: [<code>spinFor</code>](#spinfor) and [<code>spinToPosition</code>](#spintoposition).

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Spin forward until the motor is done spinning
Motor1.spinFor(forward, 200, degrees, false);
while (true) {
  if (Motor1.isDone()) {
    Drivetrain.stop();
  } else {
    Drivetrain.drive(forward);
  }
}
```

### isSpinning

```{vexcode}
id: v5_motion_motor_is_spinning
```

<code>isSpinning</code> returns whether the motor or motor group is spinning, as a Boolean value. This can be used to control the timing of other behaviors based on the motor or motor group's movement.

- <code>true</code> — The motor or motor group is spinning.
- <code>false</code> — The motor or motor group is not spinning.

This function works together with Motion movement functions such as [<code>spin</code>](#spin), [<code>spinFor</code>](#spinfor), and [<code>spinToPosition</code>](#spintoposition).

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
bool isSpinning();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns whether the motor or motor group is spinning, as a Boolean value.

<ul>
  <li><code>true</code> — The motor or motor group is spinning.</li>
  <li><code>false</code> — The motor or motor group is not spinning.</li>
</ul>

<span style="font-size: 1.5rem; ">
  Notes
</span>

- <code>isSpinning</code> works with Motion movement functions such as [<code>spin</code>](#spin), [<code>spinFor</code>](#spinfor), and [<code>spinToPosition</code>](#spintoposition).

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Spin forward until the motor is done spinning
Motor1.spinFor(forward, 200, degrees, false);
while (true) {
  if (Motor1.isSpinning()) {
    Drivetrain.drive(forward);
  } else {
    Drivetrain.stop();
  }
}
```

### position

```{vexcode}
id: v5_motion_motor_position
```

A motor or motor group's position is how far it has spun, measured in <code>degrees</code> or <code>turns</code>. One turn is equal to 360 degrees. <code>position</code> returns the motor or motor group's current position.

At the beginning of a project, the motor or motor group position is set to 0 degrees. If the motor or motor group spins one turn forward, the position will be 360 degrees or 1 turn. If the motor or motor group spins the other direction, the position will be negative.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double position(
  rotationUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>units</code> | <code>rotationUnits</code> | The unit to return the motor or motor group position in:<ul><li><code>deg</code> / <code>degrees</code> — degrees</li><li><code>turns</code> / <code>rev</code> — revolutions</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the motor or motor group's current position in the specified units.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Calling [<code>setPosition</code>](#setposition) changes the reference point for this value.
- The returned value reflects the current encoder reading and does not indicate whether the motor or motor group is actively moving.
- When called on a <code>motor_group</code>, this function returns the position of the first motor in the group.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Spin, then show the final position
Motor1.spin(forward);
wait(1, seconds);
Motor1.stop();
Brain.Screen.print("Pos: %f", Motor1.position(degrees));
```

### velocity

```{vexcode}
id: v5_motion_motor_velocity
```

<code>velocity</code> returns how fast the motor or motor group is spinning.

A positive value means the motor or motor group is spinning forward. A negative value means it is spinning in reverse.

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

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>units</code> | <code>velocityUnits</code> | The unit used to represent velocity:<ul><li><code>percent</code> / <code>pct</code> — percent</li><li><code>rpm</code> — rotations per minute</li><li><code>dps</code> — degrees per second</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing how fast the motor or motor group is spinning in the specified units.

<span style="font-size: 1.5rem;"> Notes </span>

- When called on a <code>motor_group</code>, this function returns the velocity of the first motor in the group.

### current

```{vexcode}
id: v5_motion_motor_current
```

<code>current</code> returns how much electrical current the motor or motor group is using. Current is the amount of electricity flowing through the motor or motor group. When returned in amps, current is reported from 0.0 to 1.2 A.

A higher current value means the motor or motor group is using more electrical current. This can happen when the motor or motor group is lifting something heavy, pushing against an object, or trying to move when it is stuck.

This can be used to check if the motor or motor group is struggling during a movement. If current stays high, the motor may get warmer or use power less efficiently.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

> **__1__ —** Returns the motor’s or motor group's electrical current in amps.
> ```cpp
> double current(
>   currentUnits units = amp );
> ```

> **__2__ —** Returns the motor’s or motor group's electrical current as a percentage of maximum rated current.
> ```cpp
> double current(
>   percentUnits units );
> ```


<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>units</code> | <code>currentUnits</code> | The unit used to represent current:<code>amp</code> (default) — amperes |
| <code>units</code> | <code>percentUnits</code> | Represents the current as a percentage of the motor's maximum rated current:<code>percent</code> / <code>pct</code> — percent |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing how much electrical current the motor or motor group is using in the specified units.

<span style="font-size: 1.5rem;"> Notes </span>

- When called on a <code>motor_group</code>, this function returns the total electrical current for all motors in the group.

### power

```{vexcode}
id: v5_motion_motor_power
```

<code>power</code> returns how much power the motor or motor group is using, measured in watts from 0.0 to 22.0 W. Power shows how quickly the motor or motor group is using energy.

A higher power value means the motor or motor group is using energy faster. This can happen when the motor or motor group is lifting something heavy, pushing against an object, or trying to move when it is stuck.

This can be used to compare movements or check if the motor or motor group is struggling. If power stays high, the motor may get warmer or use energy less efficiently.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double power(
  powerUnits units = watt );
```

<span style="font-size: 1.5rem;"> Parameters </span>

|      Parameter     |           Type          | Description                                                                                                                                                   |
| :----------------: | :---------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <code>units</code> | <code>powerUnits</code> | The unit used to represent the motor power:<ul><li><code>watt</code> (default) — watts</li></ul> |

<span style="font-size: 1.5rem;"> Return Values </span>

Returns a <code>double</code> representing how much power the motor or motor group is using in watts.

<span style="font-size: 1.5rem;"> Notes </span>

- When called on a <code>motor_group</code>, this function returns the electrical power of the first motor in the group.

### torque

```{vexcode}
id: v5_motion_motor_torque
```

Torque shows how hard a motor or motor group is twisting, pushing, or pulling while it spins.

<code>torque</code> returns how much torque the motor or motor group is using, measured in inch-pounds (InLb) from 0.0 to 22.0 or Newton-meters (Nm) from 0.0 to 2.1.

A higher torque value means the motor or motor group is pushing or pulling harder. This can happen when the motor or motor group is lifting something heavy, pushing against an object, or trying to move when it is stuck.

This can be used to check if the motor or motor group is struggling or to compare how much push different movements need.

To set the torque of a motor or motor group, use [<code>setMaxTorque</code>](#setmaxtorque).

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double torque(
  torqueUnits units = Nm );
```

<span style="font-size: 1.5rem;"> Parameters </span>

|      Parameter     |           Type           | Description                                                                                                                                                               |
| :----------------: | :----------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <code>units</code> | <code>torqueUnits</code> | The unit used to represent the motor torque:<ul><li><code>Nm</code> (default) — Newton-meters </li><li><code>InLb</code> — inch-pounds</li></ul> |

<span style="font-size: 1.5rem;"> Return Values </span>

Returns a <code>double</code> representing how much torque the motor or motor group is using in the specified units.

<span style="font-size: 1.5rem;"> Notes </span>

- When called on a <code>motor_group</code>, this function returns the mechanical output torque of the first motor in the group.

### efficiency

```{vexcode}
id: v5_motion_motor_efficiency
```

<code>efficiency</code> returns how efficiently the motor or motor group is using power, as a percentage from 0% to 100%.

Efficiency shows how much of the motor or motor group's power is being used for movement. A higher efficiency value means more of the motor or motor group's power is being used to move. A lower efficiency value can happen when the motor or motor group is working hard but not moving much, like when it is stuck or pushing against an object.

This can be used to compare movements or check if the motor or motor group is wasting power instead of using it for movement.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double efficiency(
  percentUnits units = percent );
```

<span style="font-size: 1.5rem;"> Parameters </span>

|      Parameter     |            Type           | Description                                                                                                         |
| :----------------: | :-----------------------: | :------------------------------------------------------------------------------------------------------------------ |
| <code>units</code> | <code>percentUnits</code> | The unit used to represent motor efficiency:<ul><li><code>percent</code> / <code>percentUnits::pct</code> (default) — percent</li></ul> |

<span style="font-size: 1.5rem;"> Return Values </span>

Returns a <code>double</code> representing how efficiently the motor or motor group is using power as a percentage.

<span style="font-size: 1.5rem;"> Notes </span>

- When called on a <code>motor_group</code>, this function returns the efficiency of the first motor in the group.

### temperature

```{vexcode}
id: v5_motion_motor_temperature
```

<code>temperature</code> returns the temperature of the motor or motor group.

Motor temperature shows how warm the motor or motor group is. A higher temperature means the motor or motor group is getting warmer while it works. The motor should stay below 55°C to keep working at full performance.

If the motor or motor group gets too hot, it will lower its maximum current to protect itself. At 70°C, a motor will stop running until it cools down.

This can be used to check if the motor or motor group is getting too hot during repeated movements, long runs, or when it is pushing against an object.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

> **__1__ —** Returns motor or motor group temperature as a percentage of maximum operating temperature.
> ```cpp
> double temperature(
>   percentUnits units = percent );
> ```

> **__2__ —** Returns motor or motor group temperature in physical temperature units.
> ```cpp
> double temperature(
>   temperatureUnits units );
> ```

<span style="font-size: 1.5rem;"> Parameters </span>

| Parameter | Type | Description |
|:---------:|:----:|:------------|
| <code>units</code> | <code>percentUnits</code> | The unit used to represent motor or motor group temperature as a percentage:<ul><li><code>percent</code> / <code>percentUnits::pct</code> (default) — percent</li></ul> |
| <code>units</code> | <code>temperatureUnits</code> | The unit used to represent motor or motor group temperature in degrees:<ul><li><code>celsius</code> — degrees Celsius</li><li><code>fahrenheit</code> — degrees Fahrenheit</li></ul> |

<span style="font-size: 1.5rem;"> Return Values </span>

Returns a <code>double</code> representing the temperature of the motor or motor group in the specified units.

<span style="font-size: 1.5rem;"> Notes </span>

- The operating temperature range for the motor is approximately <code>20°C</code> (<code>68°F</code>) to <code>70°C</code> (<code>158°F</code>).
- When called on a <code>motor_group</code>, this function returns the temperature of the first motor in the group.

### voltage

<code>voltage</code> returns the electrical voltage supplied to the motor or motor group.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double voltage(
  voltageUnits units = volt );
```

<span style="font-size: 1.5rem;"> Parameters </span>

|      Parameter     |            Type           | Description                                  |
| :----------------: | :-----------------------: | :------------------------------------------- |
| <code>units</code> | <code>voltageUnits</code> | The unit to represent the voltage:<ul><li><code>volt</code> (default)</li><li><code>voltageUnits::mV</code> — millivolts</li></ul> |

<span style="font-size: 1.5rem;"> Return Values </span>

Returns a <code>double</code> representing the electrical voltage supplied to the motor or motor group in the specified units.

<span style="font-size: 1.5rem;"> Notes </span>

- When called on a <code>motor_group</code>, this function returns the electrical voltage of the first motor in the group.

### direction

<code>direction</code> returns the direction that the motor or motor group is spinning.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
directionType direction();
```

<span style="font-size: 1.5rem;"> Parameters </span>

This function does not take any parameters.

<span style="font-size: 1.5rem;"> Return Values </span>

Returns a <code>directionType</code> indicating the motor's or motor group's current direction:

<ul><li><code>forward</code> — The motor or motor group is spinning forward.</li><li><code>reverse</code> — The motor or motor group is spinning in reverse.</li></ul>

### installed

<code>installed</code> returns whether the motor or motor group is connected to the V5 Brain.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
bool installed();
```

<span style="font-size: 1.5rem;"> Parameters </span>

This function does not take any parameters.

<span style="font-size: 1.5rem;"> Return Values </span>

Returns a <code>bool</code> indicating whether the motor or motor group is connected.

<ul> <li><code>true</code> — The motor or motor group is connected.</li> <li><code>false</code> — The motor or motor group is not connected.</li> </ul>

### count

<code>count</code> returns the number of motors in a motor group.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
int32_t count();
```

<span style="font-size: 1.5rem;"> Parameters </span>

This function does not take any parameters.

<span style="font-size: 1.5rem;"> Return Values </span>

Returns an <code>int32_t</code> representing the number of motors in the motor group.