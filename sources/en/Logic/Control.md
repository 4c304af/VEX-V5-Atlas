---
title: Control | VEX V5 - C++ API
description: Reference documentation for control structures in VEX V5 C++. Includes loops, conditionals, delays, and program termination examples.
---


```{highlight} cpp
:linenothreshold: 5
```

# Control

```{contents}
:local: true
```


## Introduction

Control includes functions for timing, program flow, conditional logic, and project termination. These controls let you pause execution, create loops, define logic paths, and end a program.

## Functions and Keywords

Below is a list of available controls, including API functions and C++ keywords:

- [<code>wait</code>](#wait) – Pauses the project for a set amount of time.
- [<code>for</code>](#for) – Repeats a block of code a set number of times.
- [<code>if</code>](#if) – Runs a block of code if a condition is true.
- [<code>if/else</code>](#ifelse) – Runs one block of code if a condition is true, or a different block if it is false.
- [<code>if/else if/else</code>](#ifelse-ifelse) – Checks multiple conditions in order and runs the first block whose condition is true.
- [<code>while</code>](#while) – Repeats a block of code while a condition remains true.
- [<code>break</code>](#break) – Exits the current loop immediately.
- [<code>programStop</code>](#programstop) – Ends the project immediately.

### wait

```{vexcode}
id: v5_control_wait
```

Pauses the project for a specific amount of time before moving to the next line of code.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void wait(
  double time,
  timeUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description                                                  |
|:--:|:--:|--|
| <code>time</code> | <code>double</code> | The amount of time to wait, as a positive <code>double</code>. |
| <code>units</code> | <code>timeUnits</code> | The unit to represent the time: <code>msec</code> (default) – Milliseconds or <code>seconds</code> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Stop driving after 1 second
Drivetrain.drive(forward);
wait(1, seconds);
Drivetrain.stop();
```

### for

```{vexcode}
id: v5_control_for
```

Repeats a block of code. The counting form runs a set number of times; the range-based form runs once for each item in a collection.

<span style="font-size: 1.5rem;">
  Syntax
</span>

> **__1__ —** Counting loop — runs a fixed number of times.
> ```cpp
> for (int i = 0; i < count; i++) {
>    // code block
> }
> ```

> **__2__ —** Range-based loop — runs once for each item in a collection.
> ```cpp
> for (type element : collection) {
>    // code block
> }
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>count</code> | <code>int</code> | The number of times that the code block will be repeated. |
| <code>type</code>  | Type Name | The data type of each item in the collection (e.g. <code>int</code>, <code>double</code>). |
| <code>element</code> | <code>variable</code> | The name of the variable to hold the value of the current item of the loop. |
| <code>collection</code> | <code>array</code> | The Array (or vector) that holds the items that will be looped through. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This control structure does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Drive in a square
for (int i = 0; i < 4; i++) {
  Drivetrain.driveFor(forward, 100, mm);
  Drivetrain.turnFor(right, 90, degrees);
}
```

```cpp
// Drive forward different distances
int distances[] = {100, 150, 200};
for (int d : distances) {
  Drivetrain.driveFor(forward, d, mm);
  wait(0.5, seconds);
}
```

### if

```{vexcode}
id: v5_control_if
```

Runs the enclosed block of code if the condition is <code>true</code>.

<span style="font-size: 1.5rem;">
  Syntax
</span>

```cpp
if (condition) {
  // code block
}
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>condition</code> | <code>bool</code> | An expression or variable that is evaluated when the statement runs. If it is <code>true</code>, the code inside the <code>if</code> block runs; if it is <code>false</code>, the block is skipped. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This control structure does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
while (true) {
  if (Brain.Screen.pressing()) {
    // Display a message once the screen is pressed
    Brain.Screen.clearScreen();
    Brain.Screen.setCursor(1, 1);
    Brain.Screen.print("Screen pressed!");
    break;
  }
  wait(5, msec);
}
```

(if-else)=
### if/else

```{vexcode}
id: v5_control_if_else
```

Determines which enclosed block of code runs based on whether the condition is <code>true</code> or <code>false</code>.

<span style="font-size: 1.5rem;">
  Syntax
</span>

```cpp
if (condition) {
  // code block if true
}
else {
  // code block if false
}
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>condition</code> | <code>bool</code> | An expression or variable that is evaluated when the statement runs. If it is <code>true</code>, the code inside the <code>if</code> block runs; if it is <code>false</code>, the code inside the <code>else</code> block runs instead. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This control structure does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>


```cpp
while (true) {
  if (Brain.Screen.pressing()) {
    // Turn the screen green when pressed
    Brain.Screen.clearScreen(green);
  } else {
    Brain.Screen.clearScreen();
  }
}
```

### if/else if/else

```{vexcode}
id: v5_control_elseif
```

Selects which enclosed block of code runs based on multiple conditions.

<span style="font-size: 1.5rem;">
  Syntax
</span>


```cpp
if (condition) {
  // code block if first condition is true
}
else if (condition) {
  // code block if second condition is true
}
else {
  // code block if no conditions are true
}
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>condition</code> | <code>bool</code> | An expression or variable that is evaluated when the statement runs. The first condition that is <code>true</code> determines which block runs; if none are <code>true</code>, the <code>else</code> block runs. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This control structure does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- <code>if</code> runs its block if the condition is <code>true</code>.
- <code>else if</code> checks additional conditions only if all previous conditions are <code>false</code>. Multiple <code>else if</code> statements can be used.
- <code>else</code> runs its block only if none of the previous conditions are <code>true</code>.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
while (true) {
  // Turn screen blue if pressed on the left half
  if (Brain.Screen.pressing() && Brain.Screen.xPosition() < 240) {
    Brain.Screen.clearScreen(blue);

  // Turn screen green if pressed on the right half
  } else if (Brain.Screen.pressing() && Brain.Screen.xPosition() > 240) {
    Brain.Screen.clearScreen(green);

  } else {
    Brain.Screen.clearScreen();
  }

  wait(20, msec);
}
```

### while

```{vexcode}
id: v5_control_while
```

```{vexcode}
id: v5_control_waitUntil
```

Repeatedly runs code as long as the condition is <code>true</code>.

<span style="font-size: 1.5rem;">
  Syntax
</span>

```cpp
while (condition) {
  // code block
}
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>condition</code> | <code>bool</code> | An expression or variable that is evaluated before each iteration. If it is <code>true</code>, the loop continues; if it is <code>false</code>, the loop stops. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This control structure does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- It can also be used like a "Wait until" by adding <code>!</code> before the condition, as shown in the examples below.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
while (true) {
  if (Brain.Screen.pressing()) {
    // Turn the screen green whenever it's pressed
    Brain.Screen.clearScreen(green);
  } else {
    Brain.Screen.clearScreen();
  }
}
```

```cpp
// Wait until the screen is pressed to turn it green
while (!Brain.Screen.pressing()) {
  wait(20, msec);
}

Brain.Screen.clearScreen(green);
```

### break

```{vexcode}
id: v5_control_break
```

Exits the current loop immediately. If in a nested loop, <code>break</code> exits the innermost loop.

<span style="font-size: 1.5rem;">
  Syntax
</span>

```cpp
break;
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This statement does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This statement does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
while (true) {

  // Press the screen to pause on a color
  Brain.Screen.clearScreen(red);
  wait(500, msec);

  if (Brain.Screen.pressing()) {
    break;
  }

  Brain.Screen.clearScreen(green);
  wait(500, msec);

  if (Brain.Screen.pressing()) {
    break;
  }
}
```

### programStop

```{vexcode}
id: v5_control_stop_project
```

Ends a project immediately.

<span style="font-size: 1.5rem;">
  Syntax
</span>

```cpp
Brain.programStop();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This statement does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This statement does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
while (true) {

  // Press the screen to end the project
  Brain.Screen.clearScreen(red);
  wait(500, msec);

  if (Brain.Screen.pressing()) {
    Brain.programStop();
  }

  Brain.Screen.clearScreen(green);
  wait(500, msec);

  if (Brain.Screen.pressing()) {
    Brain.programStop();
  }
}
```