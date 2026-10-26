---
title: Inertial Sensor | VEX V5 - C++ API
description: Explore the C++ API reference for the Inertial Sensor in VEX V5. Find detailed descriptions for methods, parameters, and usage examples to code an Inertial Sensor.
---

```{highlight} cpp
:linenothreshold: 5
```

# Inertial Sensor

```{contents}
:local: true
```


## Introduction

The <code>inertial</code> class is used to control and access data from a V5 Inertial Sensor connected to a Smart Port.

The V5 Inertial Sensor measures how the robot is moving and turning. The gyroscope measures turning, such as heading, rotation, gyro rate, and orientation. The accelerometer measures changes in motion, such as speeding up or slowing down along the x-, y-, and z-axes.

## Class Constructors

```cpp
inertial(
  int32_t  index,
  turnType dir = turnType::right );
```

## Class Destructor

Destroys the <code>inertial</code> object and releases associated resources.

```cpp
~inertial();
```

## Parameters

| Parameter |    Type    | Description                                                                                                                       |
| :-------: | :--------: | :-------------------------------------------------------------------------------------------------------------------------------- |
| <code>index</code> | <code>int32_t</code> | The Smart Port that the Inertial Sensor is connected to, written as <code>PORTx</code>, where <code>x</code> is the port number (for example, <code>PORT1</code>). |
| <code>dir</code> | <code>turnType</code> | Optional. The direction that returns positive values:<ul><li><code>right</code> (default) — Right turns return positive values.</li><li><code>left</code> — Left turns return positive values.</li></ul> |

## Examples

```cpp
// Create an inertial instance for the V5 Inertial Sensor
inertial myInertial = inertial(
    PORT1,      // Smart Port 1
    right);     // dir
```

## Member Functions

The <code>inertial</code> class includes the following member functions:

