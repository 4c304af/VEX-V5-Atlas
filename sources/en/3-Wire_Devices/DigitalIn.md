---
title: Digital In | VEX V5 - C++ API
description: Reference documentation for the digital_in class in VEX V5 C++. Includes constructors, functions, parameters, notes, and usage examples.
---

```{highlight} cpp
:linenothreshold: 5
```

# Digital In

```{contents}
:local: true
```

## Introduction

The <code>digital_in</code> class allows the V5 Brain to read a digital signal from an external source, such as a switch or sensor. It detects whether the input line is high, receiving 5 volts, or low, receiving 0 volts. This can be used to determine on/off states or trigger events in a project.

## Class Constructors

```cpp
digital_in(
  triport::port &port );
```

## Class Destructor

Destroys the <code>digital_in</code> object and releases associated resources.

```cpp
~digital_in();
```

## Parameters

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>port</code> | <code>triport::port &</code> | The 3-Wire Port that the Digital Input device is connected to, written as <code>Brain.ThreeWirePort.X</code> or <code>ExpanderName.X</code>, where <code>X</code> is the port letter (for example, <code>Brain.ThreeWirePort.A</code> or <code>Expander1.A</code>). |

## Example

```cpp
// Create the digital_in instance on 3-Wire Port A
digital_in digin = digital_in(Brain.ThreeWirePort.A);
```

## Member Functions

The <code>digital_in</code> class includes the following member functions:

- [<code>value</code>](#value) — Returns whether the Digital In port is receiving a high or low signal.
- [<code>high</code>](#high) — Registers a function to be called whenever the Digital In device sends a high signal.
- [<code>low</code>](#low) — Registers a function to be called whenever the Digital In device sends a low signal.

Before calling any <code>digital_in</code> member functions, a <code>digital_in</code> instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
Digital input configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create the digital_in instance on 3-Wire Port A
digital_in DigitalInA = digital_in(Brain.ThreeWirePort.A);
```

### value

```{vexcode}
id: v5_3-wire_digital_in_value
```

Returns whether the Digital In port is receiving a high or low signal.

<span style="font-size: 1.5rem;"> Available Functions </span>

```cpp
int32_t value();
```

<span style="font-size: 1.5rem;"> Parameters </span>

This function does not accept any parameters.

<span style="font-size: 1.5rem;"> Return Values </span>

Returns an <code>int32_t</code> representing the current digital signal state:
- <code>1</code> – The Digital In port is receiving a high signal (approximately 5V).
- <code>0</code> – The Digital In port is receiving a low signal (approximately 0V).

### high

Registers a function to be called whenever the Digital In device sends a high signal (approximately 5V).

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void high(
  void (* callback)(void) );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>callback</code> | <code>void (* callback)(void)</code> | A function that will be called when the input is high. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> // Display that the input is high
> void inputHigh() {
>   Brain.Screen.print("digital input high");
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
>   // Run inputHigh when the Digital Input is high
>   DigitalInA.high(inputHigh);
> }
> ```

### low

Registers a function to be called whenever the Digital In device sends a low signal (approximately 0V).

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void low(
  void (* callback)(void) );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>callback</code> | <code>void (* callback)(void)</code> | A function that will be called when the input is low. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> // Display that the input is low
> void inputLow() {
>   Brain.Screen.print("digital input low");
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
>   // Run inputLow when the Digital Input is low
>   DigitalInA.low(inputLow);
> }
> ```
