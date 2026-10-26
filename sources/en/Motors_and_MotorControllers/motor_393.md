---
title: Motor 393 (Motor Controller 29) | VEX V5 - C++ API
description: Reference documentation for the motor29 class in VEX V5 C++. Includes constructors, functions, parameters, notes, and usage examples.
---
```{highlight} cpp
:linenothreshold: 5
```

# Motor 393 (Motor Controller 29)

```{contents}
:local: true
```

## Introduction

The <code>motor29</code> class is used to control a Motor Controller 29 connected to a [3-Wire Port](../3-Wire_Devices/index.md). The Motor Controller 29 sends a PWM signal from the V5 Brain to operate a VEX Motor 393.

![The VEX Motor Controller 29.](/_static/img/motion/mc-29.png)

## Class Constructors

> **__1__ —** Creates a <code>motor29</code> object on the specified 3-Wire Port.
> ```cpp
> motor29(
>     triport::port &port );
> ```

> **__2__ —** Creates a <code>motor29</code> object on the specified 3-Wire Port and changes the positive turning direction.
> ```cpp
> motor29(
>     triport::port &port,
>     bool           reverse );
> ```

## Class Destructor

Destroys the <code>motor29</code> object and releases associated resources.

```cpp
~motor29();
```

## Parameters

|       Parameter      |             Type            | Description                                                                     |
| :------------------: | :-------------------------: | -------------------------------------- |
|   <code>port</code>  | <code>triport::port&</code> | The 3-Wire Port that the Motor Controller 29 is connected to, written as <code>Brain.ThreeWirePort.X</code> or <code>ExpanderName.X</code>, where <code>X</code> is the port letter (for example, <code>Brain.ThreeWirePort.A</code> or <code>Expander1.A</code>). |
| <code>reverse</code> |      <code>bool</code>      | Sets whether the motor's spin direction is reversed:<ul><li><code>false</code> (default) — Does not reverse the motor's direction.</li><li><code>true</code> — Reverses the motor's direction.</li></ul> |

## Example

```cpp
// Create a Motor Controller 29 instance in 3-Wire Port A
motor29 Motor393_A = motor29(
    Brain.ThreeWirePort.A );
```

## Member Functions

The <code>motor29</code> class includes the following member functions:

- <a href="#spin">spin</a> — Spins the motor in a specified direction.
- <a href="#stop">stop</a> — Stops the motor.
- <a href="#setvelocity">setVelocity</a> — Tells the Motor 393 how fast to spin.
- <a href="#setreversed">setReversed</a> — Sets whether the motor’s rotation direction is reversed.

Before calling any <code>motor29</code> member functions, an instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
Motor 393 configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create a Motor Controller 29 instance in 3-Wire Port A
motor29 Motor393_A = motor29(
    Brain.ThreeWirePort.A );
```

### spin

```{vexcode}
id: v5_motion_motor393_spin
```

Spins the Motor 393 in the specified direction forever.

<span style="font-size: 1.5rem;"> Available Functions </span>

> **__1__ —** Spins using the [currently configured velocity](#setvelocity).
> ```cpp
> void spin(
>  directionType dir );
> ```

> **__2__ —** Spins at the specified velocity.
> ```cpp
> void spin(
>  directionType dir,
>  double        velocity,
>  velocityUnits units );
> ```

<span style="font-size: 1.5rem;"> Parameters </span>

|       Parameter       |            Type            | Description                                                                                                |
| :-------------------: | :------------------------: | ---------------------------------------------------------------------------------------------------------- |
|    <code>dir</code>   | <code>directionType</code> | The direction in which the motor spins: <code>forward</code> or <code>reverse</code>. |
| <code>velocity</code> |     <code>double</code>    | The velocity to spin with from 0% to 100% when using <code>percent</code>.                                    |
|   <code>units</code>  | <code>velocityUnits</code> | The velocity unit:<ul><li><code>percent</code> / <code>pct</code> — percent</li><li><code>rpm</code> — rotations per minute</li><li><code>dps</code> — degrees per second</li></ul>                           |

<span style="font-size: 1.5rem;"> Return Values </span>

This function does not return a value.

<span style="font-size: 1.5rem;"> Notes </span>
- This function is non-waiting and the project will continue executing immediately after the call.
- The Motor 393 will continue spinning until [<code>stop</code>](#stop) is called or another <code>spin</code> is used.

### stop

```{vexcode}
id: v5_motion_motor393_stop
```

Stops the motor.

<span style="font-size: 1.5rem;"> Available Functions </span>

```cpp
void stop();
```

<span style="font-size: 1.5rem;"> Parameters </span>

This function does not take any parameters.

<span style="font-size: 1.5rem;"> Return Values </span>

This function does not return a value.

### setVelocity

```{vexcode}
id: v5_motion_motor393_set_velocity
```

Tells a Motor 393 how fast to spin. A higher percentage makes the Motor 393 spin faster and a lower percentage makes the Motor 393 spin slower.

Every project begins with each Motor 393 spinning at 50% velocity by default.

<span style="font-size: 1.5rem;"> Available Functions </span>

```cpp
void setVelocity(
    double velocity,
    percentUnits units );
```

<span style="font-size: 1.5rem;"> Parameters </span>

|       Parameter       |            Type           | Description                                                                      |
| :-------------------: | :-----------------------: | -------------------------------------------------------------------------------- |
| <code>velocity</code> |    <code>double</code>    | The velocity to spin with from 0% to 100% when using <code>percent</code>.                                        |
|   <code>units</code>  | <code>percentUnits</code> | The velocity unit:<code>percent</code> / <code>pct</code> — percent |

<span style="font-size: 1.5rem;"> Return Values </span>

This function does not return a value.

### setReversed

Sets whether the motor’s rotation direction is reversed.

<span style="font-size: 1.5rem;"> Available Functions </span>

```cpp
void setReversed(
    bool value );
```

<span style="font-size: 1.5rem;"> Parameters </span>

|      Parameter     |        Type       | Description                                                                                                                                                                                       |
| :----------------: | :---------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <code>value</code> | <code>bool</code> | Whether the Motor 393's direction is reversed:<ul><li><code>true</code> — Reverses the Motor 393's direction.</li><li><code>false</code> — Returns the Motor 393's direction to its default.</li></ul> |

<span style="font-size: 1.5rem;"> Return Values </span>

This function does not return a value.

<span style="font-size: 1.5rem;"> Notes </span>

- Calling <code>setReversed</code> is the same as changing the <code>reverse</code> parameter in the [constructor](#class-constructors).