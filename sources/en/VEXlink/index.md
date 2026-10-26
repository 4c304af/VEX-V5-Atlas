---
title: VEXlink | VEX V5 - C++ API
description: Explore the C++ API reference for using VEXlink to connect two V5 Brains.
---

```{highlight} cpp
:linenothreshold: 5
```

# VEXlink

VEX Link is a communication system that lets one V5 Brain talk directly to another. With VEX Link, robots can exchange commands and data in real time-so they can coordinate, collaborate, and act like a team instead of isolated machines.

- [**MessageLink**](MessageLink.md) -  A high-level, easy way to send labeled commands or small data packets between two V5 Brains for quick robot-to-robot coordination.
- [**SerialLink**](SerialLink.md) - A low-level byte-stream connection that lets you send custom, continuous data between Brains when you need more control over the format and flow.

```{toctree}
:caption: Related Classes
:titlesonly: true
:hidden:

./MessageLink
./SerialLink
```
