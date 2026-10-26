---
title: CTE Arm | VEX V5 - C++ API
description: Reference documentation for the 6-Axis CTE Arm in VEX V5 C++. Includes movement, positioning, end effector control, and sensor functions.
---

```{highlight} cpp
:linenothreshold: 5
```

# CTE Arm

```{contents}
:local: true
```


## Introduction

The <code>arm</code> class provides control for the 6-Axis Arm used in the CTE Workcell. In VEX V5 C++, the 6-Axis Arm can move an end effector to positions in three-dimensional space, rotate the end effector, check whether movements are possible, and control attached tools such as the Magnet Pickup Tool or Pen Holder Tool.

The 6-Axis Arm is not configured as a device in VEXcode V5. To use it in a VEX V5 C++ project, manually create an <code>arm</code> object in code with the Smart Port that the 6-Axis Arm is connected to.

The examples on this page use a manually constructed 6-Axis Arm named <code>Arm</code>.

## Constructors

### arm

<code>arm</code> creates a 6-Axis Arm object.

**Available Function**

```cpp
arm(int32_t index);
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>index</code> | <code>int32_t</code> | The Smart Port that the 6-Axis Arm is connected to, written as <code>PORTx</code>, where <code>x</code> is the port number. For example, <code>PORT1</code>. |

**Example**

```cpp
// Create a 6-Axis Arm named Arm on Port 1
arm Arm = arm(PORT1);
```

## Destructor

### ~arm

<code>~arm</code> destroys the <code>arm</code> object and releases associated resources.

**Available Function**

```cpp
~arm();
```

## Member Functions

The <code>arm</code> class includes the following member functions:

**Actions — Move the 6-Axis Arm to positions or orientations.**
- [<code>moveTo</code>](#moveto) — Moves the end effector to a specified x, y, and z coordinate.
- [<code>moveInc</code>](#moveinc) — Moves the end effector by a specified distance from its current position.
- [<code>moveEndEffectorTo</code>](#moveendeffectorto) — Rotates the end effector to a specified yaw, roll, and pitch orientation.
- [<code>moveEndEffectorInc</code>](#moveendeffectorinc) — Rotates the end effector by a specified yaw, roll, and pitch amount.

**Mutators — Configure movement, tools, and control settings.**
- [<code>setSpeed</code>](#setspeed) — Sets the movement speed used by the 6-Axis Arm.
- [<code>setEndEffectorType</code>](#setendeffectortype) — Sets the type of end effector attached to the 6-Axis Arm.
- [<code>setEndEffectorMagnet</code>](#setendeffectormagnet) — Enables or disables the Magnet Pickup Tool.
- [<code>setPenOffset</code>](#setpenoffset) — Sets the z-axis offset used with the Pen Holder Tool.
- [<code>setControlStop</code>](#setcontrolstop) — Enables or disables control stop for the 6-Axis Arm.
- [<code>setTimeout</code>](#settimeout) — Sets the timeout used by 6-Axis Arm movement functions.

**Getters — Return motion status, position, orientation, and connection values.**
- [<code>isDone</code>](#isdone) — Returns whether the 6-Axis Arm has finished moving.
- [<code>isCrashed</code>](#iscrashed) — Returns whether the 6-Axis Arm has crashed while moving.
- [<code>getX</code>](#getx) — Returns the current x position of the end effector.
- [<code>getY</code>](#gety) — Returns the current y position of the end effector.
- [<code>getZ</code>](#getz) — Returns the current z position of the end effector.
- [<code>getYaw</code>](#getyaw) — Returns the current yaw of the end effector.
- [<code>getRoll</code>](#getroll) — Returns the current roll of the end effector.
- [<code>getPitch</code>](#getpitch) — Returns the current pitch of the end effector.
- [<code>canArmReachTo</code>](#canarmreachto) — Returns whether the 6-Axis Arm can reach a specified position.
- [<code>canArmReachInc</code>](#canarmreachinc) — Returns whether the 6-Axis Arm can move by a specified distance.
- [<code>canEndEffectorReachTo</code>](#canendeffectortoreachto) — Returns whether the end effector can reach a specified orientation.
- [<code>canEndEffectorReachInc</code>](#canendeffectorreachinc) — Returns whether the end effector can rotate by a specified amount.
- [<code>isConnected</code>](#isconnected) — Returns whether the 6-Axis Arm is connected to the V5 Brain.
- [<code>timestamp</code>](#timestamp) — Returns the timestamp of the last received status packet from the 6-Axis Arm.
- [<code>installed</code>](#installed) — Returns whether the 6-Axis Arm is connected.

**Callbacks — Run functions when arm events occur.**
- [<code>controlStopped</code>](#controlstopped) — Registers a function to run when control stop is enabled.
- [<code>crashed</code>](#crashed) — Registers a function to run when a crash is detected.

## Actions

### moveTo

<code>moveTo</code> moves the 6-Axis Arm to a specified x, y, and z coordinate.

The x, y, and z coordinates describe the position of the end effector in three-dimensional space. Use [<code>canArmReachTo</code>](#canarmreachto) before this function if the target position may be outside the 6-Axis Arm's reachable workspace.

**Available Function**

```cpp
bool moveTo(
  double x,
  double y,
  double z,
  bool   waitForCompletion = true
);
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>x</code> | <code>double</code> | The x-coordinate of the target position in millimeters. |
| <code>y</code> | <code>double</code> | The y-coordinate of the target position in millimeters. |
| <code>z</code> | <code>double</code> | The z-coordinate of the target position in millimeters. |
| <code>waitForCompletion</code> | <code>bool</code> | Optional. <code>true</code> (default) waits until the movement is complete before continuing. <code>false</code> starts the movement and immediately continues to the next line of code. |

