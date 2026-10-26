---
title: Custom Timer | VEX V5 - C++ API
description: Explore the C++ API reference for the timer with VEX V5. Find detailed descriptions for methods, parameters, and usage examples to code a custom timer.
---

```{highlight} cpp
:linenothreshold: 5
```

# Custom Timer

```{contents}
:local: true
```

## Introduction

The <code>timer</code> class is used to keep time and interact with a timer independent of the [Brain's timer](../Brain/timer.md).

## Class Constructor

```cpp
timer();
```

## Class Destructor

Destroys the <code>timer</code> object and releases associated resources.

```cpp
~timer();
```

## Parameters

This constructor does not accept any parameters.

## Examples

```cpp
// Create a timer instance
timer myTimer = timer();
```

## Member Functions

The <code>timer</code> class includes the following member functions:

- [<code>clear</code>](#clear) — Resets the timer to zero.
- [<code>time</code>](#time) — Returns the elapsed time since the timer started.
- [<code>event</code>](#event) — Calls a function after a specified number of milliseconds, with optional arguments.

Before calling any <code>timer</code> member functions, a <code>timer</code> instance must be created, as shown below:

```cpp
/* This constructor is required to use a 
custom timer. Replace the values
as needed. */

// Create a timer instance
timer myTimer = timer();
```

### clear

Sets the timer to zero.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void clear();
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
while (true) {
  // Clear the timer every time the screen is pressed
  if (Brain.Screen.pressing()) {
    myTimer.clear();
  }
  Brain.Screen.clearScreen();
  Brain.Screen.setCursor(1, 1);
  Brain.Screen.print("Time: %.2f", myTimer.time(msec));
  wait(50, msec);
}
```

### time

Returns the current value of the timer.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Returns the elapsed time in milliseconds.
> ```cpp
> uint32_t time() const;
> ```

> **__2__ —** Returns the elapsed time in the specified time units.
> ```cpp
> double time(
>     timeUnits units ) const;
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

|      Parameter     |          Type          | Description                    |
| :----------------: | :--------------------: | :------------- |
| <code>units</code> | <code>timeUnits</code> | The units used to return the elapsed time:<ul><li><code>seconds</code> / <code>sec</code> — seconds</li><li><code>msec</code> — milliseconds</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

- The parameterless function (1) returns a <code>uint32_t</code> representing the elapsed time in milliseconds.
- The function with a <code>timeUnits</code> parameter (2) returns a <code>double</code> representing the elapsed time in the specified units.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The timer begins counting when the custom timer is constructed.
- Calling [<code>clear</code>](#clear) resets the timer value to zero.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Display the timer as it ticks up
while (true) {
  Brain.Screen.clearScreen();
  Brain.Screen.setCursor(1, 1);
  Brain.Screen.print("Time: %.2f", myTimer.time(sec));

  wait(50, msec);
}
```

### event

Registers a callback function to be executed after a specified delay.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Registers a callback to run after a specified delay and passes a user-defined value to the callback.
> ```cpp
> static void event(
>     void (*callback)(void *),
>     uint32_t value );
> ```

> **__2__ —** Registers a callback to run after a specified delay.
> ```cpp
> static void event(
>     void (*callback)(void),
>     uint32_t value );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

|       Parameter       |             Type             | Description                     |
| :-------------------: | :--------------------------: | :--------------------------------------- |
| <code>callback</code> | <code>void (*)(void *)</code> | A function that will be called after the specified delay and receives a user-defined argument. |
| <code>callback</code> |  <code>void (*)(void)</code> | A function that will be called after the specified delay.                           |
|   <code>value</code>  |     <code>uint32_t</code>    | The delay, in milliseconds, before the callback function is executed.                          |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- This function schedules a one-time callback; it does not repeat automatically.
- The callback function must return <code>void</code>.
- Multiple events may be scheduled at the same time.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> Define the function (outside of <code>int main()</code>)
> ```cpp
> // Create a function to turn the screen orange
> void turnOrange() {
>   Brain.Screen.clearScreen(orange);
> }
> ```
>
> Register the function inside <code>int main()</code>
>```cpp
> int main() {
>   /* vexcodeInit() is only required when using VEXcode.
>   Remove vexcodeInit() if compiling in VS Code. */
>   vexcodeInit();
> 
>   timer myTimer = timer();
>   // Call turnOrange after 2 seconds
>   myTimer.event(turnOrange, 2000);
> }
> ```
