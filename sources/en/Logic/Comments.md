---
title: Comments | VEX V5 - C++ API
description: Explore the C++ API reference for using comments with VEX V5. Learn how to write comments to document and organize your code.
---


```{highlight} cpp
:linenothreshold: 5
```

# Comments

```{contents}
:local: true
```

## Introduction

Comments in C++ are used to add explanations or notes within the code. They do not affect how the code runs and are useful for clarifying logic, documenting functionality, or temporarily disabling parts of the code.  

### Comments

A single-line comment starts with <code>//</code> and continues until the end of the line.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// This is a single-line comment
printf("Hello!");  // Print a greeting message
```

```cpp
// Print a greeting and then a farewell
printf("Hello!");
printf("Goodbye!");
```

### Multiline Comments

C++ uses block comments (<code>/* ... */</code>) for multi-line explanations. These are true comments and are ignored by the compiler.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
/*
This project prints a greeting message,
followed by a farewell message
*/
printf("Hello!");
printf("Goodbye!");
```