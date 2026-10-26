---
title: Functions | VEX V5 - C++ API
description: Reference documentation for using functions in VEX V5 C++. Includes syntax, prototypes, parameters, return values, and usage examples.
---

```{highlight} cpp
:linenothreshold: 5
```

# Functions

```{contents}
:local: true
```

## Introduction

Functions are a fundamental component of C++ programming, packaging code snippets into reusable, efficient sections of code designed to perform a specific task. Functions can be called multiple times within a program, making code organization easier, and helping to avoid repeated code. Functions also make code easier to debug.

This page covers the basics of using functions in C++, including:

- [Function Structure and Syntax](#function-structure-and-syntax) — How functions are written in C++, including return types, names, and parameters.
- [Function Prototypes](#function-prototypes) — What prototype functions are and why they are used.
- [Defining and Calling Functions](#defining-and-calling-functions) — How to create functions and call them from your program.
- [Return Values](#return-values) — How functions can send data back to the caller.
- [Passing by Reference](#passing-by-reference) — How functions can modify [variables](Variables.md) outside of their own scope.
- [Callback Functions](#callback-functions) — How functions can be passed into other functions and called automatically in response to events.
- [Functions with Default Arguments](#functions-with-default-arguments) — How parameters can be given default values when no argument is provided.

## Function Structure and Syntax

In C++, functions must be declared with their return type, name, and parameters. The basic syntax is:

```cpp
return_type function_name(parameters) {
  // Code to execute when the function is called
  return result;  // Optional, used to return a value
}
```

| Function Parts  | Description     |
|:---------: | :---------------------------|
| <code>return_type</code> | The data type that the function returns, some common options are: <ul><li><code>void</code> — Returns nothing</li><li><code>int</code> — Returns an integer value</li><li><code>double</code> — Returns a floating-point number</li><li><code>bool</code> — Returns <code>true</code> or <code>false</code></li><li><code>char</code> — Returns a single character</li><li><code>const char*</code> — Returns a text string</li><li>user-defined types — Returns a <code>struct</code> or class object</li></ul> |
| <code>function_name</code> | The name of the function. |
| <code>parameters</code> | Optional. A comma-separated list of typed parameters written as <code>type name</code>, where <code>type</code> specifies the data type of the parameter and <code>name</code> is the identifier used to access that value inside the function. Parameters receive input values when the function is called.  |
| <code>result</code> | Optional. The value returned by the function. If the function’s <code>return_type</code> is not <code>void</code>, this value must be provided and its type must exactly match the specified <code>return_type</code>. |


**Note:** A function must **always be declared *before*** it is called, or you must provide a [function prototype](#function-prototypes).

## Function Prototypes

In C++, code is read from top to bottom. This means a function must be known to the compiler before it can be called.

A function prototype lets you *use* a function before writing its full code. This allows you to keep <code>main()</code> near the top of your program while placing function definitions later, where they are easier to organize and read.

Without a prototype, you would have to define every function above <code>main()</code>, which can make projects harder to follow as they grow.

```cpp
// The function's prototype
void greeting();

int main() {
  greeting();
}

// Write the function's body after
void greeting() {
  Brain.Screen.print("Hello!");
}
```

## Defining and Calling Functions

### Functions with No Parameters

If a function does not require input, you can define it without parameters. Use <code>void</code> as the return type if the function doesn't return a value.

```cpp
// Define a function to display a message
void greeting() {
    Brain.Screen.print("Hello!");
}

int main() {
    // Initializing Robot Configuration. DO NOT REMOVE!
    vexcodeInit();
    // Call the function to display the message
    greeting();
}
```

### Functions with Parameters

You can also add parameters to functions, which let you pass in information for the function to use.

**Note:** Text can be passed using C-style strings (<code>const char*</code>) or C++ strings (<code>std::string</code>).

```cpp
// Define a function with a parameter
void namedGreeting(const char* name) {
    Brain.Screen.print("Hello, %s!", name);
}

int main() {
    // Initializing Robot Configuration. DO NOT REMOVE!
    vexcodeInit();
    namedGreeting("Stranger");
}
```

## Return Values

Functions can send data back to the caller using the <code>return</code> keyword. This allows you to capture and use the output in your project.

```cpp
// Define a function that multiplies numbers by 2
int timesTwo(int number) {
    return number * 2;
}

int main() {
    // Initializing Robot Configuration. DO NOT REMOVE!
    vexcodeInit();
    // Display the return value
    Brain.Screen.print("%d", timesTwo(2));
}
```

## Passing By Reference

By default, C++ passes function parameters *by value*, meaning the function receives a copy of the original [variable](Variables.md). Changes made inside the function do not affect the original value.

```cpp
// Add 1 to the number
void addOne(int number) {
  number++;
}

int main() {
  int value = 5;
  addOne(value);
  // "value" will still be 5
}
```

To allow a function to modify the original [variable](Variables.md), parameters can be passed by reference using the <code>&</code> symbol.

```cpp
// Add 1 to the number
void addOne(int& number) {
  number++;
}

int main() {
  int value = 5;
  addOne(value);
  // "value" will now be 6
}
```

Passing by reference allows functions to update [variables](Variables.md) defined outside the function without returning a value.

## Callback Functions

A callback function is a function that is passed into another function and called automatically when a specific event occurs.

Callbacks are commonly used for events such as button presses or sensor updates.

Instead of calling the function yourself, the project calls it for you when the event happens.

```cpp
void onPressed() {
  Brain.Screen.print("Screen pressed!");
}

// Call onPressed whenever the screen is pressed
int main() {
  vexcodeInit();
  Brain.Screen.pressed(onPressed);
}
```

### Callback Signatures

Every callback function must follow a specific signature, which defines:
- The return type
- The number of parameters
- The parameter types

The required signature is determined by the API. The callback function must match this signature exactly.

```cpp
// This callback function cannot include any parameters
void callback(void);
```

```cpp
// This callback function includes four parameters
void callback(axisType axis, double x, double y, double z);
```

Parameter names are descriptive and may vary, but the return type, parameter order, and parameter types must match exactly.

## Functions with Default Arguments

Functions can define default values for one or more parameters. A default argument is used when no value is provided for that parameter when the function is called.

**Rules for default arguments:**
- Default arguments **must be** the last parameters in the function's definition.
- Once a parameter has a default value, **all** parameters after it must also have default values.
- If a function specifies default arguments in its [prototype](#function-prototypes), those default values must not be specified again in the function definition.

```cpp
// Required parameter first, default parameter last
void greeting(const char* name, int repeatCount = 1) {

    for (int i = 0; i < repeatCount; i++) {
        Brain.Screen.print("Hello, %s!", name);
        Brain.Screen.newLine();
    }
}

int main() {
    vexcodeInit();

    // Say what name to greet (V5) and
    // use default value for repeatCount (1)
    greeting("V5");

    Brain.Screen.newLine();

    // Overrides the default value to 3
    greeting("V5", 3);
}
```