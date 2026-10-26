---
title: Screen | controller | VEX V5 - C++ API
description: Reference documentation for Controller.Screen in VEX V5 C++. Describes the V5 Controller screen functionalities.
---

# Screen

```{contents}
:local: true
```

## Introduction

The <code>screen</code> class is a derived class of the [<code>controller</code>](index.md) class. It provides functions for displaying text, numbers, and values on the V5 Controller screen.

A <code>screen</code> object is accessed through a <code>controller</code> object. It is not constructed directly.

The V5 Controller screen has 3 rows and 19 columns for displaying text and numbers.

```{image} /_static/img/screen/controller-resolution.png
:alt: A screenshot of the V5 Controller screen, showing the rows and columns in the printable area. Row 1 Column 1 starts at the upper left corner and row 3, column 19 are in the lower right corner.
:class: w-50
```

## Access

The <code>controller</code> class provides a <code>Screen</code> object. It is an instance of the <code>screen</code> class.

| Object | Example Usage | Description |
| :----: | :------------ | :---------- |
| <code>Screen</code> | <code>Controller.Screen.print("Hello");</code> | The V5 Controller screen. |

## Notes

- Before using a <code>screen</code> member function, create a <code>controller</code> object.
- The Controller screen has 3 rows and 19 columns.
- The cursor position determines where the next printed value appears.

```cpp
// Create a Controller object
controller Controller = controller();
```

## Member Functions

The <code>screen</code> class includes the following member functions:

**Actions — Display text or clear the Controller screen.**
- [<code>print</code>](#print) — Displays formatted text, numbers, or values on the Controller screen.
- [<code>setCursor</code>](#setcursor) — Moves the cursor to a specified row and column.
- [<code>newLine</code>](#newline) — Clears the rest of the current row and moves the cursor to the next row.
- [<code>clearScreen</code>](#clearscreen) — Clears the Controller screen.
- [<code>clearLine</code>](#clearline) — Clears one row on the Controller screen.

**Getters — Read the current cursor position.**
- [<code>row</code>](#row) — Returns the current cursor row.
- [<code>column</code>](#column) — Returns the current cursor column.

## Actions

### print

```{vexcode}
id: v5_controller_screen_print
```

<code>print</code> displays formatted text, numbers, or values on the V5 Controller screen at the current cursor position.

**Available Functions**

```cpp
void print(
  const char* format,
  ...
);
```

```cpp
void print(
  char* format,
  ...
);
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>format</code> | <code>const char*</code> | A format string provided as a string literal or read-only C-style string, such as <code>"Score: %d"</code>. |
| <code>format</code> | <code>char*</code> | A format string provided as a modifiable character array. |
| <code>...</code> |  | Optional. One or more additional values inserted into the format string, separated by commas. |

**Return Value**

This function does not return a value.

**Notes**

- Output begins at the current cursor position on the Controller screen.
- When using a format string, the number and types of values passed must match the [format specifiers](../Logic/Custom_formatting.md#formatting-numbers) in the string.

**Example**

```cpp
// Display a message at the starting cursor position
Controller.Screen.print("Hello, Robot!");
```

```cpp
// Display a formatted number
Controller.Screen.print("Score: %d", 25);
```

### setCursor

```{vexcode}
id: v5_controller_screen_set_cursor
```

<code>setCursor</code> moves the cursor to a specified row and column on the V5 Controller screen. The next printed value will appear at that position.

**Available Function**

```cpp
void setCursor(
  int32_t row,
  int32_t col
);
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>row</code> | <code>int32_t</code> | The row number where the cursor will be placed, from <code>1</code> to <code>3</code>. |
| <code>col</code> | <code>int32_t</code> | The column number where the cursor will be placed, from <code>1</code> to <code>19</code>. |

**Return Value**

This function does not return a value.

**Example**

```cpp
// Display text starting at row 2, column 3
Controller.Screen.setCursor(2, 3);
Controller.Screen.print("Row 2, Column 3");
```

### newLine

```{vexcode}
id: v5_controller_screen_new_line
```

<code>newLine</code> clears the rest of the current row and moves the cursor to column 1 on the next row of the V5 Controller screen.

**Available Function**

```cpp
void newLine();
```

**Parameters**

This function does not have parameters.

**Return Value**

This function does not return a value.

**Example**

```cpp
// Display two lines of text
Controller.Screen.print("Line 1");
Controller.Screen.newLine();
Controller.Screen.print("Line 2");
```

### clearScreen

```{vexcode}
id: v5_controller_screen_clear_screen
```

<code>clearScreen</code> clears all text from the V5 Controller screen.

**Available Function**

```cpp
void clearScreen();
```

**Parameters**

This function does not have parameters.

**Return Value**

This function does not return a value.

**Example**

```cpp
// Clear the Controller screen after 2 seconds
Controller.Screen.print("VEXcode");
wait(2, seconds);
Controller.Screen.clearScreen();
```

### clearLine

```{vexcode}
id: v5_controller_screen_clear_line
```

<code>clearLine</code> clears one row on the V5 Controller screen.

**Available Functions**

```cpp
void clearLine(
  int line
);
```

```cpp
void clearLine();
```

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>line</code> | <code>int</code> | Optional. The row to clear, from <code>1</code> to <code>3</code>. If no row is provided, the current row is cleared. |

**Return Value**

This function does not return a value.

**Notes**

- Clearing a row does not change the current cursor position.

**Example**

```cpp
// Display text on two rows
Controller.Screen.print("This text stays");
Controller.Screen.newLine();
Controller.Screen.print("This disappears");

// Wait 3 seconds before clearing row 2
wait(3, seconds);
Controller.Screen.clearLine(2);
```

## Getters

### row

<code>row</code> returns the current cursor row on the V5 Controller screen.

**Available Function**

```cpp
int32_t row();
```

**Parameters**

This function does not have parameters.

**Return Value**

Returns an <code>int32_t</code> representing the current cursor row. Row numbering starts at <code>1</code>.

**Example**

```cpp
// Display the cursor's current row
Controller.Screen.setCursor(3, 2);
Controller.Screen.print(Controller.Screen.row());
```

### column

<code>column</code> returns the current cursor column on the V5 Controller screen.

**Available Function**

```cpp
int32_t column();
```

**Parameters**

This function does not have parameters.

**Return Value**

Returns an <code>int32_t</code> representing the current cursor column. Column numbering starts at <code>1</code>.

**Example**

```cpp
// Display the cursor's current column
Controller.Screen.setCursor(3, 2);
Controller.Screen.print(Controller.Screen.column());
```