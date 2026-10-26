---
title: Variables | VEX V5 - C++ API
description: Explore the C++ API reference for variables with VEX V5. Find detailed descriptions for variables, their usages, and examples.
---


```{highlight} cpp
:linenothreshold: 5
```

# Variables

```{contents}
:local: true
```

## Introduction

Variables store data and allow you to reuse and manipulate it throughout your program. C++ is a *statically typed* language, meaning you must declare the type of a variable explicitly when you create it. The type cannot be changed after declaration. For example:

```cpp
int angle = 90;           // angle is an integer
char dist[] = "Distance"; // dist is an array of characters
double steps = 2.5;       // steps is a double
```

C++ is also *strongly typed*, which means you cannot perform operations on incompatible types without explicit conversion. For example:

```cpp
int blocks = 2;              // blocks is an integer
char rings[] = "4";          // rings is a string
int result = blocks + rings; // Creates a compilation error
```

This API explains common variable types in C++. While not an exhaustive list, it covers the types you're most likely to use in practice.

- [**Local variables**](#local-variables) — Declared inside a function and only used within that scope; best for temporary or isolated values.  
- [**Global variables**](#global-variables) — Declared outside any function and used throughout the project; good for sharing data between functions.  

- [**Integer**](#integer) — Whole numbers used for counting, distances, or anything without decimals.  
- [**Double**](#double) — High-precision decimal numbers for mathematical calculations requiring accuracy.  
- [**Float**](#float) — Standard-precision decimal numbers, useful for measurements or calculations.  
- [**C-style String**](#string) — Text values, used for messages, labels, or displaying readable output.  
- [**Boolean (bool)**](#boolean) — <code>true</code> or <code>false</code> values for logic and decision-making.  
- [**Arrays**](#arrays) — Fixed-size collections of elements of the same type.  
- [**2D Arrays**](#2d-arrays) — Arrays of arrays; ideal for representing rows, grids, or table-like data.  
- [**Const**](#constant-variables) — A variable declared with <code>const</code> cannot be modified.


## Declaring and Assigning a Variable

To create a variable in C++, you must declare its type followed by the variable name, then optionally assign a value using the <code>=</code> operator:

```cpp
int distance = 100;
```

When naming a variable, the following rules must be adhered to:

+ The name cannot contain special characters (e.g., an exclamation point).
+ The name cannot begin with a number.
+ The name cannot use spaces.
+ The name cannot conflict with predefined VEXcode objects (for example, <code>Drivetrain</code>).
+ The name cannot be a C++ reserved keyword (e.g., <code>int</code>, <code>for</code>, etc.).
+ Variable names are case-sensitive (e.g., <code>Distance</code> and <code>distance</code> are different variables).

### Local Variables

**Local variables** are defined *inside* a function or block of code. They are only accessible within the scope of that function or block and are not visible outside of it.

> Define the function (outside of <code>int main()</code>)
> ```cpp
> void show_local() {
>   // This variable only exists inside this function
>   int angle = 90;
>   Brain.Screen.print("%d", angle);
> }
> ```
>
> Call the function inside <code>int main()</code>
>```cpp
> int main() {
>   /* vexcodeInit() is only required when using VEXcode.
>   Remove vexcodeInit() if compiling in VS Code. */
>   vexcodeInit();
> 
>   // Begin project code
>   show_local();
> }
> ```

Local variables are commonly used to store temporary values that are only relevant within a specific function or part of the program.

### Global Variables

**Global variables** are defined *outside* of any function or block. They can be accessed and read *anywhere* in the program, including inside functions.

**Note:** **Global variables** are accessible from anywhere in the program, which can make them convenient for sharing data across functions. However, relying heavily on **global variables** can lead to unintended side effects, as changes to the variable in one part of the program may affect other parts unpredictably. For this reason, **local variables** are generally preferred when possible, as they limit a variable's scope to the specific function where it is defined. This reduces the likelihood of conflicts and makes debugging easier.

> Define the function (outside of <code>int main()</code>)
> ```cpp
> // The variable is defined outside a function
> int angle = 90;
>
> void show_global() {
>   // You can access 'angle' inside a function
>   Brain.Screen.print("%d", angle);
>   Brain.Screen.newLine();
> }
> ```
>
> Call the function inside <code>int main()</code>
>```cpp
> int main() {
>   /* vexcodeInit() is only required when using VEXcode.
>   Remove vexcodeInit() if compiling in VS Code. */
>   vexcodeInit();
> 
>   // Begin project code
>   show_global();
>   Brain.Screen.print("%d", angle);
> }
> ```

In C++, global variables can be directly accessed and modified from within functions without any special keywords. However, if you have a local variable with the same name, you can use the scope resolution operator <code>::</code> to access the global variable.

> Define the function (outside of <code>int main()</code>)
> ```cpp
> // Define the global variable
> int count = 0;
>
> void increase_count() {
>   // Global variables can be accessed directly
>   count = count + 1;
>   Brain.Screen.print("Count: %d", count);
>   Brain.Screen.newLine();
> }
> ```
>
> Call the function inside <code>int main()</code>
>```cpp
> int main() {
>   /* vexcodeInit() is only required when using VEXcode.
>   Remove vexcodeInit() if compiling in VS Code. */
>   vexcodeInit();
> 
>   // Begin project code
>   increase_count();
>   increase_count();
> }
> ```

## Types of Data

C++ supports several types of data that can be stored in variables. Some types can be reassigned, while others allow individual elements to be modified. Below are the most commonly used types:

### Integer

```{vexcode}
id: v5_variables_my_number
```

An **integer** (<code>int</code>) is a whole number.

```cpp
int main() {
  // Initializing Robot Configuration. DO NOT REMOVE!
  vexcodeInit();
  // Begin project code
  int distance = 100;

  // Move the robot forward for the variable value in mm
  Drivetrain.driveFor(forward, distance, mm);

  // Add to the variable and move forward the new value, 
  // for 200mm total
  wait(1, seconds);
  distance = distance + 100;
  Drivetrain.driveFor(forward, distance, mm);
}
```

### Double

```{vexcode}
id: v5_variables_my_double
```

A **double** is a decimal-point number with high precision (typically 64-bit).

```cpp
int main() {
  // Initializing Robot Configuration. DO NOT REMOVE!
  vexcodeInit();
  // Begin project code
  // Store a value with decimal points
  double raw_value = 0.88;

  // Print the decimal value as a percentage
  Brain.Screen.print("%.1f%%", raw_value * 100);
}
```

### Float

A **float** stores decimal numbers. In most VEX projects, **[doubles](#double)** are preferred over **floats** unless memory usage is a concern.

```cpp
int main() {
  // Initializing Robot Configuration. DO NOT REMOVE!
  vexcodeInit();
  // Begin project code
  // Store a value with decimal points
  float raw_value = 0.88;

  // Print the decimal value as a percentage
  Brain.Screen.print("%.1f%%", raw_value * 100);
}
```

### String

```{vexcode}
id: v5_variables_my_string
```

A C-style **string** (<code>char variable_name[]</code>) is a sequence of characters stored in a character array. C-style strings must be large enough to store the text and a null terminator.

```cpp
int main() {
  // Initializing Robot Configuration. DO NOT REMOVE!
  vexcodeInit();
  // Begin project code
  // Set the variable to a string then print the string
  char message[] = "Ready!";
  Brain.Screen.print(message);
}
```

### Boolean

```{vexcode}
id: v5_variables_my_boolean
```

A **Boolean** (<code>bool</code>) represents <code>true</code> or <code>false</code> values.

```cpp
int main() {
  // Initializing Robot Configuration. DO NOT REMOVE!
  vexcodeInit();
  // Begin project code
  // Set the state of the variable
  bool delivered = false;

  // Print different messages depending on the Boolean.
  if (delivered) {
      Brain.Screen.print("Package delivered!");
  } else {
      Brain.Screen.print("Delivering...");
  }
}
```

Booleans can be changed at any point in the project.

```cpp
int main() {
  // Initializing Robot Configuration. DO NOT REMOVE!
  vexcodeInit();
  // Begin project code
  // Print the value of the delivered variable
  bool delivered = false;
  // Print different messages depending on the Boolean.
  if (delivered) {
      Brain.Screen.print("Package delivered!");
  } else {
      Brain.Screen.print("Delivering...");
  }
  wait(2, seconds);

  // Clear the screen and print the value of the variable again
  Brain.Screen.clearScreen();
  Brain.Screen.setCursor(1,1);
  delivered = true;
  // Print different messages depending on the Boolean.
  if (delivered) {
      Brain.Screen.print("Package delivered!");
  } else {
      Brain.Screen.print("Delivering...");
  }
}
```


### Arrays


```{vexcode}
id: v5_variables_my_list
```

**Arrays** are fixed-size collections of elements of the same type, beginning at index 0. It is good practice to know the length of the array and declare at the time of creation.

```cpp
int main() {
  // Initializing Robot Configuration. DO NOT REMOVE!
  vexcodeInit();
  // Begin project code
  // Declare an array of 5 integers
  int distances[5] = {100, 200, 150, 300, 250};

  // Drive and turn 4 times to move the distance of the first four distances of the array
  for (int i = 0; i < 4; i++) {
      Drivetrain.driveFor(forward, distances[i], mm);
      Drivetrain.turnFor(right, 90, degrees);
  }
}
```

### 2D Arrays

```{vexcode}
id: v5_variables_my_2d_list
```

A **2D array** is commonly used to represent grids, tables, or matrices. Each row represents a specific grouping of data.

```cpp
int main() {
  // Initializing Robot Configuration. DO NOT REMOVE!
  vexcodeInit();
  // Begin project code
  // Assign the values in the matrix 2D array
  int matrix[3][3] = {
    { 0, 1, 2 },
    { 3, 4, 5 },
    { 6, 7, 8 }
  };

  // Loop through each row
  for (int i = 0; i < 3; i++) {
      // Loop through each column in the row
      for (int j = 0; j < 3; j++) {
          Brain.Screen.print("%d, ", matrix[i][j]);
      }
      Brain.Screen.newLine();
  }
}
```

You can modify specific elements within a 2D array:

```cpp
int main() {
  // Initializing Robot Configuration. DO NOT REMOVE!
  vexcodeInit();
  // Begin project code
  // Assign the values in the matrix 2D array
  int matrix[3][3] = {
    { 0, 1, 2 },
    { 3, 4, 5 },
    { 6, 7, 8 }
  };

  // Modify the color (in column 2) in row 0
  matrix[0][1] = 200;

  // Print the modified row from the matrix 2D array
  for (int j = 0; j < 3; j++) {
      Brain.Screen.print("%d, ", matrix[0][j]);
  }
}
```

### Constant Variables

A variable declared with <code>const</code> cannot be modified after it is initialized.

```cpp
int main() {
  // Initializing Robot Configuration. DO NOT REMOVE!
  vexcodeInit();

  const int maxSpeed = 100;

  // maxSpeed can be used like a normal variable
  Drivetrain.setDriveVelocity(maxSpeed, percent);
}
```