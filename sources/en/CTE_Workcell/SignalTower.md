---
title: Signal Tower | VEX V5 - C++ API
description: Explore the C++ API reference for the Signal Tower in VEX V5. Find detailed descriptions for methods, parameters, and usage examples to code a Signal Tower.
---

```{highlight} cpp
:linenothreshold: 5
```

# Signal Tower

```{contents}
:local: true
```

## Introduction

The <code>signaltower</code> class is used to change lights and detect interactions with the CTE Signal Tower.

## Class Constructors

```cpp
signaltower( 
  int32_t  index );
```

## Class Destructor

Destroys the <code>signaltower</code> object and releases associated resources.

```cpp
virtual ~signaltower();
```

## Parameters

| Parameter | Type | Description |
|:---------:|:----:|:------------|
| <code>index</code> | <code>int32_t</code> | The Smart Port that the Signal Tower is connected to, written as <code>PORTx</code>, where <code>x</code> is the port number (for example, <code>PORT1</code>). |

## Examples

```cpp
// Create a signal tower instance in Port 1
signaltower SignalTower = signaltower(PORT1);
```

## Member Functions

The <code>signaltower</code> class provides the following member functions:

- [setColor](#setcolor) - Controls the LED colors and states on the Signal Tower using various input methods.
- [setColors](#setcolors) - Sets the state of all LEDs on the Signal Tower individually.
- [setBlink](#setblink) - Sets the blink state of an LED on the Signal Tower by the LED's ID.
- [setBlinkTime](#setblinktime) - Sets the time between blinks for the LEDs on the Signal Tower.
- [enableBlink](#enableblink) - Enables blinking for multiple LEDs on the Signal Tower by their IDs.
- [disableBlink](#disableblink) - Disables blinking for multiple LEDs on the Signal Tower by their IDs.
- [pressing](#pressing) - Returns whether the Signal Tower bumper is currently being pressed.
- [pressed](#pressed) - Registers a function to be called when the Signal Tower bumper is pressed.
- [released](#released) - Registers a function to be called when the Signal Tower bumper is released.

### setColor

Controls the LED colors and states on the Signal Tower using various input methods. These lights can be used to track where the robot is at in a project or to show when certain conditions are met.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

> **__1__ —** Sets the Signal Tower to a color using vex::color.
> ```cpp
> void setColor( 
>   vex::color         color, 
>   signaltower::state state = signaltower::state::on );
> ```

> **__2__ —** Sets LED colors using 32-bit RGB and YW values.
> ```cpp
> void setColor( 
>   uint32_t rgb, 
>   uint32_t yw );
> ```

> **__3__ —** Sets individual LED brightness by LED ID.
> ```cpp
> void setColor( 
>   ledId id, 
>   uint32_t value );
> ```

> **__4__ —** Sets brightness levels for all LEDs individually.
> ```cpp
> void setColor( 
>   uint8_t r, 
>   uint8_t y, 
>   uint8_t g, 
>   uint8_t b, 
>   uint8_t w );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>color</code> | <code>vex::color</code> | The color to use: <ul><li><code>red</code> </li><li><code>yellow</code> </li><li><code>green</code> </li><li><code>blue</code> </li><li><code>white</code> </li><li><code>all</code> </li><ul> |
| <code>state</code> | <code>signaltower::state</code> | The state for the LED: <ul><li><code>on</code> (Default) – Turns the LED on.</li> <li><code>off</code> – Turns the LED off.</li> <li><code>blink</code> – Makes the LED blink.</li></ul> |
| <code>rgb</code> | <code>uint32_t</code> | The brightness of red, green and blue LED using a 32-bit value (e.g., red on = <code>0xFF0000</code>, green on = <code>0x00FF00</code>, and blue on = <code>0x0000FF</code>). |
| <code>yw</code> | <code>uint32_t</code> | The brightness of yellow and white LED using a 32-bit value (e.g., yellow on = <code>0xFF00</code> and white on = <code>0x00FF</code>). |
| <code>id</code> | <code>ledId</code> | The index of the LED to control: <ul><li><code>0</code> – red </li><li><code>1</code> – green </li><li><code>2</code> – blue </li><li><code>3</code> – white </li><li><code>4</code> – yellow </li><ul> |
| <code>value</code> | <code>uint32_t</code> | The brightness of the LED from 0 to 255, with 0 being off and 255 being the max brightness. |
| <code>r</code> | <code>uint8_t</code> | The brightness of the red LED from 0 to 255, with 0 being off and 255 being the max brightness. |
| <code>y</code> | <code>uint8_t</code> | The brightness of the yellow LED from 0 to 255, with 0 being off and 255 being the max brightness. |
| <code>g</code> | <code>uint8_t</code> | The brightness of the green LED from 0 to 255, with 0 being off and 255 being the max brightness. |
| <code>b</code> | <code>uint8_t</code> | The brightness of the blue LED from 0 to 255, with 0 being off and 255 being the max brightness. |
| <code>w</code> | <code>uint8_t</code> | The brightness of the white LED from 0 to 255, with 0 being off and 255 being the max brightness. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Set the Signal Tower to start blinking blue
SignalTower.setColor(vex::color::blue, signaltower::blink);

// Set the red, blue and white LEDs using hex values
SignalTower.setColor(0xFF00FF, 0x00FF);

// Set the green LED to full brightness by ID
SignalTower.setColor(1, 255);

// Set all LEDs to full brightness
SignalTower.setColor(255, 255, 255, 255, 255);
```

### setColors

Sets the state of all LEDs on the Signal Tower individually. These lights can be used to track where the robot is at in a project or to show when certain conditions are met.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void setColors( 
  signaltower::state rs, 
  signaltower::state ys, 
  signaltower::state gs, 
  signaltower::state bs, 
  signaltower::state ws );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>rs</code> | <code>signaltower::state</code> | The state of the red LED: <ul><li><code>on</code> – Turns the LED on.</li> <li><code>off</code> – Turns the LED off.</li> <li><code>blink</code> – Makes the LED blink.</li></ul> |
| <code>ys</code> | <code>signaltower::state</code> | The state of the yellow LED: <ul><li><code>on</code> – Turns the LED on.</li> <li><code>off</code> – Turns the LED off.</li> <li><code>blink</code> – Makes the LED blink.</li></ul> |
| <code>gs</code> | <code>signaltower::state</code> | The state of the green LED: <ul><li><code>on</code> – Turns the LED on.</li> <li><code>off</code> – Turns the LED off.</li> <li><code>blink</code> – Makes the LED blink.</li></ul> |
| <code>bs</code> | <code>signaltower::state</code> | The state of the blue LED: <ul><li><code>on</code> – Turns the LED on.</li> <li><code>off</code> – Turns the LED off.</li> <li><code>blink</code> – Makes the LED blink.</li></ul> |
| <code>ws</code> | <code>signaltower::state</code> | The state of the white LED: <ul><li><code>on</code> – Turns the LED on.</li> <li><code>off</code> – Turns the LED off.</li> <li><code>blink</code> – Makes the LED blink.</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Turn on all LEDs
SignalTower.setColors(signaltower::on, signaltower::on, signaltower::on, signaltower::on, signaltower::on);
```

### setBlink

Sets the blink state of an LED on the Signal Tower by the LED's ID. These blinking lights can be used to show when certain conditions are met, such as when the robot is waiting or when attention is needed.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void setBlink( 
  ledId id, 
  bool  enable );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>id</code> | <code>ledId</code> | The LED ID: <ul><li><code>0</code> – red</li> <li><code>1</code> – green</li> <li><code>2</code> – blue</li> <li><code>3</code> – white</li> <li><code>4</code> – yellow</li> <li><code>99</code> – none</li></ul> |
| <code>enable</code> | <code>bool</code> | <ul><li><code>true</code> – Enables blinking.</li> <li><code>false</code> – Disables blinking.</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

### setBlinkTime

Sets the time between blinks for the LEDs on the Signal Tower.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void setBlinkTime( 
  uint32_t onTime, 
  uint32_t offTime = 0 );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>onTime</code> | <code>uint32_t</code> | The time in milliseconds that the LED should be on when blinking. Max is 2500ms. A value of 0 defaults to 500ms. |
| <code>offTime</code> | <code>uint32_t</code> | The time in milliseconds that the LED should be off when blinking. Max is 2500ms. A value of 0 uses the onTime value. Default is 0. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

### enableBlink

Enables blinking for multiple LEDs on the Signal Tower by their IDs.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void enableBlink( 
  ledId id0, 
  ledId id1 = ledId::none, 
  ledId id2 = ledId::none, 
  ledId id3 = ledId::none, 
  ledId id4 = ledId::none );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>id0</code> | <code>ledId</code> | The LED ID: <ul><li><code>0</code> – red</li> <li><code>1</code> – green</li> <li><code>2</code> – blue</li> <li><code>3</code> – white</li> <li><code>4</code> – yellow</li> <li><code>99</code> – none</li></ul> |
| <code>id1</code> | <code>ledId</code> | The index of the second LED (optional). Default is <code>ledId::none</code>. <ul><li><code>0</code> – red</li> <li><code>1</code> – green</li> <li><code>2</code> – blue</li> <li><code>3</code> – white</li> <li><code>4</code> – yellow</li> <li><code>99</code> – none</li></ul>|
| <code>id2</code> | <code>ledId</code> | The index of the third LED (optional). Default is <code>ledId::none</code>. <ul><li><code>0</code> – red</li> <li><code>1</code> – green</li> <li><code>2</code> – blue</li> <li><code>3</code> – white</li> <li><code>4</code> – yellow</li> <li><code>99</code> – none</li></ul>|
| <code>id3</code> | <code>ledId</code> | The index of the fourth LED (optional). Default is <code>ledId::none</code>. <ul><li><code>0</code> – red</li> <li><code>1</code> – green</li> <li><code>2</code> – blue</li> <li><code>3</code> – white</li> <li><code>4</code> – yellow</li> <li><code>99</code> – none</li></ul>|
| <code>id4</code> | <code>ledId</code> | The index of the fifth LED (optional). Default is <code>ledId::none</code>. <ul><li><code>0</code> – red</li> <li><code>1</code> – green</li> <li><code>2</code> – blue</li> <li><code>3</code> – white</li> <li><code>4</code> – yellow</li> <li><code>99</code> – none</li></ul>|

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

### disableBlink

Disables blinking for multiple LEDs on the Signal Tower by their IDs.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void disableBlink( 
  ledId id0, 
  ledId id1 = ledId::none, 
  ledId id2 = ledId::none, 
  ledId id3 = ledId::none, 
  ledId id4 = ledId::none );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>id0</code> | <code>ledId</code> | The index of the first LED. <ul><li><code>0</code> – red</li> <li><code>1</code> – green</li> <li><code>2</code> – blue</li> <li><code>3</code> – white</li> <li><code>4</code> – yellow</li> <li><code>99</code> – none</li></ul>|
| <code>id1</code> | <code>ledId</code> | The index of the second LED (optional). Default is <code>ledId::none</code>. <ul><li><code>0</code> – red</li> <li><code>1</code> – green</li> <li><code>2</code> – blue</li> <li><code>3</code> – white</li> <li><code>4</code> – yellow</li> <li><code>99</code> – none</li></ul> |
| <code>id2</code> | <code>ledId</code> | The index of the third LED (optional). Default is <code>ledId::none</code>. <ul><li><code>0</code> – red</li> <li><code>1</code> – green</li> <li><code>2</code> – blue</li> <li><code>3</code> – white</li> <li><code>4</code> – yellow</li> <li><code>99</code> – none</li></ul>|
| <code>id3</code> | <code>ledId</code> | The index of the fourth LED (optional). Default is <code>ledId::none</code>. <ul><li><code>0</code> – red</li> <li><code>1</code> – green</li> <li><code>2</code> – blue</li> <li><code>3</code> – white</li> <li><code>4</code> – yellow</li> <li><code>99</code> – none</li></ul>|
| <code>id4</code> | <code>ledId</code> | The index of the fifth LED (optional). Default is <code>ledId::none</code>. <ul><li><code>0</code> – red</li> <li><code>1</code> – green</li> <li><code>2</code> – blue</li> <li><code>3</code> – white</li> <li><code>4</code> – yellow</li> <li><code>99</code> – none</li></ul>|

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

### pressing

Returns whether the Signal Tower's bumper is currently being pressed. This can be used as an emergency stop.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
bool pressing();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not have parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a Boolean indicating whether the Signal Tower's bumper is currently being pressed.

- <code>true</code> — The Signal Tower's bumper is currently being pressed.
- <code>false</code> — The Signal Tower's bumper is not being pressed.

### pressed

Registers a function to be called when the Signal Tower bumper is pressed.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void pressed( void (* callback)(void) );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>callback</code> | <code>void (*)(void)</code> | A pointer to a function that will be called when the bumper is pressed. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> // Display a message when bumper is pressed
> void towerBumperPressed() {
>   Brain.Screen.print("tower bumper pressed");
> }
> ```
>
> Register the callback inside <code>int main()</code>
>```cpp
> int main() {
>   /* vexcodeInit() is only required when using VEXcode.
>   Remove vexcodeInit() if compiling in VS Code. */
>   vexcodeInit();
> 
>   // Run towerBumperPressed when the tower bumper 
>   // is pressed
>   SignalTower.pressed(towerBumperPressed);
> }
> ```

### released

Registers a function to be called when the Signal Tower bumper is released.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void released( void (* callback)(void) );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>callback</code> | <code>void (*)(void)</code> | A pointer to a function that will be called when the bumper is released. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> // Display a message when bumper is released
> void towerBumperReleased() {
>   Brain.Screen.print("tower bumper released");
> }
> ```
>
> Register the callback inside <code>int main()</code>
>```cpp
> int main() {
>   /* vexcodeInit() is only required when using VEXcode.
>   Remove vexcodeInit() if compiling in VS Code. */
>   vexcodeInit();
> 
>   // Run towerBumperReleased when the tower bumper 
>   // is released
>   SignalTower.released(towerBumperReleased);
> }
> ```
