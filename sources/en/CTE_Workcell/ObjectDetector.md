---
title: Object Sensor | VEX V5 - C++ API
description: Reference documentation for the objectdetector class in VEX V5 C++. Includes constructors, functions, parameters, notes, and member functions.
---

```{highlight} cpp
:linenothreshold: 5
```

# Object Sensor

```{contents}
:local: true
```

## Introduction

The <code>objectdetector</code> class is used to measure reflectivity and detect objects by the Object Sensor.

## Class Constructor

```cpp
objectdetector( 
  triport::port &port, 
  bool           bReverse = false );
```

## Class Destructor

Destroys the <code>objectdetector</code> object and releases associated resources.

```cpp
virtual ~objectdetector();
```

## Parameters

| Parameter | Type | Description |
|:---------:| :---------: | :------------|
| <code>port</code>    | <code>triport::port &</code> | The 3-Wire Port that the Object Sensor is connected to, written as <code>Brain.ThreeWirePort.X</code> or <code>ExpanderName.X</code>, where <code>X</code> is the port letter (for example, <code>Brain.ThreeWirePort.A</code> or <code>Expander1.A</code>).  |
| <code>bReverse</code> | <code>bool</code> | An optional boolean to reverse the direction of the Object Sensor: <ul><li><code>false</code> (default) — Do not reverse the direction </li><li><code>true</code> — Reverse the direction</li><ul> |

## Examples

```cpp
// Create an objectdetector instance in Port A
objectdetector ObjectSensorA = objectdetector(Brain.ThreeWirePort.A, true);
```

## Member Functions

The <code>objectdetector</code> class includes the following member functions:

- [<code>reflectivity</code>](#reflectivity) — Returns the reflectivity detected by the Object Sensor.
- [<code>isObjectDetected</code>](#isobjectdetected) — Returns whether the Object Sensor detects an object.
- [<code>setDetectionThreshold</code>](#setdetectionthreshold) — Sets the detection range of the Object Sensor.
- [<code>objectDetected</code>](#objectdetected) — Registers a function to be called when the Object Sensor detects an object.
- [<code>objectLost</code>](#objectlost) — Registers a function to be called when the Object Sensor loses an object.

Before calling any <code>objectdetector</code> member functions, a <code>objectdetector</code> instance must be created, as shown below:

```cpp
// Create an objectdetector instance in Port A
objectdetector ObjectSensorA = objectdetector(Brain.ThreeWirePort.A, true);
```

### reflectivity

Returns the reflectivity measured by the Object Sensor.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
int32_t reflectivity( 
  percentUnits units = percentUnits::pct );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameters | Type | Description |
| :----------------: | :-----: | :-------------------------------------- |
| <code>units</code> | <code>percentUnits</code> | The unit that represents the reflectivity: <ul><li><code>percent</code> / <code>pct</code> — percent</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns an <code>int32_t</code> representing the reflectivity measured by the Object Detector as a percent in the range 0 - 100%.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp 
// Display the detected reflectivity on the Brain's screen
int32_t value = ObjectSensorA.reflectivity();
Brain.Screen.print(value);
```

### isObjectDetected

Returns whether an object is currently detected by the Object Detector.

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

Returns a Boolean indicating whether an object is detected:
<ul>
  <li>
    <code>true</code> — An object is detected.
  </li>
  <li>
    <code>false</code> — No object is detected.
  </li>
</ul>


### setDetectionThreshold

Sets the detection threshold for the Object Detector to a specific value.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void setDetectionThreshold( 
  int32_t      threshold, 
  percentUnits units = percentUnits::pct );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameters | Type | Description |
| :----------------: | :-----: | :-------------------------------------- |
| <code>threshold</code> | <code>int32_t</code> | The reflectivity threshold for object detection, in the range 0 - 100.|
| <code>units</code> | <code>percentUnits</code> | The unit that represents the new threshold: <ul><li><code>percent</code> / <code>pct</code> — percent</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp 
// Set the reflectivity threshold to 50%
ObjectSensorA.setDetectionThreshold(50);
```

### objectDetected

Registers a callback function for when an object is detected.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void objectDetected(void (* callback)(void));
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :----------------: | :------: | :-------------------------------------- |
| <code>callback</code> | <code>void (*)(void)</code> | The callback function to be called when an object is detected. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> // Display a message when an object is detected.
> void detected() {
>   Brain.Screen.print("object detected");
> }
> ```
>
> Register the callback inside <code>int main()</code>
> ```cpp
> int main() {
>   // Run detected when the Object Detector detects an object.
>   ObjectSensorA.objectDetected(detected);
> }
> ```

### objectLost

Registers a callback function for when an object is lost.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void objectLost(void (* callback)(void));
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :----------------: | :------: | :-------------------------------------- |
| <code>callback</code> | <code>void (*)(void)</code> | The callback function to be called when an object is lost. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> // Display a message when an object is lost.
> void lost() {
>   Brain.Screen.print("object lost");
> }
> ```
>
> Register the callback inside <code>int main()</code>
> ```cpp
> int main() {
>   // Run lost when the Object Detector loses an object.
>   ObjectSensorA.objectLost(lost);
> }
> ```
