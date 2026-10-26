---
title: SDcard | brain | VEX V5 - C++ API
description: Reference documentation for Brain.SDcard in VEX V5 C++. Describes how the SD card interface is accessed and used for file storage and retrieval.
---

# SDcard

```{contents}
:local: true
```

## Introduction

The <code>sdcard</code> class is derived from the [<code>brain</code>](index.md) base class and provides access to files stored on a removable SD card inserted into the V5 Brain.

Using the SD card, your robot can load data such as images, read and write files, and store information for later use or transfer to a computer.

<!-- Using an SD card with VEX V5 enables you to store and access files on a removable SD card inserted into the Brain's SD card slot. Whether you're saving sensor data or loading custom images, these methods provide full control over file operations. The removable SD card allows you to easily transfer data between your Brain and computer.

The V5 Brain requires an SD card no larger than 32GB, formatted as FAT32. SD cards larger than 32GB use exFAT formatting by default, which is not compatible with the V5 Brain. Ensure your SD card is properly formatted to FAT32 before use.

All files must be placed in the root folder of the SD card to be accessible. -->

### Access

```cpp
Brain.SDcard
```

### Notes

- The V5 Brain supports SD cards up to 32GB in size.
- The SD card must be formatted as FAT32.
    - SD cards larger than 32GB are typically formatted as exFAT, which is not compatible with the V5 Brain.
- All files must be placed in the root directory of the SD card to be accessible.
- The SD card must be inserted into the Brain before file operations can be performed.
- File names and paths are case-sensitive.

### Example

```cpp
/* This constructor is required when using VS Code.
A Brain is generated automatically at the start of
VEXcode projects. */

// Create the V5 Brain
brain Brain = brain();
```

```cpp
// Add more text and display file size
if (Brain.SDcard.exists("Text.txt")) {
  // Get the size of the file
  int fileSize = Brain.SDcard.size("Text.txt");

  // Make a buffer to hold the file data
  uint8_t buffer[fileSize];

  // Load the file from the SD card into the buffer
  Brain.SDcard.loadfile("Text.txt", buffer, sizeof(buffer));

  // Display the file contents on the screen
  Brain.Screen.print("%s", buffer);
}
```
## Member Functions 

The <code>sdcard</code> class includes the following member functions:

