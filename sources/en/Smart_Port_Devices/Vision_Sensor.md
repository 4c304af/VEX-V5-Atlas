---
title: Vision Sensor | VEX V5 - C++ API
description: Reference documentation for the vision class in VEX V5 C++. Includes constructors, functions, parameters, notes, and member functions.
---

```{highlight} cpp
:linenothreshold: 5
```

# Vision Sensor

```{contents}
:local: true
```

## Introduction

The <code>vision</code> class is used to control and access data from the V5 Vision Sensor. This sensor detects and tracks Color Signatures within its field of view, allowing your robot to identify targets and respond to visual information in real time.

The Vision Sensor can detect multiple signature objects simultaneously and provides information such as object position, width, height, and center coordinates.

## Class Constructors

```cpp
vision(
  int32_t  index,
  uint8_t  bright,
  Args&... sigs );
```

## Class Destructor

Destroys the <code>vision</code> object and releases associated resources.

```cpp
~vision();
```

## Parameters

| Parameter | Type | Description |
|:---------:|:----:|:------------|
| <code>index</code> | <code>int32_t</code> | The Smart Port that the Vision Sensor is connected to, written as <code>PORTx</code>, where <code>x</code> is the port number (for example, <code>PORT1</code>). |
| <code>bright</code> | <code>uint8_t</code> | The brightness level of the Vision Sensor. |
| <code>sigs</code> | <code>vision::signature</code> or <code>vision::code</code> objects | One or more [<code>vision::signature</code>](#visionsignature) or [<code>vision::code</code>](#visioncode) objects to register with the sensor. |

## Related Classes

The Vision Sensor uses the following related classes:

- [<code>vision::signature</code>](#visionsignature) — Defines a Color Signature that the Vision Sensor can detect.
- [<code>vision::code</code>](#visioncode) — Defines a Color Code composed of multiple [<code>vision::signature</code>](#visionsignature) objects. Color codes allow the Vision Sensor to detect multi-color patterns in a specific order.

### vision::signature

The <code>vision::signature</code> class defines a Color Signature that the Vision Sensor can detect.

A Color Signature represents a unique color that the Vision Sensor can recognize. These signatures allow the sensor to detect and track objects based on their color. Once a Color Signature is configured, the sensor can identify objects with that specific color in its field of view.

Color Signatures are used with [<code>takeSnapshot</code>](#takesnapshot) to process and detect colored objects in real time.

When a Color Signature is configured using the Vision Sensor Utility, VEXcode automatically generates a corresponding <code>vision::signature</code> object. The generated object follows the naming format: <code>VisionSensorName__SignatureName</code>. For example: <code>Vision1__BLUEBOX</code>

This generated <code>vision::signature</code> object is passed directly to [<code>takeSnapshot</code>](#takesnapshot).

<span style="font-size: 1.5rem; ">
  Class Constructors
</span>

```cpp
vision::signature(
  int32_t id,
  int32_t uMin,
  int32_t uMax,
  int32_t uMean,
  int32_t vMin,
  int32_t vMax,
  int32_t vMean,
  float   range,
  int32_t type );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:---------:|:----:|:------------|
| <code>id</code> | <code>int32_t</code> | The signature ID number. |
| <code>uMin</code> | <code>int32_t</code> | Minimum value on the U color axis. |
| <code>uMax</code> | <code>int32_t</code> | Maximum value on the U color axis. |
| <code>uMean</code> | <code>int32_t</code> | Mean value on the U color axis. |
| <code>vMin</code> | <code>int32_t</code> | Minimum value on the V color axis. |
| <code>vMax</code> | <code>int32_t</code> | Maximum value on the V color axis. |
| <code>vMean</code> | <code>int32_t</code> | Mean value on the V color axis. |
| <code>range</code> | <code>float</code> | Range scale factor used for detection sensitivity. |
| <code>type</code> | <code>int32_t</code> | Signature type. |

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The values used to construct a <code>vision::signature</code> object are generated using the [Vision Sensor Utility](https://vision.vexcode.cloud/).
- Open the [Vision Sensor Utility](https://vision.vexcode.cloud/) to configure a Color Signature, and copy the generated constructor values into your program.

### vision::code

The <code>vision::code</code> class defines a Color Code that the Vision Sensor can detect.

A Color Code is a structured pattern made up of multiple [Color Signatures](#visionsignature) arranged in a specific order. These codes allow the Vision Sensor to recognize predefined multi-color patterns. Color Codes are useful for identifying complex objects or creating unique markers for autonomous navigation.

Color Codes are used with [<code>takeSnapshot</code>](#takesnapshot) to detect specific multi-color patterns in the sensor’s field of view.

When a Color Code is configured using the Vision Sensor Utility, VEXcode automatically generates a corresponding <code>vision::code</code> object. The generated object follows the naming format: <code>VisionSensorName__CodeName</code>. For example: <code>Vision1__BOXCODE</code>

This generated <code>vision::code</code> object is passed directly to [<code>takeSnapshot</code>](#takesnapshot).

<span style="font-size: 1.5rem; ">
  Class Constructors
</span>

<span style="font-size: 1.5rem;">
  Available Functions
</span>

> **__1__ —** Creates a Color Code from two signature ID values.
> ```cpp
> code(
>   int32_t sig1,
>   int32_t sig2 );
> ```

> **__2__ —** Creates a Color Code from three signature ID values.
> ```cpp
> code(
>   int32_t sig1,
>   int32_t sig2,
>   int32_t sig3 );
> ```

> **__3__ —** Creates a Color Code from four signature ID values.
> ```cpp
> code(
>   int32_t sig1,
>   int32_t sig2,
>   int32_t sig3,
>   int32_t sig4 );
> ```

> **__4__ —** Creates a Color Code from five signature ID values.
> ```cpp
> code(
>   int32_t sig1,
>   int32_t sig2,
>   int32_t sig3,
>   int32_t sig4,
>   int32_t sig5 );
> ```

> **__5__ —** Creates a Color Code from two <code>vision::signature</code> objects.
> ```cpp
> code(
>   signature &s1,
>   signature &s2 );
> ```

> **__6__ —** Creates a Color Code from three <code>vision::signature</code> objects.
> ```cpp
> code(
>   signature &s1,
>   signature &s2,
>   signature &s3 );
> ```

> **__7__ —** Creates a Color Code from four <code>vision::signature</code> objects.
> ```cpp
> code(
>   signature &s1,
>   signature &s2,
>   signature &s3,
>   signature &s4 );
> ```

> **__8__ —** Creates a Color Code from five <code>vision::signature</code> objects.
> ```cpp
> code(
>   signature &s1,
>   signature &s2,
>   signature &s3,
>   signature &s4,
>   signature &s5 );
> ```

<span style="font-size: 1.5rem;">
  Parameters
</span>

| Parameter | Type | Description |
|:---------:|:----:|:------------|
| <code>sig1</code>–<code>sig5</code> | <code>int32_t</code> | [<code>vision::signature</code>](#visionsignature) <code>id</code> values used to build the Color Code. |
| <code>s1</code>–<code>s5</code> | <code>signature &</code> | References to previously created [<code>vision::signature</code>](#visionsignature) objects used to build the Color Code. |

<span style="font-size: 1.5rem; ">
  Notes
</span>

- A Color Code can be created using 2 to 5 Color Signatures.

## Examples

```cpp
// Create Color Signatures
vision::signature Vision1__REDBOX = vision::signature(
    1,      // signature id
    10121,  // uMin
    10757,  // uMax
    10439,  // uMean
    -1657,  // vMin
    -1223,  // vMax
    -1440,  // vMean
    2.5,    // range
    1 );    // type

vision::signature Vision1__BLUEBOX = vision::signature(
    2,      // signature id
    -4479,  // uMin
    -3277,  // uMax
    -3878,  // uMean
    5869,   // vMin
    7509,   // vMax
    6689,   // vMean
    2.5,    // range
    1 );    // type

// Create a Color Code from two signatures
vision::code Vision1__BOXCODE = vision::code(
    Vision1__REDBOX,  // first signature
    Vision1__BLUEBOX  // second signature
);

// Create the Vision Sensor instance
vision Vision1 = vision(
    PORT1,                  // Smart Port
    50,                     // brightness
    Vision1__REDBOX,        // signature
    Vision1__BOXCODE );     // Color Code
```

## Member Functions

The <code>vision</code> class includes the following member functions:

- [<code>takeSnapshot</code>](#takesnapshot) — Captures data for a specific Color Signature or Color Code.
- [<code>installed</code>](#installed) — Whether the Vision Sensor is connected to the V5 Brain.

To access detected object data after calling [<code>takeSnapshot</code>](#takesnapshot), use the available [**Properties**](#properties).

Before calling any <code>vision</code> member functions, a <code>vision</code> instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
Vision Sensor configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */


// Create Color Signatures
vision::signature Vision1__REDBOX = vision::signature(
    1,      // signature id
    10121,  // uMin
    10757,  // uMax
    10439,  // uMean
    -1657,  // vMin
    -1223,  // vMax
    -1440,  // vMean
    2.5,    // range
    1 );    // type

vision::signature Vision1__BLUEBOX = vision::signature(
    2,      // signature id
    -4479,  // uMin
    -3277,  // uMax
    -3878,  // uMean
    5869,   // vMin
    7509,   // vMax
    6689,   // vMean
    2.5,    // range
    1 );    // type

// Create a Color Code from two signatures
vision::code Vision1__BOXCODE = vision::code(
    Vision1__REDBOX,  // first signature
    Vision1__BLUEBOX  // second signature
);

// Create the Vision Sensor instance
vision Vision1 = vision(
    PORT1,                  // Smart Port
    50,                     // brightness
    Vision1__REDBOX,        // signature
    Vision1__BOXCODE );     // Color Code
```

### takeSnapshot

```{vexcode}
id: v5_vision_take_snapshot
```

Captures an image from the Vision Sensor, processes it based on the signature, and updates the <code>objects</code> array. This method can also limit the amount of objects captured in the snapshot.

The <code>objects</code> array stores objects ordered from largest to smallest by width, starting at index 0. Each object's [properties](#properties) can be accessed using its index. If no matching objects are detected, [<code>objectCount</code>](#objectcount) will be 0 and <code>objects[i].exists</code> will be false.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Takes a snapshot and searches for objects matching the specified signature ID.
> ```cpp
> int32_t takeSnapshot( uint32_t id );
> ```

> **__2__ —** Takes a snapshot and searches for objects matching the specified <code>vision::code</code> object.
> ```cpp
> int32_t takeSnapshot( code &cc );
> ```

> **__3__ —** Takes a snapshot and searches for objects matching the specified <code>vision::signature</code> object.
> ```cpp
> int32_t takeSnapshot( signature &sig );
> ```

> **__4__ —** Takes a snapshot and stores only the largest specified number of objects matching the signature ID.
> ```cpp
> int32_t takeSnapshot( uint32_t id, uint32_t count );
> ```

> **__5__ —** Takes a snapshot and stores only the largest specified number of objects matching the specified <code>vision::code</code> object.
> ```cpp
> int32_t takeSnapshot( code &cc, uint32_t count );
> ```

> **__6__ —** Takes a snapshot and stores only the largest specified number of objects matching the specified <code>vision::signature</code> object.
> ```cpp
> int32_t takeSnapshot( signature &sig, uint32_t count );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:---------:|:----:|:------------|
| <code>id</code> | <code>uint32_t</code> | The signature ID number to search for. |
| <code>cc</code> | <code>code &</code> | A reference to a <code>vision::code</code> object to search for. |
| <code>sig</code> | <code>signature &</code> | A reference to a <code>vision::signature</code> object to search for. |
| <code>count</code> | <code>uint32_t</code> | The maximum number of objects to detect. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns an <code>int32_t</code> representing the number of matching objects detected.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The Vision Sensor must take a snapshot before object data can be accessed.
- When <code>count</code> is specified, only the largest detected objects (up to the specified amount) are stored.

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
while (true) {
  // Display if a blue object is detected
  Vision1.takeSnapshot(Vision1__BLUEBOX);

  Brain.Screen.clearScreen();
  Brain.Screen.setCursor(1, 1);

  if (Vision1.objects[0].exists) {
    Brain.Screen.print("Blue detected");
  } 
  else {
    Brain.Screen.print("No blue");
  }

  wait(0.5, seconds);
}
```

```cpp
// Display when a blue object is detected
while (true) {
  Brain.Screen.setCursor(1, 1);
  Brain.Screen.clearLine(1);

  Vision1.takeSnapshot(Vision1__BLUEBOX);

  if (Vision1.objects[0].exists) {
    Brain.Screen.print("Color detected!");
  }

  wait(100, msec); 
}
```

```cpp
// Display when BOXCODE is detected
while (true) {
  Brain.Screen.setCursor(1, 1);
  Brain.Screen.clearLine(1);

  Vision1.takeSnapshot(Vision1__BOXCODE);

  if (Vision1.objects[0].exists) {
    Brain.Screen.print("Code detected!");
  }
  wait( 100, msec);
}
```

### installed

Returns whether the Vision Sensor is connected to the V5 Brain.

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

Returns a Boolean indicating whether the Vision Sensor is connected:
<ul>
  <li>
    <code>true</code> — The Vision Sensor is connected.
  </li>
  <li>
    <code>false</code> — The Vision Sensor is not connected.
  </li>
</ul>


## Properties

Calling [<code>takeSnapshot</code>](#takesnapshot) updates the Vision Sensor’s detection results. Each snapshot refreshes the <code>objects</code> array, which contains the detected objects for the requested Color Signature or Color Code.

Vision Sensor data is accessed through properties of objects stored in <code>Vision1.objects[index]</code>, where <code>index</code> begins at <code>0</code>.

The Vision Sensor image resolution is 316 by 212 pixels. Object position and size properties are reported in pixel units relative to the sensor’s current view.

The following properties are available:

- [<code>largestObject</code>](#largestobject) — Selects the largest detected object from the most recent snapshot.
- [<code>objectCount</code>](#objectcount) — Returns the number of valid objects stored in <code>objects</code>.
- [<code>objects</code>](#objects) — Array of detected objects updated by <code>takeSnapshot</code>.
- [<code>.exists</code>](#exists) — Whether the object entry contains valid data.
- [<code>.width</code>](#width) — Width of the detected object in pixels.
- [<code>.height</code>](#height) — Height of the detected object in pixels.
- [<code>.centerX</code>](#centerx) — X position of the object’s center in pixels.
- [<code>.centerY</code>](#centery) — Y position of the object’s center in pixels.
- [<code>.originX</code>](#originx) — X position of the object’s top-left corner in pixels.
- [<code>.originY</code>](#originy) — Y position of the object’s top-left corner in pixels.
- [<code>.angle</code>](#angle) — Orientation of the detected Color Code in degrees (when applicable).

### largestObject

```{vexcode}
id: v5_vision_largest_object
```

Retrieves the largest detected object from the <code>objects</code> array.

This method can be used to always get the largest object from <code>objects</code> without specifying an index.

<span style="font-size: 1.5rem;">
  Syntax
</span>

```cpp
VisionSensor.largestObject
```

<span style="font-size: 1.5rem;">
  Components
</span>

| Component      | Description                                                                            |
| :------------- | :------------------------------------------------------------------------------------- |
| <code>VisionSensor</code> | The name of your Vision Sensor instance.                                               |

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
int main() {
  // Initializing Robot Configuration. DO NOT REMOVE!
  vexcodeInit();

  // Display the largest detected object's width
  while (true) {
    Vision1.takeSnapshot(Vision1__BLUEBOX);

    Brain.Screen.clearScreen();
    Brain.Screen.setCursor(1, 1);

    if (Vision1.objects[0].exists) {
      Brain.Screen.print("%d", Vision1.largestObject.width);
    } 
    wait(0.5, seconds);
  }
}
```

### objectCount

```{vexcode}
id: v5_vision_object_count
```

Returns the number of items inside the <code>objects</code> array as an integer.

<span style="font-size: 1.5rem;">
  Syntax
</span>

```cpp
VisionSensor.objectCount
```

<span style="font-size: 1.5rem;">
  Components
</span>

| Component      | Description                                                                            |
| :------------- | :------------------------------------------------------------------------------------- |
| <code>VisionSensor</code> | The name of your Vision Sensor instance.                                               |

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
int main() {
  // Initializing Robot Configuration. DO NOT REMOVE!
  vexcodeInit();

  // Display how many blue objects are detected
  while (true) {
    Vision1.takeSnapshot(Vision1__BLUEBOX);

    Brain.Screen.clearScreen();
    Brain.Screen.setCursor(1, 1);

    Brain.Screen.print("Object Count: %d", Vision1.objectCount);

    wait(0.5, seconds);
  }
}
```

### objects

```{vexcode}
id: v5_vision_objects
```

<code>objects</code> is an array containing the detected objects from the most recent call to [<code>takeSnapshot</code>](#takesnapshot).

Each element in the array represents a detected object and provides access to its properties, such as [<code>width</code>](#width), [<code>height</code>](#height), [<code>centerX</code>](#centerx), and more.

Objects are ordered from largest to smallest (by width), beginning at index <code>0</code>.

<span style="font-size: 1.5rem; ">
  Syntax
</span>

```cpp
VisionSensor.objects[index].property
```

<span style="font-size: 1.5rem; ">
  Components
</span>

| Component      | Description                                                                            |
| :------------- | :------------------------------------------------------------------------------------- |
| <code>VisionSensor</code> | The name of your Vision Sensor instance.                                               |
| <code>index</code>        | The object index in the array. Index begins at <code>0</code>.                                    |
| <code>property</code>     | One of the available [object properties](#properties). |


#### .exists

```{vexcode}
id: v5_vision_vision_object_exists
```

<code>.exists</code> returns whether the specified object index contains a valid detected object.

<span style="font-size: 1.5rem;"> Access </span>

```cpp
SensorName.objects[index].exists
```

<span style="font-size: 1.5rem;"> Return Values </span>

Returns a Boolean indicating whether the specified object index contains a valid detected object:
<ul>
  <li>
    <code>true</code> — A valid object exists at the specified index.
  </li>
  <li>
    <code>false</code> — No object exists at the specified index.
  </li>
</ul>

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
// Display when a blue object is detected
while (true) {
  Brain.Screen.setCursor(1, 1);
  Brain.Screen.clearLine(1);

  Vision1.takeSnapshot(Vision1__BLUEBOX);

  if (Vision1.objects[0].exists) {
    Brain.Screen.print("Color detected!");
  }

  wait(100, msec); 
}
```

#### .width

```{vexcode}
id: v5_vision_vision_object_width
```

<code>.width</code> returns the width of the detected object.

<span style="font-size: 1.5rem;"> Access </span>

```cpp
SensorName.objects[index].width
```

<span style="font-size: 1.5rem;"> Return Values </span>

Returns an <code>int</code> representing the width of the detected object in pixels. The value ranges from <code>1</code> to <code>316</code>.

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
// Approach an object until it's at least 100 pixels wide
while (true) {
  Vision1.takeSnapshot(Vision1__BLUEBOX);
  if (Vision1.objects[0].exists && Vision1.objects[0].width < 100) {
    Drivetrain.driveFor(forward, 10, mm);
  } 
  else {
    Drivetrain.stop();
  }
  wait(0.5, seconds);
}
```

#### .height

```{vexcode}
id: v5_vision_vision_object_height
```

<code>.height</code> returns the height of the detected object.

<span style="font-size: 1.5rem;"> Access </span>

```cpp
SensorName.objects[index].height
```

<span style="font-size: 1.5rem;"> Return Values </span>

Returns an <code>int</code> representing the height of the detected object in pixels. The value ranges from <code>1</code> to <code>212</code>.

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
// Approach an object until it's at least 100 pixels tall
while (true) {
  Vision1.takeSnapshot(Vision1__BLUEBOX);

  if (Vision1.objects[0].exists && Vision1.objects[0].height < 100) {
    Drivetrain.driveFor(forward, 10, mm);
  } 
  else {
    Drivetrain.stop();
  }
  wait(0.5, seconds);  // Avoid over-processing
}
```

#### .centerX

```{vexcode}
id: v5_vision_vision_object_centerX
```

<code>.centerX</code> returns the x-coordinate of the center of the detected object.

<span style="font-size: 1.5rem;"> Access </span>

```cpp
SensorName.objects[index].centerX
```

<span style="font-size: 1.5rem;"> Return Values </span>

Returns an <code>int</code> representing the x-coordinate of the object’s center in pixels. The value ranges from <code>0</code> to <code>316</code>.

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
// Turn until an object is directly in front of the sensor
Drivetrain.setTurnVelocity(10, percent);
Drivetrain.turn(right);
while (true) {
  Vision1.takeSnapshot(Vision1__BLUEBOX);
  if (Vision1.objects[0].exists) {
    int centerX = Vision1.largestObject.centerX;
    if (140 < centerX && centerX < 180) {
      Drivetrain.stop();
    }
  }
  wait(0.5, seconds);
}
```

#### .centerY

```{vexcode}
id: v5_vision_vision_object_centerY
```

<code>.centerY</code> returns the y-coordinate of the center of the detected object.

<span style="font-size: 1.5rem;"> Access </span>

```cpp
SensorName.objects[index].centerY
```

<span style="font-size: 1.5rem;"> Return Values </span>

Returns an <code>int</code> representing the y-coordinate of the object’s center in pixels. The value ranges from <code>0</code> to <code>212</code>.

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
// Approach an object until it's at least 90 pixels tall
while (true) {
  Vision1.takeSnapshot(Vision1__BLUEBOX);

  if (Vision1.objects[0].exists) {
    if (Vision1.objects[0].centerY < 90) {
      Drivetrain.drive(forward);
    } else {
      Drivetrain.stop();
    }
  } else {
    Drivetrain.stop();
  }
  wait(50, msec);
}
```

#### .originX

```{vexcode}
id: v5_vision_vision_object_originX
```

<code>.originX</code> returns the x-coordinate of the top-left corner of the detected object's bounding box.

<span style="font-size: 1.5rem;"> Access </span>

```cpp
SensorName.objects[index].originX
```

<span style="font-size: 1.5rem;"> Return Values </span>

Returns an <code>int</code> representing the x-coordinate of the top-left corner of the object’s bounding box in pixels. The value ranges from <code>0</code> to <code>316</code>.

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
// Display if an object is to the left or the right
while (true) {
  Brain.Screen.clearScreen();
  Brain.Screen.setCursor(1, 1);
  Vision1.takeSnapshot(Vision1__BLUEBOX);
  if (Vision1.objects[0].exists) {
    if (Vision1.objects[0].originX < 160) {
      Brain.Screen.print("To the left!");
    }
    else {
      Brain.Screen.print("To the right!");
    }
  }
  wait(0.5, seconds); 
}
```

#### .originY

```{vexcode}
id: v5_vision_vision_object_originY
```

<code>.originY</code> returns the y-coordinate of the top-left corner of the detected object's bounding box.

<span style="font-size: 1.5rem;"> Access </span>

```cpp
SensorName.objects[index].originY
```

<span style="font-size: 1.5rem;"> Return Values </span>

Returns an <code>int</code> representing the y-coordinate of the top-left corner of the object’s bounding box in pixels. The value ranges from <code>0</code> to <code>212</code>.

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
// Display if an object is close or far
while (true) {
  Brain.Screen.clearScreen();
  Brain.Screen.setCursor(1, 1);
  Vision1.takeSnapshot(Vision1__BLUEBOX);
  if (Vision1.objects[0].exists) {
    if (Vision1.objects[0].originY < 80) {
      Brain.Screen.print("Far");
    } else {
      Brain.Screen.print("Close");
    }
  }
  wait(0.5, seconds);
}
```

#### .angle

```{vexcode}
id: v5_vision_vision_object_angle
```

<code>.angle</code> returns the orientation of the detected Color Code.

<span style="font-size: 1.5rem;"> Access </span>

```cpp
SensorName.objects[index].angle
```

<span style="font-size: 1.5rem;"> Return Values </span>

Returns a <code>double</code> representing the orientation of the detected Color Code in degrees. The value ranges from <code>0</code> to <code>359.9</code>.

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
// Turn left or right depending on how a configured
// Color Code is rotated
while (true) {
  Vision1.takeSnapshot(Vision1__BOXCODE);
  if (Vision1.objects[0].exists) {
    double angle = Vision1.objects[0].angle;
    if (70 < angle && angle < 110) {
      Drivetrain.turnFor(right, 45, degrees);
    }
    else if (250 < angle && angle < 290) {
      Drivetrain.turnFor(left, 45, degrees);
    }
    else {
      Drivetrain.stop();
    }
  }
  wait(0.5, seconds);
}
```