---
title: Sound | VEX V5 - C++ API
description: Explore the C++ API reference for the Sound category with VEX V5. Find detailed descriptions for functions, parameters, and usage examples to play sounds through the computer running VEXcode that the V5 Brain is connected to.
---

```{highlight} cpp
:linenothreshold: 5
```

# Sound

```{contents}
:local: true
```

## Introduction

The Sound functions play built-in VEXcode sounds through the computer running VEXcode that the V5 Brain is connected to.

Below is a list of all functions:

**Actions — Play sounds.**
- [<code>playVexcodeSound</code>](#playvexcodesound) — Play a built-in VEXcode sound through the computer.

## Actions

### playVexcodeSound

```{vexcode_new}
id: v5_sound_play
```

<code>playVexcodeSound</code> plays a built-in VEXcode sound through the computer running VEXcode that the V5 Brain is connected to.

**Usage:**<br>
<code>playVexcodeSound(sound);</code>

| Parameter | Type | Description |
| :-------: | :--: | :---------- |
| <code>sound</code> | <code>const char*</code> | The sound to play: <code>"game over"</code>. |

**Return Value:**<br>
This function does not return a value.

```cpp
// Play the game over sound
playVexcodeSound("game over");
```
