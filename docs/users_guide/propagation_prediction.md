# Propagation Prediction

![Real-time propagation](../images/gallery/real-time-propagation.png)

The propagation map shows how strong your signal would be at every point of the globe on one band,
at the time the [Clock](clock.md) panel shows. It is computed by the program with the DVOACAP
engine based on the VOACAP algorithms, from your home location, the band, and your station as set in the
**Propagation** section of the [Settings Dialog](settings.md).

## Showing the Map

Open the **Ionosphere** button on the map toolbar:

- tick **HF Propagation** to show the map in place of an ionospheric map;
- pick the band in the **Band** submenu: 80, 60, 40, 30, 20, 17, 15, 12 or 10 m;
- tick **Long Path** to compute the signal along the long path, the longer arc of the great circle
  around the Earth, instead of the short path.

The band and Long Path are the same for both maps; HF Propagation is ticked for each map
separately.

## Reading the Map

The map is drawn in bands of S-meter readings, from S1 up to S9+12 dB, with a green line at each
band edge; below S1 it is left clear. The legend in the lower left corner names the band, with
**LP** after it on the long path. The status bar's 📶 cell shows the reading at the point under the
mouse: `S7`, or `S9 + 10 dB`; with **Readout Tooltip** on in the **Map** section of
[**Tools > Settings**](settings.md#map), a tooltip follows the mouse over the map with the reading
after the map's name and band - `HF Propagation, 20 m: S7` - under the bearing and distance from
your home location.

How to read the map, and how many S units to add or subtract when your station differs from the
settings, is explained in [HF Propagation](reading_the_maps.md#hf-propagation) on the
*Reading the Maps for DX'ing* page.

## The Propagation Chart

![Propagation chart](../images/propagation_chart.png)

The map shows one band at one time; the chart shows one place for the whole day. Right-click the
map where you want to work and choose **Propagation Chart** under **Show Details**. The command is
there while the amateur radio functions are on. The line above the chart reads, for example,
`Home to VK6 (31° S, 116° E)`: the prefix of the point where it has one, and its position.

The chart plots the strength of your signal at that point, from your home location, for the
whole UTC day of the date the [Clock](clock.md) panel shows. There is one strip for each ham band,
80 m at the bottom to 10 m at the top, and the time runs along the bottom in UTC, in steps of half
an hour. It uses your station as set in the **Propagation** section of the
[Settings Dialog](settings.md).

Each cell is coloured by the better of the short and the long path: in blue where the short path is
better, in orange where the long path is. The colour darkens with each whole S unit from S1 to S9;
a cell below S1, or with no signal, is white.

- A green star in each strip marks the best hour of that band - the hour with the strongest signal.
  A band with no signal all day has none.
- The two bars above the chart show the day at your home location and at the point: yellow where
  the sun is up, grey where it is down. Dashed vertical lines mark the sunrise and sunset at both.
- A red vertical line marks the time the Clock panel shows, with a sun on each bar. While the
  Clock panel follows the current time, the line moves every 5 minutes.

Move the mouse over the chart, and the status bar below it reads that cell: the UTC time, your
local time, the local time at the point, the band, the S-meter reading, the take-off angle at
your station, the propagation mode - `2F2` is two hops by the F2 layer on a path shorter than 7,000 km, `F2F2`
the F2 layer at both ends of a longer one - and `SP` or `LP` for the better path in that cell. A
cell with no prediction reads `no signal`. The chart is computed when the window opens, which
takes a moment, and is for the time and the conditions of that moment. Close the window with **Esc**.

## Live Updates

The map is computed for a quarter hour of UTC, and changes when the clock enters the next one. With
the clock live, the program computes the maps of the next 3 hours in the background, so they are
ready when they are needed. With **Use STORM Model** ticked in the Ionospheric Parameters dialog,
the map follows geomagnetic disturbances as the Ap index is downloaded; see
[Ionospheric Maps](ionospheric_maps.md).

A change of the band, the path, the home location or a setting starts the map again at once; while
it is computed, the status bar shows `…`. The maps already computed are kept on disk, so a return
to earlier settings, or a restart, needs no new computation.

## The Propagation Settings

The **Propagation** section of the Settings dialog sets what the map is computed for:

- **Transmitter Power, W** - your transmitter's power, 100 W by default;
- **Transmit Antenna Gain, dBi** - the gain of your antenna over an isotropic one, the same in
  every direction;
- **Receive Antenna Gain, dBi** - the gain of the antennas at the receiving end;
- **Minimum Takeoff Angle, °** - the lowest elevation angle the antennas radiate at, 3° by default;
- **Man-made Noise** - the noise at the receiving end: **Industrial**, **Residential**, **Rural** or
  **Remote**;
- **Grid Resolution** - the spacing of the points the map is computed at, **3°** or **1.5°**. The
  finer grid takes four times as long;
- **Threads** - the number of processor threads that compute the map, 0 for one per processor.

To compute the maps of a whole day in advance, see
[Pre-computing Propagation](precompute_propagation.md).
