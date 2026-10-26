---
title: Light Sensor | VEX V5 - C++ API
description: Reference documentation for the light class in VEX V5 C++. Includes constructors, functions, parameters, notes, and member functions.
---

```{highlight} cpp
:linenothreshold: 5
```

# Light Sensor

```{contents}
:local: true
```

## Introduction

The <code>light</code> class is used with the Light Sensor, which measures the brightness of light reflected from or shining on an object. It outputs an analog value that represents how much light is detected.

![The VEX V5 Light Sensor.](/_static/img/sensing/light-sensor.png)

## Class Constructor

```cpp
light(
  triport::port &port );
```

## Class Destructor

Destroys the <code>light</code> object and releases associated resources.

```cpp
virtual ~light();
```

## Parameters

| Parameter | Type | Description |
|:---------:| :------: | :------------|
| <code>port</code> | <code>triport::port &</code> | The 3-Wire Port that the Light Sensor is connected to, written as <code>Brain.ThreeWirePort.X</code> or <code>ExpanderName.X</code>, where <code>X</code> is the port letter (for example, <code>Brain.ThreeWirePort.A</code> or <code>Expander1.A</code>).  |

## Examples

```cpp
// Create a light instance in Port A
light LightA = light(Brain.ThreeWirePort.A);
```

## Member Functions

The <code>light</code> class includes the following member functions:

- [<code>brightness</code>](#brightness) — Returns the amount of light detected by the Light Sensor.

Before calling any <code>light</code> member functions, a <code>light</code> instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
Light Sensor configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create a light instance in Port A
light LightA = light(Brain.ThreeWirePort.A);
```

### brightness

```{vexcode}
id: v5_3-wire_light_brightness
```

Returns the amount of light detected by the Light Sensor. This can be used to check if an object is bright enough to accurately report other visual data.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
int32_t brightness(
  percentUnits units = percentUnits::pct );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :----------------: | :-----: | :-------------------------------------- |
| <code>units</code> | <code>percentUnits</code> | The unit that represents the brightness: <code>percent</code> / <code>pct</code> (default) — percent |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns an <code>int32_t</code> representing the brightness measured by the Light Sensor as a percent in the range 0 - 100%.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Get Light Sensor brightness in range of 0% - 100%.
int32_t value = LightA.brightness();

// Print the brightness of the Light Sensor to the
// Brain's screen.
Brain.Screen.print(value);
```

<!--
### changed()
The <code>changed(callback)</code> method registers a callback function for when the value of the Light Sensor changes.


| Parameters | Description |
| :----------------: | :-------------------------------------- |
| <code>callback</code> | The callback function to be called when the value of the Light Sensor changes. |

**Returns:** None.

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> // Display a message when the Light Sensor changes.
> void lightChanged() {
>   Brain.Screen.print("Light Sensor value changed");
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
>   // Run lightChanged when the Light Sensor changes.
>   LightA.changed(lightChanged);
> }
> ```
-->