- [<code>loadfile</code>](#loadfile) — Loads the contents of a file from the SD card into a user-provided memory buffer.
- [<code>savefile</code>](#savefile) — Saves data from a user-provided buffer to a file on the V5 Brain’s SD card.
- [<code>appendfile</code>](#appendfile) — Appends data from a user-provided buffer to the end of an existing file on the V5 Brain’s SD card.
- [<code>isInserted</code>](#isinserted) — Returns whether an SD card is inserted into the Brain. 
- [<code>size</code>](#size) — Returns the size of a file stored on the V5 Brain’s SD card.
- [<code>exists</code>](#exists) — Returns whether a file with the specified name exists on the V5 Brain’s SD card.

.bmp and .png files stored on the SD card can be displayed on the V5 Brain screen using [<code>drawImageFromFile</code>](Screen.md#drawimagefromfile), which is accessed through [<code>Brain.Screen</code>](Screen.md).

Before calling any <code>sdcard</code> member functions, a <code>brain</code> instance must be created, as shown below:

```cpp
// Create the V5 Brain
brain Brain = brain();
```

### loadfile

Loads the contents of a file from the SD card into a user-provided memory buffer.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
int32_t loadfile(
  const char* name,
  uint8_t* buffer,
  int32_t len );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

| Parameter | Type | Description |
|:--:|:--:|:--|
| <code>name</code> | <code>const char*</code> | The name of the file to load from the SD card. The file's name must include the file extension.      |
| <code>buffer</code> | <code>uint8_t*</code> | A pointer to a buffer where the file data will be stored. |
| <code>len</code> | <code>int32_t</code> | The maximum number of bytes to read from the file, typically set to the size of the buffer. |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns an <code>int32_t</code> representing the number of bytes successfully read from the file:
- A positive value indicates how many bytes were loaded into the buffer.
- <code>0</code> indicates that no data was read.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- If the file is larger than <code>len</code>, only the first <code>len</code> bytes are read.
- The buffer must be large enough to hold the requested data.
- This function reads raw bytes and does not append a null terminator.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Check for SD card and show a file's text
if (Brain.SDcard.isInserted()) {
  // Create a message to save to the SD card
  uint8_t message[] = "Hello from VEX!";

  // Save the message into "Text.txt"
  Brain.SDcard.savefile("Text.txt", message, sizeof(message));

  // Get the size of the file
  int fileSize = Brain.SDcard.size("Text.txt");

  // Make a buffer to hold the file data
  uint8_t buffer[fileSize];

  // Load the file from the SD card into the buffer
  Brain.SDcard.loadfile("Text.txt", buffer, sizeof(buffer));

  // Display the file contents on the screen
  Brain.Screen.print("%s", buffer);
} else {
  Brain.Screen.print("Insert SD card");
}
```

### savefile

Saves data from a user-provided buffer to a file on the V5 Brain’s SD card.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
int32_t savefile(
  const char* name,
  uint8_t* buffer,
  int32_t len );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

|      Parameter      |           Type           | Description                                                                 |
| :-----------------: | :----------------------: | :-------------------------------------------------------------------------- |
|  <code>name</code>  | <code>const char*</code> | The name of the file to save as a string. The file's name must include the file extension.           |
| <code>buffer</code> |   <code>uint8_t*</code>  | A pointer to a memory buffer containing the data to be written to the file. |
|   <code>len</code>  |   <code>int32_t</code>   | The number of bytes to write from the buffer to the file.                   |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns an <code>int32_t</code> representing the number of bytes successfully written to the file:
- A positive value indicates how many bytes were saved.
- <code>0</code> indicates that no data was written.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- If the file is larger than <code>len</code>, only the first <code>len</code> bytes are read.
- If a file with the same name already exists, it will be overwritten.
- This function does not allocate memory; the buffer must be created and managed by the user.
- The function writes raw bytes and does not append a null terminator.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Check for SD card and show a file's text
if (Brain.SDcard.isInserted()) {
  // Create a message to save to the SD card
  uint8_t message[] = "Hello from VEX!";

  // Save the message into "Text.txt"
  Brain.SDcard.savefile("Text.txt", message, sizeof(message));

  // Get the size of the file
  int fileSize = Brain.SDcard.size("Text.txt");

  // Make a buffer to hold the file data
  uint8_t buffer[fileSize];

  // Load the file from the SD card into the buffer
  Brain.SDcard.loadfile("Text.txt", buffer, sizeof(buffer));

  // Display the file contents on the screen
  Brain.Screen.print("%s", buffer);
} else {
  Brain.Screen.print("Insert SD card");
}
```

### appendfile

Appends data from a user-provided buffer to the end of an existing file on the V5 Brain’s SD card.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
int32_t appendfile(
  const char* name,
  uint8_t* buffer,
  int32_t len );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

|      Parameter      |           Type           | Description                                                                  |
| :-----------------: | :----------------------: | :--------------------------------------------------------------------------- |
|  <code>name</code>  | <code>const char*</code> | The name of the file to append data to on the SD card. The file's name must include the file extension.                     |
| <code>buffer</code> |   <code>uint8_t*</code>  | A pointer to a memory buffer containing the data to be appended to the file. |
|   <code>len</code>  |   <code>int32_t</code>   | The number of bytes to append from the buffer to the file.                   |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns an <code>int32_t</code> representing the number of bytes successfully appended to the file:
- A positive value indicates how many bytes were appended.
- <code>0</code> indicates that no data was appended.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- If the file is larger than <code>len</code>, only the first <code>len</code> bytes are read.
- The file must already exist on the SD card; this function does not create a new file.
- This function does not allocate memory; the buffer must be created and managed by the user.
- The function appends raw bytes and does not append a null terminator.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Create a message to save to a new file
uint8_t message[] = "Hello";

// Save only the characters, not the null terminator
Brain.SDcard.savefile("Message.txt", message, sizeof(message) - 1);

// Load the file
int fileSize = Brain.SDcard.size("Message.txt");
uint8_t buffer[fileSize + 1];
Brain.SDcard.loadfile("Message.txt", buffer, fileSize);

// Add null terminator so it can be printed safely
buffer[fileSize] = 0;
Brain.Screen.print("%s\n", buffer);

// Create more text to append to the same file
uint8_t moreText[] = " World!";

// Append only the characters, not the null terminator
Brain.SDcard.appendfile("Message.txt", moreText, sizeof(moreText) - 1);

// Load the updated file
fileSize = Brain.SDcard.size("Message.txt");
uint8_t buffer2[fileSize + 1];
Brain.SDcard.loadfile("Message.txt", buffer2, fileSize);

// Add null terminator
buffer2[fileSize] = 0;
Brain.Screen.newLine();
Brain.Screen.print("%s", buffer2);
```

### isInserted

Returns whether an SD card is currently inserted in the V5 Brain.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
bool isInserted();
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

This function does not accept any parameters.

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a Boolean indicating whether an SD card is inserted:

- <code>true</code> — An SD card is inserted in the V5 Brain.
- <code>false</code> — No SD card is inserted.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- This function only checks for the presence of an SD card; it does not verify that the card is formatted or readable.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Check for SD card and show a file's text
if (Brain.SDcard.isInserted()) {
  // Create a message to save to the SD card
  uint8_t message[] = "Hello from VEX!";

  // Save the message into "Text.txt"
  Brain.SDcard.savefile("Text.txt", message, sizeof(message));

  // Get the size of the file
  int fileSize = Brain.SDcard.size("Text.txt");

  // Make a buffer to hold the file data
  uint8_t buffer[fileSize];

  // Load the file from the SD card into the buffer
  Brain.SDcard.loadfile("Text.txt", buffer, sizeof(buffer));

  // Display the file contents on the screen
  Brain.Screen.print("%s", buffer);
} else {
  Brain.Screen.print("Insert SD card");
  }
```

### size

Returns the size of a file stored on the V5 Brain’s SD card.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
int32_t size(
  const char* name );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

|     Parameter     |           Type           | Description                          |
| :---------------: | :----------------------: | :----------------------------------- |
| <code>name</code> | <code>const char*</code> | The name of the file on the SD card. The file's name must include the file extension.   |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns an <code>int32_t</code> representing the size of the file in bytes:
- A positive value indicates the file size in bytes.
- <code>0</code> indicates an empty file or that the file could not be found.

<span style="font-size: 1.5rem; ">
  Notes
</span>

- The returned size can be used to allocate a buffer before calling [<code>loadfile</code>](#loadfile).

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Check for SD card and show a file's text
if (Brain.SDcard.isInserted()) {
  // Create a message to save to the SD card
  uint8_t message[] = "Hello from VEX!";

  // Save the message into "Text.txt"
  Brain.SDcard.savefile("Text.txt", message, sizeof(message));

  // Get the size of the file
  int fileSize = Brain.SDcard.size("Text.txt");

  // Make a buffer to hold the file data
  uint8_t buffer[fileSize];

  // Load the file from the SD card into the buffer
  Brain.SDcard.loadfile("Text.txt", buffer, sizeof(buffer));

  // Display the file contents on the screen
  Brain.Screen.print("%s", buffer);
} else {
  Brain.Screen.print("Insert SD card");
}
```

### exists

Returns whether a file with the specified name exists on the V5 Brain’s SD card.

<span style="font-size: 1.5rem; ">
  Available Functions
</span>

```cpp
bool exists(
  const char* name );
```

<span style="font-size: 1.5rem; ">
  Parameters
</span>

|     Parameter     |           Type           | Description                          |
| :---------------: | :----------------------: | :----------------------------------- |
| <code>name</code> | <code>const char*</code> | The name of the file to check on the SD card. The file's name must include the file extension.   |

<span style="font-size: 1.5rem; ">
  Return Values
</span>

Returns a Boolean indicating whether the file exists:

- <code>true</code> — A file with the specified name exists on the SD card.
- <code>false</code> — No file with the specified name exists.

<span style="font-size: 1.5rem; ">
  Examples
</span>

```cpp
// Add more text and display file size
if (Brain.SDcard.exists("Text.txt")) {
  // Get the size of the file
  int fileSize = Brain.SDcard.size("Text.txt");

  // Make a buffer to hold the file data
  uint8_t buffer[fileSize];

  // Load the file from the SD card into the buffer
  Brain.SDcard.loadfile("Text.txt", buffer, sizeof(buffer));

  // Display the file contents on the screen
  Brain.Screen.print("%s", buffer);
}
```