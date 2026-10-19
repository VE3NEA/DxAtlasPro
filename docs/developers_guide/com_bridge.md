# The COM Bridge

Many logging and DX cluster programs drive DX Atlas 2 through its COM automation interface, the
`DxAtlas.Atlas` object. The COM bridge lets them drive DX Atlas Pro instead, unchanged: it is a
small COM server, `DxAtlasBridge.exe`, installed beside DX Atlas Pro on Windows, that registers
itself under DX Atlas 2's names - its ProgID, `DxAtlas.Atlas`, its class id and its type library -
and turns each call it receives into requests of the [WebSocket API](websocket_api.md).

The bridge exists for existing software. A new program should use the WebSocket API directly: it
can do everything the bridge does, and more.

## COM Registration

The DX Atlas Pro installer registers the bridge as a COM server, and uninstalling DX Atlas Pro
unregisters it. This COM registration replaces DX Atlas 2's: once DX Atlas Pro is installed, a program that creates
`DxAtlas.Atlas` gets DX Atlas Pro, whether DX Atlas 2 is installed or not. Both 32-bit and 64-bit
programs can use it.

To register or unregister the bridge as a COM server by hand, run in a command prompt opened as administrator:

```
"C:\Program Files\Afreet\DxAtlasPro\DxAtlasBridge.exe" /regserver
"C:\Program Files\Afreet\DxAtlasPro\DxAtlasBridge.exe" /unregserver
```

To give the `DxAtlas.Atlas` name back to DX Atlas 2, unregister the bridge, then reinstall
DX Atlas 2.

## How It Works

- Each `DxAtlas.Atlas` object a program creates opens its own connection to DX Atlas Pro, so what
  it draws is removed when the program releases the object, or exits.
- If DX Atlas Pro is not running, the bridge starts it, as creating the object started DX Atlas 2,
  and DX Atlas Pro closes by itself once the last program using it has released its object. If it
  is already running, the bridge uses the running copy, which stays open.
- Calls between `Map.BeginUpdate` and `Map.EndUpdate` are sent as one batch, so the map is drawn
  once, when `EndUpdate` is called.
- The bridge works on DX Atlas Pro's first map only.
- The bridge writes the errors it meets to its own log, having no window to show them in:
  `DxAtlasBridge_<date>.txt` in the `Logs` folder of the folder that **Help > Data Folder** opens,
  beside DX Atlas Pro's own `DxAtlasPro_<date>.txt`.
- A copy of DX Atlas Pro whose beta or trial period has expired does not accept connections, so
  creating the object fails.

## What Is Covered

Every object, property, method and event of DX Atlas 2's type library is there: `IAtlas`, `IDxMap`,
`IDxClock`, `ICustomLayers`, `ICustomLayer`, `ILabelInfo` and the `IDxAtlasEvents` events. Most map
to DX Atlas Pro's features directly; these work differently:

| DX Atlas 2 | DX Atlas Pro |
|---|---|
| `Map.Zoom` | converted to and from DX Atlas Pro's own zoom, so 1 is still the whole world |
| `Map.ReliefVisible`, `Land3D`, `Ocean3D` | **Land Relief** and **Ocean Relief**; `ReliefVisible` sets both, and reads as on while either is |
| `Map.PrefixesVisible` | the DXCC Entities layer, with its prefixes |
| `Map.ItuZonesVisible` | the ARRL ITU zones |
| `Map.GridSquaresVisible` | the VUCC grid squares |
| `Map.IonoLayer` | the Ionosphere button's maps: MUF, foF2, hmF2, foE and the D layer's density as theirs; the magnetic maps as Magnetic Dip; the aurora as the Aurora Oval |
| `Map.MouseMode` | `MM_USER` leaves the clicks to your program, as before; every other mode is DX Atlas Pro's own mouse handling |
| `Map.Dimmed` | the map drawn darker under your layers |
| `Map.PlotField` | DX Atlas 2's field, in its layout and bands |
| `Map.SaveImage` | the map as drawn on the screen, as PNG, or as BMP when asked |
| `Map.MarkSquare`, `Atlas.LoadSquares` | the worked and confirmed squares drawn as areas, yellow and green |
| `Atlas.LoadPins`, `Map.PinsVisible` | the pins of a DX Atlas 2 pin file drawn as red dots, with their comments as hints |
| `Atlas.IndexKind` | the Lists panel on the DXCC, Cities or IOTA layer |
| `Atlas.SaveSettings`, `LoadSettings` | DX Atlas Pro's settings, saved and loaded as JSON; a DX Atlas 2 `.ini` file is not read |
| custom layers | all five kinds - points, lines, areas, labels and glyphs - with their colours, brightness, fonts and glyph bitmaps; every line is drawn along the great circle |
| `LabelClicked`, `LabelHintRequest` | raised for labels and glyphs, with the `ILabelInfo` of DX Atlas 2; the hint set in `LabelHintRequest` is shown as before |

Accepted and ignored, as they have nothing to act on in DX Atlas Pro:

- `Atlas.LoadCities` and `Atlas.LoadIslands` - DX Atlas Pro has its own city and island lists;
- `Map.ShowFieldValue`, which did nothing in DX Atlas 2 either;
- `Map.ActiveLabels`.

## An Example

The [Examples](examples.md#vbscript-the-com-bridge) page has a VBScript program that drives DX Atlas
Pro through the bridge.
