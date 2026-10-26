---
title: Potentiometer | VEX V5 - C++ API
description: Reference documentation for the pot and potV2 class in VEX V5 C++. Includes constructors, functions, parameters, notes, and member functions.
---

```{highlight} cpp
:linenothreshold: 5
```

# Potentiometer

```{contents}
:local: true
```

## Introduction

The <code>pot</code> and <code>potV2</code> classes are used with Potentiometers, which are analog sensors that measure the angular position of a rotating shaft. A Potentiometer outputs a voltage proportional to its position.

Depending on the Potentiometer version, the amount of rotation it can detect varies:
- Potentiometer - Up to 250 degrees
- Potentiometer V2 - 330 degrees (Continuous)

| ![The VEX V5 Potentiometer V1.](/_static/img/sensing/potentiometer-first.png) | ![The VEX V5 Potentiometer V2.](/_static/img/sensing/potentiometer.png) |
|:---:|:---:|
| Potentiometer | Potentiometer V2 |

## Potentiometer

### Class Constructors

```cpp
pot(
  triport::port &port );
```

### Class Destructor

Destroys the <code>pot</code> object and releases associated resources.

```cpp
~pot();
```

### Parameters

|     Parameter     |             Type             | Description                                                                                            |
| :---------------: | :--------------------------: | ----------------------------------------------------------------------------------------------------------------------- |
| <code>port</code> | <code>triport::port &</code> | The 3-Wire Port the Potentiometer is connected to, written as <code>Brain.ThreeWirePort.X</code> or <code>ExpanderName.X</code>, where <code>X</code> is the port letter (for example, <code>Brain.ThreeWirePort.A</code> or <code>Expander1.A</code>). |


### Example

```cpp
// Create a pot instance in Port A
pot PotentiometerA = pot(Brain.ThreeWirePort.A);
```

## Potentiometer V2

### Class Constructors

```cpp
potV2(
  triport::port &port );
```

### Class Destructor

Destroys the <code>potV2</code> object and releases associated resources.

```cpp
~potV2();
```

### Parameters

|     Parameter     |             Type             | Description                                                             |
| :---------------: | :--------------------------: | ---------------------------------- |
| <code>port</code> | <code>triport::port &</code> | The 3-Wire Port the Potentiometer V2 is connected to, written as <code>Brain.ThreeWirePort.X</code> or <code>ExpanderName.X</code>, where <code>X</code> is the port letter (for example, <code>Brain.ThreeWirePort.A</code> or <code>Expander1.A</code>). |

### Examples

```cpp
// Create a Potentiometer V2 on 3-Wire Port A
potV2 PotentiometerV2A = potV2(Brain.ThreeWirePort.A);
```

## Member Functions

The <code>pot</code> and <code>potV2</code> classes include the following member functions:

- [<code>angle</code>](#angle) — Returns the angular position of the Potentiometer in degrees or as a percent.

Before calling any <code>pot</code> or <code>potV2</code> member functions, a <code>pot</code> or <code>potV2</code> instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
Potentiometer configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create a potV2 instance in Port A
potV2 PotentiometerV2A = potV2(Brain.ThreeWirePort.A);
```

### angle

```{vexcode}
id: v5_3-wire_potentiometer_angle
```

Returns the angular position of the Potentiometer.

> **__1__ —** This function represents the angle as a percent.
> ```cpp
> int32_t angle (
>   percentUnits units = percentUnits::pct );
> ```

> **__2__ —** This function represents the angle as the chosen rotation units.
> ```cpp
> double angle(
>   rotationUnits units );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>units</code> | <code>percentUnits</code> | The unit that represents the position as a percentage of full rotation: <code>percent</code> / <code>pct</code> (default) — percent, from 0 to 100%. |
| <code>units</code> | <code>rotationUnits</code> | The unit that represents the angle:<ul><li><code>deg</code> / <code>degrees</code> — degrees, from 0 to 250 for a Potentiometer or 0 to 330 for a Potentiometer V2</li><li><code>turns</code> / <code>rev</code> — revolutions</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns:
- An <code>int32_t</code> when using <code>percentUnits</code>.
- A <code>double</code> when using <code>rotationUnits</code>.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Get the current angle of the Potentiometer V2 in the
// range 0 to 330 degrees.
double angle = PotentiometerV2A.angle(degrees);

// Print the current angle of the Potentiometer to the
// brain screen.
Brain.Screen.print(angle);
```
<!--
### changed()
The <code>changed(callback)</code> method registers a callback function for when the value measured by the Potentiometer changes.


| Parameters | Description |
| :----------------: | :-------------------------------------- |
| <code>callback</code> | The callback function to be called when the value measured by the Potentiometer changes. |

**Returns:** None.


> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> // Display a message when the Potentiometer changes.
> void potentiometerChanged() {
>   Brain.Screen.print("Potentiometer changed");
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
>   // Run potentiometerChanged when the Potentiometer changes.
>   PotentiometerV2A.changed(potentiometerChanged);
> }
> ```
-->
