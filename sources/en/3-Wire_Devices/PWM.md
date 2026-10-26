---
title: PWM Out | VEX V5 - C++ API
description: Reference documentation for the pwm_out class in VEX V5 C++. Includes constructors, functions, parameters, notes, and usage examples.
---


```{highlight} cpp
:linenothreshold: 5
```

# PWM Out

```{contents}
:local: true
```

## Introduction

The <code>pwm_out</code> class is used to control PWM (Pulse Width Modulation) output on a VEX V5 3-Wire port. It allows devices to send variable-width pulse signals to compatible 3-Wire components.

## Class Constructors

```cpp
pwm_out(
  triport::port &port );
```

## Class Destructor

Destroys the <code>pwm_out</code> object and releases associated resources.

```cpp
~pwm_out();
```

## Parameters

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>port</code> | <code>triport::port &</code> | The 3-Wire Port the PWM output is connected to, written as <code>Brain.ThreeWirePort.X</code> or <code>ExpanderName.X</code>, where <code>X</code> is the port letter (for example, <code>Brain.ThreeWirePort.A</code> or <code>Expander1.A</code>). |

## Example

```cpp
// Create the pwm_out instance on 3-Wire Port A
pwm_out pwm = pwm_out(Brain.ThreeWirePort.A);
```

## Member Functions

The <code>pwm_out</code> class includes the following member functions:

- [<code>state</code>](#state) — Sets the state of the PWM output.

Before calling any <code>pwm_out</code> member functions, a <code>pwm_out</code> instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
PWM configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create the pwm_out instance on 3-Wire Port A
pwm_out pwm = pwm_out(Brain.ThreeWirePort.A);
```

### state

Sets the state of the PWM output to a specified value.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void state(
  int32_t      value,
  percentUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>value</code> | <code>int32_t</code> | The new value to set for PWM output, from -100 to +100 percent. |
| <code>units</code> | <code>percentUnits</code> | The unit used to represent the PWM value: <code>percent</code> / <code>pct</code> — percent |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The PWM output value ranges from -100 to +100 percent.
- The only valid unit for PWM output is <code>percent</code>.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Set the PWM Output to 50%
pwm.state(50, percent);

// Set the PWM Output to -75%
pwm.state(-75, percent);
```
