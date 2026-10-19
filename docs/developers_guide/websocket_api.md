# The WebSocket API

## Messages

The API is [JSON-RPC 2.0](https://www.jsonrpc.org/specification) over a WebSocket at
`ws://127.0.0.1:7373/` (see [Enabling the API](enabling_the_api.md) for the port). Each message is
one JSON text frame; binary frames close the connection.

A **request** names a method, carries its parameters, if any, in `params`, and an `id`, a number or
a string of your choice, which DX Atlas Pro returns with the answer:

```json
→ {"jsonrpc": "2.0", "id": 1, "method": "home.get"}
← {"jsonrpc": "2.0", "id": 1, "result": {"lat": 43.7, "lon": -79.4}}
```

A method that has nothing to return answers `"result": null`. A request without an `id` is a
*notification*: it runs, but is not answered.

Requests on one connection run in the order they are sent, each message completed before the next
is read.

### Batches

An array of requests is a **batch**: all of its requests run together, before the map is drawn
again, so a client that changes the view and draws its layers in one batch never shows the map
half-updated. The answer is an array of the answers, in the order of the requests, leaving out the
notifications:

```json
→ [{"jsonrpc": "2.0", "id": 5, "method": "home.get"},
   {"jsonrpc": "2.0", "method": "window.bringToFront"},
   {"jsonrpc": "2.0", "id": 6, "method": "app.info"}]
← [{"jsonrpc": "2.0", "id": 5, "result": {"lat": 43.7, "lon": -79.4}},
   {"jsonrpc": "2.0", "id": 6, "result": {"version": "0.91.0", "apiVersion": 1, "maps": 2}}]
```

### Errors

A request that fails is answered with an `error` in place of the `result`:

```json
→ {"jsonrpc": "2.0", "id": 2, "method": "map.set", "params": {"map": 3}}
← {"jsonrpc": "2.0", "id": 2, "error": {"code": -32602, "message": "no map 3; maps are 1 and 2"}}
```

| Code | Meaning |
|---|---|
| -32700 | the message is not valid JSON |
| -32600 | the message is not a valid JSON-RPC request |
| -32601 | there is no such method |
| -32602 | the parameters are wrong; the message says which and why |
| -32603 | an internal error in DX Atlas Pro |
| 1 | no such layer or image |
| 2 | not possible now, such as saving the image of a map that is not shown |

Each request of a batch succeeds or fails on its own.

### Events

DX Atlas Pro tells a client what happens on the map - clicks, mouse moves, changes made by the
user - with **events**: notifications from DX Atlas Pro, which have a `method` and `params` but no
`id`. Nothing is sent until the client subscribes to the events it wants; see
[Subscribing to Events](#subscribing-to-events).

```json
← {"jsonrpc": "2.0", "method": "map.clicked", "params": {"map": 1, "lat": 51.5, "lon": -0.1}}
```

### Conventions

- **Maps** - DX Atlas Pro has two map panels, numbered 1 and 2. A method that acts on a map takes
  an optional `"map": 1` or `"map": 2`, map 1 when it is left out.
- **Coordinates** - in degrees, latitude positive north and longitude positive east. As named
  fields they are `lat` and `lon`; as arrays, as in GeoJSON, `[lon, lat]`.
- **Zoom** - in kilometres per pixel at the centre of the map, `kmPerPixel`, a number that means
  the same on all three projections and at any window size.
- **Colours** - `#RRGGBB`, or `#AARRGGBB` with an alpha, `00` for transparent and `FF` for opaque.
- **Times** - ISO 8601, in UTC, such as `"2026-10-19T15:43:22Z"`.
- **Names** - the API's own objects use camelCase names, such as `centerLat`; the settings and the
  colours, which are DX Atlas Pro's files, keep the names those files use, such as `Home`. Names
  are read regardless of case.

## Getting and Setting State

The state of DX Atlas Pro is read and changed in blocks - the window, a map, the clock, the home
location, the settings and the colours - each with a `get` method, which returns the whole block,
and a `set` method, which takes any part of it:

```json
→ {"jsonrpc": "2.0", "id": 3, "method": "map.set", "params": {"projection": "azimuthal", "kmPerPixel": 20}}
← {"jsonrpc": "2.0", "id": 3, "result": null}
```

A `set` changes only the fields it is given and leaves the others as they are. These changes are
the user's own: they stay after the client disconnects, as if the user had made them.

### app.info

Returns the version of DX Atlas Pro, the version of the API, and the number of maps:

```json
{"version": "0.91.0", "apiVersion": 1, "maps": 2}
```

`apiVersion` grows when the API changes in a way that a client must know of.

### window.get, window.set

The main window:

```json
{
  "left": 1112, "top": 561, "width": 1600, "height": 950,
  "visible": true,
  "toolbar": true,
  "lists": {"visible": true, "kind": "dxcc", "width": 347}
}
```

- `left`, `top` - the window's position on the screen, in screen pixels;
- `width`, `height` - its size, in device-independent pixels;
- `visible` - `false` hides the window, `true` shows it;
- `toolbar` - whether the toolbars above the maps are shown;
- `lists` - the Lists panel: whether it is shown, the layer it lists, by the id of that layer, such
  as `dxcc`, `cities` or `pins`, and its width, which is read only.

### window.bringToFront

Shows the main window if it is hidden or minimized and brings it to the front.

### map.get, map.set

One map's view and switches; `map.get` takes `{"map": 2}` for the second map.

```json
{
  "map": 1,
  "width": 1245, "height": 823,
  "projection": "rectangular",
  "centerLat": 0, "centerLon": 0,
  "kmPerPixel": 32.15,
  "landRelief": true,
  "oceanRelief": true,
  "dimmed": false,
  "toggles": {
    "Overlays": {"graticule": false, "gray_line": false, "cq_zones": true, ...},
    "Labels": {"countries": true, "cities": true, ...},
    "IonoMap": "None",
    "MagDip": false,
    "Aurora": false
  },
  "dx": {"lat": 0, "lon": 0, "visible": false},
  "mouseMode": "app"
}
```

- `width`, `height` - the map's size in device-independent pixels, read only;
- `projection` - `rectangular`, `azimuthal` or `globe`. A switch to the azimuthal projection
  centres the map on the home location, as the Projection button does, unless the same `map.set`
  gives a centre;
- `centerLat`, `centerLon` - the centre of the map;
- `kmPerPixel` - the zoom, which DX Atlas Pro keeps within its zoom limits; null, and not settable,
  while the map is not shown;
- `landRelief`, `oceanRelief` - the Layers button's **Land Relief** and **Ocean Relief**;
- `dimmed` - draws the map darker, under the lines and labels, so that a client's drawing stands
  out;
- `toggles` - the switches of the map toolbar's menus, below; `map.set` changes only the keys it
  is given;
- `dx` - a DX station marker, a red antenna, drawn at `lat`, `lon` while `visible`;
- `mouseMode` - `app`, where a click on the map does what the user's settings say, or `client`,
  where it does nothing but send the `map.clicked` event, so the click is left to your program.

`toggles.Overlays`, by key:

| Key | Menu item |
|---|---|
| `home` | Layers > Home |
| `lakes`, `rivers_lake_centerlines_scale_rank`, `antarctic_ice_shelves_polys`, `urban_areas` | Layers > Lakes, Rivers, Ice Shelves, Urban Areas |
| `political_boundaries` | Lines > Political Boundaries |
| `graticule`, `azimuth_distance`, `time_zones`, `gray_line`, `geographic_lines` | Lines > Graticule, Azimuth/Distance, Time Zones, Gray Line, Date Line |
| `dxcc_entities`, `admin_1_call_areas`, `admin_1_provinces` | Amateur Radio > DXCC Entities, Call Areas, Provinces |
| `cq_zones`, `itu_rsgb_zones`, `itu_arrl_zones` | Amateur Radio > CQ Zones, ITU Zones (RSGB), ITU Zones (ARRL) |
| `sections`, `ffma_squares`, `vucc_grid` | Amateur Radio > ARRL Sections, FFMA Grid Squares, VUCC Grid Squares |

`toggles.Labels`, by key:

| Key | Menu item |
|---|---|
| `countries`, `islands`, `cities`, `seas`, `lakes_rivers`, `mountains`, `regions` | Labels > Countries, Islands, Cities, Seas, Lakes and Rivers, Mountains, Physical Features |
| `wae_prefixes`, `iota`, `wap` | Amateur Radio > WAE Entities, IOTA Groups, WAP Antarctic Bases |

`toggles.IonoMap` is the Ionosphere button's map - `None`, `FoF2`, `Muf3000`, `HmF2`, `FoE`, `NmD`
or `Propagation` - and `MagDip` and `Aurora` its Magnetic Dip and Aurora Oval switches. The
Amateur Radio toggles and the ionospheric ones take effect only while **Tools > Amateur Radio
Functions** is on; otherwise they are ignored.

### map.showAim

`{"map": 1, "lat": 55.8, "lon": 37.6}` - draws a crosshair at the point, centring the map on it,
or, on the azimuthal map, zooming out to the whole world. The crosshair stays until the user moves
the map.

### map.saveImage

`{"map": 1}` - returns the map as it is drawn on the screen, after its next frame, as a PNG in
screen pixels, base64-encoded:

```json
{"png": "iVBORw0KGgoAAAANSUhEUgAABN0AAAM3..."}
```

A map that is not shown has no image, and fails with error 2. The image is a few megabytes, larger
than some WebSocket libraries accept by default: in Python's `websockets`, connect with
`max_size=None`.

### clock.get, clock.set

The Clock panel:

```json
{"visible": false, "utc": true, "fixed": false, "time": "2026-10-19T15:43:22.565Z"}
```

- `visible` - whether the Clock panel is shown;
- `utc` - whether it shows UTC rather than local time;
- `fixed` - whether the clock is stopped at `time`, rather than live;
- `time` - the time the maps show: the gray line, the sun, the ionospheric and propagation maps.
  Setting it fixes the clock at that time; `{"fixed": false}` makes it live again.

### home.get, home.set

The home location, `{"lat": 43.7, "lon": -79.4}`, as in **Tools > Settings**, *Home Location*.

### settings.get, settings.set

DX Atlas Pro's settings as its `Settings.json` file holds them, with the window, the maps and the
panel layout as they are at the moment. `settings.set` takes the whole document or any part of it,
applies it as the Settings dialog's OK does, and saves it to the file:

```json
{"Units": {"Distance": "Miles"}}
```

The *Ionosphere* section is ignored: only the Ionospheric Parameters dialog sets it. A change to
`Api.Port` closes the connection on which it was made.

### colors.get, colors.set

The colours of the map as **Tools > Colors** sets them, the document DX Atlas Pro keeps in its
`Colors.json` file. `colors.set` takes the whole document or any part of it, and redraws both maps:

```json
{"Lines": {"Graticule": {"Color": "#FF0000", "Width": 1}}}
```

The colours are kept until DX Atlas Pro closes, then the user's own come back; with
`"persist": true` beside the colours, they are saved to `Colors.json` and replace the user's.

## Subscribing to Events

### events.subscribe

`{"names": ["map.clicked", "feature.clicked"]}` - the events this connection is sent from now on,
replacing those of any earlier `events.subscribe`; an empty list stops them all.

| Event | Params | Sent when |
|---|---|---|
| `map.clicked` | `{map, lat, lon}` | the user clicks a map, on a feature or not |
| `mouse.moved` | `{map, lat, lon}` | the mouse moves over a map by more than a pixel, at most 5 times a second |
| `map.changed` | `{map, kind}` | the user or a client changes the map, `kind` saying what - see below |
| `clock.changed` | none | the clock's mode or fixed time changes, but not as a live clock ticks |
| `window.changed` | none | the main window is moved or resized |
| `panels.changed` | none | a panel is shown or hidden |
| `app.exitRequest` | none | DX Atlas Pro is closing; the connection closes next |
| `feature.clicked` | `{map, layer, id, lat, lon}` | the user clicks a clickable feature of this client's layers; see [Drawing on the Map](drawing.md#hints-and-clicks) |
| `feature.hovered` | `{map, layer, id, lat, lon}` | the mouse comes onto a feature of this client's layers |

`map.changed`'s `kind` is `view` (moved or zoomed), `projection`, `labels`, `grid` (the
graticule), `relief`, `grayline`, `layers` (another toggle), `mousemode`, `pins` or `iono` (the
ionospheric map).

## Methods at a Glance

| Method | Params | Result |
|---|---|---|
| `app.info` | | `{version, apiVersion, maps}` |
| `window.get`, `window.set` | the window | |
| `window.bringToFront` | | |
| `map.get`, `map.set` | a map | |
| `map.showAim` | `{map, lat, lon}` | |
| `map.saveImage` | `{map}` | `{png}` |
| `map.fit` | `{map, bounds}` or `{map, layer}` | |
| `map.plotField` | `{map, values}` | |
| `clock.get`, `clock.set` | the clock | |
| `home.get`, `home.set` | `{lat, lon}` | |
| `settings.get`, `settings.set` | the settings | |
| `colors.get`, `colors.set` | the colours, and `persist` | |
| `events.subscribe` | `{names}` | |
| `layers.add` | `{map, style, visible}` | `{layer}` |
| `layers.set` | `{layer, style, visible, features, above}` | |
| `layers.upsert` | `{layer, features}` | |
| `layers.delete` | `{layer, ids}` | |
| `layers.remove` | `{layer}` | |
| `layers.clear` | `{map}` | |
| `layers.hint` | `{layer, id, hint, clickable}` | |
| `layers.addField` | `{map, lat0, lon0, dLat, dLon, rows, cols, values, palette, bands, above}` | `{layer}` |
| `images.add` | `{name, png, cellWidth, hotSpotX, hotSpotY}` | |
| `images.remove` | `{name}` | |

`map.fit`, `map.plotField` and the `layers` and `images` methods are described in
[Drawing on the Map](drawing.md).
