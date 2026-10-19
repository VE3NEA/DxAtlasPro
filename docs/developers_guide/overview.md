# Overview

DX Atlas Pro can be driven by other programs - loggers, DX cluster clients, contest software,
propagation tools - which move and zoom its maps, switch its layers, and draw their own data on
them: spots, paths, areas, labels, icons and colour-coded fields. It offers two interfaces for this:

- **the WebSocket API** - JSON-RPC 2.0 messages over a WebSocket on your own computer, usable from
  any language on Windows and Linux;
- **the COM bridge** - a COM server, on Windows only, that offers the automation interface of
  DX Atlas 2, so that programs written for DX Atlas work with DX Atlas Pro unchanged.

## Which One to Choose

| | WebSocket API | COM bridge |
|---|---|---|
| **Platforms** | Windows and Linux | Windows |
| **Languages** | any language with a WebSocket client: Python, JavaScript, C#, Java, Go, Delphi, ... | any COM client: Delphi, VB6, VBScript, C++, C#, ... |
| **Interface** | JSON objects, GeoJSON for the drawing | DX Atlas 2's `DxAtlas.Atlas` object and its properties |
| **Drawing** | per-feature styles, shapes, icons, long paths, features that expire, fields | DX Atlas 2's five layer kinds |
| **Use it for** | new programs | existing programs written for DX Atlas 2 |

Write a new program against the [WebSocket API](websocket_api.md). The [COM bridge](com_bridge.md)
exists for software that already drives DX Atlas 2: it translates each of DX Atlas's calls into the
WebSocket API, so it offers nothing the API does not, and everything it draws is limited to what
DX Atlas could draw.

## In This Guide

- [Enabling the API](enabling_the_api.md) - the port, the allowed web pages, and starting DX Atlas
  Pro from your program;
- [The WebSocket API](websocket_api.md) - the message format, the errors, the methods that read and
  set the state of the window, the maps, the clock and the settings, and the events;
- [Drawing on the Map](drawing.md) - custom layers of GeoJSON features, their styles, icons, fields
  and z-order;
- [The COM Bridge](com_bridge.md) - its registration as a COM server, and what it covers of DX Atlas 2's interface;
- [Examples](examples.md) - complete programs in C, Python, JavaScript and VBScript.
