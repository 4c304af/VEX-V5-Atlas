---
title: Custom String Formatting | VEX V5 - C++ API
description: Reference documentation for custom string formatting in VEX V5 C++. Includes format specifiers, string manipulation, and escape sequences.
---


```{highlight} cpp
:linenothreshold: 5
```

# Custom String Formatting

```{contents}
:local: true
```


## Introduction

String formatting in C++ for VEX V5 uses <code>printf</code>-style format specifiers to create strings that include variables, expressions, or values. This method uses format specifiers like <code>%d</code>, <code>%f</code>, <code>%s</code>, etc., to insert values into strings. 

**Formatting Numbers — Insert values and expressions into a string.**  
- [<code>%d</code>](#integers) — Formats integers.  
- [<code>%.xf</code>](#fixed-decimal-places) — Sets the number of decimal places to show for floats.  
- [<code>%x</code>](#hexadecimal) — Formats a number as hexadecimal.  
- [<code>%c</code>](#characters) — Formats single characters.  
- [<code>%s</code>](#strings) — Formats C-style strings.  

**Combining Strings — Combine text and values.**  
- [<code>strcat</code>](#combining-strings) — Concatenate C-style strings manually.

**Checking for Substrings — Test for presence or position of text.**  
- [<code>strstr</code>](#checking-for-substrings) — Finds a substring within a string.

**Escape Sequences — Format output with special characters.**  
- [<code>\n</code>](#new-line) — Adds a line break (new line).  

## Formatting Numbers

C++ uses format specifiers to control how numbers and other data types appear in strings.

### Integers

Formats integer values using the <code>%d</code> format specifier.

<span style="font-size: 1.5rem;">
  Format specifiers
</span>

```cpp
%d
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This format specifier does not have parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Formats the integer value as an integer in the string.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
int count = 42;

// Display a single variable 
Brain.Screen.print("Count: %d", count);
```

```cpp
int x = 1;
int y = 5;

// Display multiple variables
Brain.Screen.print("Position: (%d, %d)", x, y);
```

```cpp
// Display a calculation
Brain.Screen.print("Sum: %d", 5 + 3);
```

```cpp
// Display the robot's battery capacity
Brain.Screen.print("Battery: %d%%", Brain.Battery.capacity());
```

### Fixed Decimal Places

Controls how many decimal places a floating-point number is displayed with using the <code>%.xf</code> format specifier.

<span style="font-size: 1.5rem;">
  Format specifiers
</span>

```cpp
%.xf
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>x</code> | <code>int</code> | The number of decimal places to show. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Formats the floating-point value with the specified number of decimal places.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Display pi with 2 decimal places
double pi = 3.1415926535;
Brain.Screen.print("Pi: %.2f", pi);
```

### Hexadecimal

Converts numbers to hexadecimal representation using <code>%x</code> (lowercase) or <code>%X</code> (uppercase).

<span style="font-size: 1.5rem;">
  Format specifiers
</span>

> **__1__ —** Formats numbers as lowercase hexadecimal.
> ```cpp
> %x
> ```

> **__2__ —** Formats numbers as uppercase hexadecimal.
> ```cpp
> %X
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This format specifier does not have parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Formats the integer value as a hexadecimal string.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Convert 255 to hexadecimal
int number = 255;

// Display hexadecimals 
Brain.Screen.print("Hex: %x", number);

Brain.Screen.print("Hex: 0x%X", number);
```

### Characters

Formats single characters using the <code>%c</code> format specifier.

<span style="font-size: 1.5rem;">
  Format specifiers
</span>

```cpp
%c
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This format specifier does not have parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Formats the character value as a single character.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
char letter = 'A';

// Display a single character variable
Brain.Screen.print("Letter: %c", letter);
```

### Strings

Formats C-style strings (character arrays) using the <code>%s</code> format specifier.

<span style="font-size: 1.5rem;">
  Format specifiers
</span>

```cpp
%s
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This format specifier does not have parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Formats the string value as text.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
char message[] = "V5";

// Display a string variable
Brain.Screen.print("Hello, %s", message);
```

## Combining Strings

Combines two strings together using the <code>strcat</code> function.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
char* strcat(char* string1, const char* string2);
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>string1</code> | <code>char*</code> | The string to add onto. Must have space for the new text. |
| <code>string2</code> | <code>const char*</code> | The string you want to add. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a pointer to the resulting string (<code>string1</code>).

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Make sure that the string has enough space reserved for the characters that are being appended. Adding characters to a string that is too small can overwrite other variables and cause unexpected behavior.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Make sure the variable has enough space
// for all characters (set it to 20)
char message[20] = "Hello,";
strcat(message, " V5");

// Display the combined strings
Brain.Screen.print("%s", message);
```


## Checking for Substrings

Returns a pointer to the position of the first occurrence of a C-style string in another string using the <code>strstr</code> function.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
char* strstr(const char* str, const char* substring);
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>str</code> | <code>const char*</code> | A pointer to the string being searched. |
| <code>substring</code> | <code>const char*</code> | The string to search for. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a pointer to the first occurrence of the substring, or <code>NULL</code> if the string is not found.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
char message[] = "Hey everyone!";

// Display if "Hey" is in the variable
if (strstr(message, "Hey") != NULL) {
    Brain.Screen.print("Hello!");
}
```

## Escape Sequences

Escape sequences are special characters used inside strings to format text output.

### New Line 

Moves text to a new line when printing using the <code>\n</code> escape sequence.

<span style="font-size: 1.5rem;">
  Format specifiers
</span>

```cpp
\n
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This escape sequence does not have parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Inserts a newline character in the output.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- This only works on the console. Text will not be sent to the console until a new line is started.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Display text on two lines
printf("First line\nSecond line\n");
```