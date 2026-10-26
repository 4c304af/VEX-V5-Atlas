---
title: LED Indicator | VEX V5 - C++ API
description: Reference documentation for the led class in VEX V5 C++. Includes constructors, functions, parameters, notes, and member functions.
---

```{highlight} cpp
:linenothreshold: 5
```

# LED Indicator

```{contents}
:local: true
```

## Introduction

The <code>led</code> class allows the V5 Brain to turn a connected light-emitting diode (LED) on or off using a 3-Wire Port.

![The green VEX V5 LED indicator.](/_static/img/sensing/led.png)

## Class Constructor

```cpp
led(
  triport::port &port );
```

## Class Destructor

Destroys the <code>led</code> object and releases associated resources.

```cpp
virtual ~led();
```

## Parameters

| Parameter | Type | Description |
|:---------:| :------: | :------------|
| <code>port</code> | <code>triport::port &</code> | The 3-Wire Port that the LED Indicator is connected to, written as <code>Brain.ThreeWirePort.X</code> or <code>ExpanderName.X</code>, where <code>X</code> is the port letter (for example, <code>Brain.ThreeWirePort.A</code> or <code>Expander1.A</code>).  |

## Examples

```cpp
// Create an led instance in Port A
led LEDA = led(Brain.ThreeWirePort.A);
```

## Member Functions

The <code>led</code> class includes the following member functions:

- [<code>on</code>](#on) — Turns the specified LED Indicator on.
- [<code>off</code>](#off) — Turns the specified LED Indicator off.

Before calling any <code>led</code> member functions, a <code>led</code> instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
LED Indicator configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create an led instance in Port A
led LEDA = led(Brain.ThreeWirePort.A);
```

### on

```{vexcode}
id: v5_3-wire_led_on
```

Turns the specified LED Indicator on.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void on();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Turn on the LED
LEDA.on();

// Wait 2 seconds
wait(2, seconds);

// Turn off LED
LEDA.off();
```

### off

```{vexcode}
id: v5_3-wire_led_off
```

Turns the specified LED Indicator off.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void off();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Turn on the LED
LEDA.on();

// Wait 2 seconds
wait(2, seconds);

// Turn off LED
LEDA.off();
```
