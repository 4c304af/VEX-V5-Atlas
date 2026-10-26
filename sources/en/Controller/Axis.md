---
title: Axis | controller | VEX V5 - C++ API
description: Reference documentation for Controller.Axis in VEX V5 C++. Describes available joystick axes and how to access them.
---

# Axis

## Introduction

The <code>axis</code> class is a derived class of the [<code>controller</code>](index.md) class. It provides access to Controller joystick axis values and joystick axis change callbacks.

An <code>axis</code> object is accessed through a <code>controller</code> object. It is not constructed directly.

![A VEX V5 Controller with the axes around the joysticks labeled. Axis 1 and 2 are around the right joystick, and Axis 3 and 4 are around the left.](/_static/img/controller/v5-controller-stick-axis-new-highlight.png)

## Access

The <code>controller</code> class provides the following axis objects. Each object is an instance of the <code>axis</code> class.

| Axis Object | Example Usage | Description |
| :---------: | :------------ | :---------- |
| <code>Axis1</code> | <code>Controller.Axis1.position()</code> | Right joystick horizontal axis. |
| <code>Axis2</code> | <code>Controller.Axis2.position()</code> | Right joystick vertical axis. |
| <code>Axis3</code> | <code>Controller.Axis3.position()</code> | Left joystick vertical axis. |
| <code>Axis4</code> | <code>Controller.Axis4.position()</code> | Left joystick horizontal axis. |

## Notes

- Before using an <code>axis</code> member function, create a <code>controller</code> object.
- <code>position</code> returns a value from <code>-100</code> to <code>100</code>.

```cpp
// Create a Controller object
controller Controller = controller();
```

## Member Functions

The <code>axis</code> class includes the following member functions:

**Getter — Read joystick axis position.**
- [<code>position</code>](#position) — Returns the position of the joystick axis.

**Callback — Run a function when the joystick's position changes along an axis.**
- [<code>changed</code>](#changed) — Runs a function when the joystick's position changes along that axis.

## Getter

### position

```{vexcode}
id: v5_controller_axis_position
```

<code>position</code> returns the position of the joystick axis as a value from <code>-100</code> to <code>100</code>.

**Available Function**

```cpp
int32_t position(percentUnits units = percentUnits::pct) const;
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>units</code> | <code>percentUnits</code> | Optional. The unit used for the returned axis value. The default is <code>percentUnits::pct</code>. |

**Return Value**

Returns an <code>int32_t</code> value from <code>-100</code> to <code>100</code>.

- <code>100</code> — The joystick axis is fully moved in the positive direction.
- <code>0</code> — The joystick axis is centered.
- <code>-100</code> — The joystick axis is fully moved in the negative direction.

**Example**

```cpp
// Turn with the left joystick
while (true) {
  if (Controller.Axis4.position() > 10) {
    Drivetrain.turn(right);
  }
  else if (Controller.Axis4.position() < -10) {
    Drivetrain.turn(left);
  }
  else {
    Drivetrain.stop();
  }

  wait(20, msec);
}
```

## Callback

### changed

```{vexcode}
id: v5_controller_axis_changed
```

<code>changed</code> runs a function when the joystick's position changes along that axis.

**Available Function**

```cpp
void changed(void (* callback)(void)) const;
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>callback</code> | <code>void (*)(void)</code> | A function to run each time the joystick's position changes along that axis. |

**Return Value**

This function does not return a value.

**Example**

Define the callback function outside of <code>main</code>.

```cpp
// Rumble when the left joystick moves
void controllerRumble() {
  Controller.rumble(".");
}
```

Register the callback inside <code>main</code>.

```cpp
int main() {
  vexcodeInit();

  // Run controllerRumble when the joystick's position changes along Axis4
  Controller.Axis4.changed(controllerRumble);
}
```
