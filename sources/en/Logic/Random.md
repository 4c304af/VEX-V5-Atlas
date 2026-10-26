---
title: Random | VEX V5 - C++ API
description: Reference documentation for random number generation in VEX V5 C++. Includes functions for generating random integers and setting seeds.
---

```{highlight} cpp
:linenothreshold: 5
```

# Random

```{contents}
:local: true
```

## Introduction

The C++ Standard Library provides functions to generate pseudo-random numbers. These can be used in VEXcode V5 for behaviors that require variability or chance.

## Functions

The <code>&lt;cstdlib&gt;</code> library includes the following functions:

- [<code>rand</code>](#rand) — Returns a random integer.
- [<code>srand</code>](#srand) — Sets the random seed.

### rand

Returns a random integer between 0 and 2,147,483,647.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
int rand();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a random integer between 0 and 32767.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- To return a random integer within an exclusive limit, use the pattern <code>rand() % max</code>.
- To return a random integer within a specific range, use the pattern <code>rand() % (max - min + 1) + min</code>.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Display a random number
Brain.Screen.print("%d", rand());
```

```cpp
// Display a random number between 0 and 100
Brain.Screen.print("%d", rand() % 101);
```

```cpp
// Display a random number between 5 and 10
Brain.Screen.print("%d", rand() % (10 - 5 + 1) + 5);
```

### srand

Sets the seed to be used by the pseudo-random number generator in the [<code>rand</code>](#rand) function.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void srand( unsigned int seed );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>seed</code> | <code>unsigned int</code> | The starting seed value. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Call <code>srand</code> only once, near the start of your project, before calling <code>rand</code>. You do not need to call it before every <code>rand</code>.
- If <code>srand</code> is never called, the program behaves as if <code>srand(1)</code> was used. This means <code>rand</code> produces the same sequence of numbers every time the project runs.
- To get different results each time the project runs, seed with a value that changes between runs, such as the [Brain's timer](../Logic/Timer.md#time).
- To get the same results every time (useful for testing), seed with a fixed number such as <code>srand(1)</code>.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Use the same seed for random number
srand(5);
Brain.Screen.print("%d", rand() % 100);
```
