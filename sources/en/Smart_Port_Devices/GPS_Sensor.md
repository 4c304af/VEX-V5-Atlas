---
title: GPS Sensor | VEX V5 - C++ API
description: Reference documentation for the gps class in VEX V5 C++. Includes constructors, functions, parameters, notes, and member functions.
---

```{highlight} cpp
:linenothreshold: 5
```

# GPS Sensor

```{contents}
:local: true
```

## Introduction

The <code>gps</code> class is used to control and access data from the V5 GPS (Game Positioning System™) Sensor. This sensor provides accurate position and orientation tracking for a robot on the VEX Field. It uses the GPS Field Code around the Field’s perimeter to calculate the robot’s X and Y coordinates and heading in real time.

The GPS Sensor returns the robot’s position using a reference point automatically calculated from the offsets entered when configuring the GPS Sensor in the Devices window.

For more information about the GPS Sensor, read [Using the GPS Sensor with VEX V5](https://kb.vex.com/hc/en-us/articles/360061932711-Using-the-GPS-Sensor-with-VEX-V5) in the VEX Library.

The reference point acts as the GPS Sensor’s own (0, 0) position where all coordinates, headings, and movements returned by GPS methods are relative to this configured point.

![The VEX V5 GPS Sensor.](/_static/img/sensing/gps.png)

## Class Constructors

> **__1__ —** Creates a <code>gps</code> object on the specified Smart Port using the default origin (0, 0).
> ```cpp
> gps(
>   int32_t  index,
>   double   heading_offset = 0,
>   turnType dir = right );
> ```

> **__2__ —** Creates a <code>gps</code> object on the specified Smart Port and defines a custom origin position.
> ```cpp
> gps(
>   int32_t       index,
>   double        ox,
>   double        oy,
>   distanceUnits units = mm,
>   double        heading_offset = 0,
>   turnType      dir = right );
> ```

## Class Destructor

Destroys the <code>gps</code> object and releases associated resources.

```cpp
~gps();
```

## Parameters

| Parameter | Type | Description |
|:---------:|:----:|:------------|
| <code>index</code> | <code>int32_t</code> | The Smart Port that the GPS Sensor is connected to, written as <code>PORTx</code>, where <code>x</code> is the port number (for example, <code>PORT1</code>). |
| <code>ox</code> | <code>double</code> | The X-coordinate of the origin position. |
| <code>oy</code> | <code>double</code> | The Y-coordinate of the origin position. |
| <code>units</code> | <code>distanceUnits</code> | The unit of measurement used for <code>ox</code> and <code>oy</code>:<ul><li><code>mm</code> (default) — millimeters</li><li><code>distanceUnits::in</code> / <code>inches</code> — inches</li><li><code>distanceUnits::cm</code> — centimeters</li></ul>  |
| <code>heading_offset</code> | <code>double</code> | The GPS Sensor's rotational offset in degrees, from 0.00 to 359.99. Default is 0. |
| <code>dir</code> | <code>turnType</code> | The direction that will return positive heading values:<ul><li><code>right</code> (default)</li><li><code>left</code></li></ul> |

## Examples

```cpp
// Create the gps instance
gps GPS1 = gps(
    PORT1,      // Smart Port 1
    180);       // heading_offset
```

<hr>

```cpp
// Create the gps instance
gps GPS1 = gps(
    PORT1,   // Smart Port 1
    50.00,   // ox
    100.00,  // oy
    mm,      // units
    180 );   // heading_offset
```

## Member Functions

The <code>gps</code> class includes the following member functions:

- [<code>calibrate</code>](#calibrate) — Calibrates the GPS Sensor.
- [<code>setOrigin</code>](#setorigin) — Sets the origin position for the GPS coordinate system.
- [<code>setLocation</code>](#setlocation) — Sets the current location and heading of the GPS Sensor.
- [<code>xPosition</code>](#xposition) — Returns the current X position.
- [<code>yPosition</code>](#yposition) — Returns the current Y position.
- [<code>heading</code>](#heading) — Returns the current heading.
- [<code>acceleration</code>](#acceleration) — Returns linear acceleration along the specified axis.
- [<code>gyroRate</code>](#gyrorate) — Returns the angular velocity for the specified axis.
- [<code>orientation</code>](#orientation) — Returns the orientation for the specified axis.
- [<code>quality</code>](#quality) — Returns the current GPS signal quality.
- [<code>changed</code>](#changed) — Registers a callback function that runs when GPS data changes.

Before calling any <code>gps</code> member functions, a <code>gps</code> instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
GPS Sensor configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */

// Create the gps instance in Smart Port 1
gps GPS1 = gps(PORT1);
```

## Class Methods

### calibrate

Calibrates the GPS Sensor. This will set the GPS’ configured heading (according to its angle offset) as the current heading of the Drivetrain.

The GPS Sensor must remain still during the calibration process.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void calibrate();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not take any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Turn to face the lower Field wall using data from the GPS Sensor.
GPS1.calibrate();
Drivetrain.turnToHeading(180, degrees)
```

### setOrigin

Sets the origin of the GPS coordinate system.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Sets the origin to the specified X and Y position.
> ```cpp
> void setOrigin( 
>   double        x, 
>   double        y, 
>   distanceUnits units = mm );
> ```

> **__2__ —** Sets the origin to the sensor’s current position.
> ```cpp
> void setOrigin();
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>x</code> | <code>double</code> | The X-coordinate of the new origin position. |
| <code>y</code> | <code>double</code> | The Y-coordinate of the new origin position. |
| <code>units</code> | <code>distanceUnits</code> | The unit of measurement used for <code>x</code> and <code>y</code>:<ul><li><code>mm</code> (default) — millimeters</li><li><code>distanceUnits::cm</code> — centimeters</li><li><code>distanceUnits::in</code> — inches</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Changing the origin affects values returned by [<code>xPosition</code>](#xposition) and [<code>yPosition</code>](#yposition).

### setLocation

Sets the current GPS position and heading.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Sets the current location using specified distance and rotation units.
> ```cpp
> void setLocation(
>   double        x,
>   double        y,
>   distanceUnits units = mm,
>   double        angle = 0,
>   rotationUnits units_r = degrees );
> ```

> **__2__ —** Sets the current location using millimeters and degrees.
> ```cpp
> void setLocation( double x, double y, double angle );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>x</code> | <code>double</code> | The X-coordinate of the current location. |
| <code>y</code> | <code>double</code> | The Y-coordinate of the current location. |
| <code>units</code> | <code>distanceUnits</code> | The unit of measurement used for <code>x</code> and <code>y</code>:<ul><li><code>mm</code> (default) — millimeters</li><li><code>distanceUnits::in</code> / <code>inches</code> — inches</li><li><code>distanceUnits::cm</code> — centimeters</li></ul> |
| <code>angle</code> | <code>double</code> | The heading value for the current location. |
| <code>units_r</code> | <code>rotationUnits</code> | The unit of measurement used for <code>angle</code>:<ul><li><code>deg</code> (default) — degrees</li><li><code>rev</code> — revolutions</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Calling this function updates the internal position and heading values reported by [<code>xPosition</code>](#xposition), [<code>yPosition</code>](#yposition), and [<code>heading</code>](#heading).

### xPosition

Returns the current X position of the GPS Sensor.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double xPosition( distanceUnits units = distanceUnits::mm );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>units</code> | <code>distanceUnits</code> | The unit of measurement for the returned X position:<ul><li><code>mm</code> (default) — millimeters</li><li><code>distanceUnits::cm</code> — centimeters</li><li><code>distanceUnits::in</code> — inches</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the x positional offset from the origin in the specified units.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The X position is measured relative to the current origin.
- The origin may be changed using [<code>setOrigin</code>](#setorigin).

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Drive slowly towards the center of the Field
Drivetrain.setDriveVelocity(20.0, percent);
Drivetrain.drive(forward);
// Stop driving when the GPS returns an x position
// near the center of the Field
waitUntil((GPS1.xPosition(mm) < 0.0));
Drivetrain.stop();
```

### yPosition

Returns the current Y position of the GPS Sensor.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double yPosition( distanceUnits units = distanceUnits::mm );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>units</code> | <code>distanceUnits</code> | The unit of measurement for the returned Y position:<ul><li><code>mm</code> (default) — millimeters</li><li><code>distanceUnits::cm</code> — centimeters</li><li><code>distanceUnits::in</code> — inches</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the Y positional offset from the origin in the specified units.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The Y position is measured relative to the current origin.
- The origin may be changed using <code>setOrigin()</code>.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Drive slowly towards the center of the Field
Drivetrain.setDriveVelocity(20.0, percent);
Drivetrain.drive(forward);
// Stop driving when the GPS reports an y position
// near the center of the Field
waitUntil((GPS1.yPosition(mm) < 0.0));
Drivetrain.stop();
```

### heading

Returns the current heading (yaw angle) of the GPS Sensor.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double heading( rotationUnits units = rotationUnits::deg );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>units</code> | <code>rotationUnits</code> | The unit of measurement for the returned heading value:<ul><li><code>deg</code> (default) — degrees</li><li><code>rev</code> — revolutions</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the current heading in the specified units.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The heading value is wrapped between 0 and 360 degrees.
- The positive rotation direction is determined by the [<code>dir</code> parameter specified during construction](#class-constructors).

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Turn slowly to face the right wall
Drivetrain.setTurnVelocity(20.0, percent);
Drivetrain.turn(right);
// Stop turning when the GPS reports a heading 
// greater than 90 degrees
waitUntil((GPS1.heading() > 90.0));
Drivetrain.stop();
```

### acceleration

Returns the linear acceleration measured by the GPS Sensor along the specified axis.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double acceleration( 
  axisType axis );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>axis</code> | <code>axisType</code> | The axis for which acceleration will be returned:<ul><li><code>xaxis</code></li><li><code>yaxis</code></li><li><code>zaxis</code></li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the acceleration along the specified axis in G (gravitational units).

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Acceleration values are reported in units of G, where 1 G is equal to the acceleration due to gravity at Earth's surface.

### gyroRate

Returns the angular velocity measured by the GPS Sensor along the specified axis.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double gyroRate( 
  axisType      axis, 
  velocityUnits units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>axis</code> | <code>axisType</code> | The axis for which angular velocity will be returned:<ul><li><code>xaxis</code></li><li><code>yaxis</code></li><li><code>zaxis</code></li></ul> |
| <code>units</code> | <code>velocityUnits</code> | The unit of measurement for the returned angular velocity:<ul><li><code>dps</code> — degrees per second</li><li><code>rpm</code> — revolutions per minute</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the angular velocity along the specified axis in the selected units.

### orientation

Returns the orientation angle of the GPS Sensor for the specified axis.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double orientation( 
  orientationType axis, 
  rotationUnits   units );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>axis</code> | <code>orientationType</code> | The orientation axis to retrieve:<ul><li><code>roll</code></li><li><code>pitch</code></li><li><code>yaw</code></li></ul> |
| <code>units</code> | <code>rotationUnits</code> | The unit of measurement for the returned orientation value:<ul><li><code>deg</code> — degrees</li><li><code>rev</code> — revolutions</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the orientation of the specified axis in the selected units.

### quality

Returns the perceived GPS signal quality.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
int32_t quality();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not take any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns an <code>int32_t</code> representing the GPS signal quality as a percentage:

| Possible Values | Description |
|:--------------:|-------------|
| <code>100</code> | All reported positional and heading data from the GPS Sensor is valid. |
| <code>~90</code> | Positional data is no longer being calculated directly from the GPS Field Code and is instead being estimated through alternative means. |
| <code>0 – 80</code> | Only heading values are valid. As time passes without sufficient scanning of the GPS Field Code, signal quality continues to decrease until <code>0</code>, at which point GPS data is effectively frozen and no longer valid. |

### changed

Registers a callback function that runs when the GPS heading value changes.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void changed( 
  void (* callback)(void) );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>callback</code> | <code>void (*)(void)</code> | A pointer to a function that will be called when the GPS heading value changes. The function must take no parameters and return <code>void</code>. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.
