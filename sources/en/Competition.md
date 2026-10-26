---
title: Competition | VEX V5 - C++ API
description: Reference documentation for the competition class in VEX V5 C++. Includes constructors, functions, parameters, notes, and member functions.
---

```{highlight} cpp
:linenothreshold: 5
```

# Competition

```{contents}
:local: true
```

## Introduction

The <code>competition</code> class helps you structure a V5 project for official competition control. It lets you register functions to run during Autonomous and Driver Control, and provides simple status checks so your code can respond to match state (enabled/disabled, autonomous/driver, field control, etc.).

## Class Constructors

```cpp
competition();
```

## Class Destructor

Destroys the <code>competition</code> object and releases associated resources.

```cpp
~competition();
```

## Parameters

This constructor does not accept any parameters.

## Examples

```cpp
// Create the competition instance
competition Competition = competition();
```

## Member Functions

The <code>competition</code> class includes the following member functions:

- [<code>autonomous</code>](#autonomous) — Registers a function to be called when the Autonomous period begins.
- [<code>drivercontrol</code>](#drivercontrol) — Registers a function to be called when the Driver Control period begins.
- [<code>isEnabled</code>](#isenabled) — Returns the status of your robot when under competition control.
- [<code>isDriverControl</code>](#isdrivercontrol) — Returns whether the state of the robot is driver control.
- [<code>isAutonomous</code>](#isautonomous) — Returns whether the state of the robot is autonomous.
- [<code>isCompetitionSwitch</code>](#iscompetitionswitch) — Returns whether the competition switch is connected.
- [<code>isFieldControl</code>](#isfieldcontrol) — Returns whether the field control is connected.

Before calling any <code>competition</code> member functions, a <code>competition</code> instance must be created, as shown below:

```cpp
// Create the competition instance
competition Competition = competition();
```

### autonomous

```{vexcode}
id: v5_competition_autonomous
```

Registers a function to be called when the Autonomous period begins.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void autonomous( void (* callback)(void) );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Name       | Type             | Description                                                                                                                      |
| ---------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| <code>callback</code> | <code>void (*)(void)</code> | A pointer to a function that takes no parameters and returns no value. This function will run when the Autonomous period starts. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
void autonomousControl(void) {
  // Place automonous code here.
  Brain.Screen.clearScreen();
  Brain.Screen.print("autonomous");
}

int main(){
    // Create competition instance.
    competition Competition;

    // Set up callback for the autonomous control period.
    Competition.autonomous(autonomousControl);

    // Prevent main from exiting with an infinite loop.
    while (true) {
        wait(100, msec);
    }
}
```

### drivercontrol

```{vexcode}
id: v5_competition_drivercontrol
```

Registers a function to be called when the Driver Control period begins.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void drivercontrol( void (* callback)(void) );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type          | Description                                                                                 |
|-----------|---------------|--------------------------------------------------------------------------------------------|
| <code>callback</code> | <code>void (*)(void)</code> | A pointer to a function that takes no parameters and returns no value. This function will run when the Driver Control period starts.|

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
void userControl(void) {
  Brain.Screen.clearScreen();
  // place driver control in this while loop
  while (true) {
    wait(20, msec);
  }
}

int main(){
    // Create competition instance.
    competition Competition;

    // Set up callback for the driver control period.
    Competition.drivercontrol(userControl);

    // Prevent main from exiting with an infinite loop.
    while (true) {
        wait(100, msec);
    }
}
```

### isEnabled

```{vexcode}
id: v5_competition_isenabled
```

Returns the status of your robot when under competition control.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
bool isEnabled();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a Boolean indicating whether the autonomous or driver control period is active:
- <code>true</code> – The autonomous or driver control period is active.
- <code>false</code> – Neither control period is active.

### isDriverControl

```{vexcode}
id: v5_competition_isdrivercontrol
```

Returns a Boolean indicating if the robot is in driver control mode.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
bool isDriverControl();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a Boolean indicating if the robot is in driver control mode:
- <code>true</code> – The robot is in driver control mode.
- <code>false</code> – The robot is not in driver control mode.

### isAutonomous

```{vexcode}
id: v5_competition_isautonomous
```

Returns a Boolean indicating if the robot is in autonomous mode.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
bool isAutonomous();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a Boolean indicating if the robot is in autonomous mode:
- <code>true</code> – The robot is in autonomous mode.
- <code>false</code> – The robot is not in autonomous mode.


### isCompetitionSwitch

```{vexcode}
id: v5_competition_iscompetitionswitch
```

Returns a Boolean indicating if the Competition Control Switch is connected:

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
bool isCompetitionSwitch();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- This function checks whether the Competition Control Switch is connected. The Competition Control Switch is used before the V5 Field Control System is in place.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a Boolean indicating if the Competition Control Switch is connected:
- <code>true</code> – The Competition Control Switch is connected.
- <code>false</code> – The Competition Control Switch is not connected.


### isFieldControl

```{vexcode}
id: v5_competition_isfieldcontrol
```

Returns a Boolean indicating if the Field Controller is connected.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
bool isFieldControl();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a Boolean indicating if the Field Controller is connected:
- <code>true</code> – The Field Controller is connected.
- <code>false</code> – The Field Controller is not connected.