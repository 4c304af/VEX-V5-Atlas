---
title: Pneumatics | VEX V5 - C++ API
description: Reference documentation for the CTE Pneumatics system in VEX V5 C++. Includes cylinder control, pump operations, and connection status functions.
---

# Pneumatics

```{contents}
:local: true
```

## Introduction

The VEX V5 Brain can control the **CTE Pneumatic system** using the <code>pneumatic</code> class. This class allows the Brain to control the pneumatic pump and extend or retract pneumatic cylinders.

**Note**: CTE Pneumatic commands require the CTE module. Import it using <code>using namespace cte;</code>.

## Class Constructors

```cpp
pneumatic( 
  int32_t index );
```

## Class Destructor

Destroys the <code>pneumatic</code> object and releases associated resources.

```cpp
~pneumatic();
```

## Parameters

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>index</code> | <code>int32_t</code> | The Smart Port that the CTE Pneumatic Solenoid is connected to (e.g., PORT1). |

## Notes

- CTE Pneumatic commands will only work with the CTE Pneumatic parts.
- You must manually import the CTE module: <code>using namespace cte;</code>.
- The system can control up to 4 cylinders individually or all at once.

## Example

```cpp
using namespace cte;

// Create a CTE Pneumatic Solenoid in Port 1
pneumatic ctePneumatic1 = pneumatic(PORT1);

// Turn on the pump and extend cylinder 1
ctePneumatic1.pump_on();
ctePneumatic1.extend(cylinder1);
```

## Member Functions

The <code>pneumatic</code> class includes the following member functions:

- [<code>extend</code>](#extend) — Extend a cylinder.
- [<code>retract</code>](#retract) — Retract a cylinder.
- [<code>pump_on</code>](#pump-on) — Turns the pneumatic pump on.
- [<code>pump_off</code>](#pump-off) — Turns the pneumatic pump off.
- [<code>pump</code>](#pump) — Turns the pneumatic pump on or off.
- [<code>installed</code>](#installed) — Returns whether or not the solenoid is connected to the brain.

Before calling any <code>pneumatic</code> member functions, a <code>pneumatic</code> instance must be created, as shown below:

```cpp
using namespace cte;

/* This constructor is required to use a
CTE Pneumatic Solenoid. Replace the values
as needed. */

// Create the pneumatic instance on Port 1
pneumatic ctePneumatics1 = pneumatic(PORT1);
```

### extend

Extends a pneumatic cylinder.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void extend( 
  cylinderType id );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>id</code> | <code>cylinderType</code> | The cylinder to extend: <ul><li><code>cylinder1</code></li><li><code>cylinder2</code></li><li><code>cylinder3</code></li><li><code>cylinder4</code></li><li><code>cylinderAll</code> – All 4 cylinders</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Extend cylinder 1
ctePneumatic1.extend(cylinder1);

// Extend all cylinders
ctePneumatic1.extend(cylinderAll);
```

### retract

Retracts a pneumatic cylinder.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void retract( 
  cylinderType id );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>id</code> | <code>cylinderType</code> | The cylinder to retract: <ul><li><code>cylinder1</code></li><li><code>cylinder2</code></li><li><code>cylinder3</code></li><li><code>cylinder4</code></li><li><code>cylinderAll</code> – All 4 cylinders</li></ul> |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Retract cylinder 2
ctePneumatic1.retract(cylinder2);

// Retract all cylinders
ctePneumatic1.retract(cylinderAll);
```

### pump_on

Turns the pneumatic pump on.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void pump_on();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not have parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Turn the pneumatic pump on
ctePneumatic1.pump_on();
```

### pump_off

Turns the pneumatic pump off.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void pump_off();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not have parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Turn the pneumatic pump off
ctePneumatic1.pump_off();
```

### pump

Turns the pneumatic pump on or off.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void pump( 
  bool state );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>state</code> | <code>bool</code> | The state to set: <code>true</code> turns the pneumatic pump on. <code>false</code> turns the pneumatic pump off. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Turn the pump on
ctePneumatic1.pump(true);

// Turn the pump off
ctePneumatic1.pump(false);
```

### installed

Returns whether the CTE Pneumatic Solenoid is connected to the Brain.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
bool installed();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not have parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a Boolean indicating whether the solenoid is connected to the Brain or not.

- <code>true</code> if the solenoid is connected to the Brain.
- <code>false</code> if the solenoid is not connected to the Brain.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Check if the pneumatic solenoid is connected
if (ctePneumatic1.installed()) {
  // Pneumatic system is ready
  ctePneumatic1.pump_on();
}
```
