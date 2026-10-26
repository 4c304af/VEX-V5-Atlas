---
title: Operators | VEX V5 - C++ API
description: Explore the C++ API reference for operators used with VEX V5. Find detailed descriptions for operators, usage, and examples.
---

```{highlight} cpp
:linenothreshold: 5
```
# Operators

```{contents}
:local: true
```

## Introduction

Operators in C++ are symbols that let you perform operations on variables and values. They include arithmetic, logical, comparison, assignment, and bitwise operators. C++ also supports increment/decrement, conditional expressions, and compound assignment. These form the core of most logic and math in any C++ program, including robotics control with VEXcode V5.

### Arithmetic

| Name            | Symbol | Operator    | Example                          |
|-----------------|:------:|-------------|----------------------------------|
| Addition        | <code>+</code>    | <code>a + b</code>     | <code>5 + 3   // 8</code>                  |
| Subtraction     | <code>-</code>    | <code>a - b</code>     | <code>10 - 3  // 7</code>                   |
| Multiplication  | <code>*</code>    | <code>a * b</code>     | <code>5 * 3   // 15</code>                  |
| Division        | <code>/</code>    | <code>a / b</code>     | <code>10 / 4  // 2 (integer division)</code>|
| Modulo          | <code>%</code>    | <code>a % b</code>     | <code>10 % 4  // 2</code>                   |
| Negation        | <code>-</code>    | <code>-a</code>        | <code>-5      // -5</code>                  |

### Augmented Arithmetic

| Name            | Symbol | Operator    | Example                          |
|-----------------|:------:|-------------|----------------------------------|
| Addition        | <code>+=</code>   | <code>a += b</code>    | <code>int a = 5;</code><br><code> int b = 3;</code><br><code> a += b; // a = 8</code> |
| Subtraction     | <code>-=</code>   | <code>a -= b</code>    | <code>int a = 10;</code><br><code> int b = 4;</code><br><code> a -= b; // a = 6</code>|
| Multiplication  | <code>*=</code>   | <code>a *= b</code>    | <code>int a = 2;</code><br><code> int b = 3;</code><br><code> a *= b; // a = 6</code> |
| Division        | <code>/=</code>   | <code>a /= b</code>    | <code>int a = 10;</code><br><code> int b = 4;</code><br><code> a /= b; // a = 2</code>|
| Modulo          | <code>%=</code>   | <code>a %= b</code>    | <code>int a = 10;</code><br><code> int b = 3;</code><br><code> a %= b; // a = 1</code>|

### Comparison

| Name                  | Symbol | Operator    | Example                        |
|-----------------------|:------:|-------------|--------------------------------|
| Equality              | <code>==</code>   | <code>a == b</code>    | <code>5 == 5    // true</code>            |
| Inequality            | <code>!=</code>   | <code>a != b</code>    | <code>5 != 10   // true</code>            |
| Greater Than          | <code>></code>    | <code>a > b</code>     | <code>10 > 5    // true</code>            |
| Less Than             | <code><</code>    | <code>a < b</code>     | <code>5 < 10    // true</code>            |
| Greater Than or Equal | <code>>=</code>   | <code>a >= b</code>    | <code>10 >= 10  // true</code>            |
| Less Than or Equal    | <code><=</code>   | <code>a <= b</code>    | <code>5 <= 5    // true</code>            |

### Logical

| Name         | Symbol | Operator       | Example                      |
|--------------|:------:|----------------|------------------------------|
| Logical AND  | <code>&&</code>   | <code>a && b</code>       | <code>true && false   // false</code>  |
| Logical OR   | <code>\|\|</code> | <code>a \|\| b</code>     | <code>false \|\| true  // true</code>   |
| Logical NOT  | <code>!</code>    | <code>!a</code>           | <code>!true           // false</code>  |


### Assignment

| Name         | Symbol | Operator    | Example                |
|--------------|:------:|-------------|------------------------|
| Assignment   | <code>=</code>    | <code>a = b</code>     | <code>int a = 10;</code>          |

### Bitwise

| Name                  | Symbol | Operator    | Example                         |
|-----------------------|:------:|-------------|---------------------------------|
| Bitwise AND           | <code>&</code>    | <code>a & b</code>     | <code>6 & 3   // 2 (0b110 & 0b011)</code>  |
| Bitwise OR            | <code>\|</code>   | <code>a \| b</code>    | <code>6 \| 3   // 7 (0b110 \| 0b011)</code> |
| Bitwise XOR           | <code>^</code>    | <code>a ^ b</code>     | <code>6 ^ 3   // 5 (0b110 ^ 0b011)</code>  |
| Bitwise NOT           | <code>~</code>    | <code>~a</code>        | <code>~5      // -6</code>                 |
| Left Shift            | <code><<</code>   | <code>a << b</code>    | <code>2 << 3  // 16</code>                 |
| Right Shift           | <code>>></code>   | <code>a >> b</code>    | <code>16 >> 2 // 4</code>                  |

### Augmented Bitwise

| Name         | Symbol | Operator    | Example                        |
|--------------|:------:|-------------|--------------------------------|
| Bitwise AND  | <code>&=</code>   | <code>a &= b</code>    | <code>int a = 6;</code><br><code>a &= 3;  // a = 2</code>      |
| Bitwise OR   | <code>\|=</code>  | <code>a \|= b</code>   | <code>int a = 6;</code><br><code>a \|= 3; // a = 7</code>      |
| Bitwise XOR  | <code>^=</code>   | <code>a ^= b</code>    | <code>int a = 6;</code><br><code>a ^= 3;  // a = 5</code>      |
| Left Shift   | <code><<=</code>  | <code>a <<= b</code>   | <code>int a = 5;</code><br><code>a <<= 2; // a = 20</code>    |
| Right Shift  | <code>>>=</code>  | <code>a >>= b</code>   | <code>int a = 20;</code><br><code>a >>= 2; // a = 5</code>    |

### Ternary (Conditional)

| Name                 | Syntax                       | Example                                |
|----------------------|------------------------------|----------------------------------------|
| Conditional Operator | <code>condition ? expr1 : expr2</code>  | <code>int a = 6;</code><br><code>int b = 3;</code><br><code>int max = (a > b) ? a : b; // max = 6</code>  |

### Increment / Decrement

| Name           | Symbol | Operator | Example                                                     |
|----------------|:------:|:--------:|:------------------------------------------------------------|
| Pre-Increment  | <code>++</code>   | <code>++a</code>    | <code>int a = 5;</code><br><code>int b = ++a;</code><br><code>// a = 6, b = 6</code>          |
| Post-Increment | <code>++</code>   | <code>a++</code>    | <code>int a = 5;</code><br><code>int b = a++;</code><br><code>// a = 6, b = 5</code>          |
| Pre-Decrement  | `--`   | `--a`    | `int a = 5;`<br>`int b = --a;`<br>`// a = 4, b = 4`          |
| Post-Decrement | `--`   | `a--`    | `int a = 5;`<br>`int b = a--;`<br>`// a = 4, b = 5`          |
