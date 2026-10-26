---
title: Events | VEX V5 - C++ API
description: Reference documentation for the event class in VEX V5 C++. Includes constructors, functions, parameters, notes, and usage examples.
---


```{highlight} cpp
:linenothreshold: 5
```

# Events

```{contents}
:local: true
```

## Introduction

Events let you start a function asynchronously. When an event is broadcast, the event’s callback function is started in its own task (thread), so your main code can continue running at the same time.

**Important:** An <code>event</code> object stores **one callback**. If you register another function with the same event object, it **replaces** the previous callback.

If you want multiple things to happen from one trigger, either:
- Call multiple helper functions from a single callback, or
- Use multiple event objects and broadcast each one.
- Use separate [threads](Threads.md) to run tasks independently.

In order to create and then use an Event, follow these steps in order:

1. Create the event with [<code>event</code>](#create-an-event).
2. [Set the event’s callback](#operator) using the event name (ex: <code>myEvent(myCallback);</code>).
3. Broadcast an <code>event</code>:
    - [<code>broadcast</code>](#broadcast) — Triggers all registered functions in an event object to run in parallel.  
    - [<code>broadcastAndWait</code>](#broadcastandwait) — Triggers all registered functions in an event object and waits for them to finish before continuing.  

## Class Constructors

> **__1__ —** Creates an <code>event</code> object without a callback function.
> ```cpp
> event();
> ```

> **__2__ —** Creates an <code>event</code> object with a callback function.
> ```cpp
> event( void (* callback)(void) );
> ```

> **__3__ —** Creates an <code>event</code> object from another event with a callback function.
> ```cpp
> event( 
>   event v, 
>   void (* callback)(void) );
> ```

> **__4__ —** Creates an <code>event</code> object with a callback function that accepts an argument.
> ```cpp
> event( void (* callback)(void *), void *arg );
> ```

> **__5__ —** Creates an <code>event</code> object from another event with a callback function that accepts an argument.
> ```cpp
> event( event v, void (* callback)(void *), void *arg );
> ```

## Class Destructor

Destroys the <code>event</code> object and releases associated resources.

```cpp
~event();
```

## Parameters

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>callback</code> | <code>void (*)(void)</code> | A function that is previously defined to execute when the event is broadcasted. |
| <code>v</code> | <code>event</code> | An existing event object to copy from. |
| <code>callback</code> | <code>void (*)(void *)</code> | A function that accepts a void pointer argument and executes when the event is broadcasted. |
| <code>arg</code> | <code>void *</code> | A pointer to data that will be passed to the callback function. |

## Notes

- An <code>event</code> object stores **one callback**. If you register another function with the same event object, it **replaces** the previous callback.
- If you want multiple things to happen from one trigger, either:
  - Call multiple helper functions from a single callback, or
  - Use multiple event objects and broadcast each one.
  - Use separate threads to run tasks independently.

## Example

```cpp
// Create a callback function
void onMyEvent() {
  Brain.Screen.print("Callback function executed!");
}

int main() {
  // Create an event called myEvent and set onMyEvent
  // as the callback function.
  event myEvent(onMyEvent);
}
```

## Member Functions

The <code>event</code> class includes the following member functions:

- [<code>operator</code>](#operator) — Sets a callback function for the event.
- [<code>broadcast</code>](#broadcast) — Triggers the event's callback function to run in parallel.
- [<code>broadcastAndWait</code>](#broadcastandwait) — Triggers the event's callback function and waits for completion.

Before calling any <code>event</code> member functions, an <code>event</code> instance must be created, as shown below:

```cpp
/* This constructor is required when using VS Code.
Event configuration can be created with or without
a callback function as shown in the examples above. */

// Create an event without a callback
event myEvent;

// Or create an event with a callback
event myEvent(onMyEvent);
```


### operator

Sets a callback function for the event using the function call operator.

<span style="font-size: 1.5rem;">
  Available Functions
</span>

```cpp
void operator()( void (* callback)() );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>callback</code> | <code>void (*)(void)</code> | A previously defined callback function that is called automatically when the event is broadcast. The function must match the required callback signature. See [Callback Functions](Functions.md#callback-functions) for more information. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Setting a callback again replaces the previous callback.
- The callback function must have no parameters and return void.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
void drawSquare() {
  Brain.Screen.clearScreen();
  Brain.Screen.drawRectangle(40, 40, 120, 120);
}

void drawCircle() {
  Brain.Screen.clearScreen();
  Brain.Screen.drawCircle(100, 100, 60);
}

int main() {
  // Create the event drawEvent.
  event drawEvent;

  Brain.Screen.print("Drawing a square...");

  // Set the event to drawSquare.
  drawEvent(drawSquare);

  wait(1, seconds);

  // Trigger the event.
  drawEvent.broadcast();

  wait(1, seconds);

  Brain.Screen.clearScreen();
  Brain.Screen.setCursor(1, 1);
  Brain.Screen.print("Drawing a circle...");

  // Replace drawSquare with drawCircle.
  drawEvent(drawCircle);

  wait(1, seconds);

  // Trigger the event a second time.
  drawEvent.broadcast();
}
```

### broadcast

```{vexcode}
id: v5_events_event_broadcast
```

<code>broadcast</code> starts the event’s callback and continues immediately.

<span style="font-size: 1.5rem;">
  Member Functions
</span>

```cpp
void broadcast();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not take any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Create a callback function.
void onMyEvent() {
  Brain.Screen.clearScreen();
  Brain.Screen.setCursor(1, 1);
  Brain.Screen.print("Event fired!");
}

int main() {
  Brain.Screen.print("Broadcasting in 2 seconds...");

  // Create an event called myEvent and set onMyEvent
  // as the callback function.
  event myEvent(onMyEvent);

  wait(2, seconds);

  // Trigger the event.
  myEvent.broadcast();
}
```

### broadcastAndWait

Starts the callback and waits until it finishes (or times out).

<span style="font-size: 1.5rem;">
  Available Functions
</span>


```cpp
void broadcastAndWait( int32_t timeout = 60000 );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>timeout</code> | <code>int32_t</code> | The amount of milliseconds to wait before the code starts executing again (defaults to 60000). |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- Use this only with callbacks that end (no infinite loops).
- This is a waiting function that blocks execution until the callback completes or times out.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
void startDriving() {
  Drivetrain.drive(forward);
  wait(2, seconds);
}

int main() {
  Brain.Screen.print("Starting drive...");

  event driveEvent(startDriving);

  // Give the event time to be set.
  wait(0.25, seconds);

  // Run the event and wait until it finishes.
  driveEvent.broadcastAndWait();

  // Stop driving after 2 seconds.
  Drivetrain.stop();
  Brain.Screen.clearScreen();
  Brain.Screen.print("Drive complete!");
}
```
