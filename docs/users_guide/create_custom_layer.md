# Create a Custom Layer

You can add layers of your own to the [Lists Panel](lists_panel.md): mountain summits you climbed,
lighthouses, the parks of a park award. Each layer is a JSON file in the `Layers` folder of the
user data folder, and appears in the **Layer** box under its own name. A user layer has lists, as
the award layers do, so you can track which of its items you have visited or worked.

## The Layers Folder

**Help > Data Folder...** opens the user data folder, which holds the settings, the lists and the
caches:

- on Windows, `%APPDATA%\Afreet\Products\DxAtlasPro`;
- on Linux, `~/.config/Afreet/Products/DxAtlasPro`.

Create a folder named `Layers` there, and put the layer files in it. The files are read when the
program starts, so restart it after adding or editing a file.

## The File Format

One file is one layer, and the file name, without `.json`, is the layer's id: rename a file and its
lists are lost. An example:

```json
{
  "name": "Summits",
  "idColumn": true,
  "entities": [
    { "id": "W7A/AE-001", "name": "Humphreys Peak", "lat": 35.346, "lon": -111.678 },
    { "id": "W7A/AE-002", "name": "Agassiz Peak", "lat": 35.326, "lon": -111.677,
      "tooltip": "3766 m" }
  ]
}
```

- **`name`** - the layer's name in the Layer box;
- **`idColumn`** - `true` to show the items' ids in a column of their own beside the names,
  `false` to show the names alone;
- **`entities`** - the items.

Each item has:

- **`id`** - unique in the layer; the lists keep the items by their ids;
- **`name`** - shown in the list and searched; the id when it is missing;
- **`lat`** and **`lon`** - the item's position, in degrees, positive north and east;
- **`tooltip`** - optional, the text shown when the mouse is over the name;
- **`geometry`** - optional, the item's area, as a GeoJSON `Polygon` or `MultiPolygon`.

### Reference Items

Instead of its own position, an item can name an item that the program already has, with `ref`
written as `class:id`. It then takes the position, the area and the tooltip of that item, and an
`id` or `name` given beside the `ref` replaces that item's own:

```json
{ "id": "AL", "ref": "province:W.W4.W4(AL)" }
```

The program does not show the ids of its own items, so reference items are mainly for layers built
from the program's data. The layer of the US states that ships with the program is written this
way, and is a working example to copy: on Windows,
`C:\Program Files\Afreet\DxAtlasPro\assets\entities\layers\WAS.json`, and on Linux,
`assets/entities/layers/WAS.json` in the program folder.

## How a User Layer Is Shown

A user layer is not drawn on the map as a whole. When you find one of its items from the list, the
item is highlighted: by its area, by the area of the item its `ref` names, or by a ring at its
point.

Large layers are fine: a layer of 180,000 summits is searched as fast as a small one.

## Errors

A file that cannot be read does not stop the program. When it starts, a message lists what could
not be read - a file that is not valid JSON, a `ref` that names no item, an id used twice in one
layer - and the rest of the file is loaded.
