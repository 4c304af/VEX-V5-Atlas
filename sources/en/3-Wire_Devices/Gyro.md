---
title: Gyro Sensor | VEX V5 - C++ API
description: Reference documentation for the gyro class in VEX V5 C++. Includes constructors, functions, parameters, notes, and member functions.
---

```{highlight} cpp
:linenothreshold: 5
```

# Gyro Sensor

```{contents}
:local: true
```

## Introduction

The <code>gyro</code> class is used to measure the robot’s heading and rotational movement, allowing tracking of orientation over time.

## Class Constructor

```cpp
gyro(
  triport::port &port);
```

## Class Destructor

Destroys the <code>gyro</code> object and releases associated resources.

```cpp
virtual ~gyro();
```

## Parameters

| Parameter | Type | Description |
|:---------:| :------: | :------------|
| <code>port</code> | <code>triport::port &</code> | The 3-Wire Port that the Gyro Sensor is connected to, written as <code>Brain.ThreeWirePort.X</code> or <code>ExpanderName.X</code>, where <code>X</code> is the port letter (for example, <code>Brain.ThreeWirePort.A</code> or <code>Expander1.A</code>).  |

## Example

```cpp
// Create a gyro instance in Port A
gyro GyroA = gyro(Brain.ThreeWirePort.A);
```

## Member Functions

The <code>gyro</code> class includes the following member functions:

- [<code>calibrate</code>](#calibrate) — Calibrates the gyro for stable heading tracking.
- [<code>setHeading</code>](#setheading) — Sets the heading of the gyro.
- [<code>setRotation</code>](#setrotation) — Sets the current rotation value of the gyro.
- [<code>heading</code>](#heading) — Returns the heading of the gyro.
- [<code>rotation</code>](#rotation) — Returns the rotation of the gyro.

Before calling any <code>gyro</code> member functions, a <code>gyro</code> instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
Gyro Sensor configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create a gyro instance in Port A
gyro GyroA = gyro(Brain.ThreeWirePort.A);
```

### calibrate

Calibrates the Gyro Sensor.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void calibrate(
  int32_t value = 0 );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameters | Type | Description |
| :----------------: | :-----: | :-------------------------------------- |
| <code>value</code> | <code>int32_t</code> | The time in seconds to spend calibrating. Default is <code>0</code>. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- <code>calibrate</code> should only be called when the sensor is not moving.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Start calibration with the calibration time set to 3 seconds.
GyroA.calibrate(3);
```

### setHeading

Sets the heading of the Gyro Sensor to a specific value.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void setHeading(
  double        value,
  rotationUnits units );
```

| Parameters | Type | Description |
| :----------------: | :-----: | :-------------------------------------- |
| <code>value</code> | <code>double</code> | The value to use for the new heading. |
| <code>units</code> | <code>rotationUnits</code> | The unit that represents the heading: <ul><li><code>degrees</code>  </li><li><code>turns</code></li><ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

### setRotation

Sets the rotation of the Gyro Sensor to a specific value.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void setRotation(
  double        value,
  rotationUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameters | Type | Description |
| :----------------: | :-----: | :-------------------------------------- |
| <code>value</code> | <code>double</code> | The value to use for the new rotation value. |
| <code>units</code> | <code>rotationUnits</code> | The unit that represents the rotation value: <ul><li><code>degrees</code>  </li><li><code>turns</code></li><ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

### heading

Returns the current heading of the Gyro Sensor.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double heading(
  rotationUnits units = degrees );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :----------------: | :------: | :-------------------------------------- |
| <code>units</code> | <code>rotationUnits</code> | The unit that represents the heading: <ul><li><code>degrees</code> (default)  </li><li><code>turns</code></li><ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the current heading of the Gyro Sensor in the specified units, defaulting to <code>degrees</code>.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Get the current heading for the Gyro.
double value = GyroA.heading();
Brain.Screen.print(value);
```

### rotation

Returns the current rotation of the Gyro Sensor.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double rotation(
  rotationUnits units = degrees );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :----------------: | :------: | :-------------------------------------- |
| <code>units</code> | <code>rotationUnits</code> | The unit that represents the rotation value: <ul><li><code>degrees</code> (default)  </li><li><code>turns</code></li><ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the current rotation value of the Gyro Sensor in the specified units, defaulting to <code>degrees</code>.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Get the current rotation for the Gyro.
double value = GyroA.rotation();
Brain.Screen.print(value);
```
