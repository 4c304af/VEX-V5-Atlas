---
title: MessageLink | VEX V5 - C++ API
description: Explore the C++ API reference for using MessageLink with VEX V5. Find detailed descriptions for its methods, parameters, and usages.
---

```{highlight} cpp
:linenothreshold: 5
```

# Message Link

```{contents}
:local: true
```

## Introduction

The <code>message_link</code> class lets two V5 Brains communicate by sending short string messages with optional small data. It’s designed for robot-to-robot coordination — like starting routines, sharing sensor results, or triggering behaviors on another robot.

Every usage of [<code>send</code>](#send) adds a message to the linked V5 Brain’s queue, and the queue is read first-in, first-out (FIFO). If multiple messages are sent before the other V5 Brain uses [<code>receive</code>](#receive), they will be stored and returned one at a time in the order they were sent. Because messages can queue, repeatedly sending the same status every loop may create backlog; for time-critical logic, send only when values change.

**Important:** Both robots must be running projects that use <code>message_link</code> at the same time, or no messages will be sent/received.

## Class Constructors

```cpp
message_link( 
  int32_t     index, 
  const char  *name, 
  linkType    type, 
  bool        isWired = false ); 
```

## Class Destructor

Destroys the <code>message_link</code> object and releases associated resources.

```cpp
virtual ~message_link();
```

## Parameters

| Parameter | Type | Description |
|:---------:|:----:|:------------|
| <code>index</code> | <code>int32_t</code> | The Smart Port that the V5 Radio, or the Smart Cable, is connected to, written as <code>PORTx</code>, where <code>x</code> is the port number (for example, <code>PORT1</code>). |
| <code>name</code> | <code>char</code> | The name of the Message Link. |
| <code>type</code> | <code>linkType</code> | The type of link, either <code>linkType::manager</code> or <code>linkType::worker</code>. This information is used to correctly configure the radio and also determines available bandwidth for transmission and reception. A manager robot has double the available bandwidth (1040 bytes/second) to send information to the worker robot (520 bytes/second). <ul><li><code>linkType::manager</code> - The message_link object is a manager.</li><li><code>linkType::worker</code> - The message_link object is a worker.</li></ul>|
| <code>isWired</code> | <code>bool</code> | Whether the message_link object is wired. <ul><li><code>true</code> - The message_link object is wired.</li><li><code>false</code> - The message_link object is wireless.</li></ul> |

## Example

> __Code for Robot 1__
> ```cpp
> // Create a wireless link in Port 1
> message_link link = message_link(
>   PORT1, // index
>   "VEXRoboticsLink123456789", // name
>   linkType::manager, // type
>   true); // isWired
> ```
> __Code for Robot 2__
> ```cpp
> // Create a wireless link in Port 1
> message_link link = message_link(
>   PORT1, // index
>   "VEXRoboticsLink123456789", // name
>   linkType::worker, // type
>   true); // isWired
> ```


## Member Functions

The <code>message_link</code> class includes the following member functions:

- [<code>isLinked</code>](#islinked) — Returns whether this Brain is actively connected to its paired Brain.
- [<code>send</code>](#send) — Sends a message to the paired Brain.
- [<code>receive</code>](#receive) — Waits for and returns the next incoming message.
- [<code>received</code>](#received) — Registers a function to be called whenever a new message is received.

Before calling any <code>message_link</code> member functions, a <code>message_link</code> instance must be created, as shown below:

> __Code for Robot 1__
> ```cpp
> // Create a wireless link in Port 1
> message_link link = message_link(
>   PORT1, // index
>   "VEXRoboticsLink123456789", // name
>   linkType::manager, // type
>   true); // isWired
> ```
> __Code for Robot 2__
> ```cpp
> // Create a wireless link in Port 1
> message_link link = message_link(
>   PORT1, // index
>   "VEXRoboticsLink123456789", // name
>   linkType::worker, // type
>   true); // isWired
> ```


### isLinked
<code>isLinked</code> method returns whether the V5 Brains on a MessageLink are paired with one another.

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

This function returns a boolean value.
- <code>true</code> – The two V5 Brains are paired and communicating on this link.
- <code>false</code> – The two V5 Brains are not paired on this link.

<span style="font-size: 1.5rem; ">
  Notes
</span>

It is good practice to always check to ensure the V5 Brains are linked at the start of a project before running any further code.

<span style="font-size: 1.5rem; ">
  Examples
</span>

> __Code for Robot 1__
> ```cpp
>   // Tell the other robot when the screen is being pressed
>   // Create the link
>   message_link link = message_link(PORT1, "VEXRoboticsLink123456789", linkType::manager, true);
> 
>   // Do not run code UNTIL the Brains are linked
>   while (!link.isLinked()){
>     wait(0.1, seconds);
>   }
> 
>   Brain.Screen.print("Robot 1 - Manager");
> 
>   // Continuously send if the screen is being pressed
>   while (true){
>     if (Brain.Screen.pressing()){
>       link.send("pressed");
>     } else {
>       link.send("released");
>     }
>     wait(0.05, seconds);
>   }
> ```
> 
> __Code for Robot 2__
> ```cpp
>   // Display if the other robot's screen is being pressed
>
>   // Create the link
>   message_link link = message_link(PORT1, "VEXRoboticsLink123456789", linkType::worker, true);
>   
>   // Do not run code UNTIL the Brains are linked
>   while (!link.isLinked()){
>    wait(0.1, seconds);
>   }
> 
>   // Continuously check if Robot 1 has sent "pressed"
>   while (true){
>     Brain.Screen.clearScreen();
>     Brain.Screen.setCursor(1, 1);
>     Brain.Screen.print("Robot 2 - Worker");
>     Brain.Screen.newLine();
>     char msg[32] = {0};                         // buffer for incoming message
>     int32_t n = link.receive(msg, sizeof(msg), 100);  // wait up to 100ms
>     if (n > 0 && strcmp(msg, "pressed") == 0) {
>       Brain.Screen.newLine();
>       Brain.Screen.print("Manager is being pressed!");
>     }
>     wait(0.05, seconds);
>   }
> ```


### send

Sends a message over the link connection.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__ —** Sends a message string.
> ```cpp
> int32_t send( 
>   const char *message );
> ```
> **__2__ —** Sends a message string with a <code>double</code>.
> ```cpp        
> int32_t send( 
>   const char *message, 
>   double      value );
> ```
> **__3__ —** Sends a message string with an <code>int32_t</code> and a <code>double</code>.
> ```cpp
> int32_t send(
>   const char *message, 
>   int32_t     index, 
>   double      value );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:---------:|:----:|:------------|
| <code>message</code> | <code>const char*</code> | The message to send to the other linked V5 Brain. |
| <code>index</code> | <code>int32_t</code> | An integer to send to the other linked V5 Brain. |
| <code>value</code> | <code>double</code> | A double to send to the other linked V5 Brain. Doubles are formatted to 4 decimal places; if fewer decimals are provided, trailing zeros are added until 4 are shown. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return any values.

<span style="font-size: 1.5rem; ">
  Notes
</span>

If only <code>message</code> is sent, the other linked V5 Brain receives that exact message.

If <code>value</code> (and <code>index</code> if provided) are included, the receiving Brain gets a single encoded message that combines all fields in this order: <code>.message_index_value</code>

<span style="font-size: 1.5rem; ">
  Examples
</span>

Using <code>link.send("string", 1, 2.55)</code> is received as <code>.string_1_2.5500</code>.

> __Code for Robot 1__
> ```cpp
> // Tell the other robot when the screen is being pressed
>
> // Create the link
> message_link link = message_link(PORT1, "VEXRoboticsLink123456789", linkType::manager, true);
> 
> // Do not run code UNTIL the Brains are linked
> while (!link.isLinked()){
>   wait(0.1, seconds);
> }
> 
> Brain.Screen.print("Robot 1 - Manager");
> 
> // Continuously send if the screen is being pressed
> while (true){
>   if (Brain.Screen.pressing()){
>     link.send("pressed");
>   } else {
>     link.send("released");
>   }
>   wait(0.05, seconds);
> }
> ```
> 
> __Code for Robot 2__
> ```cpp
> // Display if the other robot's screen is being pressed
>
> // Create the link
> message_link link = message_link(PORT1, "VEXRoboticsLink123456789", linkType::worker, true);
> 
> // Do not run code UNTIL the Brains are linked
> while (!link.isLinked()){
>   wait(0.1, seconds);
> }
> // Continuously check if Robot 1 has sent "pressed"
> while (true){
>   Brain.Screen.clearScreen();
>   Brain.Screen.setCursor(1, 1);
>   Brain.Screen.print("Robot 2 - Worker");
>   Brain.Screen.newLine();
>   char msg[32] = {0};  // buffer for incoming message
>   int32_t n = link.receive(msg, sizeof(msg), 100);  // wait up to 100ms
>   if (n > 0 && strcmp(msg, "pressed") == 0) {
>     Brain.Screen.newLine();
>     Brain.Screen.print("Manager is being pressed!");
>   }
>   wait(0.05, seconds);
> }
> ```

### receive

Receives a message from the link connection.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
int32_t receive(
  char     *buffer,
  int32_t   length, 
  int32_t   timeoutMs = 500 );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:---------:|:----:|:------------|
| <code>buffer</code> | <code>char*</code> | The buffer to store the received message. |
| <code>length</code> | <code>int32_t</code> | The length of the buffer. |
| <code>timeoutMs</code> | <code>int32_t</code> |  How long in milliseconds <code>receive</code> will wait for a new message only if the queue is empty. Default is 300,000 (300 seconds). |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function returns the number of bytes received.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- <code>receive</code> returns the next queued message from the other linked V5 Brain. Messages are read in FIFO order (oldest unread first). If the queue is empty when <code>receive</code> is called, it waits up to the specified <code>timeout</code> for a new message. If no message arrives in that window, <code>receive</code> returns <code>0</code>, and any message sent afterward remains in the queue to be read the next time <code>receive</code> is used.
- If the other linked V5 Brain sent only a <code>string</code>, <code>receive</code> returns that exact string.
- If the other linked V5 Brain sent an integer and/or float, <code>receive</code> returns a single encoded string that combines all fields in this order: <code>.string_integer_float</code> 
  - For example, if the other linked V5 Brain uses <code>link.send("string", 1, 2.55)</code>, then using <code>link.receive()</code> returns an encoded string such as <code>.string_1_2.5500</code>. You can split this encoded string (see the examples below) to extract the message name, integer, and float values.
  - If you’d rather avoid manual splitting/parsing, use [<code>received</code>](#received) to register a handler for a specific message name; the handler receives the sent values as arguments.



<span style="font-size: 1.5rem; ">
  Examples
</span>

Using <code>link.send("string", 1, 2.55)</code> is received as <code>.string_1_2.5500</code>.

> __Code for Robot 1__
> ```cpp
> // Tell the other robot when the screen is being pressed
>
> // Create the link
> message_link link = message_link(PORT1, "VEXRoboticsLink123456789", linkType::manager, true);
> 
> // Do not run code UNTIL the Brains are linked
> while (!link.isLinked()){
>   wait(0.1, seconds);
> }
> 
> Brain.Screen.print("Robot 1 - Manager");
> 
> // Continuously send if the screen is being pressed
> while (true){
>   if (Brain.Screen.pressing()){
>     link.send("pressed");
>   } else {
>     link.send("released");
>   }
>   wait(0.05, seconds);
> }
> ```
> 
> __Code for Robot 2__
> ```cpp
> // Display if the other robot's screen is being pressed
>
> // Create the link
> message_link link = message_link(PORT1, "VEXRoboticsLink123456789", linkType::worker, true);
> 
> // Do not run code UNTIL the Brains are linked
> while (!link.isLinked()){
>   wait(0.1, seconds);
> }
> // Continuously check if Robot 1 has sent "pressed"
> while (true){
>   Brain.Screen.clearScreen();
>   Brain.Screen.setCursor(1, 1);
>   Brain.Screen.print("Robot 2 - Worker");
>   Brain.Screen.newLine();
>   char msg[32] = {0};   // buffer for incoming message
>   int32_t n = link.receive(msg, sizeof(msg), 100);  // wait up to 100ms
>   if (n > 0 && strcmp(msg, "pressed") == 0) {
>     Brain.Screen.newLine();
>     Brain.Screen.print("Manager is being pressed!");
>   }
>   wait(0.05, seconds);
> }
> ```

### received

Registers a function to be called whenever the V5 Brain receives a sent message.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

> **__1__** Registers a callback for all received messages (message + value).
> ```cpp
> void received(
>     void (* callback)(const char *, const char *, double)
> );
> ```
> **__2__** Registers a callback for all received messages (message + index + value).
> ```cpp
> void received(
>     void (* callback)(const char *, const char *, int32_t, double)
> );
> ```
> **__3__** Registers a callback for a specific message (message + value).
> ```cpp
> void received(
>     const char *message,
>     void      (* callback)(const char *, const char *, double)
> );
> ```
> **__4__** Registers a callback for a specific message (message + index + value).
> ```cpp
> void received(
>     const char *message,
>     void      (* callback)(const char *, const char *, int32_t, double)
> );
> ```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

|       Parameter       |            Type           | Description                                                                                        |
| :-------------------: | :-----------------------: | -------------------------------------------------------------------------------------------------- |
|  <code>message</code> | <code>const char *</code> | The message name to listen for. If omitted, the callback runs for all received messages. |
| <code>callback</code> | <code>void (*)(const char *, const char *, double)</code> or <code>void (*)(const char *, const char *, int32_t, double)</code> | A function that executes when a message is received. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

This function does not return any values.

<span style="font-size: 1.5rem; ">
  Callback Signature
</span>

> **__1__** Receives sender name, message name, and value.
> ```cpp
> void callback(const char *, const char *, double)
> ```
> **__2__** Receives sender name, message name, index, and value.
> ```cpp
> void callback(const char *, const char *, int32_t, double)
> ```

|            Type           | Description                            |
| :-----------------------: | -------------------------------------- |
| 1st <code>const char *</code> | The sender link name.                  |
| 2nd <code>const char *</code> | The message name received.             |
|    <code>int32_t</code>   | The index associated with the message. |
|    <code>double</code>    | The value associated with the message. |



<span style="font-size: 1.5rem; ">
  Examples
</span>

> __Code for Robot 1__
> ```cpp
> // Create the link.
> message_link link(PORT1, "LeftRightLink", linkType::manager, true);
>
> // Send whether screen is pressed on left or right.
> void screen_pressed() {
>   if (Brain.Screen.xPosition() < 240) {
>     link.send("left");
>   } else {
>     link.send("right");
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
>   Brain.Screen.pressed(screen_pressed);
> 
>   while (true) {
>     wait(10, msec);
>   }
> }
> ```
> 
> __Code for Robot 2__
> ```cpp
> // Create variable to track where screen is pressed.
> int lastPress = 0;
> 
> // Update the variable whenever a new message is received.
> void message_received(const char* message, const char* linkname, double timestamp) {
>   if (strcmp(message, "left") == 0)  lastPress = 1;
>   if (strcmp(message, "right") == 0) lastPress = 2;
> }
> 
> int main() {
>   /* vexcodeInit() is only required when using VEXcode.
>   Remove vexcodeInit() if compiling in VS Code. */
>   vexcodeInit();
> 
>   // Create the link.
>   message_link link(PORT1, "VEXRoboticsLink123456789", linkType::worker, true);
> 
>   // Do not run code UNTIL the Brains are linked.
>   while (!link.isLinked()) {
>     wait(0.1, seconds);
>   }
> 
>   link.received(message_received);
> 
>   // Display if Robot 1's screen was pressed on the left or right
>   while (true) {
>     Brain.Screen.clearScreen();
>     Brain.Screen.setCursor(1, 1);
>     Brain.Screen.print("Robot 2 - Worker");
>     Brain.Screen.newLine();
> 
>     if (lastPress == 1) {
>       Brain.Screen.print("Manager pressed LEFT");
>     } else if (lastPress == 2) {
>       Brain.Screen.print("Manager pressed RIGHT");
>     } else {
>       Brain.Screen.print("Waiting...");
>     }
> 
>     wait(0.1, seconds);
>   }
> }
> ```


