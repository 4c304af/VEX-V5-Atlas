---
title: controller | VEX V5 - C++ API
description: Reference documentation for the controller class in VEX V5 C++. Includes constructors, functions, parameters, notes, and usage examples.
---

# Controller


## Introduction

The <code>controller</code> class represents a VEX V5 Controller connected to the V5 Brain. A <code>controller</code> object can be used to access joystick axis values, read button states, register button or joystick callbacks, make the Controller rumble, write to the Controller screen, and check whether the Controller is connected.

VEX V5 is compatible with the EXP Controller. See the [EXP Controller API](../../../../exp/home/cpp/Controller/index.md) for more information.

When one or more Controllers are configured in the Devices window, VEXcode V5 also provides <code>RemoteControlCodeEnabled</code>. This global variable enables or disables Controller actions configured in the Devices menu.

## Derived Classes

The <code>controller</code> class provides the following derived classes:

- [<code>Axis</code>](Axis.md) - Provides access to joystick axis input values and change events.
- [<code>Button</code>](Button.md) - Provides access to button state and button event callbacks.
- [<code>Screen</code>](Screen.md) - Provides functions for writing text to the controller screen.

## Constructors

> **__1__ -** Creates a controller using the primary controller type.
> Typically used when a single controller is connected.
> ```cpp
> controller();
> ```

> **__2__ -** Creates a controller for the specified controller type.
> Used when two controllers are connected.
> ```cpp
> controller(
>     controllerType id );
> ```

**Available Functions**

```cpp
controller();
```

```cpp
controller(controllerType id);
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>id</code> | <code>controllerType</code> | Optional. The Controller type to create: <code>primary</code> for the primary Controller connected to the Brain or <code>partner</code> for the second Controller connected to the Brain. |

**Notes**

Only one <code>primary</code> Controller and one <code>partner</code> Controller can be created in a single project.

**Example**

```cpp
// Create the primary Controller
controller Controller1 = controller();
```

```cpp
// Create a partner Controller
controller Controller2 = controller(partner);
```

## Destructor

### ~controller

<code>~controller</code> destroys the <code>controller</code> object and releases associated resources.

**Available Function**

```cpp
~controller();
```

## Parameters

|    Parameter    |             Type            | Description                                                                                       |
| :-------------: | :-------------------------: | ------------------------------------------------------------------------------------------------- |
| <code>id</code> | <code>controllerType</code> | The type of controller being created:<ul><li><code>primary</code> - The primary controller connected to the Brain.</li><li><code>partner</code> - The partner (second) controller connected to the Brain.</li></ul>|

## Notes

- Only one <code>primary</code> and one <code>partner</code> controller may exist in a single project.

## Example

```cpp
// Create a V5 controller instance
controller Controller = controller();
```

## Member Functions

The <code>controller</code> class includes the following member functions:

- [<code>rumble</code>](#rumble) - Rumbles the controller using a pattern.
- [<code>installed</code>](#installed) - Checks whether the controller is connected to the brain.

### rumble

```{vexcode}
id: v5_controller_rumble
```

<code>rumble</code> makes the Controller vibrate using a pattern. In the pattern string, dots are short vibrations, dashes are long vibrations, and spaces are pauses.

**Available Function**

```cpp
void rumble(const char *str);
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>str</code> | <code>const char *</code> | A string made of dots, dashes, and spaces that represent the rumble pattern. |

**Return Value**

This function does not return a value.

**Example**

```cpp
// Rumble with a short-short-long pattern
Controller1.rumble("..-");
```

## Getter

### installed

<code>installed</code> returns whether the Controller is connected to the Brain.

**Available Function**

```cpp
bool installed();
```

**Parameters**

This function does not have parameters.

**Return Value**

Returns a Boolean value.

<ul> <li><code>true</code> - The controller is installed/connected.</li> <li><code>false</code> - The controller is not installed/connected.</li> </ul>

## Global Variables

### RemoteControlCodeEnabled

```{vexcode}
id: v5_controller_remote_control_code_enabled
```

<code>RemoteControlCodeEnabled</code> enables or disables Controller actions configured in the Devices menu. Controller configured actions are enabled by default.

**Usage:**<br>
<code>RemoteControlCodeEnabled = state;</code>

| Value | Description |
| :---: | :---------- |
| <code>true</code> | Enables Controller configured actions. |
| <code>false</code> | Disables Controller configured actions. |

<span style="font-size: 1.5rem; ">
  Values
</span>

<ul>
  <li><code>true</code> - Controller-configured actions are enabled.</li>
  <li><code>false</code> - Controller-configured actions are disabled.</li>
</ul>

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Controller-configured actions are enabled by default.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Drive forward or backward using the left joystick
RemoteControlCodeEnabled = false;

while (true) {
  if (Controller1.Axis3.position() > 0) {
    Drivetrain.drive(forward);
  }
  else if (Controller1.Axis3.position() < 0) {
    Drivetrain.drive(reverse);
  }
  // Press A to use Controller configured actions again
  else if (Controller1.ButtonA.pressing()) {
    break;
  }
  else {
    Drivetrain.stop();
  }

  wait(20, msec);
}

RemoteControlCodeEnabled = true;
```

```{toctree}
:caption: controller Derived Classes
:titlesonly: true
:hidden:

./Axis
./Button
./Screen
```
