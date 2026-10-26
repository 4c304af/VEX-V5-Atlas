---
title: Serial Link | VEX V5 - C++ API
description: Reference documentation for the serial_link class in VEX V5 C++. Includes constructors, functions, parameters, notes, and usage examples.
---

```{highlight} cpp
:linenothreshold: 5
```

# Serial Link

```{contents}
:local: true
```

## Introduction

The <code>serial_link</code> class allows for a stream of raw bytes to be sent between robots. It's designed for robot-to-robot communication where the transmitting and receiving robot both understand the contents of the data stream. 

Every usage of [<code>send</code>](#send) adds data to the linked V5 Brain's queue, and the queue is read first-in, first-out (FIFO). If multiple messages are sent before the other V5 Brain uses receive, they will be stored and returned one at a time in the order they were sent. Because messages can queue, repeatedly sending the same status every loop may create backlog; for time-critical logic, send only when values change.

**Important:** Both robots must be running projects that use <code>serial_link</code> at the same time, or no data will be sent/received.

## Class Constructors

```cpp
serial_link(
 int32_t index,
 const char *name,
 linkType type,
 bool isWired = false );
```

## Class Destructor

Destroys the <code>serial_link</code> object and releases associated resources.

```cpp
~serial_link();
```

## Parameters

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>index</code> | <code>int32_t</code> | The Smart Port that the message link is connected to, written as <code>PORTx</code>, where <code>x</code> is the port number (for example, <code>PORT1</code>). |
| <code>name</code> | <code>const char*</code> | The name of this link. It is recommended that this unique string is long enough that when hashed by vexos it will create a unique ID. A bad link name would be something generic such as “vexlink” as it may be used by another team. |
| <code>type</code> | <code>linkType</code> | The type of link, either <code>linkType::manager</code> or <code>linkType::worker</code>. This information is used to correctly configure the radio and also determines available bandwidth for transmission and reception. A manager robot has double the available bandwidth (1040 bytes/second) to send information to the worker robot (520 bytes/second). <ul><li><code>linkType::manager</code> — The serial_link object is a manager</li><li><code>linkType::worker</code> — The serial_link object is a worker</li></ul>|
| <code>isWired</code> | <code>bool</code> | Whether the serial_link object is wired (defaults to <code>false</code>):<ul><li><code>true</code> — The serial_link object is wired</li><li><code>false</code> — The serial_link object is wireless</li></ul> |

## Notes

- VEXlink supports both wireless and wired communication, with wired connections recommending a modified smart cable to prevent power routing issues.
- For wireless communication, each robot needs a V5 Robot Radio connected to a Smart Port.
- The VEXlink Radio can be used alongside a V5 Controller's VEXnet radio, which should be connected to the highest numbered Smart Port to avoid conflicts.
- To create a VEXlink, both V5 Brains must be connected to a V5 Robot Radio.

## Example

> __Code for Robot 1__
> ```cpp
> // Create a wireless link in Port 1
> serial_link link = serial_link(
>   PORT1, // index
>   "VEXRoboticsLink123456789", // name
>   linkType::manager, // type
>   true); // isWired
> ```
> __Code for Robot 2__
> ```cpp
> // Create a wireless link in Port 1
> serial_link link = serial_link(
>   PORT1, // index
>   "VEXRoboticsLink123456789", // name
>   linkType::worker, // type
>   true); // isWired
> ```

## Member Functions

The <code>serial_link</code> class includes the following member functions:
- [<code>isLinked</code>](#islinked) — Checks if the V5 Brains are paired and communicating on this link.
- [<code>send</code>](#send) — Sends a message to the paired Brain.
- [<code>receive</code>](#receive) — Waits for and returns the next incoming message.
- [<code>received</code>](#received) — Registers a function to be called whenever a new message is received.

Before calling any <code>serial_link</code> member functions, a <code>serial_link</code> instance must be created, as shown below:

> __Code for Robot 1__
> ```cpp
> // Create a wireless link in Port 1
> serial_link link = serial_link(
>   PORT1, // index
>   "VEXRoboticsLink123456789", // name
>   linkType::manager, // type
>   true); // isWired
> ```
> __Code for Robot 2__
> ```cpp
> // Create a wireless link in Port 1
> serial_link link = serial_link(
>   PORT1, // index
>   "VEXRoboticsLink123456789", // name
>   linkType::worker, // type
>   true); // isWired
> ```

### isLinked

Returns whether the V5 Brains on a serial link are paired with one another.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
bool isLinked();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not have any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a Boolean indicating whether the V5 Brains are linked:

<ul>
  <li><code>true</code> — The two V5 Brains are paired and communicating on this link.</li>
  <li><code>false</code> — The two V5 Brains are not paired on this link.</li>
</ul>

<span style="font-size: 1.5rem; ">
  Notes
</span>

- It is good practice to always check to ensure the V5 Brains are linked at the start of a project before running any further code.

<span style="font-size: 1.5rem; ">
  Examples
</span>


> __Code for Robot 1__
> ```cpp
>   // Create the link
>   serial_link link(PORT1, "VEXRoboticsLink123456789", linkType::manager, true);
> 
>   // Do not run code UNTIL the Brains are linked
>   while (!link.isLinked()) {
>     wait(0.1, seconds);
>   }
> 
>   Brain.Screen.print("Robot 1 - Manager");
>   Brain.Screen.newLine();
>   Brain.Screen.print("Sending message...");
> 
>   // Message to send
>   const char* message = "Hello Robot 2";
> 
>   // Send the message
>   link.send((uint8_t*)message, strlen(message));
> ```

> __Code for Robot 2__
> ```cpp
>   // Create the link
>   serial_link link(PORT1, "VEXRoboticsLink123456789", linkType::worker, true);
> 
>   // Do not run code UNTIL the Brains are linked
>   while (!link.isLinked()) {
>     wait(0.1, seconds);
>   }
>   
>   Brain.Screen.print("Robot 2 - Worker");
>   Brain.Screen.newLine();
>   Brain.Screen.print("Waiting...");
> 
>   // Buffer to store incoming bytes
>   uint8_t buffer[32] = {0};
> 
>   int32_t n = link.receive(buffer, sizeof(buffer) - 1);
> 
>   // Null-terminate
>   if (n > 0) {
>     buffer[n] = 0;
> 
>     // Display the message that was sent
>     Brain.Screen.clearScreen();
>     Brain.Screen.setCursor(1, 1);
>     Brain.Screen.print("Robot 2 - Worker");
>     Brain.Screen.newLine();
>     Brain.Screen.print((char*)buffer);
>   }
>   else {
>     Brain.Screen.newLine();
>     Brain.Screen.print("No message received");
>   }
> ```

### send

Sends a message to the paired Brain.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Sends a message using a byte buffer.
> ```cpp
> int32_t send( 
>   uint8_t *buffer, 
>   int32_t  length );
> ```

> **__2__ —** Sends a message using a character buffer.
> ```cpp        
> int32_t send( 
>   const char *buffer, 
>   int32_t     length );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>buffer</code> | <code>uint8_t*</code> or <code>const char*</code> | The buffer to send to the other linked V5 Brain. |
| <code>length</code> | <code>int32_t</code> | The length of the buffer to send. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns an <code>int32_t</code> representing the number of bytes sent.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> __Code for Robot 1__
> ```cpp
>   // Create the link
>   serial_link link(PORT1, "VEXRoboticsLink123456789", linkType::manager, true);
>
>   // Do not run code UNTIL the Brains are linked
>   while (!link.isLinked()) {
>     wait(0.1, seconds);
>   }
> 
>   Brain.Screen.clearScreen();
>   Brain.Screen.setCursor(1, 1);
>   Brain.Screen.print("Robot 1 - Manager");
> 
>   // Track last sent state
>   uint8_t lastState = 255;  // impossible initial value
> 
>  // Tell Robot 2 when the screen is being pressed
>   while (true) {
>     uint8_t state = Brain.Screen.pressing() ? 1 : 0;
> 
>     // Only send if state changed
>     if (state != lastState) {
>       link.send(&state, 1);
>       lastState = state;
>     }
> 
>     wait(0.02, seconds);
>   }
> ```

> __Code for Robot 2__
> ```cpp
>   // Create the link
>   serial_link link(PORT1, "VEXRoboticsLink123456789", linkType::worker, true);
> 
>   // Do not run code UNTIL the Brains are linked
>    while (!link.isLinked()) {
>     wait(0.1, seconds);
>   }
> 
>   Brain.Screen.clearScreen();
>   Brain.Screen.setCursor(1, 1);
>   Brain.Screen.print("Robot 2 - Worker");
>   Brain.Screen.newLine();
>   Brain.Screen.print("Waiting...");
> 
>   // Track the last state
>   uint8_t lastShown = 255;
> 
>   while (true) {
>     // Variable stores 1 - pressed, 0 - not pressed 
>     uint8_t state = 0;
>     int32_t n = link.receive(&state, 1, 200);
> 
>     // Only update screen if state changes
>     if (n == 1 && state != lastShown) {
>       Brain.Screen.clearScreen();
>       Brain.Screen.setCursor(1, 1);
>       Brain.Screen.print("Robot 2 - Worker");
>       Brain.Screen.newLine();
> 
>       // Display text if Robot 1's screen is being pressed
>       if (state == 1) {
>         Brain.Screen.print("Manager IS being pressed!");
>       } else {
>         Brain.Screen.print("Manager is NOT being pressed");
>       }
> 
>       lastShown = state;
>     }
>     wait(0.02, seconds);
>   }
> ```


### receive

Waits for and returns the next incoming message.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Receives a message into a character buffer with optional timeout.
> ```cpp
> int32_t receive( 
>   char    *buffer, 
>   int32_t  length, 
>   int32_t  timeoutMs = 500);
> ```


<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>buffer</code> | <code>char*</code> | The buffer to store the received message. |
| <code>length</code> | <code>int32_t</code> | The length of the buffer. |
| <code>timeoutMs</code> | <code>int32_t</code> | How long in milliseconds <code>receive</code> will wait for a new message only if the queue is empty (defaults to 500ms). |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns an <code>int32_t</code> representing the number of bytes received.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- <code>receive</code> returns the next queued message from the other linked V5 Brain.
- Messages are read in FIFO order (oldest unread first).
- If the queue is empty when <code>receive</code> is called, it waits up to the specified <code>timeoutMs</code> for a new message.
- If no message arrives in that window, <code>receive</code> returns <code>0</code>, and any message sent afterward remains in the queue to be read the next time <code>receive</code> is used.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> __Code for Robot 1__
> ```cpp
>   // Create the link
>   serial_link link(PORT1, "VEXRoboticsLink123456789", linkType::manager, true);
>
>   // Do not run code UNTIL the Brains are linked
>   while (!link.isLinked()) {
>     wait(0.1, seconds);
>   }
> 
>   Brain.Screen.clearScreen();
>   Brain.Screen.setCursor(1, 1);
>   Brain.Screen.print("Robot 1 - Manager");
> 
>   // Track last sent state
>   uint8_t lastState = 255;  // impossible initial value
> 
>  // Tell Robot 2 when the screen is being pressed
>   while (true) {
>     uint8_t state = Brain.Screen.pressing() ? 1 : 0;
> 
>     // Only send if state changed
>     if (state != lastState) {
>       link.send(&state, 1);
>       lastState = state;
>     }
> 
>     wait(0.02, seconds);
>   }
> ```

> __Code for Robot 2__
> ```cpp
>   // Create the link
>   serial_link link(PORT1, "VEXRoboticsLink123456789", linkType::worker, true);
> 
>   // Do not run code UNTIL the Brains are linked
>    while (!link.isLinked()) {
>     wait(0.1, seconds);
>   }
> 
>   Brain.Screen.clearScreen();
>   Brain.Screen.setCursor(1, 1);
>   Brain.Screen.print("Robot 2 - Worker");
>   Brain.Screen.newLine();
>   Brain.Screen.print("Waiting...");
> 
>   // Track the last state
>   uint8_t lastShown = 255;
> 
>   while (true) {
>     // Variable stores 1 - pressed, 0 - not pressed 
>     uint8_t state = 0;
>     int32_t n = link.receive(&state, 1, 200);
> 
>     // Only update screen if state changes
>     if (n == 1 && state != lastShown) {
>       Brain.Screen.clearScreen();
>       Brain.Screen.setCursor(1, 1);
>       Brain.Screen.print("Robot 2 - Worker");
>       Brain.Screen.newLine();
> 
>       // Display text if Robot 1's screen is being pressed
>       if (state == 1) {
>         Brain.Screen.print("Manager IS being pressed!");
>       } else {
>         Brain.Screen.print("Manager is NOT being pressed");
>       }
> 
>       lastShown = state;
>     }
>     wait(0.02, seconds);
>   }
> ```


### received

Registers a function to be called whenever the V5 Brain receives data.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Registers a callback function for each received byte buffer.
> ```cpp
> void received( 
>   void (* callback)(uint8_t *, int32_t) );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|--|
| <code>callback</code> | <code>void (*)(uint8_t *, int32_t)</code> | A previously defined function that runs when the V5 Brain receives data. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return a value.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- <code>received</code> callbacks are called with two arguments: a byte buffer and the number of bytes received.
- The received data may not be null-terminated. If the callback treats the data as a string, copy the received bytes into a character array and add a null terminator.

<span style="font-size: 1.5rem; ">
  Callback Signature
</span>

<code>callback(buffer, length)</code>

| Argument | Description |
|:--:|---|
| <code>buffer</code> | A pointer to the received byte buffer. |
| <code>length</code> | The number of bytes received. |

<span style="font-size: 1.5rem; ">
  Examples
</span>

> __Code for Robot 1__
> ```cpp
> // Create the link.
> serial_link link(PORT1, "VEXRoboticsLink123456789", linkType::manager, true);
>
> // Send left or right when pressed.
> void screen_pressed() {
>   if (Brain.Screen.xPosition() < 240) {
>     link.send((uint8_t*)"left", 4);
>   } else {
>     link.send((uint8_t*)"right", 5);
>   }
> }
> 
> int main() {
>   /* vexcodeInit() is only required when using VEXcode.
>   Remove vexcodeInit() if compiling in VS Code. */
>   vexcodeInit();
> 
>   // Do not run code UNTIL the Brains are linked.
>   while (!link.isLinked()) {
>     wait(0.1, seconds);
>   }
>
>   Brain.Screen.print("Robot 1 - Manager");
> 
> 
>   Brain.Screen.pressed(screen_pressed);
>
>   while (true) {
>     wait(10, msec);
>   }
> }
> ```

> __Code for Robot 2__
> ```cpp
> // Called when message received.
> void received_callback(uint8_t *buffer, int32_t length) {
>   char msg[32];
> 
>   // Copy safely and null terminate.
>   int n = (length < 31) ? length : 31;
>   memcpy(msg, buffer, n);
>   msg[n] = '\0';
> 
>   Brain.Screen.clearScreen();
>   Brain.Screen.setCursor(1,1);
>   Brain.Screen.print("Robot 2 - Worker");
>   Brain.Screen.newLine();
> 
>   // Display if Robot 1's screen is pressed on left or right
>   if (strcmp(msg, "left") == 0) {
>     Brain.Screen.print("Manager pressed LEFT");
>   }
>   else if (strcmp(msg, "right") == 0) {
>     Brain.Screen.print("Manager pressed RIGHT");
>   }
> }
> 
> int main() {
>   /* vexcodeInit() is only required when using VEXcode.
>   Remove vexcodeInit() if compiling in VS Code. */
>   vexcodeInit();
> 
>   // Create the link.
>   serial_link link(PORT1, "VEXRoboticsLink123456789", linkType::worker, true);
> 
>   // Do not run code UNTIL the Brains are linked.
>   while (!link.isLinked()) {
>     wait(0.1, seconds);
>   }
> 
>   link.received(received_callback);
> 
>   Brain.Screen.clearScreen();
>   Brain.Screen.setCursor(1,1);
>   Brain.Screen.print("Robot 2 - Worker");
>   Brain.Screen.newLine();
>   Brain.Screen.print("Waiting...");
>
>   while (true) {
>     wait(10, msec);
>   }
> }
> ```