- [<code>heading</code>](#heading) — Returns the direction the sensor is facing.
- [<code>rotation</code>](#rotation) — Returns how far the sensor has turned.
- [<code>setHeading</code>](#setheading) — Sets the sensor's current heading to a new heading value.
- [<code>setRotation</code>](#setrotation) — Sets the sensor's current rotation to a new rotation value.
- [<code>calibrate</code>](#calibrate) — Calibrates the Inertial Sensor.
- [<code>resetHeading</code>](#resetheading) — Resets the sensor's current heading to 0 degrees.
- [<code>resetRotation</code>](#resetrotation) — Resets the sensor's current rotation to 0 degrees.
- [<code>isCalibrating</code>](#iscalibrating) — Returns whether the Inertial Sensor is currently calibrating.
- [<code>changed</code>](#changed) — Registers a callback function that runs when the heading changes.
- [<code>installed</code>](#installed) — Returns whether the Inertial Sensor is installed.
- [<code>acceleration</code>](#acceleration) — Returns how quickly the sensor is speeding up or slowing down on the selected axis.
- [<code>gyroRate</code>](#gyrorate) — Returns how fast the sensor is rotating on the selected axis.
- [<code>orientation</code>](#orientation) — Returns the Inertial Sensor's roll, pitch, or yaw angle.
- [<code>collision</code>](#collision) — Registers a callback function that runs when a collision is detected.
- [<code>setTurnType</code>](#setturntype) — Sets which turn direction returns positive values.
- [<code>getTurnType</code>](#getturntype) — Returns which turn direction produces positive values.

Before calling any <code>inertial</code> member functions, an <code>inertial</code> instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
Inertial Sensor configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create an inertial instance for the V5 Inertial Sensor connected to Port 1.
inertial myInertial = inertial(PORT1);
```

### heading

A heading is the direction the sensor is facing, measured in degrees from 0 to 359.99. This function returns the sensor's current heading.

The starting heading is 0 degrees. If the sensor turns past 359.99 degrees, the heading wraps back to 0 degrees.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double heading( rotationUnits units = degrees );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter |       Type      | Description                                                                              |
| :-------: | :-------------: | :--------------------------------------------------------------------------------------- |
|  <code>units</code>  | <code>rotationUnits</code> | The heading unit:<ul><li><code>deg</code> / <code>degrees</code> (default) — degrees</li><li><code>turns</code> / <code>rev</code> — revolutions</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the current heading of the sensor in the specified units.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The heading value is wrapped between 0 and 359.99 degrees. Use [<code>rotation</code>](#rotation) to access the continuous rotation value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Turn, then show the current heading
Drivetrain.turnFor(right, 450, degrees);
Brain.Screen.print("%f", myInertial.heading(degrees));
```

### rotation

Returns the current rotation of the Inertial Sensor.

Rotation is how much the sensor has turned. Unlike heading, rotation can increase past 359.99 degrees or decrease below 0 degrees. For example, making two full turns to the right returns a rotation of 720 degrees. Turning one full turn to the left from 0 degrees returns a rotation of -360 degrees.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double rotation( rotationUnits units = degrees );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter |       Type       | Description |
| :-------: | :--------------: | :---------- |
| <code>units</code> | <code>rotationUnits</code> | The rotation unit:<ul><li><code>deg</code> / <code>degrees</code> (default) — degrees</li><li><code>turns</code> / <code>rev</code> — revolutions</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the current rotation in the specified units.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The rotation value is continuous and does not wrap between 0 and 359.99 degrees. Use [<code>heading</code>](#heading) to access the wrapped heading value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Turn, then show the current rotation
Drivetrain.turnFor(right, 450, degrees);
Brain.Screen.print("%f", myInertial.rotation(degrees));
```

### setHeading

A heading is the direction the sensor is facing, measured in degrees from 0 to 359.99. This function changes the Inertial Sensor's current heading to a new heading value.

For example, if the sensor has turned to face right, setting the heading to 0 degrees makes that right-facing position the new 0 degrees. Then the sensor can track other headings based on that new direction.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void setHeading( double value, rotationUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>value</code> | <code>double</code> | The heading value, in degrees, to set for the sensor. This can be a value from 0 to 359.99. |
| <code>units</code> | <code>rotationUnits</code> | The heading unit:<ul><li><code>deg</code> / <code>degrees</code> — degrees</li><li><code>turns</code> / <code>rev</code> — revolutions</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Turn the robot around
myInertial.setHeading(180, degrees);
Drivetrain.turnToHeading(0, degrees);
```

### setRotation

Rotation is how much the sensor has turned, measured in degrees. Unlike heading, rotation can increase past 359.99 degrees or decrease below 0 degrees. At the beginning of a project, the rotation value is set to 0 degrees. This function changes the Inertial Sensor's current rotation to a new value.

For example, if the sensor has made two full turns to the right, its rotation value will be 720 degrees. Setting the rotation to 0 degrees will reset that rotation from 720 to 0 degrees. Then the sensor can track rotations based on that new value.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void setRotation( double value, rotationUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>value</code> | <code>double</code> | The rotation value, in degrees, to set for the sensor. This can be an integer or a decimal. |
| <code>units</code> | <code>rotationUnits</code> | The rotation unit:<ul><li><code>deg</code> / <code>degrees</code> — degrees</li><li><code>turns</code> / <code>rev</code> — revolutions</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Turn the robot around
myInertial.setRotation(-180, degrees);
Drivetrain.turnToRotation(0, degrees);
```

### calibrate

Calibrates the Inertial Sensor.

Calibration helps the sensor measure turns correctly. Keep the sensor still during calibration. If the sensor moves during calibration, heading, rotation, gyro rate, and orientation values may not measure correctly.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void calibrate( );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The sensor should remain stationary while calibration is in progress.
- Use [<code>isCalibrating</code>](#iscalibrating) to determine when calibration has completed.

### resetHeading

Resets the Inertial Sensor's current heading to 0 degrees.

After this function is used, the sensor's current direction becomes the new 0 degree heading.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void resetHeading();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not take any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.


### resetRotation

Resets the Inertial Sensor's current rotation to 0 degrees.

After this function is used, the sensor tracks future turns from the new 0 degree rotation value.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void resetRotation();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not take any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

### isCalibrating

Returns whether the Inertial Sensor is currently calibrating.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
bool isCalibrating();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not take any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a Boolean indicating whether the Inertial Sensor is calibrating:

<ul>
  <li>
    <code>true</code> — The sensor is currently calibrating.
  </li>
  <li>
    <code>false</code> — The sensor is not currently calibrating.
  </li>
</ul>

### changed

Registers a callback function that runs when the heading value of the Inertial Sensor changes.

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
| <code>callback</code> | <code>void (*)(void)</code> | A pointer to a function that will be called when the heading value changes. The function must take no parameters and return <code>void</code>. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> // Display the heading when the Inertial Sensor's heading value changes.
> void onHeadingChanged() {
>   Brain.Screen.clearScreen();
>   Brain.Screen.setCursor(1, 1);
>   Brain.Screen.print("Heading: %.2f", myInertial.heading());
> }
> ```
>
> Register the callback inside <code>int main()</code>
> ```cpp
> int main() {
>   // Run onHeadingChanged when the Inertial Sensor's heading value changes.
>   myInertial.changed(onHeadingChanged);
> }
> ```

### installed

Returns whether the Inertial Sensor is installed and connected.

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

Returns a Boolean indicating whether the Inertial Sensor is installed and connected:
<ul>
  <li>
    <code>true</code> — The sensor is connected and responding.
  </li>
  <li>
    <code>false</code> — The sensor is not connected or not detected.
  </li>
</ul>

### acceleration

Acceleration is how quickly the sensor is speeding up or slowing down. This function returns the acceleration of the Inertial Sensor on the selected axis, from -4.0 G to 4.0 G.

A <code>G</code> is a unit used to measure acceleration. 1 G is about the acceleration you feel from gravity while sitting still. The value can be positive or negative depending on the direction of acceleration on the selected axis.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double acceleration( axisType axis );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>axis</code> | <code>axisType</code> | The axis to measure acceleration on:<ul><li><code>xaxis</code></li><li><code>yaxis</code></li><li><code>zaxis</code></li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the acceleration along the specified axis in G (gravitational units).

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Acceleration values are reported in units of <code>G</code>.

### gyroRate

Gyro rate is how fast the Inertial Sensor is rotating. This function returns the current rotation speed of the Inertial Sensor on the selected axis.

The value can be positive or negative depending on the direction the sensor is rotating on that axis.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double gyroRate( axisType axis, velocityUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>axis</code> | <code>axisType</code> | The axis to return the gyro rate from:<ul><li><code>xaxis</code></li><li><code>yaxis</code></li><li><code>zaxis</code></li></ul> |
| <code>units</code> | <code>velocityUnits</code> | The gyro rate unit:<ul><li><code>dps</code> — degrees per second</li><li><code>rpm</code> — revolutions per minute</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the current rotation speed along the specified axis in the selected units.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Display the rate of change of rotation while turning in dps
Drivetrain.turn(right);
wait(1, seconds);

Brain.Screen.print(myInertial.gyroRate(zaxis, dps));

Drivetrain.stop();
```

### orientation

Orientation is the Inertial Sensor's current angle on a selected axis. This function returns the current orientation of the Inertial Sensor for the specified axis.

The selected x-, y-, or z-axis corresponds to one of the sensor's orientation axes.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double orientation(
  axisType      axis,
  rotationUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>axis</code> | <code>axisType</code> | The axis for which orientation is returned:<ul><li><code>xaxis</code></li><li><code>yaxis</code></li><li><code>zaxis</code></li></ul> |
| <code>units</code> | <code>rotationUnits</code> | The orientation unit:<ul><li><code>deg</code> / <code>degrees</code> — degrees</li><li><code>turns</code> / <code>rev</code> — revolutions</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the selected orientation angle in the specified units.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
while (true) {
  Brain.Screen.clearScreen();
  Brain.Screen.setCursor(1,1);
  // Show the Inertial Sensor's orientation value
  // for roll in degrees
  double orient = myInertial.orientation(xaxis, deg);
  Brain.Screen.print("%f", orient);
  wait(0.1, seconds);
}
```

### collision

Registers a callback function that runs when the Inertial Sensor detects a sudden impact or collision.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void collision( void (* callback)(axisType, double, double, double) );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>callback</code> | <code>void (*)(axisType, double, double, double)</code> | A pointer to a function that will be called when a collision is detected. The callback function must accept the following parameters:<ul><li><code>axisType</code> — The axis on which the collision was detected.</li><li>Acceleration values at the time of impact, in order:<ul><li><code>double</code> — Acceleration along the x-axis (in G).</li><li><code>double</code> — Acceleration along the y-axis (in G).</li><li><code>double</code> — Acceleration along the z-axis (in G).</li></ul></li></ul>The function must return <code>void</code>. |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> // Display a message when the Inertial Sensor detects a collision.
> void onCollision(axisType axis, double x, double y, double z) {
>   Brain.Screen.print("Collision detected!");
> }
> ```
>
> Register the callback inside <code>int main()</code>
> ```cpp
> int main() {
>   // Run onCollision when the Inertial Sensor detects a collision.
>   myInertial.collision(onCollision);
> }
> ```

### setTurnType

Sets which turn direction returns positive values.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void setTurnType( turnType dir );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>dir</code> | <code>turnType</code> | The direction that returns positive values:<ul><li><code>right</code></li><li><code>left</code></li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- This setting affects how [<code>heading</code>](#heading) and [<code>rotation</code>](#rotation) report positive and negative values.
- Calling this function overrides the <code>dir</code> value specified when [constructing the <code>inertial</code> object](#class-constructors).

### getTurnType

Returns which turn direction produces positive values.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
turnType getTurnType();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not take any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>turnType</code> indicating which direction produces positive values:
<ul>
  <li>
    <code>right</code> — Clockwise rotation returns positive values.
  </li>
  <li>
    <code>left</code> — Counterclockwise rotation returns positive values.
  </li>
</ul>

<span style="font-size: 1.5rem; ">
  Notes
</span>

- This value is set during [construction of the <code>inertial</code> object](#class-constructors) or by calling [<code>setTurnType</code>](#setturntype).
