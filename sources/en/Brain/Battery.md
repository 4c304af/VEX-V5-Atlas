---
title: Battery | Brain | VEX V5 - C++ API
description: Reference documentation for Brain.Battery in VEX V5 C++. Provides access to information about the V5 Brain battery.
---

# Battery

```{contents}
:local: true
```

## Introduction

The <code>battery</code> class is derived from the [<code>brain</code>](index.md) base class and provides access to the V5 Brain’s battery, allowing your robot to monitor capacity, voltage, current draw, power usage, temperature, and efficiency.

## Access

```cpp
Brain.Battery
```

## Member Functions

The <code>battery</code> class includes the following member functions:

- [<code>voltage</code>](#voltage) — Returns the battery voltage.
- [<code>current</code>](#current) — Returns the battery current draw.
- [<code>capacity</code>](#capacity) — Returns the brain's remaining battery capacity.
- [<code>temperature</code>](#temperature) — Returns the battery temperature.

Before calling any <code>battery</code> member functions, a <code>brain</code> instance must be created, as shown below:

```cpp
// Create the V5 Brain
brain Brain = brain();
```

### voltage

```{vexcode}
id: v5_sensing_brain_battery_voltage
```

Returns the voltage of the V5 Brain battery. Voltage is the electrical pressure supplied to the battery, which can help you check whether the battery is charged enough for the robot to run reliably.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double voltage( voltageUnits units = voltageUnits::volt );
```


<span style="font-size: 1.5rem; ">
  Parameters
</span>

|      Parameter     |            Type           | Description                                                                                                         |
| :----------------: | :-----------------------: | :------------------------------------------------------------------------------------------------------------------ |
| <code>units</code> | <code>voltageUnits</code> | Optional. The unit used to represent voltage: <code>volt</code> (default) — volts, or <code>mV</code> — millivolts |


<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the battery voltage in the specified units.

### current

```{vexcode}
id: v5_sensing_brain_battery_current
```

Returns the electrical current drawn from the V5 Brain battery. Current is how much electrical flow the robot is using from the battery, which can help you see how hard the robot is working or whether motors may be under extra load, ranging from 0.0 to 20.0 Amps. 

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
double current( currentUnits units = currentUnits::amp );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

|      Parameter     |            Type           | Description                                                                                                         |
| :----------------: | :-----------------------: | :------------------------------------------------------------------------------------------------------------------ |
| <code>units</code> | <code>currentUnits</code> | Optional. The unit used to represent current: <code>amp</code> (default) — amperes |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the electrical current drawn from the V5 Brain battery in amperes.

### capacity

```{vexcode}
id: v5_sensing_brain_battery_capacity
```

Returns the remaining battery level of the V5 Brain battery.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
uint32_t capacity( percentUnits units = percentUnits::pct );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

|      Parameter     |            Type           | Description                                                                                                                   |
| :----------------: | :-----------------------: | :---------------------------------------------------------------------------------------------------------------------------- |
| <code>units</code> | <code>percentUnits</code> | Optional. The unit used to represent battery capacity: <code>pct</code> / <code>percent</code> — percent |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>uint32_t</code> representing the remaining battery capacity as a percentage from 0% to 100%.

### temperature

Returns the temperature of the V5 Brain battery.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Returns the battery temperature as a percentage.
> ```cpp
> double temperature(
>     percentUnits units = percentUnits::pct );
> ```

> **__2__ —** Returns the battery temperature in the specified temperature units.
> ```cpp
> double temperature(
>     temperatureUnits units );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

|      Parameter     |              Type             | Description          |
| :----------------: | :---------------------------: | :----------- |
| <code>units</code> | <code>percentUnits</code> | Optional. The unit used to represent battery temperature: <code>pct</code> / <code>percent</code> (default) — percent |
| <code>units</code> | <code>temperatureUnits</code> | Returns the battery temperature in specific units: <code>celsius</code> — degrees Celsius, or <code>fahrenheit</code> — degrees Fahrenheit |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a <code>double</code> representing the remaining battery temperature in the specified units.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The operating temperature range for the battery is approximately <code>20°C</code> (<code>68°F</code>) to <code>70°C</code> (<code>158°F</code>).