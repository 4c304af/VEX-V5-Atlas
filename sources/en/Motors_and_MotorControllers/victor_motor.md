---
title: Victor 883 Motor | VEX V5 - C++ API
description: Reference documentation for the motor_victor class in VEX V5 C++. Includes constructors, functions, parameters, notes, and usage examples.
---

```{highlight} cpp
:linenothreshold: 5
```

# Victor 883 Motor

```{contents}
:local: true
```

## Introduction

The <code>motor_victor</code> class is used to control a Victor 883 Motor Controller connected to a 3-Wire Port. The Victor 883 Motor Controller sends a PWM signal from the V5 Brain to control compatible VEXpro or VEX EDR DC motors that cannot be connected directly to Smart Ports.

The Victor 883 Motor Controller cannot be configured in VEXcode and must be manually constructed in code in order to be used.

## Class Constructors

> **__1__ —** Creates a <code>motor_victor</code> object for the Victor 883 Motor Controller connected to the specified 3-Wire Port.
> ```cpp
> motor_victor( triport::port& port );
> ```

> **__2__ —** Creates a <code>motor_victor</code> object on the specified 3-Wire Port and optionally reverses its direction.
> ```cpp
> motor_victor(
>  triport::port& port,
>  bool           reverse );
> ```

## Class Destructor

Destroys the <code>motor_victor</code> object and releases associated resources.

```cpp
~motor_victor();
```

## Parameters

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>port</code> | <code>triport::port&</code> | The 3-Wire Port that the Victor 883 Motor is connected to, written as <code>Brain.ThreeWirePort.X</code> or <code>ExpanderName.X</code>, where <code>X</code> is the port letter (for example, <code>Brain.ThreeWirePort.A</code> or <code>Expander1.A</code>). |
| <code>reverse</code> | <code>bool</code> | Sets whether the motor's spin direction is reversed:<ul><li><code>false</code> (default) — Does not reverse the motor's direction.</li><li><code>true</code> — Reverses the motor's direction.</li></ul> |

## Example

```cpp
// Create the motor_victor instance on 3-Wire Port A
motor_victor victor = motor_victor(Brain.ThreeWirePort.A);

// Create the motor_victor instance with reversed direction
motor_victor victor2 = motor_victor(Brain.ThreeWirePort.B, true);
```

## Member Functions

The <code>motor_victor</code> class includes the following member functions:

- [<code>spin</code>](#spin) — Spins the motor in a specified direction.
- [<code>stop</code>](#stop) — Stops the motor.
- [<code>setVelocity</code>](#setvelocity) — Tells the motor how fast to spin.
- [<code>setReversed</code>](#setreversed) — Sets the motor direction to be reversed or not.

Before calling any <code>motor_victor</code> member functions, a <code>motor_victor</code> instance must be created, as shown below:

```cpp
/* This constructor is required to use a
Victor 883 Motor. Replace the values
as needed. */

// Create the motor_victor instance on 3-Wire Port A
motor_victor victor = motor_victor(Brain.ThreeWirePort.A);
```

### spin

Spins the motor in the specified direction forever.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

> **__1__ —** Spins the motor using the currently configured motor velocity.
> ```cpp
> void spin(
>  directionType dir );
> ```

> **__2__ —** Spins the motor at the specified velocity.
> ```cpp
> void spin(
>  directionType dir,
>  double        velocity,
>  velocityUnits units );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>dir</code> | <code>directionType</code> | The direction in which the motor spins: <code>forward</code> or <code>reverse</code>. |
| <code>velocity</code> | <code>double</code> | The velocity to spin with from 0% to 100% when using <code>percent</code>. |
| <code>units</code> | <code>velocityUnits</code> | The velocity unit:<ul><li><code>percent</code> / <code>pct</code> — percent</li><li><code>rpm</code> — rotations per minute</li><li><code>dps</code> — degrees per second</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The motor will continue spinning until [<code>stop</code>](#stop) is called or another movement function is executed.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Spin forward, then stop
victor.spin(forward);
wait(1, seconds);
victor.stop();
```

```cpp
// Spin forward at 100 rpm
victor.spin(forward, 100, rpm);
wait(1, seconds);
victor.stop();
```

### stop

Stops the motor from spinning.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void stop();
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

- Calling <code>stop</code> immediately stops any current motor movement.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Spin and then stop
victor.spin(forward);
wait(1, seconds);
victor.stop();
```

### setVelocity

Tells the motor how fast to spin. A higher percentage makes the motor spin faster and a lower percentage makes the motor spin slower.

Every project begins with each connected motor spinning at 50% velocity by default.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void setVelocity(
    double       velocity,
    percentUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>velocity</code> | <code>double</code> | The velocity to spin with from 0% to 100% when using <code>percent</code>. |
| <code>units</code> | <code>percentUnits</code> | The velocity unit:<code>percent</code> / <code>pct</code> — percent |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Any subsequent Victor 883 Motor movement function (such as [<code>spin</code>](#spin)) that does not explicitly specify a velocity will use this value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Set velocity to 50%, then spin
victor.setVelocity(50, percent);
victor.spin(forward);
```

### setReversed

Sets the motor direction to be reversed or not.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void setReversed( bool value );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>value</code> | <code>bool</code> | Whether the motor's direction is reversed:<ul><li><code>true</code> — Reverses the motor's direction.</li><li><code>false</code> — Returns the motor's direction to its default.</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- This is the same as changing the <code>reverse</code> parameter in the [constructor](#class-constructors).

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Reverse the motor direction
victor.setReversed(true);
victor.spin(forward); // Will actually spin in reverse
```