---
title: Threads | VEX V5 - C++ API
description: Explore the C++ API reference for threads with VEX V5. Find detailed descriptions for thread functions, usage, and examples.
---


```{highlight} cpp
:linenothreshold: 5
```

# Threads

```{contents}
:local: true
```

## Introduction

Threads allow a robot to run multiple tasks simultaneously within the same program. They enable multitasking, letting the robot perform independent actions at the same time.

## Class Constructors

> **__1__ —** Creates and starts a new thread with a function.
> ```cpp
> thread( void (* callback)(void) );
> ```

> **__2__ —** Creates and starts a new thread with a function that accepts an argument.
> ```cpp
> thread( int (* callback)(void *), void *arg );
> ```

## Class Destructor

Destroys the <code>thread</code> object and releases associated resources.

```cpp
~thread();
```

## Parameters

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>callback</code> | <code>void (*)(void)</code> | A previously defined function that will run in the new thread. |
| <code>callback</code> | <code>int (*)(void *)</code> | A previously defined function that accepts a void pointer argument and will run in the new thread. |
| <code>arg</code> | <code>void *</code> | A void pointer that is passed to the callback function. |

## Notes

- A function must **always be defined *before*** it is called.
- When you create a thread, you can name it to manage it individually in your project.
- Once a thread is stopped using <code>interrupt()</code>, it cannot be restarted. To run it again, you must create a new thread.

## Example

> Define the function (outside of <code>int main()</code>)
> ```cpp
> // Drive forward while blinking screen
> void blinkScreen() {
>   while (true) {
>     Brain.Screen.clearScreen(red);
>     wait(0.5, seconds);
>     Brain.Screen.clearScreen();
>     wait(0.5, seconds);
>   }
> }
> ```
>
> Register the thread inside <code>int main()</code>
>```cpp
> int main() {
>   /* vexcodeInit() is only required when using VEXcode.
>   Remove vexcodeInit() if compiling in VS Code. */
>   vexcodeInit();
> 
>   // Begin project code
>   thread blinkScreenThread = thread(blinkScreen);
>   Drivetrain.drive(forward);
> }
> ```

> Define the function (outside of <code>int main()</code>)
> ```cpp
> // Run multiple threads simultaneously
> // Turn right, blink screen at once
> void blinkScreen() {
>   while (true) {
>     Brain.Screen.clearScreen(red);
>     wait(0.5, seconds);
>     Brain.Screen.clearScreen();
>     wait(0.5, seconds);
>   }
> }
>
> void turning() {
>   Drivetrain.turn(right);
> }
> ```
>
> Register the thread inside <code>int main()</code>
>```cpp
> int main() {
>   /* vexcodeInit() is only required when using VEXcode.
>   Remove vexcodeInit() if compiling in VS Code. */
>   vexcodeInit();
> 
>   // Begin project code
>   thread blinkScreenThread = thread(blinkScreen);
>   thread turningThread = thread(turning);
> }
> ```

## Member Functions

The thread class includes the following member functions:
- [<code>interrupt</code>](#interrupt) – Stops a thread manually, useful for halting background behavior.

### interrupt

Stops a thread manually, which is useful when a task is no longer needed or when a program needs to reset threads.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void interrupt();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not have parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Once a thread is stopped, it cannot be restarted. To run it again, you must create a new thread using `thread`.
- This is useful when a task is no longer needed or when a program needs to reset or reassign threads.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> Define the function (outside of <code>int main()</code>)
> ```cpp
> // Loop through red and green
> void colorLoop() {
>   while (true) {
>     Brain.Screen.drawRectangle(0, 120, 480, 120, red);
>     wait(0.5, seconds);
>     Brain.Screen.drawRectangle(0, 120, 480, 120, green);
>     wait(0.5, seconds);
>   }
> }
>
> // Display the current heading
> void displayHeading() {
>   Brain.Screen.setFont(prop60);
>   while (true) {
>     Brain.Screen.clearLine(1);
>     Brain.Screen.setCursor(1, 1);
>     Brain.Screen.print(
>       "Heading: %.1f",
>       DrivetrainInertial.heading(degrees)
>     );
>     wait(50, msec);
>   }
> }
> ```
>
> Register the thread inside <code>int main()</code>
>```cpp
> int main() {
>   /* vexcodeInit() is only required when using VEXcode.
>   Remove vexcodeInit() if compiling in VS Code. */
>   vexcodeInit();
> 
>   // Turn right, change screen color, and display heading at once
>   thread colorThread = thread(colorLoop);
>   thread displayHeadingThread = thread(displayHeading);
>
>   Drivetrain.turn(right);
>   wait(2, seconds);
>
>   // Stop the flashing colors
>   colorThread.interrupt();
> }
> ```