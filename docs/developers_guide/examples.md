# Examples

Four complete programs, each run against DX Atlas Pro as printed here. Start DX Atlas Pro before
running them.

## C: Hello, World

Writes "Hello, world!" at London on the map, in plain C with no libraries: the WebSocket handshake
and frames are written by hand over a TCP socket, which shows how little the protocol needs. It
builds on Windows with MinGW, `gcc hello.c -o hello.exe -lws2_32`, or with Visual C++, `cl hello.c`,
and on Linux with `cc hello.c -o hello`. The label stays until you press Enter, when the program
closes its connection and DX Atlas Pro removes it.

The program sends one request at a time and subscribes to no events, so the next message it reads
is always the answer to its request. A real program would use a JSON library to build the requests
and read the answers, and a WebSocket library, such as [libwebsockets](https://libwebsockets.org/),
to handle messages of any size.

```c
/* Hello, world on the map of DX Atlas Pro, in plain C with no libraries: the WebSocket handshake
   and frames written by hand over a TCP socket. Build on Windows with
   gcc hello.c -o hello.exe -lws2_32 (or cl hello.c), on Linux with cc hello.c -o hello */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#ifdef _WIN32
#include <winsock2.h>
#ifdef _MSC_VER
#pragma comment(lib, "ws2_32.lib")
#endif
typedef SOCKET Socket;
#else
#include <arpa/inet.h>
#include <sys/socket.h>
#include <unistd.h>
typedef int Socket;
#define closesocket close
#endif

static Socket sock;

/* the WebSocket handshake's request; the key is any 16 bytes in base64 */
static const char *Upgrade =
  "GET / HTTP/1.1\r\nHost: 127.0.0.1:7373\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n"
  "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\nSec-WebSocket-Version: 13\r\n\r\n";

/* sends text as one masked text frame, as a WebSocket client must */
static void send_text(const char *text)
{
  size_t length = strlen(text), header = 0, i;
  unsigned char *frame = malloc(length + 14);
  unsigned char mask[4] = {0x12, 0x34, 0x56, 0x78};
  frame[header++] = 0x81;  /* the final frame of a text message */
  if (length < 126) frame[header++] = 0x80 | (unsigned char)length;
  else
  {
    frame[header++] = 0x80 | 126;  /* messages up to 64 KB here */
    frame[header++] = (unsigned char)(length >> 8);
    frame[header++] = (unsigned char)length;
  }
  memcpy(frame + header, mask, 4);
  header += 4;
  for (i = 0; i < length; i++) frame[header + i] = text[i] ^ mask[i % 4];
  send(sock, (const char *)frame, (int)(header + length), 0);
  free(frame);
}

static int receive_all(unsigned char *buffer, size_t count)
{
  size_t done = 0;
  while (done < count)
  {
    int got = recv(sock, (char *)buffer + done, (int)(count - done), 0);
    if (got <= 0) return 0;
    done += got;
  }
  return 1;
}

/* the next message's text, unmasked as the server sends it; the caller frees it */
static char *receive_text(void)
{
  unsigned char head[2], extended[8];
  unsigned long long length;
  char *text;
  int i;
  if (!receive_all(head, 2)) return NULL;
  length = head[1] & 0x7F;
  if (length == 126)
  {
    if (!receive_all(extended, 2)) return NULL;
    length = (extended[0] << 8) | extended[1];
  }
  else if (length == 127)
  {
    if (!receive_all(extended, 8)) return NULL;
    for (length = 0, i = 0; i < 8; i++) length = (length << 8) | extended[i];
  }
  text = malloc((size_t)length + 1);
  if (!receive_all((unsigned char *)text, (size_t)length)) return NULL;
  text[length] = 0;
  return text;
}

/* sends a request and returns its answer */
static char *call(const char *request)
{
  printf("-> %s\n", request);
  send_text(request);
  return receive_text();
}

int main(void)
{
  struct sockaddr_in address;
  char handshake[512], *answer, request[512];
  int length, layer;

#ifdef _WIN32
  WSADATA wsa;
  WSAStartup(MAKEWORD(2, 2), &wsa);
#endif
  sock = socket(AF_INET, SOCK_STREAM, 0);
  memset(&address, 0, sizeof address);
  address.sin_family = AF_INET;
  address.sin_port = htons(7373);
  address.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
  if (connect(sock, (struct sockaddr *)&address, sizeof address) != 0)
  {
    printf("DX Atlas Pro is not running\n");
    return 1;
  }

  /* the WebSocket handshake: an HTTP request, answered with 101 Switching Protocols */
  send(sock, Upgrade, (int)strlen(Upgrade), 0);
  length = 0;
  while (length < (int)sizeof handshake - 1 && recv(sock, handshake + length, 1, 0) == 1)
  {
    handshake[++length] = 0;
    if (length >= 4 && strcmp(handshake + length - 4, "\r\n\r\n") == 0) break;
  }
  if (strncmp(handshake, "HTTP/1.1 101", 12) != 0)
  {
    printf("handshake refused: %s\n", handshake);
    return 1;
  }

  answer = call("{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"app.info\"}");
  printf("<- %s\n", answer);
  free(answer);

  /* a layer, and a label in it; the answer is {"jsonrpc":"2.0","id":2,"result":{"layer":N}} */
  answer = call("{\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"layers.add\","
    "\"params\":{\"style\":{\"Label\":{\"Size\":24}}}}");
  printf("<- %s\n", answer);
  layer = atoi(strstr(answer, "\"layer\":") + 8);
  free(answer);

  sprintf(request, "{\"jsonrpc\":\"2.0\",\"id\":3,\"method\":\"layers.set\",\"params\":{\"layer\":%d,"
    "\"features\":[{\"type\":\"Feature\",\"geometry\":{\"type\":\"Point\",\"coordinates\":[-0.1,51.5]},"
    "\"properties\":{\"label\":\"Hello, world!\"}}]}}", layer);
  answer = call(request);
  printf("<- %s\n", answer);
  free(answer);

  printf("Press Enter to remove the label and quit\n");
  getchar();
  closesocket(sock);
  return 0;
}
```

Its output:

```
-> {"jsonrpc":"2.0","id":1,"method":"app.info"}
<- {"jsonrpc":"2.0","id":1,"result":{"version":"0.91.0","apiVersion":1,"maps":2}}
-> {"jsonrpc":"2.0","id":2,"method":"layers.add","params":{"style":{"Label":{"Size":24}}}}
<- {"jsonrpc":"2.0","id":2,"result":{"layer":1}}
-> {"jsonrpc":"2.0","id":3,"method":"layers.set","params":{"layer":1,"features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[-0.1,51.5]},"properties":{"label":"Hello, world!"}}]}}
<- {"jsonrpc":"2.0","id":3,"result":null}
Press Enter to remove the label and quit
```

## Python: Spots on the Map

Draws three DX spots on the azimuthal map centred on your home location, each a diamond with its
callsign, coloured by band and removed after ten minutes, and prints the clicks on the spots and on
the map. It needs the [`websockets`](https://pypi.org/project/websockets/) package,
`pip install websockets`.

The `DxAtlasPro` class is a JSON-RPC client small enough to copy into your own program: `call`
sends a request and waits for its answer, and every event goes to `on_event`.

```python
import asyncio, itertools, json
import websockets

URL = "ws://127.0.0.1:7373/"

class DxAtlasPro:
  """A minimal JSON-RPC 2.0 client: answers matched to requests by id, events handed to on_event."""

  def __init__(self, ws, on_event):
    self.ws = ws
    self.on_event = on_event
    self.ids = itertools.count(1)
    self.pending = {}

  async def call(self, method, params=None):
    request_id = next(self.ids)
    future = asyncio.get_running_loop().create_future()
    self.pending[request_id] = future
    message = {"jsonrpc": "2.0", "id": request_id, "method": method}
    if params is not None: message["params"] = params
    await self.ws.send(json.dumps(message))
    return await future

  async def read(self):
    async for text in self.ws:
      message = json.loads(text)
      if "id" not in message:
        self.on_event(message["method"], message.get("params"))
      elif "error" in message:
        self.pending.pop(message["id"]).set_exception(RuntimeError(message["error"]["message"]))
      else:
        self.pending.pop(message["id"]).set_result(message["result"])

BAND_COLORS = {"20m": "#FF4040", "15m": "#40C040", "10m": "#4080FF"}

SPOTS = [
  {"call": "JA1ABC", "band": "20m", "lon": 139.7, "lat": 35.7},
  {"call": "VK2XYZ", "band": "15m", "lon": 151.2, "lat": -33.9},
  {"call": "ZS6DEF", "band": "10m", "lon": 28.0, "lat": -26.2},
]

def spot_feature(spot):
  color = BAND_COLORS[spot["band"]]
  return {
    "type": "Feature",
    "id": spot["call"],
    "geometry": {"type": "Point", "coordinates": [spot["lon"], spot["lat"]]},
    "properties": {
      "label": spot["call"],
      "hint": f'{spot["call"]} on {spot["band"]}',
      "clickable": True,
      "ttl": 600,
      "style": {"Symbol": {"Color": color}, "Label": {"Color": color}},
    },
  }

def on_event(name, params):
  print(name, params)

async def main():
  async with websockets.connect(URL) as ws:
    pro = DxAtlasPro(ws, on_event)
    reader = asyncio.create_task(pro.read())

    print(await pro.call("app.info"))
    home = await pro.call("home.get")
    await pro.call("map.set", {"projection": "azimuthal", "centerLat": home["lat"], "centerLon": home["lon"], "kmPerPixel": 25})

    spots = await pro.call("layers.add", {"style": {"Symbol": {"Shape": "diamond", "Size": 9}, "Label": {"Size": 13}}})
    await pro.call("layers.set", {"layer": spots["layer"], "features": [spot_feature(spot) for spot in SPOTS]})

    await pro.call("events.subscribe", {"names": ["feature.clicked", "map.clicked"]})
    print("Click a spot or the map; Ctrl+C to quit.")
    await reader

asyncio.run(main())
```

When the program exits, its connection closes and DX Atlas Pro removes the spots; the map stays
azimuthal, as `map.set` left it.

## JavaScript: a Field and an Image of the Map

Draws a made-up field over Europe in three coloured bands, sent in one batch with the switch to
the rectangular projection, fits the map to Europe, and saves an image of the map as `field.png`.
It runs in [Node.js](https://nodejs.org/) 22 or later, whose `WebSocket` is built in:
`node field.mjs`. The same code runs in a web page, without the file writing, once the page's
origin is in **Allowed Origins** (see [Enabling the API](enabling_the_api.md#web-pages)).

```javascript
// Node.js 22 or later, whose WebSocket is built in; in a browser, leave out the file writing
import { writeFileSync } from "node:fs";

const ws = new WebSocket("ws://127.0.0.1:7373/");
const pending = new Map();
let nextId = 1;

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // a batch is answered with an array, one answer per request
  for (const answer of Array.isArray(message) ? message : [message]) {
    if (answer.id === undefined) continue;  // an event; this example subscribes to none
    const { resolve, reject } = pending.get(answer.id);
    pending.delete(answer.id);
    if (answer.error) reject(new Error(answer.error.message));
    else resolve(answer.result);
  }
};

function request(method, params) {
  const id = nextId++;
  const promise = new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
  return [{ jsonrpc: "2.0", id, method, params }, promise];
}

// one request, or several sent as a batch, which the map draws in one frame
function call(method, params) {
  const [message, promise] = request(method, params);
  ws.send(JSON.stringify(message));
  return promise;
}

function batch(...calls) {
  const requests = calls.map(([method, params]) => request(method, params));
  ws.send(JSON.stringify(requests.map(([message]) => message)));
  return Promise.all(requests.map(([, promise]) => promise));
}

// a made-up field over Europe: 1 by 1 degree, highest at 50N 10E
const [lat0, lon0, rows, cols] = [30, -20, 41, 71];
const values = [];
for (let row = 0; row < rows; row++)
  for (let col = 0; col < cols; col++) {
    const [lat, lon] = [lat0 + row, lon0 + col];
    values.push(Math.max(0, 10 - Math.hypot(lat - 50, (lon - 10) * Math.cos(lat * Math.PI / 180)) / 2.5));
  }

ws.onopen = async () => {
  const [, field] = await batch(
    ["map.set", { projection: "rectangular" }],
    ["layers.addField", {
      lat0, lon0, dLat: 1, dLon: 1, rows, cols, values,
      palette: [
        { value: 2, color: "#604080FF" },
        { value: 5, color: "#6040C040" },
        { value: 8, color: "#80FF4040" }
      ],
      above: "relief"
    }]
  );
  await call("map.fit", { bounds: [-20, 30, 50, 70] });

  const { png } = await call("map.saveImage", { map: 1 });
  writeFileSync("field.png", Buffer.from(png, "base64"));
  console.log(`field layer ${field.layer} drawn, map saved to field.png`);
  ws.close();
};
```

## VBScript: the COM Bridge

Drives DX Atlas Pro through the [COM bridge](com_bridge.md), as a program written for DX Atlas 2
would: switches the map to the azimuthal projection centred on home, shows the CQ zones, draws a
great circle path to Moscow and a label there, saves an image of the map as `atlas.png`, and prints
the clicks on the map for ten seconds. Run it with `cscript atlas.vbs`.

```vb
' DX Atlas Pro through the COM bridge: run with cscript atlas.vbs
Const PRJ_AZIMUTHAL = 1
Const LK_LINES = 2
Const LK_LABELS = 4

Set Atlas = WScript.CreateObject("DxAtlas.Atlas", "Atlas_")
Set Map = Atlas.Map

Map.BeginUpdate
Map.Projection = PRJ_AZIMUTHAL
Map.CenterLatitude = Map.HomeLatitude
Map.CenterLongitude = Map.HomeLongitude
Map.CqZonesVisible = True

' a great circle path from home to Moscow, and a label there
Set Path = Map.CustomLayers.Add(LK_LINES)
Path.PenColor = &HFF   ' clRed, a TColor in BGR order
Path.SetData Array(Array(Array(Map.HomeLongitude, Map.HomeLatitude), Array(37.6, 55.8)))

Set Labels = Map.CustomLayers.Add(LK_LABELS)
Labels.SetData Array(Array(37.6, 55.8, "Moscow DX"))
Map.EndUpdate

WScript.Echo "Zoom " & Map.Zoom & ", " & Map.CustomLayers.Count & " layers; click the map within 10 seconds"
Map.SaveImage CreateObject("Scripting.FileSystemObject").GetAbsolutePathName("atlas.png"), False
WScript.Sleep 10000

Sub Atlas_MapClicked(Latitude, Longitude)
  WScript.Echo "Clicked at " & Latitude & ", " & Longitude
End Sub

Sub Atlas_LabelClicked(Info)
  WScript.Echo "Label " & Info.Text & " clicked"
End Sub
```

`WScript.CreateObject` with the `"Atlas_"` prefix connects the `Atlas_` subroutines to the
bridge's events, which `WScript.Sleep` lets in while it waits.
