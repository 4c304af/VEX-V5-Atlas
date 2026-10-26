---
title: C++ | VEX V5 - C++ API
description: Explore the C++ API reference for VEXcode V5. Find detailed descriptions for classes, constructors, member functions, parameters, return values, notes, and examples.
---

# C++

The VEX V5 C++ API Reference explains the classes, objects, constructors, member functions, and variables used in VEXcode V5 C++ projects.

Use this reference when you want to understand how a device or feature is created, check which function signature to use, or compare related member functions in a class.

C++ commands are used in VEXcode V5 C++ projects. C++ API information can also support projects written in Visual Studio Code with the VEX Visual Studio Code Extension.

## How to Read a C++ Class Page

A C++ class page usually follows this order:

1. **Introduction** - Explains what the class represents and when it is useful.
2. **Derived Classes** - Lists any classes that are based on this class, if applicable.
3. **Class Constructor or Constructors** - Shows the syntax used to create an object from the class.
4. **Class Destructor** - Shows the syntax used to destroy the object and release its resources, if applicable.
5. **Parameters** - Explains the constructor parameters used when creating the object.
6. **Example** - Shows how to create the object in code.
7. **Member Functions** - Lists the functions that belong to the class, often grouped by purpose.
8. **Function Entries** - Explains each member function, including available functions, parameters, return values, notes, and examples.

Not every page has every section. For example, some pages do not include derived classes, and some functions do not have parameters or return values.

## Common C++ API Elements

| Element | What it means |
| :-----: | :------------ |
| **Class** | The C++ type for a device or feature, such as <code>motor</code> or <code>drivetrain</code>. |
| **Object** | A named instance created from a class, such as <code>motor Motor1</code> or <code>drivetrain myDrivetrain</code>. |
| **Constructor** | The code used to create an object from a class. |
| **Member Function** | A command called on an object, such as <code>myDrivetrain.drive(...)</code>. |
| **Available Function** | One exact function signature that can be used for a member function. Some member functions have more than one available function. |
| **Parameter** | A value passed into a constructor or function to control what it does. |
| **Return Value** | A value a function gives back, such as <code>bool</code>, <code>int32_t</code>, or <code>double</code>. |

## Basic C++ Vocabulary

| Term | What it means |
| :--: | :------------ |
| **Variable** | A name that stores a value, such as <code>int speed = 50;</code>. |
| **Type** | The kind of data something stores, such as <code>int</code>, <code>double</code>, or <code>bool</code>. |
| **String** | Text inside quotes, such as <code>"Hello"</code>. |
| **int** | A positive or negative whole number type, such as <code>90</code>. |
| **double** | A number type that can include a decimal, such as <code>25.5</code>. |
| **bool** | A value that is either <code>true</code> or <code>false</code>. |
| **Argument** | A value passed into a member function or function call, such as <code>forward</code> in <code>myDrivetrain.drive(forward)</code>. |

## Constructors and Objects

Before using member functions from many C++ classes, an object must exist. The constructor shows how to create that object.

For example, a motor object can be created by giving the constructor the port or configuration information it needs:

```cpp
motor Motor1 = motor(PORT1, false);
```

After the object is created, its member functions can be called:

```cpp
Motor1.spin(forward);
```

In VEXcode, device configuration is often generated automatically by the Device Menu. In Visual Studio Code with the VEX extension, constructors may need to be written manually.

## Choosing the Right Available Function

Some member functions have more than one available function. Each function uses a different set of parameters, so choose the one that matches the values your project needs to provide.

For example, a drivetrain function may have one version that uses the current velocity and another version that lets the project choose a velocity:

```cpp
void drive(directionType dir);

void drive(directionType dir, double velocity, velocityUnits units);
```

Both functions call <code>drive</code>, but the second function gives more control because it includes velocity parameters.

## Example Function Entry

### drive

<code>drive</code> moves the robot forward or reverse forever. The robot will continue to move until it is given another action, like turning or stopping. For RPM or DPS, the limit is changed by the gear ratio of the drivetrain.

**Available Functions**

```cpp
void drive(directionType dir);
```

```cpp
void drive(directionType dir, double velocity, velocityUnits units);
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>dir</code> | <code>directionType</code> | The direction the robot moves: <code>forward</code> or <code>reverse</code>. |
| <code>velocity</code> | <code>double</code> | The velocity to drive with from 0% to 100% when using <code>velocityUnits::pct</code>, from 0 to 600 rpm when using <code>rpm</code>, or from 0 to 3600 degrees per second when using <code>dps</code>. If no velocity is provided, the robot drives at the current drive velocity. |
| <code>units</code> | <code>velocityUnits</code> | The velocity unit: <code>velocityUnits::pct</code> (percent), <code>rpm</code> (rotations per minute), or <code>dps</code> (degrees per second). |

**Return Value**

This function does not return a value.

**Notes**

- <code>drive</code> is non-waiting; the project will continue executing the next line of code immediately after the call.
- The drivetrain will continue moving until <code>stop</code> is called or another drivetrain movement function is executed.
- Functions such as <code>isDone</code> and <code>isMoving</code> are not applicable to <code>drive</code>, since it does not use target-based movement.

**Example**

```cpp
// Drive forward and back
myDrivetrain.drive(forward);
wait(2, seconds);
myDrivetrain.drive(reverse, 25, rpm);
wait(2, seconds);
myDrivetrain.stop();
```

## Waiting and Non-Waiting Behavior

Some C++ movement functions wait until an action is finished before the project moves to the next line of code. Other functions start an action and allow the next line to run right away.

- **Waiting** - The project waits until the function finishes.
- **Non-waiting** - The project starts the function and immediately continues to the next line.

Some functions include a parameter such as <code>waitForCompletion</code> to choose this behavior. For those functions, <code>true</code> usually makes the project wait, while <code>false</code> lets the next line run right away.

## Commands in Subsections

C++ commands are organized by device or topic. For example, commands for the Drivetrain, Motors, Controller, Brain, Smart Port devices, 3-Wire devices, Console, Logic, and VEXlink are grouped into their own subsections.

```{toctree}
:caption: C++
:titlesonly: true
:hidden:

Drivetrain/index
Motors_and_MotorControllers/index
Controller/index
Brain/index
./Competition
Smart_Port_Devices/index
3-Wire_Devices/index
./Console
Logic/index
VEXlink/index
CTE_Workcell/index
```
