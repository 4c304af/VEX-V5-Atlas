---
title: Screen | brain | VEX V5 - C++ API
description: Reference documentation for Brain.Screen in VEX V5 C++. Describes the V5 Brain touchscreen, display layout, and how the screen interface is accessed and used.
---

# Screen

```{contents}
:local: true
```

## Introduction

The <code>screen</code> class is derived from the [<code>brain</code>](index.md) base class. It controls how the V5 Brain shows text, numbers, and graphics on its touchscreen, and how it responds to touch input.

By default, the font for printing to the Brain is **monospaced small** which has 12 rows and 48 columns.

For drawing, the Brain's resolution is 480 x 240 pixels.

![The V5 Brain screen with red grid lines showing the layout of 12 rows and 48 columns in total. The pixel dimensions are 479 wide by 239 tall. The upper left corner begins at (0,0) pixels and row 1, column 1, while the lower right corner ends at (479, 239) pixels and row 12, column 48.](/_static/img/screen/brain-resolution.png)

## Access

The <code>screen</code> class can be accessed by:

```cpp
Brain.Screen
```

## Notes

- The <code>screen</code> object is provided by the Brain. It is not constructed directly.
- Projects use a single global <code>Brain</code> object, so screen functions are called using <code>Brain.Screen</code>.

## Example

```cpp
/* This constructor is required when using VS Code.
A Brain is generated automatically at the start of
VEXcode projects. */

// Create the V5 Brain
brain Brain = brain();

// Print text to the Brain screen
Brain.Screen.print("Hello!");
```

## Member Functions

The <code>screen</code> class includes the following member functions:

