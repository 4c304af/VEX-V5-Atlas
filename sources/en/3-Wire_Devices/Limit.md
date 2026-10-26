---
title: Limit Switch | VEX V5 - C++ API
description: Reference documentation for the limit class in VEX V5 C++. Includes constructors, functions, parameters, notes, and member functions.
---

```{highlight} cpp
:linenothreshold: 5
```

# Limit Switch

```{contents}
:local: true
```

## Introduction

The <code>limit</code> class is used with the Limit Switch, a small digital sensor that detects physical contact with an object.

![The VEX V5 Limit Switch.](/_static/img/sensing/limit_switch.png)

## Class Constructor

```cpp
limit(
  triport::port &port);
```

## Class Destructor

Destroys the <code>limit</code> object and releases associated resources.

```cpp
virtual ~limit();
```

## Parameters

| Parameter | Type | Description |
|:---------:| :------: | :------------|
| <code>port</code> | <code>triport::port &</code> | The 3-Wire Port that the Limit Switch is connected to, written as <code>Brain.ThreeWirePort.X</code> or <code>ExpanderName.X</code>, where <code>X</code> is the port letter (for example, <code>Brain.ThreeWirePort.A</code> or <code>Expander1.A</code>).  |

## Example

```cpp
// Create a limit instance in Port A
limit LimitSwitchA = limit(Brain.ThreeWirePort.A);
```

## Member Functions

The <code>limit</code> class includes the following member functions:

- [<code>pressing</code>](#pressing) – Returns whether the Limit Switch is being pressed.
- [<code>pressed</code>](#pressed) – Registers a function to be called whenever the Limit Switch is pressed.
- [<code>released</code>](#released) – Registers a function to be called whenever the Limit Switch is released.

Before calling any <code>limit</code> member functions, a <code>limit</code> instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
Limit Switch configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create a limit instance in Port A
limit LimitSwitchA = limit(Brain.ThreeWirePort.A);
```

### pressing

Returns whether the Limit Switch is currently being pressed. This can be used to check if the robot bumps into other objects.

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

Returns an <code>int32_t</code> indicating whether the Limit Switch is being pressed.

- <code>1</code> — The Limit Switch is being pressed.
- <code>0</code> — The Limit Switch is not being pressed.

### pressed

Registers a function to be called when the Limit Switch is pressed.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void pressed(
  void (* callback)(void) );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :----------------: | :------: | :-------------------------------------- |
| <code>callback</code> | <code>void (*)(void)</code> | A pointer to a function that will be called when the Limit Switch is pressed. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> void switchPressed() {
>   // The Brain will print that the Limit Switch was pressed
>   // on the Brain's screen.
>   Brain.Screen.print("switch pressed");
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
>   // Run switchPressed when the Limit Switch is pressed.
>   LimitSwitchA.pressed(switchPressed);
> }
> ```

### released

Registers a function to be called when the Limit Switch is released.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void released(
  void (* callback)(void) );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>


| Parameter | Type | Description |
| :----------------: | :------: | :-------------------------------------- |
| <code>callback</code> | <code>void (*)(void)</code> | A pointer to a function that will be called when the Limit Switch is released. |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> void switchReleased() {
>   // The Brain will print that the Limit Switch was released
>   // on the Brain's screen.
>   Brain.Screen.print("switch released");
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
>   // Run switchReleased when the Limit Switch is released.
>   LimitSwitchA.released(switchReleased);
> }
> ```
