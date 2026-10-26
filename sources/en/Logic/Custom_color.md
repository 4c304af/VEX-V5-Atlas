---
title: Custom Colors | VEX V5 - C++ API
description: Reference documentation for custom colors in VEX V5 C++. Includes constructors, mutators, getters, and examples for creating and using custom colors.
---


```{highlight} cpp
:linenothreshold: 5
```

# Custom Colors

```{contents}
:local: true
```


## Introduction

The <code>color</code> class is used to define and modify colors for drawing shapes and displaying text on the V5 Brain Screen. Colors can be created using RGB values, hexadecimal color codes, HSV values, or predefined color constants.

## Class Constructors

> **__1__ —** Creates a <code>color</code> object with no assigned color.
> ```cpp
> color();
> ```

> **__2__ —** Creates a <code>color</code> object from a hexadecimal or integer value.
> ```cpp
> color( 
>   int value );
> ```

> **__3__ —** Creates a <code>color</code> object from RGB values.
> ```cpp
> color( 
>   uint8_t r, 
>   uint8_t g, 
>   uint8_t b );
> ```

## Class Destructor

Destroys the <code>color</code> object and releases associated resources.

```cpp
~color();
```

## Parameters

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>value</code> | <code>int</code> | The color value, which can be either a hexadecimal RGB integer (for example, <code>0xFFF700</code>) or one of the predefined color constants listed below. |
| <code>r</code> | <code>uint8_t</code> | An integer from 0 to 255 representing the red component. |
| <code>g</code> | <code>uint8_t</code> | An integer from 0 to 255 representing the green component. |
| <code>b</code> | <code>uint8_t</code> | An integer from 0 to 255 representing the blue component. |

## Notes

- The following predefined color constants are supported:<ul><li><code>black</code></li><li><code>blue</code></li><li><code>cyan</code></li><li><code>green</code></li><li><code>orange</code></li><li><code>purple</code></li><li><code>red</code></li><li><code>transparent</code></li><li><code>violet</code></li><li><code>white</code></li><li><code>yellow</code></li></ul>

## Example

```cpp
// Create the color yellow using a hexadecimal value
color myYellow = color(0xFFF700);

// Create a color using RGB values
color myBlue = color(0, 100, 255);

// Create a color using a predefined constant
color myRed = color(red);
```

## Member Functions

The <code>color</code> class includes the following member functions:

- [<code>rgb</code>](#rgb) — Updates the color using RGB values.
- [<code>hsv</code>](#hsv) — Updates the color using HSV values.
- [<code>web</code>](#web) — Updates the color using a web hex color string.

Before calling any <code>color</code> member functions, a <code>color</code> instance must be created, as shown below:

```cpp
// Create a color using RGB values
color brainColor = color(255, 128, 0);
```

### rgb

Updates the color of an existing <code>color</code> object using RGB values.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

> **__1__ —** Updates a color object with a packed RGB value.
> ```cpp
> uint32_t rgb( 
>   uint32_t value );
> ```

> **__2__ —** Updates a color object with separate RGB values.
> ```cpp
> uint32_t rgb( 
>   uint8_t r, 
>   uint8_t g, 
>   uint8_t b );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>value</code> | <code>uint32_t</code> | A packed RGB value containing all three color components. |
| <code>r</code> | <code>uint8_t</code> | An integer from 0 to 255 representing the red component of the color. |
| <code>g</code> | <code>uint8_t</code> | An integer from 0 to 255 representing the green component of the color. |
| <code>b</code> | <code>uint8_t</code> | An integer from 0 to 255 representing the blue component of the color. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>uint32_t</code> representing the packed RGB value of the updated color.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp 
// Draw a rectangle with a custom teal color
color brainColor = color(50, 200, 180);
Brain.Screen.setFillColor(brainColor);
Brain.Screen.drawRectangle(0, 0, 480, 120);

// Change the color to magenta for a second rectangle
brainColor.rgb(170, 40, 150);

Brain.Screen.setFillColor(brainColor);
Brain.Screen.drawRectangle(0, 120, 480, 120);
```

```cpp 
// Draw a rectangle with a custom teal color
color brainColor = color(50, 200, 180);
Brain.Screen.setFillColor(brainColor);
Brain.Screen.drawRectangle(0, 0, 480, 120);

// Change the color to magenta for a second rectangle
brainColor.rgb(0xAA2896);

Brain.Screen.setFillColor(brainColor);
Brain.Screen.drawRectangle(0, 120, 480, 120);
```

### hsv

Updates the color of an existing <code>color</code> object using hue, saturation, and brightness values.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
color& hsv( 
  uint32_t hue, 
  double   sat, 
  double   value );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>hue</code> | <code>uint32_t</code> | An integer from 0 to 360 that represents the hue of the color. |
| <code>sat</code> | <code>double</code> | A double from 0.0 to 1.0 that represents the saturation of the color. |
| <code>value</code> | <code>double</code> | A double from 0.0 to 1.0 that represents the brightness of the color. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a reference to the updated <code>color</code> object.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp 
// Draw a rectangle with a custom teal color
color brainColor = color(50, 200, 180);
Brain.Screen.setFillColor(brainColor);
Brain.Screen.drawRectangle(0, 0, 480, 120);

// Change the color to magenta for a second rectangle
brainColor.hsv(300, 0.75, 0.78);

Brain.Screen.setFillColor(brainColor);
Brain.Screen.drawRectangle(0, 120, 480, 120);
```

### web

Updates the color of an existing <code>color</code> object using a hexadecimal or web color value.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
color& web( 
  const char* color );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>color</code> | <code>const char*</code> | A hexadecimal or web color value that defines a specific color (e.g., <code>"#FF0000"</code> for red). |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a reference to the updated <code>color</code> object.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Draw a rectangle with a custom teal color
color brainColor = color(50, 200, 180);
Brain.Screen.setFillColor(brainColor);
Brain.Screen.drawRectangle(0, 0, 480, 120);

// Change the color to magenta for a second rectangle
brainColor.web("#AA2896");

Brain.Screen.setFillColor(brainColor);
Brain.Screen.drawRectangle(0, 120, 480, 120);
```