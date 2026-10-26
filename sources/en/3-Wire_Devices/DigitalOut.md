---
title: Digital Out | VEX V5 - C++ API
description: Reference documentation for the digital_out class in VEX V5 C++. Includes constructors, functions, parameters, notes, and usage examples.
---

```{highlight} cpp
:linenothreshold: 5
```

# Digital Out

```{contents}
:local: true
```

## Introduction

The <code>digital_out</code> class allows the V5 Brain to send a digital signal to an external component such as an LED, relay, or other electronic device. It can send a high signal (5 volts) or a low signal (0 volts).

## Class Constructors

```cpp
digital_out(
  triport::port &port );
```

## Class Destructor

Destroys the <code>digital_out</code> object and releases associated resources.

```cpp
~digital_out();
```

## Parameters

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>port</code> | <code>triport::port &</code> | The 3-Wire Port that the Digital Output device is connected to, written as <code>Brain.ThreeWirePort.X</code> or <code>ExpanderName.X</code>, where <code>X</code> is the port letter (for example, <code>Brain.ThreeWirePort.A</code> or <code>Expander1.A</code>). |

## Example

```cpp
// Create the digital_out instance on 3-Wire Port A
digital_out DigitalOutA = digital_out(Brain.ThreeWirePort.A);
```

## Member Functions

The <code>digital_out</code> class includes the following member functions:

- [<code>set</code>](#set) — Sets the signal level of a 3-Wire Digital Out port to high or low.

Before calling any <code>digital_out</code> member functions, a <code>digital_out</code> instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
Digital output configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create the digital_out instance on 3-Wire Port A
digital_out DigitalOutA = digital_out(Brain.ThreeWirePort.A);
```

### set

```{vexcode}
id: v5_3-wire_digital_out_set
```

Sets the signal level of the selected 3-Wire Port.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void set(
  bool value );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>value</code> | <code>bool</code> | Whether to send a high or low signal: <code>true</code> sends a high signal (5V), and <code>false</code> sends a low signal (0V). |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Set the Digital Output to true
DigitalOutA.set(true);

// Set the Digital Output to false
DigitalOutA.set(false);
```
