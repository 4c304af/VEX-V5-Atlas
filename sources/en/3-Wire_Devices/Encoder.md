---
title: Encoder | VEX V5 - C++ API
description: Reference documentation for the encoder class in VEX V5 C++. Includes constructors, functions, parameters, notes, and member functions.
---

```{highlight} cpp
:linenothreshold: 5
```

# Encoder

```{contents}
:local: true
```

## Introduction

The <code>encoder</code> class is used with the Optical Shaft Encoder, which measures the rotational position and speed of a shaft. It uses internal optical sensors to detect how far and how fast the shaft turns, making it useful for tracking wheel rotation, arm position, or other mechanisms.

![The VEX Optical Shaft Encoder.](/_static/img/sensing/encoder_1.png)

## Class Constructor

```cpp
encoder(
  triport::port &port );
```

## Class Destructor

Destroys the <code>encoder</code> object and releases associated resources.

```cpp
virtual ~encoder();
```

## Parameters

| Parameter | Type | Description |
|:---------:| :------: | :------------|
| <code>port</code> | <code>triport::port &</code> | The first 3-Wire Port of a required two-port group used by the Optical Shaft Encoder. The encoder occupies two adjacent ports (A–B, C–D, E–F, or G–H) on either the Brain or a 3-Wire Expander. Specify the first port in the pair (A, C, E, or G), written as <code>Brain.ThreeWirePort.X</code> or <code>ExpanderName.X</code> where <code>X</code> is the port letter (for example, <code>Brain.ThreeWirePort.A</code> or <code>Expander1.C</code>). |

## Examples

```cpp
// Create an encoder instance in Ports A and B
encoder EncoderA = encoder(Brain.ThreeWirePort.A);
```

## Member Functions

The <code>encoder</code> class includes the following member functions:

- [<code>setPosition</code>](#setposition) — Sets the encoder's current position to a specified value.
- [<code>position</code>](#position) — Returns how far the encoder has rotated.
- [<code>velocity</code>](#velocity) — Returns the current rotational velocity of the encoder.

Before calling any <code>encoder</code> member functions, a <code>encoder</code> instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
Encoder configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create an encoder instance in Ports A and B
encoder EncoderA = encoder(Brain.ThreeWirePort.A);
```

### setPosition

```{vexcode}
id: v5_3-wire_encoder_set_position
```

Sets the encoder's current position to a specified value. This can be used to manually set the tracked position without rotating a motor or other mechanism.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void setPosition(
  double        value,
  rotationUnits units);
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameters | Type | Description |
| :----------------: | :------: | :-------------------------------------- |
| <code>value</code> | <code>double</code> | The rotational position to set. |
| <code>units</code> | <code>rotationUnits</code> | The unit that represents the position:<ul><li><code>deg</code> / <code>degrees</code> — degrees</li><li><code>turns</code> / <code>rev</code> — revolutions</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<!-- <span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Set the Encoder Sensor's value of position to 180 degrees.
EncoderA.setPosition(180, degrees);
``` -->

### position

```{vexcode}
id: v5_3-wire_encoder_position
```

Returns how far the shaft connected to the encoder has rotated.

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

| Parameters | Type | Description |
| :--------- | :-----: | :----------- |
| <code>units</code> | <code>rotationUnits</code> | The unit that represents the position:<ul><li><code>deg</code> / <code>degrees</code> — degrees</li><li><code>turns</code> / <code>rev</code> — revolutions</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the rotation in the specified units.

<!-- <span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Get the current Encoder Sensor's position.
double value = EncoderA.position(degrees);
``` -->

### velocity

```{vexcode}
id: v5_3-wire_encoder_velocity
```

Returns the rotational velocity of the encoder.

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

| Parameters | Type | Description |
| :----------------: | :-----: | :-------------------------------------- |
| <code>units</code> | <code>velocityUnits</code> | The unit used to represent the velocity:<ul><li><code>percent</code> / <code>pct</code> — percent</li><li><code>rpm</code> — rotations per minute</li><li><code>dps</code> — degrees per second</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the velocity in the specified units.

<!-- <span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Get the current Encoder Sensor's velocity in rpm.
double value = EncoderA.velocity(rpm);
``` -->

<!--
### resetRotation()
The <code>resetRotation()</code> method resets the rotation of the Encoder Sensor to 0.

**Returns:** None.

### setRotation()
The <code>setRotation(double value, rotationUnits units)</code> method sets the rotation of the Encoder Sensor.

| Parameters | Description |
| :----------------: | :-------------------------------------- |
| <code>value</code> | The rotation value to set. |
| <code>units</code> | A valid [<code>rotationUnit</code>](https://test-api.vex.com/v5/home/cpp/Enums.html#rotation-units). |

**Returns:** None.

```cpp
// Set the Encoder Sensor's value of rotation to 180 degrees.
Encoder.setRotation(180);
```

### rotation()

The <code>rotation(rotationUnits units)</code> method returns the rotation value of the Encoder Sensor.

| Parameters | Description |
| :--------- | :----------- |
| <code>units</code> | A valid [<code>rotationUnit</code>](https://test-api.vex.com/v5/home/cpp/Enums.html#rotation-units). |

**Returns:** A <code>double</code> that represents the current rotation of the Encoder.

```cpp
// Get the current encoder rotation.
double value = Encoder.rotation();
```

### changed()
The <code>changed(callback)</code> method registers a function to be called when the value of the Encoder Sensor changes.

| Parameters | Description |
| :----------------: | :-------------------------------------- |
| <code>callback</code> | A function that will be called when the Encoder Sensor's axis value changes. |

**Returns:** An instance of the Event class.

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> // Display a message when the Encoder changes.
> void encoderChanged() {
>   Brain.Screen.print("encoder changed");
> }
> ```
>
> Register the callback inside <code>int main()</code>
>```cpp
> int main() {
>   /* vexcodeInit() is only required when using VEXcode.
>   Remove vexcodeInit() if compiling in VS Code. */
>   vexcodeInit();
>
>   // Run encoderChanged when the Encoder changes.
>   EncoderA.changed(encoderChanged);
> }
> ```
-->