- [<code>print</code>](#print) — Prints formatted text, numbers, or Boolean values to the Brain screen.
- [<code>setCursor</code>](#setcursor) — Moves the text cursor to a specified row and column.
- [<code>newLine</code>](#newline) — Clears the remainder of the current line and moves the cursor to the next line.
- [<code>clearLine</code>](#clearline) — Clears the remainder of the current line or clears a specified line.
- [<code>row</code>](#row) — Returns the row where text will be printed.
- [<code>column</code>](#column) — Returns the column where text will be printed.
- [<code>getStringHeight</code>](#getstringheight) — Returns the height of a string in pixels using the current font.
- [<code>getStringWidth</code>](#getstringwidth) — Returns the width of a string in pixels using the current font.
- [<code>printAt</code>](#printat) — Prints formatted text at an x, y pixel location.
- [<code>clearScreen</code>](#clearscreen) — Clears all drawings and text from the Brain screen.
- [<code>setFont</code>](#setfont) — Sets the font used for printing on the screen.
- [<code>setPenWidth</code>](#setpenwidth) — Sets the thickness of drawn lines and shape outlines.
- [<code>setPenColor</code>](#setpencolor) — Sets the color of text, pixels, lines, and shape outlines.
- [<code>setFillColor</code>](#setfillcolor) — Sets the fill color for drawn shapes and printed text backgrounds.
- [<code>setOrigin</code>](#setorigin) — Sets the origin used for screen coordinates.
- [<code>setClipRegion</code>](#setclipregion) — Restricts screen output to a rectangular region.
- [<code>drawPixel</code>](#drawpixel) — Draws one pixel at a coordinate.
- [<code>drawLine</code>](#drawline) — Draws a line between two points.
- [<code>drawRectangle</code>](#drawrectangle) — Draws a rectangle at an x, y location with a specified size.
- [<code>drawCircle</code>](#drawcircle) — Draws a circle at an x, y location with a specified radius.
- [<code>drawImageFromFile</code>](#drawimagefromfile) — Draws an image from an SD card file onto the screen.
- [<code>render</code>](#render) — Enables double buffering or renders the back buffer to the screen.
- [<code>pressing</code>](#pressing) — Returns whether the screen is currently being pressed.
- [<code>xPosition</code>](#xposition) — Returns the x-coordinate of the most recent screen press.
- [<code>yPosition</code>](#yposition) — Returns the y-coordinate of the most recent screen press.
- [<code>pressed</code>](#pressed) — Registers a callback function to run when the screen is pressed.
- [<code>released</code>](#released) — Registers a callback function to run when the screen is released after being pressed.

Before calling any <code>screen</code> member functions, a <code>brain</code> instance must be created, as shown below:

```cpp
// Create the V5 Brain
brain Brain = brain();
```

### print

```{vexcode}
id: v5_looks_brain_screen_print
```

Displays text, numbers, or Boolean values on the V5 Brain screen.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Prints formatted text using string literals or read-only C-style strings.
> ```cpp
> void print(
>     const char* format,
>     ... );
> ```

> **__2__ —** Prints formatted text using modifiable character arrays.
> ```cpp
> void print(
>     char* format,
>     ... );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|:--|
| <code>format</code> | <code>const char*</code> | A format string provided as a string literal or read-only C-style string (for example, <code>"Score: %d"</code>). |
| <code>format</code> | <code>char*</code> | A format string provided as a modifiable character array. |
| <code>...</code> |  | One or more additional values that are inserted into the format string, separated by commas. |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Output begins at the <a href="#setcursor">current cursor position</a> on the screen.
- Printed text uses the <a href="#setfont">current screen font</a>.
- Printed text uses the <a href="#setpencolor">current pen color</a>.
- Text printed with <code>print</code> is always printed with a background, and the background color is determined by the <a href="#setfillcolor">current fill color</a>.
- When using a format string, the number and types of values passed must match the [format specifiers](../Logic/Custom_formatting.md#formatting-numbers) in the string.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Display a message at the starting cursor
Brain.Screen.print("Hello, Robot!");
```

![A screenshot of the V5 Brain showing Hello, Robot! printed on the screen in the upper left corner in white text.](/_static/img/screen/print-on-screen.png)

### setCursor

```{vexcode}
id: v5_looks_brain_screen_set_cursor
```

Moves the cursor to a specific row and column on the V5 Brain screen. The next [<code>print</code>](#print) call will start printing at that location.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void setCursor(
  int32_t row, 
  int32_t col );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|------|-----------|-------------|
| <code>row</code> | <code>int32_t</code> | The row to move the cursor to. |
| <code>col</code> | <code>int32_t</code> | The column to move the cursor to. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Affects where subsequent text output begins when using [<code>print</code>](#print).
- Rows and columns are based on the [currently set screen font](#setfont).
- The default font (<code>mono20</code>) uses 12 rows and 48 columns.
- Calling <code>setCursor</code> affects the position of subsequent text output only.


<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Display text starting at Row 3 Column 12
Brain.Screen.setCursor(3, 12);
Brain.Screen.print("Row 3, Column 12");
```

![A screenshot of the V5 Brain showing Row 3 Column 12 printed in the upper portion near the center of screen, at that position.](/_static/img/screen/set-cursor.png)

### newLine

```{vexcode}
id: v5_looks_brain_screen_new_line
```

Moves the cursor to the beginning of the next row on the Brain screen.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void newLine();
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

- If the cursor is in the middle of a sentence, <code>newLine</code> will clear the rest of the row after the cursor before moving to the next row.
- After calling <code>newLine</code>, the cursor is positioned at the first column of the next line.
- The cursor position and row numbering are set using [<code>setCursor</code>](#setcursor).

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Display two lines of text
Brain.Screen.print("Line 1");
Brain.Screen.newLine();
Brain.Screen.print("Line 2");
```

![A screenshot of the V5 Brain screen showing two lines of white text in the upper left corner. The top line reads Line 1, and the second line directly below it reads Line 2.](/_static/img/screen/next-row.png)

### clearLine

```{vexcode}
id: v5_looks_brain_screen_clear_line
```

Clears text from a row on the V5 Brain screen.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Clears the rest of the current line from the cursor position.
> ```cpp
> void clearLine();
> ```

> **__2__ —** Clears the specified row using the currently configured [fill color](#setfillcolor).
> ```cpp
> void clearLine(
>     int number );
> ```

> **__3__ —** Clears the specified row using a predefined or [custom color](../Logic/Custom_color.md) object.
> ```cpp
> void clearLine(
>     int          number,
>     const color& color );
> ```

> **__4__ —** Clears the specified row using a hexadecimal color value.
> ```cpp
> void clearLine(
>     int         number,
>     const char* color );
> ```

> **__5__ —** Clears the specified row using a hue value.
> ```cpp
> void clearLine(
>     int number,
>     int hue );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

|      Parameter      |            Type           | Description   |
| :-----------------: | :-----------------------: | :------------------------------------------- |
| <code>number</code> |      <code>int</code>     | The row number to clear. Row numbering starts at <code>1</code>.            |
|  <code>color</code> | <code>const color&</code> | Clears the row using a <code>color</code> object. Predefined colors include:<ul><li><code>black</code></li><li><code>white</code></li><li><code>red</code></li><li><code>green</code></li><li><code>blue</code></li><li><code>yellow</code></li><li><code>orange</code></li><li><code>purple</code></li><li><code>cyan</code></li><li><code>transparent</code></li></ul>This can also use a [custom color object](../Logic/Custom_color.md). |
|  <code>color</code> |  <code>const char*</code> | Clears the row using a hexadecimal color value (for example, <code>"#000000"</code>).      |
|   <code>hue</code>  |      <code>int</code>     | Clears the row using an integer hue value in the range <code>0</code>–<code>359</code>, representing degrees around a color wheel. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Clearing a line does not change the current cursor position.
- The cursor position and row numbering are set using [<code>setCursor</code>](#setcursor).
- The <code>hue</code> parameter value is based on a circular color wheel, as shown below, where values represent degrees around the wheel (for example, red near 0°, green near 120°, and blue near 240°).

![A color wheel showing the range of colors from 0 to 359, where red is 0, green is 120, and blue is 240.](/_static/img/screen/hue_range.png)

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Display text on two rows
Brain.Screen.print("This text stays");
Brain.Screen.newLine();
Brain.Screen.print("This disappears");

// Wait 3 seconds before clearing row 2
wait(3, seconds);
Brain.Screen.clearLine(2);
```

### row

```{vexcode}
id: v5_sensing_brain_screen_row
```

Returns the row where text will be printed on the V5 Brain screen.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>


```cpp
int32_t row();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>


This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns an <code>int32_t</code> representing the row where text will be printed.

Row numbering starts at 1.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The cursor position is based on the <a href="#setfont">current screen font</a>.
- The returned value indicates where the next printed output will appear.
- The row value changes when text is printed or when [<code>setCursor</code>](#setcursor) is called.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Display the cursor's current row
Brain.Screen.setCursor(3, 12);
Brain.Screen.print(Brain.Screen.row());
```

![A screenshot of the V5 Brain screen showing the text 3 in white in the upper left quadrant of the screen, at the row 3 column 12 position.](/_static/img/screen/row.png)

### column

```{vexcode}
id: v5_sensing_brain_screen_column
```

Returns the column where text will be printed on the V5 Brain screen.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
int32_t column();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns an <code>int32_t</code> representing the column where text will be printed.

Column numbering starts at 1.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The cursor position is based on the <a href="#setfont">current screen font</a>.
- The returned value indicates where the next printed output will appear.
- The column value changes when text is printed or when [<code>setCursor</code>](#setcursor) is called.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Display the cursor's current column
Brain.Screen.setCursor(5, 15);
Brain.Screen.print(Brain.Screen.column());
```

![A screenshot of the V5 Brain screen showing the text 15 in white in the upper left quadrant of the screen, at the row 3 column 15 position.](/_static/img/screen/column.png)

### getStringHeight

Returns the height, in pixels, of a string when rendered on the V5 Brain screen.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
int32_t getStringHeight( 
    const char* cstr );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|:--|
| <code>cstr</code> | <code>const char*</code> | The text to be measured, provided as a [C-style string](../Logic/Custom_formatting.md#strings) (for example, <code>"Hello"</code>). |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns an <code>int32_t</code> representing the height of the string in pixels when rendered on the Brain screen.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The returned height depends on the <a href="#setfont">currently selected screen font</a>.
- This function measures the string without drawing it to the screen.
- The returned height reflects how the string would appear when printed.

### getStringWidth

Returns the width, in pixels, of a string when rendered on the V5 Brain screen.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
int32_t getStringWidth( 
    const char* cstr );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|:--|
| <code>cstr</code> | <code>const char*</code> | The text to be measured, provided as a [C-style string](../Logic/Custom_formatting.md#strings) (for example, <code>"Hello"</code>). |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns an <code>int32_t</code> representing the width of the string in pixels when rendered on the Brain screen.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The returned width depends on the <a href="#setfont">currently selected screen font</a>.
- This function measures the string without drawing it to the screen.
- The returned width reflects how the string would appear when printed.

### printAt

Prints text, numbers, or Boolean values at a specific coordinate on the V5 Brain screen.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Prints formatted output at the specified pixel location.
> ```cpp
> void printAt(
>     int32_t    x,
>     int32_t    y,
>     const char* format,
>     ... );
> ```

> **__2__ —** Prints formatted output at the specified pixel location and sets whether the text background is opaque or transparent.
> ```cpp
> void printAt(
>     int32_t    x,
>     int32_t    y,
>     bool       bOpaque,
>     const char* format,
>     ... );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|:--|
| <code>x</code> | <code>int32_t</code> | The x-position to print at, referenced to the screen origin.  |
| <code>y</code> | <code>int32_t</code> | The y-position to print at, referenced to the screen origin. |
| <code>bOpaque</code> | <code>bool</code> | Controls whether the printed text is drawn opaquely or transparently:<br><ul><li><code>true</code> — The background of the printed text is filled using the [current fill color](#setfillcolor).</li><li><code>false</code> — The text is drawn transparently and the background is not filled.</li></ul> |
| <code>format</code> | <code>const char*</code> | A format string that controls what is printed on the screen (for example, <code>"Score: %d"</code>). |
| <code>...</code> | | One or more additional values that are inserted into the format string, separated by commas. |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The <code>x</code> and <code>y</code> coordinates are relative to the current screen origin, which can be changed using [<code>setOrigin</code>](#setorigin).
- Printed text uses the <a href="#setfont">current screen font</a>.
- Printed text uses the <a href="#setpencolor">current pen color</a>.
- When using a format string, the number and types of values passed must match the [format specifiers](../Logic/Custom_formatting.md#formatting-numbers) in the string.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Print "Center" at the center of the screen
Brain.Screen.printAt(220, 120, "Center");
```

![A screenshot of the V5 Brain screen with white text that reads Center, centered on the screen.](/_static/img/screen/print-at.png)

### clearScreen

```{vexcode}
id: v5_looks_brain_screen_clear_screen
```

Erases all drawings and text from the Brain screen and resets the cursor position to row 1, column 1.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Clears the screen to black.
> ```cpp
> void clearScreen();
> ```

> **__2__ —** Clears the screen using a predefined or [custom color](../Logic/Custom_color.md) object.
> ```cpp
> void clearScreen(
>     const color& color );
> ```

> **__3__ —** Clears the screen using a hexadecimal color value.
> ```cpp
> void clearScreen(
>     const char* color );
> ```

> **__4__ —** Clears the screen using a hue value.
> ```cpp
> void clearScreen(
>     int hue );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|:--|
| <code>color</code> | <code>const color&</code> | Clears the screen using a <code>color</code> object. Predefined colors include:<ul><li><code>black</code></li><li><code>white</code></li><li><code>red</code></li><li><code>green</code></li><li><code>blue</code></li><li><code>yellow</code></li><li><code>orange</code></li><li><code>purple</code></li><li><code>cyan</code></li><li><code>transparent</code></li></ul>This can also use a [custom color object](../Logic/Custom_color.md). |
| <code>color</code> | <code>const char*</code> | Clears the screen using a hexadecimal color value represented as a string (for example, <code>"#000000"</code>). |
| <code>hue</code> | <code>int</code> | Clears the screen using an integer hue value in the range <code>0</code>–<code>359</code>, representing degrees around a color wheel. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The <code>hue</code> parameter value is based on a circular color wheel, as shown below, where values represent degrees around the wheel (for example, red near 0°, green near 120°, and blue near 240°).

![A color wheel showing the range of colors from 0 to 359, where red is 0, green is 120, and blue is 240.](/_static/img/screen/hue_range.png)

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Clear screen after 2 seconds
Brain.Screen.print("VEXcode");
wait(2, seconds);
Brain.Screen.clearScreen();
```

<hr>

```cpp
// Clear screen to blue after 2 seconds
Brain.Screen.print("VEXcode");
wait(2, seconds);
Brain.Screen.clearScreen(blue);
```

![A screenshot of the V5 Brain screen with the entire printable area bright blue.](/_static/img/screen/clear-screen-color.png)

### setFont

```{vexcode}
id: v5_looks_brain_screen_set_font
```

Sets the font used for text displayed on the V5 Brain screen.

This controls the font applied to subsequent text output when using screen text functions such as [<code>print</code>](#print).

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void setFont(
  fontType font );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|------|-----------|-------------|
| <code>font</code> | <code>fontType</code> | Sets the font to one of the following:<br><ul><li><code>mono12</code></li><li><code>mono15</code></li><li><code>mono20</code></li><li><code>mono30</code></li><li><code>mono40</code></li><li><code>mono60</code></li><li><code>prop20</code></li><li><code>prop30</code></li><li><code>prop40</code></li><li><code>prop60</code></li><li><code>fontType::cjk16</code> — Can print Chinese, Japanese, and Korean characters.<ul><li>Simplified Chinese — Can be seen up to column 28.</li><li>Traditional Chinese — Can be seen up to column 28.</li><li>Japanese (Kanji) — Can be seen up to column 28.</li><li>Korean (Hangul) — Can be seen up to column 30.</li></ul></li></ul>These options are shown below. |

| ![TA screenshot of the V5 Brain screen with numbers and letters printed in white in the upper left corner in MONO 12 font. It shows A-Z on one line, across about a quarter of the width of screen. In the bottom left corner it reads 80 columns and 20 rows.](/_static/img/fonts/mono12.png)<br><code>mono12</code> | ![The same image as the one previous, with Mono 15 font. It shows A-Z on one line, across nearly half width of the screen. In the bottom left corner it reads 68 columns and 16 rows.](/_static/img/fonts/mono15.png)<br><code>mono15</code>  | ![The same image as the one previous, with Mono 20 font. It shows A-Z on one line, across nearly two thirds of the width of the screen. In the bottom left corner it reads 48 columns and 12 rows.](/_static/img/fonts/mono20.png)<br><code>mono20</code> |
|:--:|:--:|:--:|
| ![The same image as the one previous, with Mono 30 font. It shows A-Z on one line, across nearly the whole width of the screen. In the bottom left corner it reads 32 columns and 8 rows.](/_static/img/fonts/mono30.png)<br><code>mono30</code> | ![The same image as the one previous, with Mono 40 font. It shows A-X on one line, spanning the width the screen. In the bottom left corner it reads 24 columns and 6 rows.](/_static/img/fonts/mono40.png)<br><code>mono40</code>  | ![The same image as the one previous, with Mono 60 font. It shows A-P on one line, spanning the width the screen. On the bottom it indicates 16 columns and 4 rows.](/_static/img/fonts/mono60.png)<br><code>mono60</code>  |
 ![The same image as the one previous, with Prop 20 font. It shows A-Z on one line, across nearly two thirds of the width of the screen. In the bottom left corner it reads 48 columns and 12 rows.](/_static/img/fonts/prop20.png)<br><code>prop20</code>  | ![The same image as the one previous, with Prop 30 font. It shows A-Z on one line, spanning nearly the width of the screen. In the bottom left corner it reads 32 columns and 8 rows.](/_static/img/fonts/prop30.png)<br><code>prop30</code> | ![The same image as the one previous, with Prop 40 font. It shows A-U on one line, spanning the width of the screen. In the bottom left corner it reads 24 columns and 6 rows.](/_static/img/fonts/prop40.png)<br><code>prop40</code> |
| ![The same image as the one previous, with Prop 60 font. It shows A-N on one line, spanning the width of the screen. On the bottom it reads 15 columns and 4 rows.](/_static/img/fonts/prop60.png)<br><code>prop60</code> | ![The same image as the one previous, with CJK 16 font. It shows A-Z on one line, spanning about two thirds of the screen. The subsequent lines read VEXcode in simplified Chinese, traditional Chinese, Korean, and Japanese. On the bottom it reads 43 columns and 12 rows.](/_static/img/fonts/cjk16.png)<br><code>fontType::cjk16</code> |  |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Print larger text
Brain.Screen.setFont(mono40);
Brain.Screen.print("VEX");
```

![A screenshot of the V5 Brain screen showing white text that reads VEX in larger font than the default, in the upper left corner.](/_static/img/screen/set-font.png)

<hr>

```cpp
// Print in Chinese
Brain.Screen.setFont(fontType::cjk16);
Brain.Screen.print("VEX机器人");
```

![A screenshot of the V5 Brain screen showing the text "VEX机器人" in Chinese font in the upper left corner.](/_static/img/fonts/cjk16-example.png)

### setPenWidth

```{vexcode}
id: v5_looks_brain_screen_set_pen_width
```

Sets the thickness of drawn lines and shape outlines.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void setPenWidth(
  uint32_t width );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|------|-----------|-------------|
| <code>width</code> | <code>uint32_t</code> | The pen width, in pixels, from 0 to 32. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The pen width applies to drawing functions such as [<code>drawLine</code>](#drawline), [<code>drawRectangle</code>](#drawrectangle), and [<code>drawCircle</code>](#drawcircle).

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Draw a rectangle with a pen width of 10
Brain.Screen.setPenWidth(10);
Brain.Screen.drawRectangle(50, 50, 130, 60);
```

![A screenshot of the V5 Brain screen showing a rectangle with thick borders printed in the upper left quadrant of the screen.](/_static/img/screen/set-pen-width.png)

### setPenColor

```{vexcode}
id: v5_looks_brain_screen_set_pen_color
```

Sets the color of text, pixels, lines, and shape outlines.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Sets the pen color using a predefined or [custom color](../Logic/Custom_color.md) object.
> ```cpp
> void setPenColor(
>     const color& color );
> ```

> **__2__ —** Sets the pen color using a hexadecimal color value.
> ```cpp
> void setPenColor(
>     const char* color );
> ```

> **__3__ —** Sets the pen color using a hue value.
> ```cpp
> void setPenColor(
>     int hue );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|:--|
| <code>color</code> | <code>const color&</code> | Sets the pen color using a <code>color</code> object. Predefined colors include:<ul><li><code>black</code></li><li><code>white</code></li><li><code>red</code></li><li><code>green</code></li><li><code>blue</code></li><li><code>yellow</code></li><li><code>orange</code></li><li><code>purple</code></li><li><code>cyan</code></li><li><code>transparent</code></li></ul> |
| <code>color</code> | <code>const char*</code> | Sets the pen color using a hexadecimal color value represented as a string (for example, <code>"#FF0000"</code>). |
| <code>hue</code> | <code>int</code> | Sets the pen color using an integer hue value in the range <code>0</code>–<code>359</code>, representing degrees around a color wheel (for example, <code>0</code> is red, <code>120</code> is green, and <code>240</code> is blue). |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The default pen color at the start of a project is <code>white</code>.
- The pen color is used for outlines of shapes (such as with [<code>drawCircle</code>](#drawcircle) or [<code>drawRectangle</code>](#drawrectangle)), text and numeric output (with [<code>print</code>](#print) and [<code>printAt</code>](#printat)), and individual pixels drawn with [<code>drawPixel</code>](#drawpixel).
- The <code>hue</code> parameter value is based on a circular color wheel, as shown below, where values represent degrees around the wheel (for example, red near 0°, green near 120°, and blue near 240°).

![A color wheel showing the range of colors from 0 to 359, where red is 0, green is 120, and blue is 240.](/_static/img/screen/hue_range.png)

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Draw a rectangle with orange borders
Brain.Screen.setPenColor(orange);
Brain.Screen.drawRectangle(50, 50, 130, 60);
```

![A screenshot of the V5 Brain screen showing a rectangle drawn in orange in the upper left quadrant of the screen.](/_static/img/screen/set-pen-color.png)

### setFillColor

```{vexcode}
id: v5_looks_brain_screen_set_fill_color
```

Sets the fill color used when shapes are drawn. 

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Sets the fill color using a predefined or [custom color](../Logic/Custom_color.md) object.
> ```cpp
> void setFillColor(
>     const color& color );
> ```

> **__2__ —** Sets the fill color using a hexadecimal color value.
> ```cpp
> void setFillColor(
>     const char* color );
> ```

> **__3__ —** Sets the fill color using a hue value.
> ```cpp
> void setFillColor(
>     int hue );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

|      Parameter     |           Type           | Description   |
| :----------------: | :----------------------: | :--: |
| <code>color</code> |    <code>const color&</code>    | Sets the fill color using a <code>color</code> object. Predefined colors include:<ul><li><code>black</code></li><li><code>white</code></li><li><code>red</code></li><li><code>green</code></li><li><code>blue</code></li><li><code>yellow</code></li><li><code>orange</code></li><li><code>purple</code></li><li><code>cyan</code></li><li><code>transparent</code></li></ul> |
| <code>color</code> | <code>const char*</code> | Sets the fill color using a hexadecimal color value represented as a string (for example, <code>"#00FF00"</code>).  |
|  <code>hue</code>  |     <code>int</code>     | Sets the fill color using an integer hue value in the range <code>0</code>–<code>359</code>, representing degrees around a color wheel (for example, <code>0</code> is red, <code>120</code> is green, and <code>240</code> is blue).      |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The default fill color at the start of a project is <code>black</code>.
- The fill color is used for interior of shapes (such as with [<code>drawCircle</code>](#drawcircle) or [<code>drawRectangle</code>](#drawrectangle)).
- The fill color is used as the background color for printed text (such as with [<code>print</code>](#print) and [<code>printAt</code>](#printat)).
  - If <code>transparent</code> is used with printed text, the background will be <code>black</code>.
- The <code>hue</code> parameter value is based on a circular color wheel, as shown below, where values represent degrees around the wheel (for example, red near 0°, green near 120°, and blue near 240°).

![A color wheel showing the range of colors from 0 to 359, where red is 0, green is 120, and blue is 240.](/_static/img/screen/hue_range.png)

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
  // Draw a rectangle filled with purple
  Brain.Screen.setFillColor(purple);
  Brain.Screen.drawRectangle(50, 100, 130, 60);
```

![A screenshot of the V5 Brain screen showing a rectangle filled with purple in the lower left quadrant of the screen.](/_static/img/screen/set-fill-color.png)

### setOrigin

Sets the origin used for drawing and coordinate-based printing on the Brain screen.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>


```cpp
void setOrigin(
  int32_t x,
  int32_t y );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>


| Parameter | Type | Description |
|------|-----------|-------------|
| <code>x</code> | <code>int32_t</code> | The origin's x-position relative to the top-left corner of the Brain screen from 0 to 479. |
| <code>y</code> | <code>int32_t</code> | The origin's y-position relative to the top-left corner of the Brain screen from 0 to 239. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The default origin is the top-left corner of the screen at coordinate (0, 0).
- The origin applies to coordinate functions such as [<code>drawLine</code>](#drawline), [<code>drawRectangle</code>](#drawrectangle), [<code>drawCircle</code>](#drawcircle), and [<code>printAt</code>](#printat).
- The origin remains in effect until changed again or the project is reset.

<!--
<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
/* This constructor is required when using VS Code.
A Brain is generated automatically at the start of
VEXcode projects. */

// Create the V5 Brain
brain Brain = brain();
```

<hr>

```cpp
// Draw a rectangle with a pen width of 10
Brain.Screen.setPenWidth(10);
Brain.Screen.drawRectangle(50, 50, 130, 60);
``` -->

### setClipRegion

Defines a rectangular area on the screen where all drawings and text will be confined. Any content outside this region will not be displayed.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void setClipRegion(
  int x,
  int y,
  int width,
  int height );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

|      Parameter      |       Type       | Description                                                       |
| :-----------------: | :--------------: | :---------------------------------------------------------------- |
|    <code>x</code>   | <code>int</code> | The x-coordinate of the top-left corner of the clip region, given as an integer from 0 to 479. |
|    <code>y</code>   | <code>int</code> | The y-coordinate of the top-left corner of the clip region, given as an integer from 0 to 239.  |
|  <code>width</code> | <code>int</code> | The width of the clip region in pixels, given as an integer from 0 to 479.          |
| <code>height</code> | <code>int</code> | The height of the clip region in pixels, given as an integer from 0 to 239.                     |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Drawing functions are still executed even if they fall outside the clip region, but only the portion inside the region is visible.
- The <code>x</code> and <code>y</code> coordinates are relative to the current screen origin, which can be changed using [<code>setOrigin</code>](#setorigin).
- The clip region applies only to the current thread.
- Setting a new clip region replaces any previously set clip region for the current thread.


<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Restrict text and drawings to a specific region
Brain.Screen.setClipRegion(0, 0, 120, 120);
Brain.Screen.drawRectangle(60, 60, 100, 100, red);
Brain.Screen.printAt(60, 60, "Cut off!");
```

![A screenshot of the V5 Brain's screen with white text that reads Cut of with a solid red square directly below it in the upper left quadrant, reflecting what is printed within the clip region.](/_static/img/screen/set_clip_region.png)

### drawPixel

```{vexcode}
id: v5_looks_brain_screen_draw_pixel
```

Draws one pixel on the V5 Brain screen at the selected x and y pixel location.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void drawPixel(
  int x,
  int y );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

|    Parameter   |       Type       | Description                                            |
| :------------: | :--------------: | :----------------------------------------------------- |
| <code>x</code> | <code>int</code> | The x-coordinate where the pixel will be drawn, given as an integer from 0 to 479. |
| <code>y</code> | <code>int</code> | The y-coordinate where the pixel will be drawn, given as an integer from 0 to 239. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Pixels are drawn using the current pen color set with [<code>setPenColor</code>](#setpencolor).
- The <code>x</code> and <code>y</code> coordinates are relative to the current screen origin, which can be set using [<code>setOrigin</code>](#setorigin).
- If the specified pixel location is outside the screen bounds, the pixel is not drawn.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Draw the pixels marking the corners of a square
Brain.Screen.drawPixel(250, 100);
Brain.Screen.drawPixel(275, 100);
Brain.Screen.drawPixel(250, 125);
Brain.Screen.drawPixel(275, 125);
```

![A screenshot of the V5 Brain screen showing an assortment of pixels showing the corners of a square near the center of the screen.](/_static/img/screen/draw-pixel.png)

### drawLine

```{vexcode}
id: v5_looks_brain_screen_draw_line
```

Draws a straight line connecting two points on the V5 Brain screen.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
void drawLine(
  int x1,
  int y1,
  int x2,
  int y2 );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

|    Parameter    |       Type       | Description                                                     |
| :-------------: | :--------------: | :-------------------------------------------------------------- |
| <code>x1</code> | <code>int</code> | The starting x-coordinate of the line, given as an integer from 0 to 479. |
| <code>y1</code> | <code>int</code> | The starting y-coordinate of the line, given as an integer from 0 to 239. |
| <code>x2</code> | <code>int</code> | The ending x-coordinate of the line, given as an integer from 0 to 479.   |
| <code>y2</code> | <code>int</code> | The ending y-coordinate of the line, given as an integer from 0 to 239.   |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Lines are drawn using the current pen color set with [<code>setPenColor</code>](#setpencolor).
- The width of the line is determined by the current pen width set with [<code>setPenWidth</code>](#setpenwidth).
- The <code>x</code> and <code>y</code> coordinates are relative to the current screen origin, which can be set using [<code>setOrigin</code>](#setorigin).
- If any portion of the line lies outside the screen bounds, only the visible portion is drawn.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Draw a line from the top left to bottom right of the screen
Brain.Screen.drawLine(0, 0, 479, 239);
```

![A screenshot of the V5 Brain screen shows a thin diagonal line across the center, from the upper left corner to the lower right corner.](/_static/img/screen/draw-line.png)

### drawRectangle

```{vexcode}
id: v5_looks_brain_screen_draw_rectangle
```

Draws a rectangle on the V5 Brain screen at the specified position and size.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Draws and fills a rectangle using the currently configured [fill color](#setfillcolor).
> ```cpp
> void drawRectangle(
>     int x,
>     int y,
>     int width,
>     int height );
> ```

> **__2__ —** Draws and fills a rectangle using a predefined or [custom color](../Logic/Custom_color.md) object.
> ```cpp
> void drawRectangle(
>     int           x,
>     int           y,
>     int           width,
>     int           height,
>     const color&  color );
> ```

> **__3__ —** Draws and fills a rectangle using a hexadecimal color value.
> ```cpp
> void drawRectangle(
>     int           x,
>     int           y,
>     int           width,
>     int           height,
>     const char*   color );
> ```

> **__4__ —** Draws and fills a rectangle using a hue value.
> ```cpp
> void drawRectangle(
>     int x,
>     int y,
>     int width,
>     int height,
>     int hue );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

|      Parameter      |            Type           | Description  |
| :-----------------: | :-----------------------: | :--- |
|    <code>x</code>   |      <code>int</code>     | The x-coordinate of the top-left corner of the rectangle, given as an integer from 0 to 479.    |
|    <code>y</code>   |      <code>int</code>     | The y-coordinate of the top-left corner of the rectangle, given as an integer from 0 to 239.    |
|  <code>width</code> |      <code>int</code>     | The width of the rectangle, given as an integer from 0 to 479.   |
| <code>height</code> |      <code>int</code>     | The height of the rectangle, given as an integer from 0 to 239.   |
|  <code>color</code> | <code>const color&</code> | Fills the rectangle using a <code>color</code> object. Predefined colors include:<ul><li><code>black</code></li><li><code>white</code></li><li><code>red</code></li><li><code>green</code></li><li><code>blue</code></li><li><code>yellow</code></li><li><code>orange</code></li><li><code>purple</code></li><li><code>cyan</code></li><li><code>transparent</code></li></ul>This can also use a [custom color object](../Logic/Custom_color.md). |
|  <code>color</code> |  <code>const char*</code> | Fills the rectangle using a hexadecimal color value (for example, <code>"#FF0000"</code>).    |
|   <code>hue</code>  |      <code>int</code>     | Fills the rectangle using a hue value in the range <code>0</code>–<code>359</code>.    |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The rectangle outline is drawn using the current pen color set with [<code>setPenColor</code>](#setpencolor).
- The outline thickness is determined by the current pen width set with [<code>setPenWidth</code>](#setpenwidth).
- When no <code>color</code> parameter is provided, the rectangle interior is filled using the current fill color set with [<code>setFillColor</code>](#setfillcolor).
- The <code>x</code> and <code>y</code> coordinates are relative to the current screen origin, which can be changed using [<code>setOrigin</code>](#setorigin).
- If any portion of the rectangle lies outside the screen bounds, only the visible portion is drawn.
- The <code>hue</code> parameter value is based on a circular color wheel, as shown below, where values represent degrees around the wheel (for example, red near 0°, green near 120°, and blue near 240°).

![A color wheel showing the range of colors from 0 to 359, where red is 0, green is 120, and blue is 240.](/_static/img/screen/hue_range.png)

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Draw a rectangle on the screen
Brain.Screen.drawRectangle(50, 50, 130, 60);
```

![A screenshot of the V5 Brain's screen shows a rectangle with a thin white border printed in the upper left quadrant.](/_static/img/screen/draw-rectangle.png)

### drawCircle

```{vexcode}
id: v5_looks_brain_screen_draw_circle
```

Draws a circle on the V5 Brain screen at the specified position and radius.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Draws and fills a circle using the currently configured [fill color](#setfillcolor).
> ```cpp
> void drawCircle(
>     int x,
>     int y,
>     int radius );
> ```

> **__2__ —** Draws and fills a circle using a predefined or [custom color](../Logic/Custom_color.md) object.
> ```cpp
> void drawCircle(
>     int           x,
>     int           y,
>     int           radius,
>     const color&  color );
> ```

> **__3__ —** Draws and fills a circle using a hexadecimal color value.
> ```cpp
> void drawCircle(
>     int           x,
>     int           y,
>     int           radius,
>     const char*   color );
> ```

> **__4__ —** Draws and fills a circle using a hue value.
> ```cpp
> void drawCircle(
>     int x,
>     int y,
>     int radius,
>     int hue );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

|      Parameter      |            Type           | Description  |
| :-----------------: | :-----------------------: | :--- |
|    <code>x</code>   |      <code>int</code>     | The x-coordinate of the center of the circle, given as an integer from 0 to 479.    |
|    <code>y</code>   |      <code>int</code>     | The y-coordinate of the center of the circle, given as an integer from 0 to 239.    |
|  <code>radius</code> |      <code>int</code>     | The radius of the circle, given as an integer from 0 to 239 pixels.   |
|  <code>color</code> | <code>const color&</code> | Fills the circle using a <code>color</code> object. Predefined colors include:<ul><li><code>black</code></li><li><code>white</code></li><li><code>red</code></li><li><code>green</code></li><li><code>blue</code></li><li><code>yellow</code></li><li><code>orange</code></li><li><code>purple</code></li><li><code>cyan</code></li><li><code>transparent</code></li></ul> This can also use a [custom color object](../Logic/Custom_color.md). |
|  <code>color</code> |  <code>const char*</code> | Fills the circle using a hexadecimal color value (for example, <code>"#FF0000"</code>).    |
|   <code>hue</code>  |      <code>int</code>     | Fills the circle using a hue value in the range <code>0</code>–<code>359</code>.    |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The circle outline is drawn using the current pen color set with [<code>setPenColor</code>](#setpencolor).
- The outline thickness is determined by the current pen width set with [<code>setPenWidth</code>](#setpenwidth).
- When no <code>color</code> parameter is provided, the circle interior is filled using the current fill color set with [<code>setFillColor</code>](#setfillcolor).
- The <code>x</code> and <code>y</code> coordinates are relative to the current screen origin, which can be changed using [<code>setOrigin</code>](#setorigin).
- The <code>hue</code> parameter value is based on a circular color wheel, as shown below, where values represent degrees around the wheel (for example, red near 0°, green near 120°, and blue near 240°).

![A color wheel showing the range of colors from 0 to 359, where red is 0, green is 120, and blue is 240.](/_static/img/screen/hue_range.png)

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Draw a circle on the screen
Brain.Screen.drawCircle(240, 120, 40);
```

![A screenshot of the V5 Brain screen shows a circle with a thin white border drawn in the center.](/_static/img/screen/draw-circle.png)

### drawImageFromFile

Draws an image on the V5 Brain screen using an image file stored on the [SD card](SDcard.md).

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
bool drawImageFromFile(
  const char* name,
  int x,
  int y );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

|     Parameter     |           Type           | Description                                                                                                      |
| :---------------: | :----------------------: | :--------------------------------------------------------------------------------------------------------------- |
| <code>name</code> | <code>const char*</code> | The filename of the image on the SD card. The file must have a <code>.bmp</code> or <code>.png</code> extension. |
|   <code>x</code>  |     <code>int</code>     | The x-coordinate, in pixels from 0 to 479, at which the left edge of the image will be drawn.                                  |
|   <code>y</code>  |     <code>int</code>     | The y-coordinate, in pixels from 0 to 239, at which the top edge of the image will be drawn.                                   |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a Boolean indicating whether the image was successfully drawn:<ul><li><code>true</code> — The image was successfully loaded and drawn on the screen.</li><li><code>false</code> — The image could not be drawn (for example, if the file does not exist or is invalid).</li></ul>

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Supported image formats are <code>.bmp</code> and <code>.png</code>.
- The image file size must not exceed <code>512 KB</code>.
  - 8-bit RLE encoding is recommended to minimize file size.
- The maximum supported image dimensions are the size of the Brain screen (approximately 479 x 239 pixels).
- The <code>x</code> and <code>y</code> coordinates are relative to the current screen origin, which can be changed using [<code>setOrigin</code>](#setorigin).

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Draw a bmp file on the Brain's screen at coordinate 0, 0
Brain.Screen.drawImageFromFile("test_image.bmp", 0, 0);
```

### render

Enables double buffering for the Brain's screen. Once called, any drawing functions (like text, shapes, or images) will no longer appear immediately for the rest of the project. Instead, updates will only be shown when <code>render</code> is used again. This allows for smoother and more controlled screen updates, but means nothing will be visible until <code>render</code> is used.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Enables double buffering or renders the back buffer to the screen.
> ```cpp
> bool render();
> ```

> **__2__ —** Renders the back buffer to the screen with control over vertical sync behavior and optional scheduler execution.
> ```cpp
> bool render(
>     bool bVsyncWait,
>     bool bRunScheduler = true );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|:--|
| <code>bVsyncWait</code> | <code>bool</code> | <ul><li><code>true</code> — Wait for the screen's vertical refresh before rendering to reduce visual tearing.</li><li><code>false</code> — Do not wait for the screen's vertical refresh before rendering.</li></ul> |
| <code>bRunScheduler</code> | <code>bool</code> | Optional. <ul><li><code>true</code> (default) — Allow background tasks to run while waiting to render.</li><li><code>false</code> — Do not allow background tasks to run while waiting to render. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a Boolean indicating whether the saved drawings in the buffer were successfully rendered to the screen:<ul><li><code>true</code> — The drawings were successfully rendered on the screen.</li><li><code>false</code> — The drawings could not be rendered on the screen.</li>

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Calling <code>render</code> will require <code>render</code> to be used for the rest of the project.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
Brain.Screen.render();

// Draw text to the back buffer
Brain.Screen.print("Render later...");

// Wait for a screen press to render drawings
while (!Brain.Screen.pressing()) {
  wait(20, msec);
}
Brain.Screen.render();
```

### pressing

```{vexcode}
id: v5_sensing_brain_screen_pressing
```

Reports whether the V5 Brain screen is currently being pressed.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
bool pressing();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a Boolean indicating the current pressed state of the screen:<code>true</code> — The screen is currently being pressed. or <code>false</code> — The screen is not being pressed.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Change the screen's color after it's pressed
while (Brain.Screen.pressing() == false) {
  wait(5, msec);
}

Brain.Screen.setFillColor(green);
Brain.Screen.drawRectangle(0, 0, 479, 239);
```

<hr>

```cpp
// Display different messages after the screen is pressed
while (!Brain.Screen.pressing()) {
  wait(5, msec);
}
Brain.Screen.print("First message!");
Brain.Screen.newLine();

// Lift finger to press the screen again
while (Brain.Screen.pressing()) {
  wait(5, msec);
}
while (Brain.Screen.pressing() == false) {
  wait(5, msec);
}
Brain.Screen.print("Second message!");
Brain.Screen.newLine();
```

### xPosition

```{vexcode}
id: v5_sensing_brain_screen_xPosition
```

Returns the x-coordinate of the last press on the V5 Brain screen.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
int32_t xPosition();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns an <code>int32_t</code> representing the x-coordinate, in pixels from 0 to 479, of the last screen press.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Display a circle where the screen is pressed
while (Brain.Screen.pressing() == false) {
  wait(5, msec);
}

Brain.Screen.drawCircle(Brain.Screen.xPosition(), Brain.Screen.yPosition(), 20, white);
```

### yPosition

```{vexcode}
id: v5_sensing_brain_screen_yPosition
```

Returns the y-coordinate of the last press on the V5 Brain screen.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
int32_t yPosition();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns an <code>int32_t</code> representing the y-coordinate, in pixels from 0 to 239, of the last screen press.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Display a circle where the screen is pressed
while (Brain.Screen.pressing() == false) {
  wait(5, msec);
}

Brain.Screen.drawCircle(Brain.Screen.xPosition(), Brain.Screen.yPosition(), 20, white);
```

### pressed

```{vexcode}
id: v5_brain_screen_pressed
```

Registers a function to be called when the V5 Brain screen is pressed.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Calls a function when the screen is pressed.
> ```cpp
> void pressed(
>     void (*callback)(void)
> );
> ```

> **__2__ —** Calls a function when the screen is pressed and passes a user-defined argument to the callback function.
> ```cpp
> void pressed(
>     void (*callback)(void*),
>     void* arg );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

|       Parameter       |             Type             | Description                                                                                |
| :-------------------: | :--------------------------: | :----------------------------------------------------------------------------------------- |
| <code>callback</code> |  <code>void (*)(void)</code> | A function that is called when the screen is pressed.                                      |
| <code>callback</code> | <code>void (*)(void*)</code> | A function that is called when the screen is pressed and receives a user-defined argument. |
|    <code>arg</code>   |      <code>void*</code>      | A user-defined value that is passed to the callback function when the screen is pressed.   |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The callback function is executed each time the Brain screen is pressed.
- Only one callback function can be registered at a time; calling <code>pressed</code> again replaces the previous callback.
- The callback function must return <code>void</code>.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> // Tracks how many times the screen is pressed.
> void onScreenPressed(void* arg) {
>   int* count = (int*)arg;
>   (*count)++;
>
>   Brain.Screen.clearScreen();
>   Brain.Screen.setCursor(1, 1);
>   Brain.Screen.print("Pressed %d times", *count);
> }
> ```
>
> Register the callback inside <code>int main()</code>
> ```cpp
> int main() {
>   int pressCount = 0;
>
>   // Register the callback and pass a value to update.
>   Brain.Screen.pressed(onScreenPressed, &pressCount);
>
>   while (true) {
>     wait(20, msec);
>   }
> }
> ```

### released

```{vexcode}
id: v5_brain_screen_released
```

Registers a function to be called when the V5 Brain screen is released after being pressed.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Calls a function when the screen is released after being pressed.
> ```cpp
> void released(
>     void (*callback)(void)
> );
> ```

> **__2__ —** Calls a function when the screen is released after being pressed and passes a user-defined argument to the callback function.
> ```cpp
> void released(
>     void (*callback)(void*),
>     void* arg );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

|       Parameter       |             Type             | Description                                                                                |
| :-------------------: | :--------------------------: | :----------------------------------------------------------------------------------------- |
| <code>callback</code> |  <code>void (*)(void)</code> | A function that is called when the screen is released after being pressed.                                      |
| <code>callback</code> | <code>void (*)(void*)</code> | A function that is called when the screen is released after being pressed and receives a user-defined argument. |
|    <code>arg</code>   |      <code>void*</code>      | A user-defined value that is passed to the callback function when the screen is released after being pressed.   |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The callback function is executed each time the Brain screen is released after being pressed.
- Only one callback function can be registered at a time; calling <code>released</code> again replaces the previous callback.
- The callback function must return <code>void</code>.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> Define the callback function (outside of <code>int main()</code>)
> ```cpp
> // Tracks how many times the screen is released.
> void onScreenReleased(void* arg) {
>   int* count = (int*)arg;
>   (*count)++;
>
>   Brain.Screen.clearScreen();
>   Brain.Screen.setCursor(1, 1);
>   Brain.Screen.print("Released %d times", *count);
> }
> ```
>
> Register the callback inside <code>int main()</code>
> ```cpp
> int main() {
>   int releaseCount = 0;
>
>   // Register the callback and pass a value to update.
>   Brain.Screen.released(onScreenReleased, &releaseCount);
>
>   while (true) {
>     wait(20, msec);
>   }
> }
> ```
