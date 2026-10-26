---
title: Analog In | VEX V5 - C++ API
description: Reference documentation for the analog_in class in VEX V5 C++. Includes constructors, functions, parameters, notes, and usage examples.
---

```{highlight} cpp
:linenothreshold: 5
```

# Analog In

```{contents}
:local: true
```

## Introduction

The <code>analog_in</code> class is used to read analog input signals from devices connected to a VEX V5 3-Wire port. It provides access to the current analog value and allows callback functions to be registered for value changes.

## Class Constructors

```cpp
analog_in(
    triport::port &port );
```

## Class Destructor

Destroys the <code>analog_in</code> object and releases associated resources.

```cpp
~analog_in();
```

## Parameters

| Parameter | Type | Description |
|:--:|:--:|--|
|   <code>port</code>  | <code>triport::port&</code> | The 3-Wire Port that the Analog Input is connected to, written as <code>Brain.ThreeWirePort.X</code> or <code>ExpanderName.X</code>, where <code>X</code> is the port letter (for example, <code>Brain.ThreeWirePort.A</code> or <code>Expander1.A</code>). |

## Example

```cpp
// Create the analog_in instance on 3-Wire Port A
analog_in AnalogInA = analog_in(Brain.ThreeWirePort.A);
```

## Member Functions

The <code>analog_in</code> class includes the following member functions:

- [<code>value</code>](#value) — Returns the value of the Analog Input device.
- [<code>changed</code>](#changed) — Registers a callback function for when the analog input value changes.

Before calling any <code>analog_in</code> member functions, an <code>analog_in</code> instance must be created, as shown below:

```cpp
/* This constructor is required to use an
Analog Input device. Replace the values
as needed. */

// Create the analog_in instance on 3-Wire Port A
analog_in AnalogInA = analog_in(Brain.ThreeWirePort.A);
```

### value

Returns the current value of the analog input.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
int32_t value(
  analogUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>units</code> | <code>analogUnits</code> | The unit to represent the value:<ul><li><code>range8bit</code> — 8-bit analog value (a value with 256 possible states)</li><li><code>range10bit</code> — 10-bit analog value (a value with 1024 possible states)</li><li><code>range12bit</code> — 12-bit analog value (a value with 4096 possible states)</li><li><code>pct</code> — percentage</li><li><code>mV</code> — millivolts</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function returns the current value of the analog input.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Get the current value of the Analog Input
int32_t value = AnalogInA.value();
```

### changed

Registers a callback function to be called when the value of the analog input changes.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void changed( void (* callback)(void) );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>callback</code> | <code>void (* callback)(void)</code> | A function that will be called when the value of the analog input changes. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> // Display a message when the input changes
> void AnalogInputChanged() {
>   Brain.Screen.print("analog input changed");
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
>   // Run AnalogInputChanged when the value of the
>   // Analog Input changes
>   AnalogInA.changed(AnalogInputChanged);
> }
> ```
