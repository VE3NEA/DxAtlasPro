# Enabling the API

The WebSocket API is always on while DX Atlas Pro runs: there is nothing to switch on, and a
program can connect as soon as the main window is open, at

```
ws://127.0.0.1:7373/
```

DX Atlas Pro listens on the **loopback address only**, so only programs on the same computer can
connect; nothing on the network can reach the API.

## The Port

The port, 7373 by default, is set in **Tools > Settings**, *API* section, **Port**. A change takes
effect when you click OK or Apply, and closes the connections open at the time. If another program
already uses the port, DX Atlas Pro runs without the API and writes the error to its log, in the
`Logs` folder of the folder that **Help > Data Folder** opens.

Your program can read the port from DX Atlas Pro's settings file, `Settings.json` in that folder,
as `Api.Port`; where the file or the field is missing, the port is 7373.

## Web Pages

Any web page open in a browser could try to open a WebSocket to `127.0.0.1`, so DX Atlas Pro
refuses a connection from a web page unless you allow it. A browser always sends the page's origin
when it opens a WebSocket, and DX Atlas Pro refuses the connection, with HTTP status 403, when that
origin is not in **Tools > Settings**, *API* section, **Allowed Origins** - a list of origins
separated by spaces or commas, such as:

```
http://localhost:3000 https://my-logger.example.com
```

Programs that are not web pages - written in Python, C#, Node.js and so on - send no origin and are
always accepted.

## Starting DX Atlas Pro

If your program finds the port closed, it can start DX Atlas Pro itself and connect once the port
answers:

- **Windows** - `DxAtlasPro.exe` in the installation folder, `C:\Program Files\Afreet\DxAtlasPro`
  by default. DX Atlas Pro also registers itself under *App Paths* each time it starts, so
  `ShellExecute` or `start DxAtlasPro` finds it by name;
- **Linux** - `DxAtlasPro` in the folder where the tar.gz was unpacked.

Started with the `--automation` switch, DX Atlas Pro closes by itself shortly after its last API
client disconnects - the way the [COM bridge](com_bridge.md) starts it, so that a program that
started it does not leave it running. Without the switch, it stays open until the user closes it.

## When the API Is Off

A copy of DX Atlas Pro whose beta or trial period has expired does not open the port, so a client
cannot connect to it.
