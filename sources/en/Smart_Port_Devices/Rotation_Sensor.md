---
title: Rotation | VEX V5 - C++ API
description: Reference documentation for the rotation class in VEX V5 C++. Includes constructors, functions, parameters, notes, and member functions.
---

```{highlight} cpp
:linenothreshold: 5
```

# Rotation Sensor

```{contents}
:local: true
```

## Introduction

The <code>rotation</code> class is used to control and access data from a V5 Rotation Sensor.

The **Rotation Sensor** measures the rotation of a shaft. It can be used anywhere on a robot where a shaft is rotating, even if that shaft is not connected directly to a motor.

A motor has a built-in encoder that can track its own rotation. The Rotation Sensor works like an external encoder that can track the rotation of a separate shaft.

The Rotation Sensor can return the shaft's angle, position, and velocity. Angle is the shaft's absolute position from 0 to 359.99 degrees. It does not reset when a project starts or when the robot is powered off. Position tracks how many degrees or turns the shaft has rotated forward or reverse during a project, and it can be reset as needed.

The Rotation Sensor is compatible with 1/8 inch and 1/4 inch standard VEX shafts.

## Class Constructor

```cpp
rotation(
    int32_t index,
    bool    reverse = false );
```

## Class Destructor

Destroys the <code>rotation</code> object and releases associated resources.

```cpp
virtual ~rotation();
```

## Parameters

| Parameter | Type | Description |
|:---------:|:----:|:------------|
| <code>index</code> | <code>int32_t</code> | The Smart Port that the Rotation Sensor is connected to, written as <code>PORTx</code>, where <code>x</code> is the port number (for example, <code>PORT1</code>). |
| <code>reverse</code> | <code>bool</code> | Optional. Whether to reverse the Rotation Sensor output:<ul><li><code>true</code> — Reverses the direction of the reported angle and position values.</li><li><code>false</code> (default) — Reports angle and position values in the standard direction.</li></ul> |


## Examples

```cpp
// Create a Rotation Sensor instance in Port 1
rotation Rotation1 = rotation(PORT1);
```

## Member Functions

The <code>rotation</code> class includes the following member functions:

- [<code>setPosition</code>](#setposition) — Sets the Rotation Sensor's current position to a specific value.
- [<code>angle</code>](#angle) — Returns the shaft's current angle from 0 to 359.99 degrees.
- [<code>position</code>](#position) — Returns how far the shaft has rotated in degrees or turns.
- [<code>velocity</code>](#velocity) — Returns how fast the shaft is rotating.

Before calling any <code>rotation</code> member functions, a <code>rotation</code> instance must be created, as shown below:

```cpp
// Create a Rotation Sensor instance in Port 1
rotation Rotation1 = rotation(PORT1);
```

### setPosition

Sets the Rotation Sensor's current position to a specific value.

Position is how far the shaft has rotated during a project. Setting the position changes the current position value without moving the shaft.

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
| :----------------: | :------: | :-------------------------------------- |
| <code>value</code> | <code>double</code> | The position value to assign to the Rotation Sensor. This can be an integer or a decimal. |
| <code>units</code> | <code>rotationUnits</code> | The position unit:<ul><li><code>deg</code> / <code>degrees</code> — degrees</li><li><code>turns</code> / <code>rev</code> — turns</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

### angle

Returns the shaft's current angle.

Angle reports the shaft's absolute position within one rotation, from 0 to 359.99 degrees. It does not reset when a project starts or when the robot is powered off.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
  double angle( rotationUnits units = degrees );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :----------------: | :------: | :-------------------------------------- |
| <code>units</code> | <code>rotationUnits</code> | Optional. The angle unit:<ul><li><code>deg</code> / <code>degrees</code> (default) — degrees</li><li><code>turns</code> / <code>rev</code> — turns</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the shaft's current angle in the specified units.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
  // Get the current angle of the shaft
  double angle = Rotation1.angle(degrees);

  // Print the current angle of the shaft to the
  // Brain's screen.
  Brain.Screen.print(angle);
```

### position

Returns how far the shaft has rotated.

Unlike angle, position can increase past 359.99 degrees or decrease below 0 degrees. Position tracks how far the shaft rotates forward or reverse during a project and can be reset as needed.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
  double position( rotationUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :----------------: | :------: | :-------------------------------------- |
| <code>units</code> | <code>rotationUnits</code> | The position unit:<ul><li><code>deg</code> / <code>degrees</code> — degrees</li><li><code>turns</code> / <code>rev</code> — turns</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing how far the shaft has rotated in the specified units.

### velocity

Returns how fast the shaft is rotating.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
  double velocity( velocityUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :----------------: | :------: | :-------------------------------------- |
| <code>units</code> | <code>velocityUnits</code> | The velocity unit:<ul><li><code>rpm</code> — revolutions per minute</li><li><code>dps</code> — degrees per second</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing how fast the shaft is rotating in the specified units.