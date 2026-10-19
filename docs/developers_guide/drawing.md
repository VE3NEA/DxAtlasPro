# Drawing on the Map

A client draws on a map in **custom layers** of [GeoJSON](https://geojson.org/) features - points,
lines and polygons, with labels, icons and tooltips - and in **fields**, grids of values drawn as
coloured bands, such as a propagation map of its own.

## Custom Layers

`layers.add` makes an empty layer on a map and returns its number, which the other `layers`
methods take:

```json
→ {"jsonrpc": "2.0", "id": 1, "method": "layers.add", "params": {"map": 1, "style": {"Line": {"Color": "#FF0000", "Width": 2}}}}
← {"jsonrpc": "2.0", "id": 1, "result": {"layer": 7}}
→ {"jsonrpc": "2.0", "id": 2, "method": "layers.set", "params": {"layer": 7, "features": [
    {"type": "Feature", "id": "path", "geometry": {"type": "LineString", "coordinates": [[-79.4, 43.7], [37.6, 55.8]]}}]}}
← {"jsonrpc": "2.0", "id": 2, "result": null}
```

A layer belongs to the connection that made it: no other client sees or changes it, and it is
removed when its connection closes, so a client that exits or crashes leaves nothing behind on the
map. The layers of all clients are drawn over the map's own lines and under its labels, in the
order they were made; their symbols, icons and labels go over the map's labels.

| Method | Params | What it does |
|---|---|---|
| `layers.add` | `{map, style, visible}` | makes a layer, map 1 and visible unless told otherwise, and returns `{layer}` |
| `layers.set` | `{layer, style, visible, features, above}` | changes what it is given: `style` merges onto the layer's, `features` replace all of the layer's, `above` is the [z-order](#z-order) |
| `layers.upsert` | `{layer, features}` | adds the features, replacing those whose `id` the layer has, in their place |
| `layers.delete` | `{layer, ids}` | removes the features with these ids; an id the layer lacks is ignored |
| `layers.remove` | `{layer}` | removes the layer |
| `layers.clear` | `{map}` | removes all of this connection's layers on the map |

A layer this connection did not make, or one already removed, is error 1.

## Features

`features` is a GeoJSON `FeatureCollection`, or a plain array of `Feature`s. A feature's geometry
is a `Point`, `LineString` or `Polygon`, a `MultiPoint`, `MultiLineString` or `MultiPolygon`, or a
`GeometryCollection` of these; positions are `[lon, lat]` in degrees. Each line or polygon edge
between two positions is drawn along the great circle, the shortest path on the globe, so a
two-point line is a great circle path, and edges are cut cleanly at the date line and round the
poles.

A feature's `id`, a string or a number, names it to `layers.upsert`, `layers.delete` and the
events. A feature may have none, but then it can only be replaced with the whole layer, and its
events carry `"id": null`.

DX Atlas Pro reads these of a feature's `properties`, and ignores any others:

| Property | Value | |
|---|---|---|
| `label` | text | drawn at each point of the feature, in the layer's `Label` style |
| `glyph` | number | the icon of the layer's image strip drawn at the point, counting from 0; see [Icons](#icons) |
| `hint` | text | a tooltip shown while the mouse is on the feature |
| `clickable` | `true` | a click on the feature sends `feature.clicked`; see [Hints and Clicks](#hints-and-clicks) |
| `style` | a style | this feature's style, merged onto the layer's |
| `path` | `"long"` | a two-point `LineString` drawn the long way round the great circle |
| `ttl` | seconds | the feature is removed by DX Atlas Pro this many seconds after it was sent |

A feature with its own `style` can share a layer with others, so one layer of spots can have a
colour per band. `ttl` suits spots, which can be sent and forgotten: DX Atlas Pro removes each one
when it expires, checking once a second.

```json
{
  "type": "Feature",
  "id": "JA1ABC",
  "geometry": {"type": "Point", "coordinates": [139.7, 35.7]},
  "properties": {
    "label": "JA1ABC",
    "hint": "JA1ABC on 20m",
    "clickable": true,
    "ttl": 600,
    "style": {"Symbol": {"Color": "#FF4040"}, "Label": {"Color": "#FF4040"}}
  }
}
```

## Styles

A layer's style has four parts, each optional, and each field of a part optional. `layers.add`
starts from the defaults below, and `layers.set` merges a new style onto the layer's:

```json
{
  "Line":   {"Color": "#FF0000", "Width": 2},
  "Area":   {"Fill": "#40FF0000", "Line": "#FF0000", "Width": 1},
  "Label":  {"Color": "#FFFFFF", "HaloColor": "#000000", "Size": 12, "Bold": false, "Italic": false, "Font": "", "Offset": true},
  "Symbol": {"Shape": "circle", "Image": null, "Color": "#FFFF00", "Size": 6}
}
```

- `Line` - lines: their colour and width in pixels;
- `Area` - polygons: the fill, and the outline's colour and width;
- `Label` - the text of the `label` property: its colour, the colour of the halo round it, which a
  transparent colour such as `#00000000` turns off, its size in pixels, bold and italic, and its
  font, the system's default when empty. With `Offset`, the label is drawn beside its point, to the
  right of the symbol; without it, centred on the point;
- `Symbol` - what marks a point: a `Shape`, `circle`, `square`, `triangle`, `diamond`, `cross` or
  `none`, in a `Color`, `Size` pixels across; or, when `Image` names an image strip, the icon the
  feature's `glyph` picks.

`Line`, `Area` and `Label` are the same objects, with the same names, as the line, area and label
colours of `Colors.json` and of the `colors.get` method, so a look copied from one works in the
other.

## Icons

`images.add` sends a PNG of one icon, or of a strip of icons side by side, each `cellWidth` pixels
wide, under a name; a layer whose `Symbol.Image` names it draws, at each point, the icon that the
feature's `glyph` property picks, counting from 0:

```json
{"name": "bands", "png": "iVBORw0KGgo...", "cellWidth": 16, "hotSpotX": 8, "hotSpotY": 8}
```

- `png` - the image, base64-encoded;
- `cellWidth` - the width of one icon; the whole image is one icon when it is left out;
- `hotSpotX`, `hotSpotY` - the pixel of the icon, from its top-left corner, that is placed on the
  point; the top-left corner itself when left out.

An image belongs to the connection that sent it, as a layer does; sending the same name again
replaces it, and `images.remove` with `{"name": ...}` removes it.

## Hints and Clicks

A feature with a `hint` shows it as a tooltip while the mouse is on it. A client whose hints change,
or are costly to make, can give them when they are needed instead: subscribed to
`feature.hovered`, it is told each time the mouse comes onto one of its features, and answers with
`layers.hint` within 250 ms:

```json
← {"jsonrpc": "2.0", "method": "feature.hovered", "params": {"map": 1, "layer": 7, "id": "JA1ABC", "lat": 35.7, "lon": 139.7}}
→ {"jsonrpc": "2.0", "method": "layers.hint", "params": {"layer": 7, "id": "JA1ABC", "hint": "JA1ABC, 14.025 MHz, 2 min ago", "clickable": true}}
```

DX Atlas Pro shows the hint if the answer comes in time and the mouse is still on the feature, and
`"clickable": true` makes the feature clickable while the mouse stays on it.

A click on a clickable feature - one with `"clickable": true` in its properties, or made clickable
by `layers.hint` - sends `feature.clicked` to a client subscribed to it, after the `map.clicked`
that every click sends, and does nothing else in DX Atlas Pro, so the client decides what the click
does:

```json
← {"jsonrpc": "2.0", "method": "feature.clicked", "params": {"map": 1, "layer": 7, "id": "JA1ABC", "lat": 35.7, "lon": 139.7}}
```

Where features overlap, the newest layer's feature is the one under the mouse; within a layer, a
symbol, icon or label comes first, then a line within 4 pixels, then a polygon.

## Z-Order

`layers.set` with `above` moves a layer among the map's own drawing:

- `relief` - over the land and sea, under every line, so the map's borders and zones show through
  a field or a filled area;
- `overlays` - over the borders, zones and other lines;
- `grayline` - over the gray line too, the default;
- `labels` - over the map's labels as well.

Layers with the same `above` are drawn in the order they were made.

## Fields

`layers.addField` draws a grid of values - a prediction, a measurement, any quantity over an area -
as coloured bands, as DX Atlas Pro draws its own ionospheric maps, and returns a layer that
`layers.remove` removes:

```json
{
  "map": 1,
  "lat0": 30, "lon0": -20, "dLat": 1, "dLon": 1, "rows": 41, "cols": 71,
  "values": [0, 0.1, 0.3, ...],
  "palette": [
    {"value": 2, "color": "#604080FF"},
    {"value": 5, "color": "#6040C040"},
    {"value": 8, "color": "#80FF4040"}
  ],
  "bands": true,
  "above": "relief"
}
```

- `lat0`, `lon0` - the position of the first value, in degrees;
- `dLat`, `dLon` - the steps between rows and between columns, in degrees;
- `rows`, `cols` - the size of the grid, at least 2 by 2;
- `values` - `rows` times `cols` numbers, row by row: the first row at `lat0`, from `lon0` east;
- `palette` - 1 to 16 values, each with the colour of the band from that value up to the next; the
  map is clear below the first value and outside the grid;
- `bands` - `false` blends the colours smoothly between the values instead of banding them;
- `above` - the [z-order](#z-order), `grayline` when left out.

The grid is resampled onto one covering the whole earth, no finer than a quarter of a degree, so a
grid may cross the date line.

### map.plotField

`map.plotField` is DX Atlas 2's field, for the [COM bridge](com_bridge.md): `{"map": 1, "values":
[[...], ...]}`, `values[x][y]`, N by N, `x` from 180°W to 180°E and `y` from 90°S to 90°N, both ends
included, values from 0 to 1 banded in sixteenths. It is shown in place of the Ionosphere button's
map until another map is chosen there, and is removed by a `map.plotField` with no values or when
the connection closes. New programs use `layers.addField`.

## Fitting the Map

`map.fit` centres and zooms a map on a box, `{"map": 1, "bounds": [west, south, east, north]}` in
degrees, or on all the features of a layer, `{"map": 1, "layer": 7}`, so that they fill about half
of the map. A single point is shown at one kilometre per pixel.