**Return Value**

Returns a Boolean value.

- <code>true</code> — The 6-Axis Arm reached the target position.
- <code>false</code> — The 6-Axis Arm did not reach the target position, or <code>waitForCompletion</code> was set to <code>false</code>.

**Examples**

```cpp
// Move the 6-Axis Arm to (200, 0, 100)
Arm.moveTo(200, 0, 100);
```

```cpp
// Start moving, then print the y-position while the arm moves
Arm.moveTo(-100, 200, 100, false);

while (!Arm.isDone()) {
  Brain.Screen.print(Arm.getY());
  Brain.Screen.newLine();
  wait(0.25, seconds);
}
```

### moveInc

<code>moveInc</code> moves the 6-Axis Arm by a specified distance from its current position along the x, y, and z axes.

Use this function to move relative to where the end effector is now. Use [<code>canArmReachInc</code>](#canarmreachinc) before this function if the movement may place the 6-Axis Arm outside its reachable workspace.

**Available Function**

```cpp
bool moveInc(
  double x,
  double y,
  double z,
  bool   waitForCompletion = true
);
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>x</code> | <code>double</code> | The distance to move along the x-axis in millimeters. |
| <code>y</code> | <code>double</code> | The distance to move along the y-axis in millimeters. |
| <code>z</code> | <code>double</code> | The distance to move along the z-axis in millimeters. |
| <code>waitForCompletion</code> | <code>bool</code> | Optional. <code>true</code> (default) waits until the movement is complete before continuing. <code>false</code> starts the movement and immediately continues to the next line of code. |

**Return Value**

Returns a Boolean value.

- <code>true</code> — The 6-Axis Arm reached the requested position.
- <code>false</code> — The 6-Axis Arm did not reach the requested position, or <code>waitForCompletion</code> was set to <code>false</code>.

**Example**

```cpp
// Move the 6-Axis Arm 100 millimeters along the y-axis
Arm.moveInc(0, 100, 0);
```

### moveEndEffectorTo

<code>moveEndEffectorTo</code> rotates the 6-Axis Arm's end effector to a specified yaw, roll, and pitch orientation.

Orientation describes how the end effector is rotated. <code>yaw</code> rotates around the z-axis, <code>roll</code> rotates around the x-axis, and <code>pitch</code> rotates around the y-axis.

**Available Function**

```cpp
bool moveEndEffectorTo(
  double yaw,
  double roll = 0,
  double pitch = 0,
  bool   waitForCompletion = true
);
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>yaw</code> | <code>double</code> | The target yaw angle in degrees. |
| <code>roll</code> | <code>double</code> | Optional. The target roll angle in degrees. The default is <code>0</code>. |
| <code>pitch</code> | <code>double</code> | Optional. The target pitch angle in degrees. The default is <code>0</code>. |
| <code>waitForCompletion</code> | <code>bool</code> | Optional. <code>true</code> (default) waits until the movement is complete before continuing. <code>false</code> starts the movement and immediately continues to the next line of code. |

**Return Value**

Returns a Boolean value.

- <code>true</code> — The end effector reached the target orientation.
- <code>false</code> — The end effector did not reach the target orientation, or <code>waitForCompletion</code> was set to <code>false</code>.

**Example**

```cpp
// Rotate the end effector to 90 degrees of roll
Arm.moveEndEffectorTo(0, 90, 0);
```

### moveEndEffectorInc

<code>moveEndEffectorInc</code> rotates the 6-Axis Arm's end effector by a specified yaw, roll, and pitch amount from its current orientation.

Use this function to rotate relative to the end effector's current yaw, roll, or pitch.

**Available Function**

```cpp
bool moveEndEffectorInc(
  double yaw,
  double roll = 0,
  double pitch = 0,
  bool   waitForCompletion = true
);
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>yaw</code> | <code>double</code> | The change in yaw, in degrees. |
| <code>roll</code> | <code>double</code> | Optional. The change in roll, in degrees. The default is <code>0</code>. |
| <code>pitch</code> | <code>double</code> | Optional. The change in pitch, in degrees. The default is <code>0</code>. |
| <code>waitForCompletion</code> | <code>bool</code> | Optional. <code>true</code> (default) waits until the movement is complete before continuing. <code>false</code> starts the movement and immediately continues to the next line of code. |

**Return Value**

Returns a Boolean value.

- <code>true</code> — The end effector reached the requested orientation.
- <code>false</code> — The end effector did not reach the requested orientation, or <code>waitForCompletion</code> was set to <code>false</code>.

**Example**

```cpp
// Rotate the end effector -50 degrees in pitch
Arm.moveEndEffectorInc(0, 0, -50);
```

## Mutators

### setSpeed

<code>setSpeed</code> sets the movement speed used by the 6-Axis Arm.

**Available Function**

```cpp
void setSpeed(uint32_t speed);
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>speed</code> | <code>uint32_t</code> | The speed at which the 6-Axis Arm should move, in millimeters per second. |

**Return Value**

This function does not return a value.

**Example**

```cpp
// Set the 6-Axis Arm movement speed
Arm.setSpeed(100);
```

### setEndEffectorType

<code>setEndEffectorType</code> sets the type of end effector attached to the 6-Axis Arm.

When the end effector type is changed, the 6-Axis Arm automatically adjusts its z-offset to match the selected tool.

**Available Function**

```cpp
bool setEndEffectorType(
  endEffectorType type,
  bool            waitForCompletion = true
);
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>type</code> | <code>endEffectorType</code> | The tool attached to the 6-Axis Arm: <code>magnet</code> (Magnet Pickup Tool) or <code>pen</code> (Pen Holder Tool). |
| <code>waitForCompletion</code> | <code>bool</code> | Optional. <code>true</code> (default) waits until the change is complete before continuing. <code>false</code> starts the change and immediately continues to the next line of code. |

**Return Value**

Returns a Boolean value.

- <code>true</code> — The requested type was set.
- <code>false</code> — The requested type was not set, or <code>waitForCompletion</code> was set to <code>false</code>.

**Example**

```cpp
// Set the end effector type to the Magnet Pickup Tool
Arm.setEndEffectorType(magnet);
```

### setEndEffectorMagnet

<code>setEndEffectorMagnet</code> enables or disables the Magnet Pickup Tool.

**Available Function**

```cpp
void setEndEffectorMagnet(bool enabled);
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>enabled</code> | <code>bool</code> | <code>true</code> enables the magnet to pick up and hold objects. <code>false</code> disables the magnet and drops any held object. |

**Return Value**

This function does not return a value.

**Example**

```cpp
// Pick up objects and then drop them
Arm.setEndEffectorType(magnet);
Arm.setEndEffectorMagnet(true);
wait(2, seconds);
Arm.setEndEffectorMagnet(false);
```

### setPenOffset

<code>setPenOffset</code> sets the z-axis offset used when the Pen Holder Tool is attached to the 6-Axis Arm.

Set the end effector type to <code>pen</code> before using this function. If the Pen Holder Tool is not selected, this function has no effect.

The pen offset is the distance from the top of the Pen Holder Tool to the tip of the Dry-Erase Marker. A positive z value moves the offset upward from the tool mount point.

**Available Function**

```cpp
void setPenOffset(double zOffset);
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>zOffset</code> | <code>double</code> | The pen offset value in millimeters. |

**Return Value**

This function does not return a value.

**Example**

```cpp
// Set the end effector type to the Pen Holder Tool and set the pen offset
Arm.setEndEffectorType(pen);
Arm.setPenOffset(25);
```

### setControlStop

<code>setControlStop</code> enables or disables control stop for the 6-Axis Arm.

When control stop is enabled, the 6-Axis Arm immediately stops movement and prevents further linear or joint movements.

**Available Function**

```cpp
void setControlStop(bool state = true);
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>state</code> | <code>bool</code> | Optional. <code>true</code> (default) enables control stop and prevents further linear or joint movements. <code>false</code> disables control stop. |

**Return Value**

This function does not return a value.

**Example**

```cpp
// Stop the 6-Axis Arm and prevent further movement
Arm.setControlStop();
```

### setTimeout

<code>setTimeout</code> sets the timeout value used when moving the 6-Axis Arm.

If a movement does not finish before the timeout is reached, the project continues to the next line of code.

**Available Function**

```cpp
void setTimeout(
  int32_t   timeout,
  timeUnits units
);
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>timeout</code> | <code>int32_t</code> | The new timeout value. |
| <code>units</code> | <code>timeUnits</code> | The time unit: <code>sec</code> (seconds) or <code>msec</code> (milliseconds). |

**Return Value**

This function does not return a value.

**Example**

```cpp
// Set the 6-Axis Arm timeout to 2 seconds
Arm.setTimeout(2, sec);
```

## Getters

### isDone

<code>isDone</code> returns whether the 6-Axis Arm has finished moving.

This function is useful after a movement function is called with <code>waitForCompletion</code> set to <code>false</code>.

**Available Function**

```cpp
bool isDone();
```

**Parameters**

This function does not have parameters.

**Return Value**

Returns a Boolean value.

- <code>true</code> — The 6-Axis Arm has finished moving.
- <code>false</code> — The 6-Axis Arm is still moving.

**Example**

```cpp
// Display the 6-Axis Arm's y-position while it moves
Arm.moveTo(-100, 200, 100, false);

while (!Arm.isDone()) {
  Brain.Screen.print(Arm.getY());
  Brain.Screen.newLine();
  wait(0.25, seconds);
}
```

### isCrashed

<code>isCrashed</code> returns whether the 6-Axis Arm has crashed while moving.

When a crash is detected, the 6-Axis Arm stops motor movement and may appear to go limp. This reduces strain and helps protect the motors from accidental damage.

**Available Function**

```cpp
bool isCrashed();
```

**Parameters**

This function does not have parameters.

**Return Value**

Returns a Boolean value.

- <code>true</code> — The 6-Axis Arm has crashed.
- <code>false</code> — The 6-Axis Arm has not crashed.

**Example**

```cpp
// Quickly move to a new location
Arm.setSpeed(100);
Arm.moveTo(-40, 250, 40, false);

// While moving, check for a crash
while (true) {
  if (Arm.isCrashed()) {
    // Indicate a crash with the Brain screen
    Brain.Screen.print("Crash Detected");
    break;
  }

  wait(5, msec);
}
```

### getX

<code>getX</code> returns the current x position of the end effector in millimeters.

Use this function to read where the end effector is currently located along the x-axis.

**Available Function**

```cpp
float getX();
```

**Parameters**

This function does not have parameters.

**Return Value**

Returns a <code>float</code> representing the x position of the end effector in millimeters.

**Example**

```cpp
// Print the current x position of the 6-Axis Arm
Brain.Screen.print(Arm.getX());
```

### getY

<code>getY</code> returns the current y position of the end effector in millimeters.

Use this function to read where the end effector is currently located along the y-axis.

**Available Function**

```cpp
float getY();
```

**Parameters**

This function does not have parameters.

**Return Value**

Returns a <code>float</code> representing the y position of the end effector in millimeters.

**Example**

```cpp
// Print the current y position of the 6-Axis Arm
Brain.Screen.print(Arm.getY());
```

### getZ

<code>getZ</code> returns the current z position of the end effector in millimeters.

Use this function to read where the end effector is currently located along the z-axis.

**Available Function**

```cpp
float getZ();
```

**Parameters**

This function does not have parameters.

**Return Value**

Returns a <code>float</code> representing the z position of the end effector in millimeters.

**Example**

```cpp
// Print the current z position of the 6-Axis Arm
Brain.Screen.print(Arm.getZ());
```

### getYaw

<code>getYaw</code> returns the current yaw of the end effector in degrees.

**Available Function**

```cpp
float getYaw();
```

**Parameters**

This function does not have parameters.

**Return Value**

Returns a <code>float</code> representing the current yaw of the end effector in degrees.

**Example**

```cpp
// Print the current yaw of the end effector
Brain.Screen.print(Arm.getYaw());
```

### getRoll

<code>getRoll</code> returns the current roll of the end effector in degrees.

**Available Function**

```cpp
float getRoll();
```

**Parameters**

This function does not have parameters.

**Return Value**

Returns a <code>float</code> representing the current roll of the end effector in degrees.

**Example**

```cpp
// Print the current roll of the end effector
Brain.Screen.print(Arm.getRoll());
```

### getPitch

<code>getPitch</code> returns the current pitch of the end effector in degrees.

**Available Function**

```cpp
float getPitch();
```

**Parameters**

This function does not have parameters.

**Return Value**

Returns a <code>float</code> representing the current pitch of the end effector in degrees.

**Example**

```cpp
// Print the current pitch of the end effector
Brain.Screen.print(Arm.getPitch());
```

### canArmReachTo

<code>canArmReachTo</code> returns whether the 6-Axis Arm can move the end effector to a specified x, y, and z coordinate.

Use this function to check a target position before using [<code>moveTo</code>](#moveto).

**Available Function**

```cpp
bool canArmReachTo(
  double x,
  double y,
  double z
);
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>x</code> | <code>double</code> | The x-coordinate of the target position in millimeters. |
| <code>y</code> | <code>double</code> | The y-coordinate of the target position in millimeters. |
| <code>z</code> | <code>double</code> | The z-coordinate of the target position in millimeters. |

**Return Value**

Returns a Boolean value.

- <code>true</code> — The 6-Axis Arm can reach the requested position.
- <code>false</code> — The 6-Axis Arm cannot reach the requested position.

**Example**

```cpp
// Move the 6-Axis Arm to (100, -20, 50) if it can reach
if (Arm.canArmReachTo(100, -20, 50)) {
  Arm.moveTo(100, -20, 50);
}
```

### canArmReachInc

<code>canArmReachInc</code> returns whether the 6-Axis Arm can move the end effector by a specified x, y, and z distance from its current position.

Use this function to check a relative movement before using [<code>moveInc</code>](#moveinc).

**Available Function**

```cpp
bool canArmReachInc(
  double x,
  double y,
  double z
);
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>x</code> | <code>double</code> | The distance to move along the x-axis in millimeters. |
| <code>y</code> | <code>double</code> | The distance to move along the y-axis in millimeters. |
| <code>z</code> | <code>double</code> | The distance to move along the z-axis in millimeters. |

**Return Value**

Returns a Boolean value.

- <code>true</code> — The 6-Axis Arm can make the requested movement.
- <code>false</code> — The 6-Axis Arm cannot make the requested movement.

**Example**

```cpp
// Increment the 6-Axis Arm 100 mm along the x-axis if possible
if (Arm.canArmReachInc(100, 0, 0)) {
  Arm.moveInc(100, 0, 0);
}
```

### canEndEffectorReachTo

<code>canEndEffectorReachTo</code> returns whether the end effector can rotate to a specified yaw, roll, and pitch orientation.

Use this function to check a target orientation before using [<code>moveEndEffectorTo</code>](#moveendeffectorto).

**Available Function**

```cpp
bool canEndEffectorReachTo(
  double yaw,
  double roll = 0,
  double pitch = 0
);
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>yaw</code> | <code>double</code> | The target yaw angle in degrees. |
| <code>roll</code> | <code>double</code> | Optional. The target roll angle in degrees. The default is <code>0</code>. |
| <code>pitch</code> | <code>double</code> | Optional. The target pitch angle in degrees. The default is <code>0</code>. |

**Return Value**

Returns a Boolean value.

- <code>true</code> — The end effector can reach the requested orientation.
- <code>false</code> — The end effector cannot reach the requested orientation.

**Example**

```cpp
// Rotate the end effector to 90 degrees of roll if possible
if (Arm.canEndEffectorReachTo(0, 90, 0)) {
  Arm.moveEndEffectorTo(0, 90, 0);
}
```

### canEndEffectorReachInc

<code>canEndEffectorReachInc</code> returns whether the end effector can rotate by a specified yaw, roll, and pitch amount from its current orientation.

Use this function to check a relative orientation movement before using [<code>moveEndEffectorInc</code>](#moveendeffectorinc).

**Available Function**

```cpp
bool canEndEffectorReachInc(
  double yaw,
  double roll = 0,
  double pitch = 0
);
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>yaw</code> | <code>double</code> | The change in yaw, in degrees. |
| <code>roll</code> | <code>double</code> | Optional. The change in roll, in degrees. The default is <code>0</code>. |
| <code>pitch</code> | <code>double</code> | Optional. The change in pitch, in degrees. The default is <code>0</code>. |

**Return Value**

Returns a Boolean value.

- <code>true</code> — The end effector can make the requested rotation.
- <code>false</code> — The end effector cannot make the requested rotation.

**Example**

```cpp
// Increment the end effector by 10 degrees of pitch if possible
if (Arm.canEndEffectorReachInc(0, 0, 10)) {
  Arm.moveEndEffectorInc(0, 0, 10);
}
```

### isConnected

<code>isConnected</code> returns whether the 6-Axis Arm is connected to the V5 Brain.

This is a compatibility function that returns the same value as [<code>installed</code>](#installed).

**Available Function**

```cpp
bool isConnected();
```

**Parameters**

This function does not have parameters.

**Return Value**

Returns a Boolean value.

- <code>true</code> — The 6-Axis Arm is connected to the V5 Brain.
- <code>false</code> — The 6-Axis Arm is not connected to the V5 Brain.

**Example**

```cpp
// Print whether the 6-Axis Arm is connected
Brain.Screen.print(Arm.isConnected());
```

### timestamp

<code>timestamp</code> returns the timestamp of the last received status packet from the 6-Axis Arm.

**Available Function**

```cpp
uint32_t timestamp();
```

**Parameters**

This function does not have parameters.

**Return Value**

Returns the timestamp of the last status packet as a <code>uint32_t</code> in milliseconds.

### installed

<code>installed</code> returns whether the 6-Axis Arm is connected.

**Available Function**

```cpp
bool installed();
```

**Parameters**

This function does not have parameters.

**Return Value**

Returns a Boolean value.

- <code>true</code> — The 6-Axis Arm is connected.
- <code>false</code> — The 6-Axis Arm is not connected.

## Callbacks

### controlStopped

<code>controlStopped</code> registers a function that runs when control stop is enabled.

**Available Function**

```cpp
void controlStopped(void (* callback)(void));
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>callback</code> | <code>void (*)(void)</code> | A function that runs when control stop is enabled. |

**Return Value**

This function does not return a value.

**Example**

```cpp
// Called when the 6-Axis Arm is control stopped
void onControlStopped() {
  Brain.Screen.print("Arm control stopped");
}

int main() {
  Arm.controlStopped(onControlStopped);
}
```

### crashed

<code>crashed</code> registers a function that runs when the 6-Axis Arm has crashed while moving.

When a crash is detected, the 6-Axis Arm stops motor movement and may appear to go limp. This reduces strain and helps protect the motors from accidental damage.

**Available Function**

```cpp
void crashed(void (* callback)(void));
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>callback</code> | <code>void (*)(void)</code> | A function that runs when the 6-Axis Arm has crashed while moving. |

**Return Value**

This function does not return a value.

**Example**

```cpp
// Called when the 6-Axis Arm crashes while moving
void onArmCrashed() {
  Brain.Screen.print("Crash detected");
}

int main() {
  Arm.crashed(onArmCrashed);
}
```