---
title: Console | VEX V5 - C++ API
description: Reference documentation for console output in VEX V5 C++. Includes functions, parameters, notes, and examples.
---

```{highlight} cpp
:linenothreshold: 5
```

# Console

```{contents}
:local: true
```


## Introduction

The VEXcode V5 Console is displayed in the Monitor window within VEXcode. Console output can display text, numbers, and variable values while a project is running.

When using VS Code, text-based Console output appears in the terminal instead of the VEXcode Console.

**Note:** When using the VEXcode Console, you must connect to the Console Serial Port before any output can be printed to the Console.

Below is a list of all functions:

**Action — Output text.**
- [<code>printf</code>](#printf) — Displays text, numbers, or variable values in the Console or terminal.

## Action

### printf

```{vexcode}
id: v5_console_print
```

<code>printf</code> displays text, numbers, or variable values in the Console. In VS Code, <code>printf</code> displays output in the terminal.

In C++, <code>printf</code> uses a format string. The format string is the text inside the quotation marks. It can include regular text, control sequences, and format specifiers that insert values from your project, like a score, timer, or sensor reading. See the [String Formatting](Logic/Custom_formatting.md) page for more information about format specifiers.

By default, <code>printf</code> does not automatically move to the next line. Add <code>\n</code>, which stands for a new line, when you want the next printed value to start on a new row.

**Usage:**<br>
<code>printf(value);</code>

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>value</code> | <code>const char*</code> | The text, format string, or control sequence to display in the Console or terminal. |

**Return Value:**<br>
This function does not return a value.

```cpp
// Display a message in the Console
printf("Hello, robot!\n");
```

![The VEXcode Console, showing the Console and the text "Hello, robot!" displayed.](/_static/img/console_examples/print.png)

```cpp
// Display two messages on separate lines
printf("Hello, robot!\n");
printf("This prints on the next line.\n");
```

![The VEXcode Console, showing the Console and the text "Hello, robot!" displayed on the first line and "This prints on the next line" on the line below it.](/_static/img/console_examples/python_print_1.png)

```cpp
// Display two messages on the same line
printf("Hello, ");
printf("robot!\n");
```

![The VEXcode Console, showing the Console and the text "Hello, robot!" displayed.](/_static/img/console_examples/print.png)

```cpp
// Display a number with two decimal places
printf("%.2f\n", 1.0 / 3.0);
```

![The VEXcode Console, showing the Console and the text "0.33" displayed.](/_static/img/console_examples/set_print_precision.png)

#### Control Sequences

Control sequences are short codes that can be printed with <code>printf</code> to change how text appears in the Console.

Control sequences are useful when you want to change text color or clear the Console directly inside a <code>printf</code> statement.

To change the text color, print <code>\033</code> followed by a color code. At the start of a project, the Console text color is set to blue.

| Color | Control sequence |
| :---: | :--------------- |
| Black | <code>\033[30m</code> |
| Red | <code>\033[31m</code> |
| Green | <code>\033[32m</code> |
| Yellow | <code>\033[33m</code> |
| Blue | <code>\033[34m</code> |
| Purple | <code>\033[35m</code> |
| Cyan | <code>\033[36m</code> |
| White | <code>\033[37m</code> |
| Orange | <code>\033[91m</code> |
| Transparent | <code>\033[97m</code> |

```cpp
// Print text in different colors
printf("Default text color\n");
printf("\033[31m");
printf("Red text color\n");
```

![The VEXcode Console, showing the Console and blue-colored text saying "Default text color" displayed on the first line and red-colored "Red text color" on the second line.](/_static/img/console_examples/print_color.png)

#### Clear the Console

C++ does not have a separate Console function for clearing all rows. To clear the Console, print the control sequence <code>\033[2J</code> with <code>printf</code>.

This clears all rows from the Console and moves the cursor back to row 1.

```cpp
// Clear the Console after two seconds
printf("VEXcode\n");
wait(2, seconds);
printf("\033[2J");
```
