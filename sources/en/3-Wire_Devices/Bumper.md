---
title: Bumper Switch | VEX V5 - C++ API
description: Reference documentation for the bumper class in VEX V5 C++. Includes constructors, functions, parameters, notes, and member functions.
---

```{highlight} cpp
:linenothreshold: 5
```

# Bumper Switch

```{contents}
:local: true
```

## Introduction

The <code>bumper</code> class is used with the Bumper Switch, a mechanical switch that completes a circuit when pressed, allowing the robot to detect presses and releases.

![The VEX V5 Bumper Switch is a 3-wire device with a wide black base to attach it to a robot, and red pressable button on top.](/_static/img/sensing/bumper_switch_1_new_image.png)

## Class Constructor

```cpp
bumper(
  triport::port &port );
```

## Class Destructor

Destroys the <code>bumper</code> object and releases associated resources.

```cpp
virtual ~bumper();
```

## Parameters

| Parameter | Type | Description |
|:---------:| :------: | :------------|
|   <code>port</code>  | <code>triport::port&</code> | The 3-Wire Port that the Bumper Switch is connected to, written as <code>Brain.ThreeWirePort.X</code> or <code>ExpanderName.X</code>, where <code>X</code> is the port letter (for example, <code>Brain.ThreeWirePort.A</code> or <code>Expander1.A</code>). |

## Example

```cpp
// Create a bumper instance in Port A
bumper BumperA = bumper(Brain.ThreeWirePort.A);
```

## Member Functions

The <code>bumper</code> class includes the following member functions:

- [<code>pressing</code>](#pressing) — Returns whether the Bumper Switch is being pressed.
- [<code>pressed</code>](#pressed) — Registers a function to be called when the Bumper Switch is pressed.
- [<code>released</code>](#released) — Registers a function to be called when the Bumper Switch is released.

Before calling any <code>bumper</code> member functions, a <code>bumper</code> instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
Bumper Switch configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create a bumper instance in Port A
bumper BumperA = bumper(Brain.ThreeWirePort.A);
```

### pressing

```{vexcode}
id: v5_3-wire_bumper_pressing
```

Returns whether the Bumper Switch is currently being pressed. This can be used to check if the robot bumps into other objects.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
int32_t pressing();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns an <code>int32_t</code> indicating whether the Bumper Switch is being pressed.

- <code>1</code> — The Bumper Switch is being pressed.
- <code>0</code> — The Bumper Switch is not being pressed.

### pressed

```{vexcode}
id: v5_3-wire_bumper_pressed
```

Registers a function to be called when the Bumper Switch is pressed.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void pressed( void (* callback)(void) );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :----------------: | :------: | :-------------------------------------- |
| <code>callback</code> | <code>void (*)(void)</code> | A pointer to a function that will be called when the bumper is pressed. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> // Display a message when bumper is pressed
> void BumperPressed() {
>   Brain.Screen.print("Bumper pressed");
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
>   // Run BumperPressed when the value of the Bumper Switch is pressed.
>   BumperA.pressed(BumperPressed);
> }
> ```

### released

```{vexcode}
id: v5_3-wire_bumper_released
```

Registers a function to be called when the Bumper Switch is released.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void released( void (* callback)(void) );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>


| Parameter | Type | Description |
| :----------------: | :-----: | :-------------------------------------- |
| <code>callback</code> | <code>void (*)(void)</code> | A pointer to a function that will be called when the bumper is released. |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> // Display a message when bumper is released
> void BumperReleased() {
>   Brain.Screen.print("Bumper released");
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
>   // Run BumperReleased when the value of the Bumper Switch is released.
>   BumperA.released(BumperReleased);
> }
> ```
