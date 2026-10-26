---
title: brain | VEX V5 - C++ API
description: Reference documentation for the brain class in VEX V5 C++. Includes constructors, functions, parameters, notes, and usage examples.
---

# Brain

## Introduction

In VEX V5 C++, the Brain is represented by the <code>brain</code> class. You create (or use the default project-provided) Brain object and then access Brain features through its member objects.

## Derived Classes

The <code>brain</code> class serves as a base class for the following derived classes:

- [<code>Screen</code>](Screen.md) - This class provides access to the Brain's built-in color touchscreen, allowing programs to display text, graphics, and receive touch input.
- [<code>Timer</code>](timer.md) - This class provides high-resolution timing utilities for measuring elapsed time and controlling time-based behavior in programs.
- [<code>Battery</code>](Battery.md) - This class allows programs to monitor the Brain's battery status, including voltage, current, capacity, and temperature.
- <code>ThreeWirePort</code> (<code>triport</code> / 3-Wire Port) - This class provides access to the Brain's 3-Wire ports for connecting and controlling legacy sensors and devices such as limit switches, potentiometers, and LEDs.
- [<code>SDcard</code>](SDcard.md) - This class enables reading from and writing to the Brain's SD card for file storage, data logging, and loading external resources.

## Class Constructors

```cpp
brain();
```

<!-- ### Destructor

Destroys the <code>brain</code> object and releases associated resources.

```cpp
~brain();
``` -->

## Parameters

The <code>brain</code> constructor uses no parameters.

## Notes

- Only one <code>brain</code> object should be created in a project.

## Example

```cpp
// Create the V5 Brain
brain Brain = brain();
```

## Member Functions

The <code>brain</code> class includes the following member functions:

- [<code>programStop</code>](#programstop) - Stops the currently running project on the V5 Brain.
- [<code>timer</code>](#timer) - Returns the current value of the Brain's internal timer in the specified units.
- [<code>resetTimer</code>](#resettimer) - Resets the Brain's internal timer to zero and restarts timing.
- [<code>setTimer</code>](#settimer) - Sets the Brain's internal timer to a specified value and time unit.

Before calling any <code>brain</code> member functions, a <code>brain</code> instance must be created, as shown below:

```cpp
// Create the V5 Brain
brain Brain = brain();
```

### programStop

```{vexcode}
id: v5_control_stop_project
```

Stops the currently running project on the V5 Brain.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void programStop();
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
// Stop the project when the Brain screen is pressed
while (true) {
  if (Brain.Screen.pressing()) {
    Brain.programStop();
  }
  wait(20, msec);
}
```

### timer

Returns the current value of the Brain's internal timer in the specified units.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double timer(
  timeUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|------|-----------|-------------|
| <code>units</code> | <code>timeUnits</code> | The unit of time to return:<ul><li><code>seconds</code> / <code>sec</code> - seconds</li><li><code>msec</code> - milliseconds</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the elapsed time since the program started, in the specified units.

<span style="font-size: 1.5rem; ">
  Examples
</span>

- The timer starts automatically when the project begins.
- The timer can be reset with the use of [<code>resetTimer</code>](#resettimer)
.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Stop the project after 3 seconds
while (Brain.timer(seconds) < 3) {
  wait(20, msec);
}

Brain.programStop();
```

### resetTimer

Resets the Brain's internal timer to zero, Afterwards, the timer immediately begins counting up again from zero.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>


```cpp
void resetTimer();
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
  Notes
</span>

- The timer begins counting again immediately after it is reset.
- Calling <code>resetTimer</code> affects the value returned by subsequent calls to [<code>timer</code>](#timer).

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Reset the timer and measure elapsed time
Brain.resetTimer();

while (Brain.timer(sec) < 5) {
  wait(20, msec);
}

// 5 seconds have elapsed since reset
Brain.Screen.print("5 seconds passed");
```

### setTimer

Sets the Brain's internal timer to a specified value and time unit.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void setTimer(
  double value,
  timeUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|------|-----------|-------------|
| <code>value</code> | <code>double</code> | The time to set the timer to, based on the <code>timeUnits</code> provided in the <code>units</code> parameter. |
| <code>units</code> | <code>timeUnits</code> | The unit used to interpret the <code>value</code> parameter:<ul><li><code>seconds</code> / <code>sec</code> - seconds</li><li><code>msec</code> - milliseconds</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The timer continues counting forward after being set.
- Calling <code>setTimer</code> immediately changes the value returned by [<code>timer</code>](#timer).

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Set the timer to start at 10 seconds
Brain.setTimer(10, sec);

// Wait until the timer is at 3 seconds
while (Brain.timer(sec) < 3) {
  wait(20, msec);
}

// 5 seconds have elapsed since setTimer was called
Brain.Screen.print("5 seconds passed");
```


```{toctree}
:caption: brain Derived Classes
:titlesonly: true
:hidden:

./Screen
./timer
./Battery
./SDcard
```
