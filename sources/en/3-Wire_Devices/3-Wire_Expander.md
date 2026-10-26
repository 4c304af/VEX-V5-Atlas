---
title: 3-Wire Expander | VEX V5 - C++ API
description: Reference documentation for the triport class in VEX V5 C++. Includes constructors, functions, parameters, notes, and member functions.
---


```{highlight} cpp
:linenothreshold: 5
```

# 3-Wire Expander

```{contents}
:local: true
```

## Introduction

The <code>triport</code> class is used to configure a 3-Wire Expander, allowing additional 3-Wire ports to be used with the V5 Brain.

![The VEX V5 3-Wire Expander.](/_static/img/sensing/expander.png)

## Class Constructor

```cpp
triport(
  int32_t index );
```

## Class Destructor

Destroys the <code>triport</code> object and releases associated resources.

```cpp
virtual ~triport();
```

## Parameters

| Parameter | Type | Description |
|:---------:| :------: | :------------|
| <code>index</code>    | <code>int32_t</code> | The Smart Port that the 3-Wire Expander is connected to, written as <code>PORTx</code>, where <code>x</code> is the port number (for example, <code>PORT1</code>). |

## Examples

```cpp
// Create a triport instance in Port 1.
triport Expander1 = triport(PORT1);
```

<!-- <span style="font-size: 1.5rem; ">
  Notes
</span>

- After a <code>triport</code> instance has been created, an additional option will appear in the Devices window in VEXcode, allowing 3-Wire devices to connect to the ports on the expander. -->
