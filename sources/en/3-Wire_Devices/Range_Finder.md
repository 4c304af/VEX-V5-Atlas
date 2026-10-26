---
title: Range Finder | VEX V5 - C++ API
description: Reference documentation for the sonar class in VEX V5 C++. Includes constructors, functions, parameters, notes, and member functions.
---

```{highlight} cpp
:linenothreshold: 5
```

# Range Finder

```{contents}
:local: true
```

## Introduction

The <code>sonar</code> class is used with the Ultrasonic Range Finder, which measures the distance to the nearest object using sound waves. It works by sending out an ultrasonic pulse and measuring how long it takes for the sound to bounce back.

![The VEX V5 Range Finder.](/_static/img/sensing/range_finder.png)

## Class Constructor

```cpp
sonar(
  triport::port &port);
```

## Class Destructor

Destroys the <code>sonar</code> object and releases associated resources.

```cpp
virtual ~sonar();
```

## Parameters

| Parameter | Type | Description |
|:---------:| :------: | :------------|
| <code>port</code> | <code>triport::port &</code> | The first 3-Wire Port of a required two-port group used by the Range Finder. The Range Finder occupies two adjacent ports (A–B, C–D, E–F, or G–H) on either the Brain or a 3-Wire Expander. Specify the first port in the pair (A, C, E, or G), written as <code>Brain.ThreeWirePort.X</code> or <code>ExpanderName.X</code> where <code>X</code> is the port letter (for example, <code>Brain.ThreeWirePort.A</code> or <code>Expander1.C</code>).  |

## Examples

```cpp
// Create a sonar instance in Ports A and B
sonar RangeFinderA = sonar(Brain.ThreeWirePort.A);
```

## Member Functions

The <code>sonar</code> class includes the following member functions:

- [<code>foundObject</code>](#foundobject) — Returns whether the Range Finder detects an object.
- [<code>distance</code>](#distance) — Returns the distance between the Range Finder and the nearest detected object.

Before calling any <code>sonar</code> member functions, a <code>sonar</code> instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
Range Finder configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create a sonar instance in Ports A and B
sonar RangeFinderA = sonar(Brain.ThreeWirePort.A);
```

### foundObject

```{vexcode}
id: v5_3-wire_range_finder_found_object
```

Returns whether the Range Finder detects an object within its field of view.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
bool foundObject();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>bool</code> representing whether the Range Finder detects an object:
- <code>true</code> — The Range Finder is detecting an object.
- <code>false</code> — The Range Finder is not detecting an object.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Check if an object is detected.
if (RangeFinderA.foundObject()){
    // Print to screen on the brain that an object was found.
    Brain.Screen.print("object found");
}
```

### distance

```{vexcode}
id: v5_3-wire_range_finder_distance
```

Returns the measured distance to the nearest object detected by the sensor.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double distance(
  distanceUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :----------------: | :-----: | -------------------------------------- |
| <code>units</code> | <code>distanceUnits</code> | The unit that represents the distance: <code>inches</code>  or <code>mm</code> — millimeters. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the distance in the specified units.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Get the Range Finder distance in millimeters.
double value = RangeFinderA.distance(mm);

// Print the current distance detected by the Range Finder to the
// Brain's screen.
Brain.Screen.print(value);
```
<!--
### setMaximum()
The <code>setMaximum(distance, units)</code> method sets the maximum distance the <code>foundObject()</code> method will return <code>true</code> for.

| Parameters | Description |
| :--------- | :----------- |
| <code>distance</code> | A <code>double</code> representing the maximum distance the Range Finder will find objects at. |
| <code>units</code> | A valid [<code>distanceUnit</code>](https://test-api.vex.com/v5/home/cpp/Enums.html#distance-units). |

**Returns:** None.


### changed()

The <code>changed(callback)</code> method runs a callback function when the Range Finder's value changes.

| Parameters | Description |
| :--------- | :----------- |
| <code>callback</code> | A callback function to run when the value of the Range Finder changes. |

**Returns:** None.

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> // Display a message when the Range Finder changes.
> void sonarChanged() {
>   Brain.Screen.print("Range Finder value changed");
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
>   // Run sonarChanged when the Range Finder changes.
>   RangeFinderA.changed(sonarChanged);
> }
> ```
-->
