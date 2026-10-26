---
title: Optical | VEX V5 - C++ API
description: Reference documentation for the optical class in VEX V5 C++. Includes constructors, functions, parameters, notes, and member functions.
---

```{highlight} cpp
:linenothreshold: 5
```

# Optical Sensor

```{contents}
:local: true
```

## Introduction

The <code>optical</code> class is used to access data from the **V5 Optical Sensor**. It uses reflected light to detect objects, identify colors, and measure brightness and hue.

## Class Constructor

```cpp
optical Optical = optical(index);
```

## Class Destructor

Destroys the <code>optical</code> object and releases associated resources.

```cpp
virtual ~optical();
```

## Parameters

| Parameter | Type | Description |
|:---------:|:----:|:------------|
| <code>index</code> | <code>int32_t</code> | The Smart Port that the Optical Sensor is connected to, written as <code>PORTx</code>, where <code>x</code> is the port number (for example, <code>PORT1</code>). |

## Examples

```cpp
// Create an optical instance in Port 1
optical Optical1 = optical(PORT1);
```

## Member Functions

The <code>optical</code> class includes the following member functions:

- [<code>setLight</code>](#setlight) — Turns the Optical Sensor’s LED on or off.
- [<code>setLightPower</code>](#setlightpower) — Sets the Optical Sensor's light power level.
- [<code>isNearObject</code>](#isnearobject) — Returns whether the Optical Sensor detects an object within range.
- [<code>color</code>](#color) — Returns the color detected by the Optical Sensor.
- [<code>brightness</code>](#brightness) — Returns the amount of light reflected from the object.
- [<code>hue</code>](#hue) — Returns the hue detected by the Optical Sensor.
- [<code>objectDetected</code>](#objectdetected) — Registers a function to be called when the Optical Sensor detects an object.
- [<code>objectLost</code>](#objectlost) — Registers a function to be called when the Optical Sensor loses an object.

Before calling any <code>optical</code> member functions, an <code>optical</code> instance must be created, as shown below:

```cpp
// Create an optical object in Port 1
optical Optical1 = optical(PORT1);
```

### setLight

Sets Optical Sensor's LED to on or off. The light can help the Optical Sensor detect objects and colors more clearly.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void  setLight(ledState state);
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :----------------: | :------: | :-------------------------------------- |
| <code>state</code> | <code>ledState</code> | Sets the LED on or off. <code>ledState::on</code> turns the LED on at 100% [brightness](#setlightpower). <code>ledState::off</code> turns it off. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp 
// Turn on LED with previous intensity.
Optical.setLight(ledState::on);
```

### setLightPower

Sets the brightness of the Optical Sensor's LED. The light can help the Optical Sensor detect objects and colors more clearly.

If the Optical Sensor's light is off, setting the light power above 0% will turn the light on.

If the Optical Sensor's light is on, setting the light power at 0% will turn the light off.

A higher percentage makes the light brighter. A lower percentage makes the light dimmer.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
  void setLightPower( 
      int32_t      intensity, 
      percentUnits units = percent );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :----------------: | :------: | :-------------------------------------- |
| <code>intensity</code> | <code>int32_t</code> | The power level to set the light from 0 – 100. |
| <code>units</code> | <code>percentUnits</code> | The unit that represents the light intensity: <code>percent</code> / <code>pct</code> — percent|

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp 
// Set the light power to 50 percent.
Optical.setLightPower(50, percent);
```

### isNearObject

Returns if the Optical Sensor detects a nearby object.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
bool  isNearObject();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function returns a Boolean indicating if a nearby object is detected:

- <code>true</code> – The Optical Sensor detects an object.
- <code>false</code> – The Optical Sensor does not detect an object.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp 
// If an object is detected by the Optical Sensor, print
// "near object".
if (Optical.isNearObject()){
  Brain.Screen.print("near object");
}
```

### color

Returns the color detected by the Optical Sensor.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
vex::color  color();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

The color detected by the Optical Sensor as an instance of the [color class](../Logic/Custom_color.md#predefined-color).

Possible colors are:
- <code>black</code>
- <code>white</code>
- <code>red</code> - A hue value between 340° - 20°
- <code>green</code> - A hue value between 80° - 140°
- <code>blue</code> - A hue value between 200° - 240°
- <code>yellow</code> - A hue value between 40° - 60°
- <code>orange</code> - A hue value between 20° - 40°
- <code>purple</code> - A hue value between 240° - 280°
- <code>cyan</code> - A hue value between 140° - 200°

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp 
// Set a variable, detectColor, to the color detected by the
// Optical Sensor
color detectColor = Optical.color();

// Print the color detected by the Optical Sensor
// to the Brain's screen
Brain.Screen.print(detectColor);
```

### brightness

Returns the amount of light reflected from the object.

A higher percentage means more light is reflected back to the Optical Sensor. A lower percentage means less light is reflected back.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double  brightness(bool bRaw = false);
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
| :----------------: | :------: | :-------------------------------------- |
| <code>bRaw</code> | <code>bool</code> | A Boolean value to read raw brightness data instead of percentage. The default is <code>false</code>. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

A double representing the brightness detected by the Optical Sensor as a double in the range 0 - 100%, or a double representing the raw data detected by the sensor.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp 
// Set a variable, brightness, to the value of the brightness
// detected by the Optical Sensor
double brightness = Optical.brightness();

// Print the brightness detected by the Optical Sensor to the
// Brain's screen
Brain.Screen.print(brightness);
```

### hue

Returns the hue value of the detected color.

Hue is a way to describe color using numbers around a color wheel.

![The VEX Color Wheel showing the degrees of colors around a circle, with red at 0 degrees and transitioning through the rainbow as the value increases.](/_static/img/sensing/color-wheel.jpg)

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
  double hue();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

A double representing the value of the hue detected by the Optical Sensor in the range 0 — 359.99.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp 
// Set a variable, hue, to the value of the hue detected
// by the Optical Sensor.
double hue = Optical.hue();
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
| <code>callback</code> | <code>void (*)(void)</code> | A previously defined [function](../Logic/Functions.md) that executes when the Optical Sensor detects a new object. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> // Display a message when the Optical Sensor detects an object.
> void detected() {
>   Brain.Screen.print("object detected");
> }
> ```
>
> Register the callback inside <code>int main()</code>
> ```cpp
> int main() {
>   // Run detected when the Optical Sensor detects an object.
>   Optical.objectDetected(detected);
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
| <code>callback</code> | <code>void (*)(void)</code> | A previously defined [function](../Logic/Functions.md) that executes when the Optical Sensor loses a detected object. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> // Display a message when the Optical Sensor loses an object.
> void lost() {
>   Brain.Screen.print("object lost");
> }
> ```
>
> Register the callback inside <code>int main()</code>
> ```cpp
> int main() {
>   // Run lost when the Optical Sensor loses an object.
>   Optical.objectLost(lost);
> }
> ```
