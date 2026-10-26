---
title: Math | VEX V5 - C++ API
description: Reference documentation for math functions in VEX V5 C++. Includes trigonometry, rounding, exponents, logarithms, and constants.
---


```{highlight} cpp
:linenothreshold: 5
```

# Math

```{contents}
:local: true
```


## Introduction

The C++ standard library provides basic math functionality through <code>&lt;cmath&gt;</code>, which is supported in VEXcode V5. These functions let you perform common mathematical operations such as trigonometry, rounding, exponentiation, and more.

Use them for calculating positions, angles, distances, or performing conversions between degrees and radians.

Below is a list of available math functions, constants, and utilities: 

**Common Math Functions – Common math tools.**
- [<code>abs</code>](#abs) – Returns the absolute value of a number.  
- [<code>fmin</code>](#fmin) – Returns the smallest of the input values.  
- [<code>fmax</code>](#fmax) – Returns the largest of the input values.  
- [<code>pow</code>](#pow) – Raises a number to a power.

**Constants – Predefined values from <code>&lt;cmath&gt;</code>.**  
- [<code>M_PI</code>](#m_pi) – The constant π (pi).  
- [<code>M_E</code>](#m_e) – Euler’s number, base of the natural log.  

**Trigonometry – Calculate angles and relationships between sides.**  
- [<code>sin</code>](#sin) – Sine of an angle in radians.  
- [<code>cos</code>](#cos) – Cosine of an angle in radians.  
- [<code>tan</code>](#tan) – Tangent of an angle in radians.  
- [<code>atan</code>](#atan) – Arctangent of a value in radians.  
- [<code>atan2</code>](#atan2) – Arctangent of y/x in radians, considering the quadrant.  
- [<code>asin</code>](#asin) – Arcsine of a value in radians.  
- [<code>acos</code>](#acos) – Arccosine of a value in radians.  

**Rounding & Absolute Value – Adjust precision or direction.**  
- [<code>ceil</code>](#ceil) – Rounds up to the nearest integer.  
- [<code>floor</code>](#floor) – Rounds down to the nearest integer.  
- [<code>trunc</code>](#trunc) – Removes the decimal portion.  

**Exponents & Logarithms – Power, root, and log calculations.**  
- [<code>sqrt</code>](#sqrt) – Returns the square root.  
- [<code>exp</code>](#exp) – Calculates e to the power of x.  
- [<code>log</code>](#log) – Natural logarithm (base e).  
- [<code>log10</code>](#log10) – Base-10 logarithm.  

**Floating Point Operations – Inspect or decompose float values.** 
- [<code>fmod</code>](#fmod) – Remainder with sign of the dividend.  
- [<code>copysign</code>](#copysign) – Returns a value with the sign of another.  

## Common Math Functions

### abs

Returns the absolute value of a number, removing any negative sign.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

> **__1__ —** Returns the absolute value of an integer.
> ```cpp
> int abs( int x );
> ```

> **__2__ —** Returns the absolute value of a double.
> ```cpp
> double abs( double x );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>x</code> | <code>int</code> or <code>double</code> | An integer or double. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns the absolute value of the input as the same type.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Display the absolute value of -10
Brain.Screen.print("%d", abs(-10));

// Output: 10
```

### fmin

Returns the lower of two values as a double.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double fmin( double value1, double value2 );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>value1</code> | <code>double</code> | The first value to compare. |
| <code>value2</code> | <code>double</code> | The second value to compare. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the smaller of the two input values.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Display the lower of two values
Brain.Screen.print("%f", fmin(7, 4));

// Output: 4.000000
```

### fmax

Returns the higher of two values as a double.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double fmax( double value1, double value2 );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>value1</code> | <code>double</code> | The first value to compare. |
| <code>value2</code> | <code>double</code> | The second value to compare. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the larger of the two input values.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Display the higher of two values
Brain.Screen.print("%f", fmax(7, 4));

// Output: 7.000000
```

### pow

Returns a number raised to a power as a double.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double pow( double base, double exponent );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>base</code> | <code>double</code> | The base number. |
| <code>exponent</code> | <code>double</code> | The exponent. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the base raised to the power of the exponent.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Display 2 to the power of 3
Brain.Screen.print("%f", pow(2, 3));

// Output: 8.000000
```

## Constants

Constants are predefined values that remain fixed during a project. They can be used in calculations without requiring any definition or assignment.

### M_PI

<code>M_PI</code> gives the mathematical constant π, the ratio of a circle’s circumference to its diameter.

<span style="font-size: 1.5rem;">
  Available Constants
</span>

```cpp
const double M_PI;
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This constant does not have parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns the mathematical constant π as a <code>double</code>.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Calculate the area of a circle with radius 5
double area = M_PI * 5 * 5;

Brain.Screen.print("%f", area);  

// Output: 78.539816
```

### M_E

The mathematical constant e (Euler's number), the base of the natural logarithm.

<span style="font-size: 1.5rem;">
  Available Constants
</span>

```cpp
const double M_E;
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This constant does not have parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns the mathematical constant e as a <code>double</code>.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Calculate e raised to the power of 2
double result = pow(M_E, 2);

Brain.Screen.print("%f", result);  

// Output: 7.389056
```

## Trigonometry

### sin

Calculates the sine of an angle in radians and returns a double.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double sin( double x );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>x</code> | <code>double</code> | A double representing an angle in radians. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the sine of the angle.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Convert 30 degrees to radians
double radians = 30 * M_PI / 180.0;

// Display the sine of 30 degrees
Brain.Screen.print("%f", sin(radians));

// Output: 0.500000
```

### cos

Calculates the cosine of an angle in radians and returns a double.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double cos( double x );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>x</code> | <code>double</code> | A double representing an angle in radians. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the cosine of the angle.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Convert 60 degrees to radians
double radians = 60 * M_PI / 180.0;

// Display the cosine of 60 degrees
Brain.Screen.print("%f", cos(radians));

// Output: 0.500000
```

### tan

Calculates the tangent of an angle in radians and returns a double.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double tan( double x );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>x</code> | <code>double</code> | A double representing an angle in radians. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the tangent of the angle.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Convert 45 degrees to radians
double radians = 45 * M_PI / 180.0;

// Compute tangent of 45 degrees
Brain.Screen.print("%f", tan(radians));

// Output: 1.000000
```

### atan

Calculates the inverse tangent (arc tangent) of a number and returns a double representing the angle in radians.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double atan( double x );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>x</code> | <code>double</code> | A double value. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the arc tangent in radians.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Calculate the arc tangent of 1 in degrees
double degrees = atan(1.0) * 180.0 / M_PI;

Brain.Screen.print("%f", degrees);

// Output: 45.000000
```

### atan2

Calculates the principal value of the inverse tangent of y/x and returns a double representing the angle in radians.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double atan2( double y, double x );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>y</code> | <code>double</code> | A double representing the y-coordinate. |
| <code>x</code> | <code>double</code> | A double representing the x-coordinate. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the arc tangent of y/x in radians.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Calculate the inverse tangent of 1/1 in degrees
double degrees = atan2(1.0, 1.0) * 180.0 / M_PI;

Brain.Screen.print("%f", degrees);

// Output: 45.000000
```

### asin

Calculates the inverse sine (arc sine) of a number and returns a double representing the angle in radians.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double asin( double x );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>x</code> | <code>double</code> | A double between -1 and 1. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the arc sine in radians.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Calculate the arc sine of 0.5 in degrees
double degrees = asin(0.5) * 180.0 / M_PI;

Brain.Screen.print("%f", degrees);

// Output: 30.000000
```

### acos

Calculates the inverse cosine (arc cosine) of a number and returns a double representing the angle in radians.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double acos( double x );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>x</code> | <code>double</code> | A double between -1 and 1. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the arc cosine in radians.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Calculate the arc cosine of 0.5 in degrees
double degrees = acos(0.5) * 180.0 / M_PI;

Brain.Screen.print("%f", degrees);  

// Output: 60.000000
```

## Rounding & Absolute Value

### ceil

Returns a number rounded up as a double.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double ceil( double x );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>x</code> | <code>double</code> | A double to be rounded up. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the smallest integer greater than or equal to x.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Round up 9.7
Brain.Screen.print("%f", ceil(9.7));

// Output: 10.000000
```

### floor

Returns a number rounded down as a double.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double floor( double x );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>x</code> | <code>double</code> | A double to be rounded down. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the largest integer less than or equal to x.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Round down 9.7
Brain.Screen.print("%f", floor(9.7));

// Output: 9.000000
```

### trunc

Returns a number as a double, with its decimal portion set to zero.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double trunc( double x );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>x</code> | <code>double</code> | A double to be truncated. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> with the decimal portion removed.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Truncate 9.7
Brain.Screen.print("%f", trunc(9.7));

// Output: 9.000000
```

## Exponents & Logarithms

### sqrt

Returns the square root of a number.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double sqrt( double x );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>x</code> | <code>double</code> | A non-negative double. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the square root of x.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Display the square root of 121
Brain.Screen.print("%f", sqrt(121));

// Output: 11.000000
```

### exp

Calculates the exponential of a number.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double exp( double x );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>x</code> | <code>double</code> | A double to calculate the exponential of. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing e raised to the power of x.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Calculate e raised to the power of 1
double result = exp(1);

Brain.Screen.print("%f", result);
  
// Output: 2.718282
```

### log

Calculates the natural logarithm of a number.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double log( double x );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>x</code> | <code>double</code> | A positive double. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the natural logarithm of x.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Calculate the natural logarithm (base e) of e
double result = log(M_E);

Brain.Screen.print("%f", result);  
  
// Output: 1.000000
```

### log10

Calculates the base-10 logarithm of a number.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double log10( double x );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>x</code> | <code>double</code> | A positive double. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the base-10 logarithm of x.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Calculate the base-10 logarithm of 1000
double result = log10(1000);

Brain.Screen.print("%f", result);  
  
// Output: 3.000000
```

## Floating Point Operations

### fmod

Returns the remainder of division while keeping the sign of the dividend.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double fmod( double x, double y );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>x</code> | <code>double</code> | The dividend. |
| <code>y</code> | <code>double</code> | The divisor. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the remainder of x/y with the sign of x.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Calculate remainder of 10 / -3
// that preserves the sign of 10
double result = fmod(10.0, -3.0);

Brain.Screen.print("%f", result);  

// Output: 1.000000
```

### copysign

Returns a number with the magnitude of x and the sign of y.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
double copysign( double x, double y );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>x</code> | <code>double</code> | The value whose magnitude will be used. |
| <code>y</code> | <code>double</code> | The value whose sign will be used. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> with the magnitude of x and the sign of y.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Return -10 with the sign of -3 (negative)
double result = copysign(10, -3);

Brain.Screen.print("%f", result);  
  
// Output: -10.000000
```

