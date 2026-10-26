---
title: Button | controller | VEX V5 - C++ API
description: Reference documentation for controller button objects in VEX V5 C++. Describes available buttons, how to access them, and supported button functions.
---

# Button

## Introduction

The <code>button</code> class is a derived class of the [<code>controller</code>](index.md) class. It provides access to Controller button states and button event callbacks.

A <code>button</code> object is accessed through a <code>controller</code> object. It is not constructed directly.

![The front and back side of the V5 Controller with the buttons highlighted in yellow. On the surface of the controller are up, down, left, and right arrow buttons on the left, and X, A, B, Y buttons clockwise from 12 o'clock on the right. On the back side of the controller are L1, L2, R1, and R2 on the left and right sides respectively.](/_static/img/controller/v5-controller-buttons-sticks-callout.png)

## Access

The <code>controller</code> class provides the following button objects. Each object is an instance of the <code>button</code> class.

| Object | Example Usage | Description |
| :----: | :------------ | :---------- |
| <code>ButtonA</code> | <code>Controller.ButtonA.pressing()</code> | The **A** button. |
| <code>ButtonB</code> | <code>Controller.ButtonB.pressing()</code> | The **B** button. |
| <code>ButtonX</code> | <code>Controller.ButtonX.pressing()</code> | The **X** button. |
| <code>ButtonY</code> | <code>Controller.ButtonY.pressing()</code> | The **Y** button. |
| <code>ButtonDown</code> | <code>Controller.ButtonDown.pressing()</code> | The **Down** button. |
| <code>ButtonUp</code> | <code>Controller.ButtonUp.pressing()</code> | The **Up** button. |
| <code>ButtonLeft</code> | <code>Controller.ButtonLeft.pressing()</code> | The **Left** button. |
| <code>ButtonRight</code> | <code>Controller.ButtonRight.pressing()</code> | The **Right** button. |
| <code>ButtonL1</code> | <code>Controller.ButtonL1.pressing()</code> | The **L1** button. |
| <code>ButtonL2</code> | <code>Controller.ButtonL2.pressing()</code> | The **L2** button. |
| <code>ButtonR1</code> | <code>Controller.ButtonR1.pressing()</code> | The **R1** button. |
| <code>ButtonR2</code> | <code>Controller.ButtonR2.pressing()</code> | The **R2** button. |

## Notes

- Before using a <code>button</code> member function, create a <code>controller</code> object.

```cpp
// Create a Controller object
controller Controller = controller();
```

## Member Functions

The <code>button</code> class includes the following member functions:

**Getter — Read button state.**
- [<code>pressing</code>](#pressing) — Returns whether the button is being pressed.

**Callbacks — Run functions when button events occur.**
- [<code>pressed</code>](#pressed) — Registers a function to run when the button is pressed.
- [<code>released</code>](#released) — Registers a function to run when the button is released.

## Getter

### pressing

```{vexcode}
id: v5_controller_button_pressing
```

<code>pressing</code> returns whether the button is currently being pressed.

**Available Function**

```cpp
bool pressing() const;
```

**Parameters**

This function does not have parameters.

**Return Value**

Returns a Boolean value.

- <code>true</code> — The button is being pressed.
- <code>false</code> — The button is not being pressed.

**Example**

```cpp
// Turn right while L1 is pressed
while (true) {
  if (Controller.ButtonL1.pressing()) {
    Drivetrain.turn(right);
  }
  else {
    Drivetrain.stop();
  }

  wait(20, msec);
}
```

## Callbacks

### pressed

```{vexcode}
id: v5_controller_button_pressed
```

<code>pressed</code> registers a function that runs when the button is pressed.

**Available Function**

```cpp
void pressed(void (* callback)(void)) const;
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>callback</code> | <code>void (*)(void)</code> | A function that runs when the button is pressed. |

**Return Value**

This function does not return a value.

**Example**

Define the callback function outside of <code>main</code>.

```cpp
// Drive forward when A is pressed
void driveForward() {
  Drivetrain.driveFor(forward, 100, mm);
}
```

Register the callback inside <code>main</code>.

```cpp
int main() {
  vexcodeInit();

  // Run driveForward when A is pressed
  Controller.ButtonA.pressed(driveForward);
}
```

### released

```{vexcode}
id: v5_controller_button_released
```

<code>released</code> registers a function that runs when the button is released.

**Available Function**

```cpp
void released(void (* callback)(void)) const;
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>callback</code> | <code>void (*)(void)</code> | A function that runs when the button is released. |

**Return Value**

This function does not return a value.

**Example**

Define the callback function outside of <code>main</code>.

```cpp
// Stop the drivetrain when A is released
void stopDriving() {
  Drivetrain.stop();
}
```

Register the callback inside <code>main</code>.

```cpp
int main() {
  vexcodeInit();

  // Run stopDriving when A is released
  Controller.ButtonA.released(stopDriving);
}
```