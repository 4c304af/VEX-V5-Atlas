---
title: Accelerometer | VEX V5 - C++ API
description: Reference documentation for the accelerometer class in VEX V5 C++. Includes constructors, functions, parameters, notes, and member functions.
---

```{highlight} cpp
:linenothreshold: 5
```

# Accelerometer

```{contents}
:local: true
```

## Introduction

The <code>accelerometer</code> class measures the acceleration of the robot along one or more axes. The sensor outputs an analog voltage that changes based on acceleration in G-forces (G).

A jumper on the Accelerometer determines its sensitivity range:
- **2G** - Measures acceleration from -2G to +2G
- **6G** - Measures acceleration from -6G to +6G

![The VEX V5 Analog accelerometer.](/_static/img/sensing/accelerometer.png)

## Class Constructor

```cpp
accelerometer(
  triport::port &port,
  bool           bHighSensitivity = false);
```

## Class Destructor

Destroys the <code>accelerometer</code> object and releases associated resources.

```cpp
virtual ~accelerometer();
```

## Parameters

| Parameter | Type | Description |
|:---------:| :------: | :------------|
| <code>port</code> | <code>triport::port &</code> | The 3-Wire Port the Accelerometer is connected to, written as <code>Brain.ThreeWirePort.X</code> or <code>ExpanderName.X</code>, where <code>X</code> is the port letter (for example, <code>Brain.ThreeWirePort.A</code> or <code>Expander1.A</code>). |
| <code>bHighSensitivity</code> | <code>bool</code> | Optional. Whether to enable high sensitivity mode on the Accelerometer:<ul><li><code>true</code> - Enables high sensitivity (+/- 2G).</li><li><code>false</code> (default) - Enables low sensitivity (+/- 6G).</li></ul> |

## Examples

```cpp
// Create a 6G accelerometer instance in Port A
accelerometer Accel6GA = accelerometer(Brain.ThreeWirePort.A);
```

```cpp
// Create a 2G accelerometer instance in Port A
accelerometer Accel2GA = accelerometer(Brain.ThreeWirePort.A, true);
```

## Member Functions

The <code>accelerometer</code> class includes the following member functions:

- [<code>acceleration</code>](#acceleration) — Returns the acceleration measured by the Accelerometer in Gs.

Before calling any <code>accelerometer</code> member functions, an <code>accelerometer</code> instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
Accelerometer configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create a 2G accelerometer instance in Port A
accelerometer Accel2GA = accelerometer(Brain.ThreeWirePort.A, true);
```

### acceleration

```{vexcode}
id: v5_3-wire_accelerometer_acceleration
```

Returns the acceleration measured in Gs.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double acceleration();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the acceleration measured in Gs.

```cpp
// Drive the robot forward.
Drivetrain.drive(forward);

// Get the acceleration measured by the Accelerometer.
double accelerationValue = Accel2GA.acceleration();
```

<!--
### changed()
The <code>changed(callback)</code> method registers a function to be called when the value of the Accelerometer changes.

| Parameters | Description |
| :----------------: | :-------------------------------------- |
| <code>callback</code> | A function that will be called when the Accelerometer's axis value changes. |

**Returns:** An instance of the Event class.

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> // Display a message when the Accelerometer changes.
> void accelerometerChanged() {
>   Brain.Screen.print("accelerometer changed");
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
>   // Run accelerometerChanged when the Accelerometer changes.
>   Accel2GA.changed(accelerometerChanged);
> }
> ```
-->
