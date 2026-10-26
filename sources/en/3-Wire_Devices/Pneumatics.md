---
title: Pneumatics | VEX V5 - C++ API
description: Reference documentation for the pneumatics class in VEX V5 C++. Includes constructors, functions, parameters, notes, and usage examples.
---

```{highlight} cpp
:linenothreshold: 5
```

# Pneumatics

```{contents}
:local: true
```

## Introduction

The VEX V5 Brain can control a **V5 Pneumatics system** using the <code>pneumatics</code> class. This class allows the Brain to open or close the system, extending or retracting pneumatic cylinders.

The Pneumatics device must be manually constructed in code and cannot be added using the Device Menu in VEXcode V5.

## Class Constructors

```cpp
pneumatics( 
  triport::port &port );
```

## Class Destructor

Destroys the <code>pneumatics</code> object and releases associated resources.

```cpp
~pneumatics();
```

## Parameters

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>&port</code> | <code>triport::port</code> | The 3-Wire Port the Pneumatic Solenoid is connected to, written as <code>Brain.ThreeWirePort.X</code> or <code>ExpanderName.X</code>, where <code>X</code> is the port letter (for example, <code>Brain.ThreeWirePort.A</code> or <code>Expander1.A</code>). |

## Notes

- This class can only be constructed manually in code, as it cannot be constructed using the Device Menu in VEXcode V5.
- A Brain or 3-Wire Expander must be created first before they can be used to create an object with the <code>pneumatics</code> class constructor.

## Example

```cpp
// Create the pneumatics instance on 3-Wire Port A
pneumatics PneumaticsA = pneumatics(Brain.ThreeWirePort.A);
```

## Member Functions

The <code>pneumatics</code> class includes the following member functions:

- [<code>open</code>](#open) — Sets the Pneumatic Solenoid to the open state, allowing air to flow into the cylinder.
- [<code>close</code>](#close) — Sets the Pneumatic Solenoid to the close state, stopping air from flowing into the cylinder.

Before calling any <code>pneumatics</code> member functions, a <code>pneumatics</code> instance must be created, as shown below:

```cpp
/* This constructor is required to use a
V5 Pneumatics Solenoid when not configured as
a Digital Out device. Replace the values
as needed. */

// Create the pneumatics instance on 3-Wire Port A
pneumatics PneumaticsA = pneumatics(Brain.ThreeWirePort.A);
```

### open

Sets the Pneumatic Solenoid to the open state, allowing air to flow into the cylinder.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void open();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not take any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Open the solenoid to extend the cylinder
PneumaticsA.open();
```

### close

Sets the Pneumatic Solenoid to the close state, stopping air from flowing into the cylinder.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void close();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not take any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Close the solenoid to retract the cylinder
PneumaticsA.close();
```
