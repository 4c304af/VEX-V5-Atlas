---
title: Line Tracker | VEX V5 - C++ API
description: Reference documentation for the line class in VEX V5 C++. Includes constructors, functions, parameters, notes, and member functions.
---

```{highlight} cpp
:linenothreshold: 5
```

# Line Tracker

```{contents}
:local: true
```

## Introduction

The <code>line</code> class is used with the Line Tracker, an analog sensor that uses an infrared LED and light sensor to detect the reflectivity of the surface in front of it. It is designed to be mounted under the chassis of a robot so that the robot can follow a pre-marked path.

![The VEX Line Tracker.](/_static/img/sensing/line-tracker.png)

## Class Constructor

```cpp
line(
  triport::port &port );
```

## Class Destructor

Destroys the <code>line</code> object and releases associated resources.

```cpp
virtual ~line();
```

## Parameters

| Parameter | Type | Description |
|:---------:| :------: | :------------|
| <code>port</code> | <code>triport::port &</code> | The 3-Wire Port that the Line Tracker is connected to, written as <code>Brain.ThreeWirePort.X</code> or <code>ExpanderName.X</code>, where <code>X</code> is the port letter (for example, <code>Brain.ThreeWirePort.A</code> or <code>Expander1.A</code>).  |

## Examples

```cpp
// Create a line instance in Port A
line LineTrackerA = line(Brain.ThreeWirePort.A);
```

## Member Functions

The <code>line</code> class includes the following member functions:

- [<code>reflectivity</code>](#reflectivity) — Returns an <code>int32_t</code> that represents the amount of light reflected from the surface as a percent.

Before calling any <code>line</code> member functions, a <code>line</code> instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
Line Tracker configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create a line instance in Port A
line LineTrackerA = line(Brain.ThreeWirePort.A);
```

### reflectivity

```{vexcode}
id: v5_3-wire_line_tracker_reflectivity
```

Returns an <code>int32_t</code> that represents the amount of light reflected from the surface as a percent. This can be used to help a robot follow a pre-marked path.

**Note:**
- 0% reflectivity means the object is very dark.
- 100% reflectivity means the object is very bright.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
int32_t reflectivity(
  percentUnits units = percentUnits::pct );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :----------------: | :-----: | :-------------------------------------- |
| <code>units</code> | <code>percentUnits</code> | The unit that represents the reflectivity: <code>percent</code> / <code>pct</code> (default) — percent |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns an <code>int32_t</code> representing the reflectivity measured by the Line Tracker as a percent in the range 0 - 100%.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Display the detected reflectivity
int32_t value = LineTrackerA.reflectivity();
Brain.Screen.print(value);
```
<!--
### changed()
The <code>changed(callback)</code> command registers a callback function for when the value of the Line Tracker changes.

| Parameters | Description |
| :----------------: | :-------------------------------------- |
| <code>callback</code> | The callback function to be called when the value of the Line Tracker changes. |

**Returns:** None.

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> // Display a message when the Line Tracker changes.
> void lineChanged() {
>   Brain.Screen.print("Line Tracker value changed");
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
>   // Run lineChanged when the Line Tracker changes.
>   LineTrackerA.changed(lineChanged);
> }
> ```
-->
