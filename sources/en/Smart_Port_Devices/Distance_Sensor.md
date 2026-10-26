---
title: Distance Sensor | VEX V5 - C++ API
description: Reference documentation for the distance class in VEX V5 C++. Includes constructors, functions, parameters, notes, and member functions.
---

```{highlight} cpp
:linenothreshold: 5
```

# Distance Sensor

```{contents}
:local: true
```

## Introduction

The <code>distance</code> class is used to control and access data from a Distance Sensor.

The **Distance Sensor** can detect whether an object is in front of the sensor and return how far away that object is. It can also return the detected object's relative velocity and estimate whether the object is small, medium, or large.

The Distance Sensor operates over a range of 20 mm to 2000 mm.

Below 200mm, accuracy is approximately ±15mm. Above 200mm, accuracy improves to about 5%.

The Distance Sensor uses a Class 1 laser. Detection is directed straight ahead and is classroom-safe.

## Class Constructors

```cpp
distance( int32_t  index );
```

## Class Destructor

Destroys the <code>distance</code> object and releases associated resources.

```cpp
~distance();
```

## Parameters

| Parameter | Type | Description |
|:---------:|:----:|:------------|
| <code>index</code> | <code>int32_t</code> | The Smart Port that the Distance Sensor is connected to, written as <code>PORTx</code>, where <code>x</code> is the port number (for example, <code>PORT1</code>). |

## Examples

```cpp
// Create a Distance Sensor instance in Port 1
distance Distance1 = distance(PORT1);
```

## Member Functions

The <code>distance</code> class includes the following member functions:

- [<code>objectDistance</code>](#objectdistance) — Returns the distance between the Distance Sensor and the nearest detected object.
- [<code>objectSize</code>](#objectsize) — Returns the estimated size of the detected object.
- [<code>objectVelocity</code>](#objectvelocity) — Returns how quickly the detected object is moving toward or away from the Distance Sensor.
- [<code>isObjectDetected</code>](#isobjectdetected) — Returns whether the Distance Sensor currently detects an object.
- [<code>changed</code>](#changed) — Registers a callback function that runs when the detected distance value changes.
- [<code>installed</code>](#installed) — Returns whether the Distance Sensor is installed and connected.

Before calling any <code>distance</code> member functions, a <code>distance</code> instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
Distance Sensor configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create a Distance Sensor instance in Port 1
distance Distance1 = distance(PORT1);
```

### objectDistance

Returns the distance between the Distance Sensor and the nearest detected object.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double objectDistance( distanceUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>units</code> | <code>distanceUnits</code> | The distance unit:<ul><li><code>mm</code> - millimeters (20 mm to 2000 mm)</li><li><code>cm</code> - centimeters (2 cm to 200 cm)</li><li><code>inches</code> - inches (0.78 inches to 78.74 inches)</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the distance between the Distance Sensor and the nearest detected object in the specified units.

### objectSize

Returns the estimated size of the object detected by the Distance Sensor.

The Distance Sensor estimates object size based on how much of the sensor's view is taken up by the detected object.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
sizeType objectSize();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not take any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>sizeType</code> indicating the estimated size of the detected object:
<ul>
  <li>
    <code>none</code> — No object is detected.
  </li>
  <li>
    <code>small</code> — A small object is detected.
  </li>
  <li>
    <code>medium</code> — A medium object is detected.
  </li>
  <li>
    <code>large</code> — A large object is detected.
  </li>
</ul>

### objectVelocity

Returns the relative velocity of the detected object.

Velocity shows how quickly the object is moving toward or away from the Distance Sensor. A value near 0 means the object is not moving much relative to the sensor.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double objectVelocity();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not take any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the relative velocity of the detected object in m/s (meters per second).

### isObjectDetected

Returns whether the Distance Sensor currently detects an object.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
bool isObjectDetected();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not take any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a Boolean indicating whether the Distance Sensor detects an object:
<ul>
  <li>
    <code>true</code> — The Distance Sensor detects an object.
  </li>
  <li>
    <code>false</code> — The Distance Sensor does not detect an object.
  </li>
</ul>

### changed

Registers a callback function that runs when the detected distance value changes.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void changed( void (* callback)(void) );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>callback</code> | <code>void (*)(void)</code> | A pointer to a function that will be called when the detected distance value changes. The function must take no parameters and return <code>void</code>. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

### installed

Returns whether the Distance Sensor is installed and connected.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
bool installed();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not take any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a Boolean indicating whether the Distance Sensor is installed and connected:
<ul>
  <li>
    <code>true</code> — The Distance Sensor is installed and connected.
  </li>
  <li>
    <code>false</code> — The Distance Sensor is not installed or not connected.
  </li>
</ul>
