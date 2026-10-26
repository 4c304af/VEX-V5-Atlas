---
title: AI Vision Sensor | VEX V5 - C++ API
description: Reference documentation for the aivision class in VEX V5 C++. Includes constructors, functions, parameters, notes, and member functions.
---

```{highlight} cpp
:linenothreshold: 5
```

# AI Vision Sensor

```{contents}
:local: true
```

## Introduction

The <code>aivision</code> class is used to control and access data from the V5 AI Vision Sensor. The AI Vision Sensor can detect:

- AI Classifications (such as game objects)
- AprilTag IDs
- Custom Color Signatures
- Custom Color Codes

It provides object data including position, size, orientation, classification ID, and confidence score.

The sensor processes visual information using an onboard AI model selected in the **AI Vision Utility** within VEXcode. The selected model determines which AI Classifications the sensor can detect. When using VS Code, the AI model must first be configured in VEXcode before it can be used in your program. Detected objects are returned through the [<code>objects</code>](#objects) array after [<code>takeSnapshot</code>](#takesnapshot) is called.

## Class Constructors

```cpp
aivision(
  int32_t index,
  Args&... sigs );
```

## Parameters

|      Parameter     |                              Type                              | Description                                                                                |
| :----------------: | :------------------------------------------------------------: | :------------------------------------------------------------------------------- |
| <code>index</code> |                      <code>int32_t</code>                      | The Smart Port that the AI Vision Sensor is connected to, written as <code>PORTx</code>, where <code>x</code> is the port number (for example, <code>PORT1</code>).                 |
|  <code>sigs</code> | <code>colordesc</code>, <code>codedesc</code>, or AI constants | One or more detection types to register with the sensor:<ul><li><code>aivision::ALL_AIOBJS</code> — All AI Classifications</li><li><code>aivision::ALL_TAGS</code> — All AprilTag IDs</li><li><code>aivision::colordesc</code> — Custom Color Signature</li><li><code>aivision::codedesc</code> — Custom Color Code</li></ul> |

## Related Classes

The AI Vision Sensor uses the following related classes:

- [<code>aivision::colordesc</code>](#aivisioncolordesc) — Defines a Color Signature that the AI Vision Sensor can detect.
- [<code>aivision::codedesc</code>](#aivisioncodedesc) — Defines a Color Code composed of multiple <code>aivision::colordesc</code> objects.

### aivision::colordesc

The <code>aivision::colordesc</code> class defines a Color Signature for the AI Vision Sensor.

A Color Signature represents a specific color that the AI Vision Sensor can detect. These signatures allow the sensor to identify and track objects based on color.

Up to seven Color Signatures can be stored on an AI Vision Sensor at one time.

Color Signatures are used with [<code>takeSnapshot</code>](#takesnapshot) to detect matching colored objects in real time.

<span style="font-size: 1.5rem;"> Class Constructor </span>

```cpp
aivision::colordesc(
  int32_t index,
  uint8_t red,
  uint8_t green,
  uint8_t blue,
  float   hangle,
  float   hdsat );
```

<span style="font-size: 1.5rem;"> Parameters </span>

|      Parameter      |         Type         | Description                                                                                                   |
| :-----------------: | :------------------: | :------------------------------------------------------------------------------------------------------------ |
|  <code>index</code> | <code>int32_t</code> | The Color Signature index (1–7). Creating two signatures with the same index will overwrite the previous one. |
|   <code>red</code>  | <code>uint8_t</code> | The red value from 0 – 255.                                                                                            |
|  <code>green</code> | <code>uint8_t</code> | The green value from 0 – 255.                                                                                          |
|  <code>blue</code>  | <code>uint8_t</code> | The blue value from 0 – 255.                                                                                           |
| <code>hangle</code> | <code>float</code> | The allowable hue variance from 1 – 40 degrees.                                                                        |
|  <code>hdsat</code> |  <code>float</code> | The allowable saturation deviation from 0.10 – 1.00.                                                                   |

<span style="font-size: 1.5rem;"> Notes </span>

- Creating two signatures with the same <code>index</code> will cause the later one to replace the earlier signature.
- The <code>hangle</code> parameter represents the allowable hue variance on a circular color wheel. Hue values correspond to degrees around the wheel (for example, red near 0°, green near 120°, and blue near 240°). Larger values allow a wider range of color variation to be detected.

![A color wheel showing the range of colors from 0 to 359, where red is 0, green is 120, and blue is 240.](/_static/img/screen/hue_range.png)

### aivision::codedesc

The <code>aivision::codedesc</code> class defines a Color Code for the AI Vision Sensor.

A Color Code is a structured pattern made up of multiple Color Signatures arranged in a specific order. These codes allow the AI Vision Sensor to recognize predefined multi-color patterns.

Up to eight Color Codes can be stored on an AI Vision Sensor at one time.

Color Codes are used with [<code>takeSnapshot</code>](#takesnapshot) to detect specific multi-color patterns.

<span style="font-size: 1.5rem;"> Class Constructors </span>

> **__1__ —** Creates a Color Code from two color descriptors.
> ```cpp
> aivision::codedesc(
>   int32_t index,
>   aivision::colordesc &sig1,
>   aivision::colordesc &sig2 );
> ```

> **__2__ —** Creates a Color Code from three color descriptors.
> ```cpp
> aivision::codedesc(
>   int32_t index,
>   aivision::colordesc &sig1,
>   aivision::colordesc &sig2,
>   aivision::colordesc &sig3 );
> ```

> **__3__ —** Creates a Color Code from four color descriptors.
> ```cpp
> aivision::codedesc(
>   int32_t index,
>   aivision::colordesc &sig1,
>   aivision::colordesc &sig2,
>   aivision::colordesc &sig3,
>   aivision::colordesc &sig4 );
> ```

> **__4__ —** Creates a Color Code from five color descriptors.
> ```cpp
> aivision::codedesc(
>   int32_t index,
>   aivision::colordesc &sig1,
>   aivision::colordesc &sig2,
>   aivision::colordesc &sig3,
>   aivision::colordesc &sig4,
>   aivision::colordesc &sig5 );
> ```

<span style="font-size: 1.5rem;">
  Parameters
</span>

| Parameter | Type | Description |
|:---------:|:----:|:------------|
| <code>index</code> | <code>int32_t</code> | The Color Code index number (1–8). |
| <code>sig1</code>–<code>sig5</code> | <code>aivision::colordesc &</code> | References to previously created color descriptors used to build the Color Code. |

<span style="font-size: 1.5rem;"> Notes </span>

- A Color Code requires at least two Color Signatures.
- A maximum of five Color Signatures can be used in a single Color Code.
- Creating two Color Codes with the same <code>index</code> will overwrite the previous one.

### aivision::tagdesc

Creates a Tag Descriptor used to detect a specific AprilTag ID.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
tagdesc( int32_t id );
```

<span style="font-size: 1.5rem;">
  Parameters
</span>

| Parameter | Type | Description |
|:---------:|:----:|:------------|
| <code>id</code> | <code>int32_t</code> | The AprilTag ID number to detect (0–36). |

## AI Models and Classifications

The AI Vision Sensor can detect different objects with certain AI Classifications. Depending on the AI Classification model selected when configuring the AI Vision Sensor in the Devices window, different objects can be detected. The currently available models are:

**Classroom Elements**

| ID Number | AI Classification |
|:------------------:|--|
| 0 | <code>blueBall</code>    |
| 1 | <code>greenBall</code>   |
| 2 | <code>redBall</code>     |
| 3 | <code>blueRing</code>    |
| 4 | <code>greenRing</code>   |
| 5 | <code>redRing</code>     |
| 6 | <code>blueCube</code>    |
| 7 | <code>greenCube</code>   |
| 8 | <code>redCube</code>     |

**VEX V5 Robotics Competition High Stakes**

| ID Number | AI Classification |
|:------------------:|--|
| 0 | <code>mobileGoal</code>    |
| 1 | <code>redRing</code>   |
| 2 | <code>blueRing</code>     |

**VEX V5 Robotics Competition Push Back**

| ID Number | AI Classification |
|:------------------:|--|
| 0 | <code>blueBlock</code>    |
| 1 | <code>redBlock</code>   |

**VEX V5 Robotics Competition Override**

| ID Number | AI Classification |
|:------------------:|--|
| 0 | <code>redBluePin</code>    |
| 1 | <code>blueYellowPin</code>   |
| 2 | <code>redYellowPin</code>     |
| 3 | <code>yellowPin</code>    |
| 4 | <code>cup</code>   |

## Examples

```cpp
// Create Color Signatures
aivision::colordesc AIVision1__greenBox(
    1,      // index
    85,     // red
    149,    // green
    46,     // blue
    23,     // hangle
    0.23 ); // hdsat

aivision::colordesc AIVision1__blueBox(
    2,      // index
    77,     // red
    135,    // green
    125,    // blue
    27,     // hangle
    0.29 ); // hdsat

// Create a Color Code from two color signatures
aivision::codedesc AIVision1__greenBlue(
    1,                    // code index
    AIVision1__greenBox,  // first color signature
    AIVision1__blueBox ); // second color signature

// Create the AI Vision Sensor instance
aivision AIVision1(
    PORT11,                  // Smart Port
    AIVision1__greenBlue,    // color code
    aivision::ALL_AIOBJS );  // enable AI Classifications
```

## Member Functions

The <code>aivision</code> class includes the following member functions:

- [<code>takeSnapshot</code>](#takesnapshot) — Captures data for a specific Color Signature, Color Code, AI Classification group, or AprilTag ID group.
- [<code>installed</code>](#installed) — Returns whether the AI Vision Sensor is connected to the V5 Brain.

To access detected object data after calling [<code>takeSnapshot</code>](#takesnapshot), use the available [**Properties**](#properties).

Before calling any <code>aivision</code> member functions, an <code>aivision</code> instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
AI Vision Sensor configuration is generated automatically
in VEXcode using the Device Menu. Replace the values
as needed. */


// Create Color Signatures
aivision::colordesc AIVision1__greenBox(
    1,      // index
    85,     // red
    149,    // green
    46,     // blue
    23,     // hangle
    0.23 ); // hdsat

aivision::colordesc AIVision1__blueBox(
    2,      // index
    77,     // red
    135,    // green
    125,    // blue
    27,     // hangle
    0.29 ); // hdsat

// Create a Color Code from two color signatures
aivision::codedesc AIVision1__greenBlue(
    1,                    // code index
    AIVision1__greenBox,  // first color signature
    AIVision1__blueBox ); // second color signature

// Create the AI Vision Sensor instance
aivision AIVision1(
    PORT1,                   // Smart Port
    AIVision1__greenBlue,    // color code
    aivision::ALL_AIOBJS );  // enable AI Classifications
```

### takeSnapshot

```{vexcode}
id: v5_vision_aivision_take_snapshot
```

Captures an image from the AI Vision Sensor, processes it using the selected AI model or configured color signatures, and updates the <code>objects</code> array.

Each call refreshes the <code>objects</code> array with the most recent detection results. Objects are ordered from largest to smallest (by width), beginning at index <code>0</code>. If no objects are detected <code>objectCount</code> will be <code>0</code> and <code>objects[i].exists</code> will be <code>false</code>.

> **__1__ —** Takes a snapshot using an object ID and object type.
> ```cpp
> int32_t takeSnapshot(
>   uint32_t id,
>   objectType type,
>   uint32_t count );
> ```

> **__2__ —** Takes a snapshot using a [Color Signature](#aivisioncolordesc).
> ```cpp
> int32_t takeSnapshot(
>   const colordesc &desc,
>   int32_t count = 8 );
> ```

> **__3__ —** Takes a snapshot using a [Color Code](#aivisioncodedesc).
> ```cpp
> int32_t takeSnapshot(
>   const codedesc &desc,
>   int32_t count = 8 );
> ```

> **__4__ —** Takes a snapshot using an [AprilTag ID](#aivisiontagdesc).
> ```cpp
> int32_t takeSnapshot(
>   const tagdesc &desc,
>   int32_t count = 8 );
> ```

> **__5__ —** Takes a snapshot using an [AI Classification](#ai-models-and-classifications).
> ```cpp
> int32_t takeSnapshot(
>   const aiobjdesc &desc,
>   int32_t count = 8 );
> ```

> **__6__ —** Takes a snapshot using an Object Descriptor.
> ```cpp
> int32_t takeSnapshot(
>   const objdesc &desc,
>   int32_t count = 8 );
> ```

<span style="font-size: 1.5rem;">
  Parameters
</span>

| Parameter | Type | Description |
|:---------:|:----:|:------------|
| <code>id</code> | <code>uint32_t</code> | The identifier of the object to detect when using the <code>(id, type, count)</code> function. The meaning depends on <code>type</code>:<ul><li><code>colorObject</code> — Color Descriptor index (1–7)</li><li><code>codeObject</code> — Color Code index (1–8)</li><li><code>modelObject</code> — AI Classification ID</li><li><code>tagObject</code> — AprilTag ID (0–36)</li></ul><br><strong>Note:</strong> In VEXcode, AI Classification names (such as <code>blueBall</code>) may be used directly. In VS Code, the numeric ID must be used. |
| <code>type</code> | <code>objectType</code> | Specifies the category of object associated with <code>id</code>:<ul><li><code>objectType::tagObject</code> — Detects AprilTag IDs</li><li><code>objectType::colorObject</code> — Detects [Color Signatures](#aivisioncolordesc)</li><li><code>objectType::codeObject</code> — Detects [Color Codes](#aivisioncolordesc)</li><li><code>objectType::modelObject</code> — Detects [AI Classifications](#ai-models-and-classifications)</li><li><code>objectType::allObject</code> — Detects everything the sensor can recognize</li></ul> |
| <code>desc</code> | <code>colordesc &</code>, <code>codedesc &</code>, <code>tagdesc &</code>, <code>aiobjdesc &</code>, or <code>objdesc &</code> | Descriptor used to detect a specific object. Passed directly to <code>takeSnapshot</code>, for example:<ul><li><code>AIVision1.takeSnapshot(AIVision1__greenBox);</code></li><li><code>AIVision1.takeSnapshot(aivision::ALL_AIOBJS);</code></li></ul>Predefined descriptor constants:<ul><li><code>aivision::ALL_TAGS</code> — Detects all AprilTag IDs</li><li><code>aivision::ALL_COLORS</code> — Detects all configured [Color Signatures](#aivisioncolordesc)</li><li><code>aivision::ALL_CODES</code> — Detects all configured [Color Codes](#aivisioncodedesc)</li><li><code>aivision::ALL_AIOBJS</code> — Detects all [AI Classifications](#ai-models-and-classifications)</li><li><code>aivision::ALL_OBJECTS</code> — Detects everything the sensor can recognize</li></ul> |
| <code>count</code> | <code>uint32_t</code> / <code>int32_t</code> | Maximum number of objects stored from the snapshot. Defaults to 8. |


<span style="font-size: 1.5rem;"> Return Values </span>

Returns an <code>int32_t</code> representing the number of detected objects matching the specified signature or detection type.

<span style="font-size: 1.5rem;"> Notes </span>

- The AI Vision Sensor must take a snapshot before object data can be accessed.
- The <code>objects</code> array is refreshed on every call.
- When <code>count</code> is specified, only the largest detected objects (up to the specified amount) are stored.

AI Classifications depend on the model selected in the AI Vision Utility in VEXcode.

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
// Move forward if an object is detected
while (true) {
  AIVision1.takeSnapshot(aivision::ALL_AIOBJS);
  if (AIVision1.objects[0].exists) {
    Drivetrain.driveFor(forward, 50, mm);
  }
  wait(50, msec);
}
```

### installed

Returns whether the AI Vision Sensor is connected to the V5 Brain.

<span style="font-size: 1.5rem;"> Available Functions </span>

```cpp
bool installed();
```

<span style="font-size: 1.5rem;"> Parameters </span>

This function does not take any parameters.

<span style="font-size: 1.5rem;"> Return Values </span>

Returns a Boolean indicating whether the AI Vision Sensor is connected:

- <code>true</code> — The AI Vision Sensor is connected.
- <code>false</code> — The AI Vision Sensor is not connected.

```cpp
// Display a message if the AI Vision Sensor is connected
if (AIVision1.installed()){
  Brain.Screen.print("Installed!");
}
```

## Properties

Calling [<code>takeSnapshot</code>](#takesnapshot) updates the AI Vision Sensor’s detection results. Each snapshot refreshes the <code>objects</code> array, which contains detected objects for the requested AI Classification, Color Signature, Color Code, or AprilTag ID.

AI Vision data is accessed through properties of objects stored in <code>AIVisionSensor.objects[index]</code>, where <code>index</code> begins at <code>0</code>.

Objects are ordered from largest to smallest (by area).

The AI Vision Sensor image resolution is <strong>320 × 240 pixels</strong>. Object position and size values are reported in pixel units relative to the sensor’s current view.

The following properties are available:

- [<code>objectCount</code>](#objectcount) — Returns the number of detected objects from the most recent snapshot.
- [<code>largestObject</code>](#largestobject) — Selects the largest detected object from the most recent snapshot.
- [<code>objects</code>](#objects) — Array containing detected objects updated by [<code>takeSnapshot</code>](#takesnapshot).
- [<code>.exists</code>](#exists) — Whether the object entry contains valid data.
- [<code>.width</code>](#width) — Width of the detected object in pixels.
- [<code>.height</code>](#height) — Height of the detected object in pixels.
- [<code>.centerX</code>](#centerx) — X position of the object’s center in pixels.
- [<code>.centerY</code>](#centery) — Y position of the object’s center in pixels.
- [<code>.originX</code>](#originx) — X position of the object’s top-left corner in pixels.
- [<code>.originY</code>](#originy) — Y position of the object’s top-left corner in pixels.
- [<code>.angle</code>](#angle) — Orientation of a Color Code or AprilTag ID in degrees.
- [<code>.id</code>](#id) — Classification ID or AprilTag ID.
- [<code>.score</code>](#score) — Confidence score for AI Classifications.

### objectCount

```{vexcode}
id: v5_vision_aivision_objectCount
```

<code>objectCount</code> returns the number of items inside the <code>objects</code> array as an integer.

<span style="font-size: 1.5rem;">
  Syntax
</span>

```cpp
AIVisionSensor.objectCount
```

<span style="font-size: 1.5rem;">
  Components
</span>

| Component      | Description                                                                            |
| :------------- | :------------------------------------------------------------------------------------- |
| <code>AIVisionSensor</code> | The name of your AI Vision Sensor instance.                             |

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
// Display the number of detected objects
while (true) {
  Brain.Screen.setCursor(1, 1);
  Brain.Screen.clearLine(1);
  AIVision1.takeSnapshot(aivision::ALL_AIOBJS);
  if (AIVision1.objects[0].exists) {
    Brain.Screen.print("%d", AIVision1.objectCount);
  }
  wait(50, msec);
}
```

### largestObject

<code>largestObject</code> retrieves the largest detected object from the <code>objects</code> array.

This method can be used to always get the largest object from <code>objects</code> without specifying an index.

<span style="font-size: 1.5rem;">
  Syntax
</span>

```cpp
AIVisionSensor.largestObject
```

<span style="font-size: 1.5rem;">
  Components
</span>

| Component      | Description                                                                            |
| :------------- | :------------------------------------------------------------------------------------- |
| <code>AIVisionSensor</code> | The name of your AI Vision Sensor instance.                             |

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
// Display the closest AprilTag ID
while (true) {
  Brain.Screen.setCursor(1, 1);
  Brain.Screen.clearLine(1);
  AIVision1.takeSnapshot(aivision::ALL_TAGS);
  if (AIVision1.objects[0].exists) {
    Brain.Screen.print("%d", AIVision1.largestObject.id);
  }
  wait(50, msec);
}
```

### objects

<code>objects</code> returns an array of detected object properties. Use the array to access specific [property](#properties) values of individual objects.


There are ten properties that are included with each object stored in the <code>objects</code> array after <code>takeSnapshot</code> is used.

All property values except <code>id</code> and <code>score</code> describe the detected object's position and size in the AI Vision Sensor's view at the moment <code>takeSnapshot</code> was used. These values are measured in pixels, based on the sensor's 320 by 240 pixel resolution.

<span style="font-size: 1.5rem; ">
  Syntax
</span>

```cpp
AIVisionSensor.objects[index].property
```

<span style="font-size: 1.5rem; ">
  Components
</span>

| Component      | Description                                                                            |
| :------------- | :------------------------------------------------------------------------------------- |
| <code>AIVisionSensor</code> | The name of your AI Vision Sensor instance.                                               |
| <code>index</code>        | The object index in the array. Index begins at <code>0</code>.                                    |
| <code>property</code>     | One of the available [object properties](#properties). |

#### .exists

```{vexcode}
id: v5_vision_aivision_exists
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
// Move forward if an object is detected
while (true) {
  AIVision1.takeSnapshot(aivision::ALL_AIOBJS);
  if (AIVision1.objects[0].exists) {
    Drivetrain.driveFor(forward, 50, mm);
  }
  wait(50, msec);
}
```

#### .width

```{vexcode}
id: v5_vision_aivision_width
```

<code>.width</code> returns the width of the detected object.

<span style="font-size: 1.5rem;"> Access </span>

```cpp
SensorName.objects[index].width
```

<span style="font-size: 1.5rem;"> Return Values </span>

Returns an <code>int16_t</code> representing the width of the detected object in pixels. The value ranges from <code>1</code> to <code>320</code>.

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
// Approach an object until it's at least 100 pixels wide
while (true) {
  AIVision1.takeSnapshot(aivision::ALL_AIOBJS);

  if (AIVision1.objects[0].exists) {
    if (AIVision1.objects[0].width < 100) {
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

#### .height

```{vexcode}
id: v5_vision_aivision_height
```

<code>.height</code> returns the height of the detected object.

<span style="font-size: 1.5rem;"> Access </span>

```cpp
SensorName.objects[index].height
```

<span style="font-size: 1.5rem;"> Return Values </span>

Returns an <code>int16_t</code> representing the height of the detected object in pixels. The value ranges from <code>1</code> to <code>240</code>.

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
// Approach an object until it's at least 90 pixels tall
while (true) {
  AIVision1.takeSnapshot(aivision::ALL_AIOBJS);

  if (AIVision1.objects[0].exists) {
    if (AIVision1.objects[0].height < 90) {
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

#### .centerX

```{vexcode}
id: v5_vision_aivision_centerX
```

<code>.centerX</code> returns the x-coordinate of the center of the detected object.

<span style="font-size: 1.5rem;"> Access </span>

```cpp
SensorName.objects[index].centerX
```

<span style="font-size: 1.5rem;"> Return Values </span>

Returns an <code>int16_t</code> representing the x-coordinate of the object’s center in pixels. The value ranges from <code>0</code> to <code>320</code>.

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
// Turn until an object is directly in front of the sensor
Drivetrain.setTurnVelocity(10, percent);
Drivetrain.turn(right);
while (true) {
  AIVision1.takeSnapshot(aivision::ALL_AIOBJS);

  if (AIVision1.objects[0].exists) {
    if (AIVision1.objects[0].centerX > 140 && AIVision1.objects[0].centerX < 180) {
      Drivetrain.stop();
    }
  }
  wait(10, msec);
}
```

#### .centerY

```{vexcode}
id: v5_vision_aivision_centerY
```

<code>.centerY</code> returns the y-coordinate of the center of the detected object.

<span style="font-size: 1.5rem;"> Access </span>

```cpp
SensorName.objects[index].centerY
```

<span style="font-size: 1.5rem;"> Return Values </span>

Returns an <code>int16_t</code> representing the y-coordinate of the object’s center in pixels. The value ranges from <code>0</code> to <code>240</code>.

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
// Approach an object until it's close to the sensor
while (true) {
  AIVision1.takeSnapshot(aivision::ALL_AIOBJS);

  if (AIVision1.objects[0].exists) {
    if (AIVision1.objects[0].centerY < 150) {
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

#### .angle

```{vexcode}
id: v5_vision_aivision_angle
```

<code>.angle</code> returns the orientation of the detected Color Code or AprilTag ID.

<span style="font-size: 1.5rem;"> Access </span>

```cpp
SensorName.objects[index].angle
```

<span style="font-size: 1.5rem;"> Return Values </span>

Returns a <code>float</code> representing the rotation of the detected Color Code or AprilTag ID in degrees. The value ranges from <code>0</code> to <code>359.9</code>.

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
// Turn left or right depending on how a configured
// Color Code is rotated
while (true) {
  AIVision1.takeSnapshot(AIVision1__redBlue);
  if (AIVision1.objects[0].exists) {
    if (AIVision1.objects[0].angle > 50 && AIVision1.objects[0].angle < 100) {
      Drivetrain.turn(right);
    }
    else if (AIVision1.objects[0].angle > 270 && AIVision1.objects[0].angle < 330) {
      Drivetrain.turn(left);
    }
    else {
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
id: v5_vision_aivision_originX
```

<code>.originX</code> returns the x-coordinate of the top-left corner of the detected object's bounding box.

<span style="font-size: 1.5rem;"> Access </span>

```cpp
SensorName.objects[index].originX
```

<span style="font-size: 1.5rem;"> Return Values </span>

Returns an <code>int16_t</code> representing the x-coordinate of the object’s bounding box origin in pixels. The value ranges from <code>0</code> to <code>320</code>.

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
// Display if an object is to the left or the right
while (true) {
  Brain.Screen.clearScreen();
  Brain.Screen.setCursor(1, 1);
  AIVision1.takeSnapshot(aivision::ALL_AIOBJS);
  if (AIVision1.objects[0].exists) {
    if (AIVision1.objects[0].originX < 120) {
      Brain.Screen.print("To the left!");
    } else {
      Brain.Screen.print("To the right!");
    }
  } else {
    Brain.Screen.print("No objects");
  }
  wait(100, msec);
}
```

#### .originY

```{vexcode}
id: v5_vision_aivision_originY
```

<code>.originY</code> returns the y-coordinate of the top-left corner of the detected object's bounding box.

<span style="font-size: 1.5rem;"> Access </span>

```cpp
SensorName.objects[index].originY
```

<span style="font-size: 1.5rem;"> Return Values </span>

Returns an <code>int16_t</code> representing the y-coordinate of the object’s bounding box origin in pixels. The value ranges from <code>0</code> to <code>240</code>.

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
// Display if an object is close or far
while (true) {
  Brain.Screen.clearScreen();
  Brain.Screen.setCursor(1, 1);
  AIVision1.takeSnapshot(aivision::ALL_AIOBJS);
  if (AIVision1.objects[0].exists) {
    if (AIVision1.objects[0].originY < 110) {
      Brain.Screen.print("Close");
    } else {
      Brain.Screen.print("Far");
    }
  }
  wait(100, msec);
}
```

#### .id

```{vexcode}
id: v5_vision_aivision_id
```

<code>.id</code> returns the detected AprilTag ID or AI Classification ID.

<span style="font-size: 1.5rem;"> Access </span>

```cpp
SensorName.objects[index].id
```

<span style="font-size: 1.5rem;"> Return Values </span>

Returns an <code>int32_t</code> representing the ID of the detected object:

- For [AI Classifications](#ai-models-and-classifications), this corresponds to the ID defined by the [selected AI model](#ai-models-and-classifications).
- For AprilTag IDs, this represents the detected AprilTag ID number (0–36).

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
// Move forward when AprilTag ID 1 is detected
while (true) {
  AIVision1.takeSnapshot(aivision::ALL_TAGS);
  if (AIVision1.objects[0].exists) {
    if (AIVision1.objects[0].id == 1) {
      Drivetrain.drive(forward);
    }
  } else {
    Drivetrain.stop();
  }
  wait(50, msec);
}
```

#### .score

```{vexcode}
id: v5_vision_aivision_score
```

<code>.score</code> returns the confidence score of the detected AI Classification.

<span style="font-size: 1.5rem;"> Access </span>

```cpp
SensorName.objects[index].score
```

<span style="font-size: 1.5rem;"> Return Values </span>

Returns an <code>int16_t</code> indicating the confidence score of the detected AI Classification between 1 and 100.

A lower score means the sensor is less confident about the detected object, while a higher score means the sensor is more confident.

<span style="font-size: 1.5rem;"> Examples </span>

```cpp
// Display if a score is confident
while (true) {
  AIVision1.takeSnapshot(aivision::ALL_AIOBJS);

  if (AIVision1.objects[0].exists) {
    Brain.Screen.clearScreen();
    Brain.Screen.setCursor(1, 1);

    if (AIVision1.objects[0].score > 95) {
      Brain.Screen.print("Confident");
    } else {
      Brain.Screen.print("Not confident");
    }
  }
  wait(50, msec);
}
```