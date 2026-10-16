# Reading the Maps for DX'ing

A propagation prediction answers one question: on this band, at this hour, how strong will the
signal be along the great circle between two stations? It answers it for the median day of the
month, and on any given day the answer may be wrong. The path may be absorbed, the band may close
early, or the signal may arrive from a direction no prediction offered.

The ionospheric maps of DX Atlas Pro are a road atlas for those days. They show the state of each
layer of the ionosphere across the whole globe, so you can see why a predicted path failed, and
find another route for the signal: a skewed path, a chordal hop, the long path, or a band that is
open along a different arc.

This page explains what each map tells a DXer. The controls that show the maps are described in
[Ionospheric Maps](ionospheric_maps.md) and [Propagation Prediction](propagation_prediction.md).

The ionospheric maps are computed with the IRI-2026 model, which gives the monthly median
ionosphere for the sunspot number of the month. With **Use STORM Model** on, foF2 is corrected for
the geomagnetic activity of the last hours, which brings the maps closer to the ionosphere of the
day during a storm.

## foF2 and MUF(3000)

**foF2**, the critical frequency of the F2 layer, is the highest frequency that the layer reflects
straight up. **MUF(3000)**, the maximum usable frequency of a 3000 km hop, is about three times
foF2. A path is open when the band is below MUF(3000) at its control points, about 1500 km from
each end of the path; a shorter hop has a lower MUF. The distance circles of the
**Azimuth/Distance** lines ([Layers, Lines and Labels](layers_lines_labels.md)) are drawn every
3000 km, the length of an F2 hop, so each circle marks where a hop from their centre lands.

Where foF2 rises steeply along the path, the signal may travel in **chordal hops**, without
touching the ground between, and stay strong. Where the great circle crosses a region of low foF2,
the signal may arrive by a **skewed path** through higher foF2 off the great circle, from an
unexpected bearing.

## hmF2

**hmF2** is the height of the F2 layer's peak, typically 250 to 400 km. The higher the layer, the
longer each hop, the fewer hops a long path needs, and the smaller the factor between foF2 and
MUF(3000).

## foE

**foE**, the critical frequency of the E layer, follows the sun: up to about 4 MHz at noon in
summer, almost nothing at night. On the low bands in daytime, the E layer can keep a low-angle
signal from reaching the F2 layer, reflecting it in hops of at most 2000 km or absorbing it. The
map shows the regular E layer only, not sporadic E.

## NmD

**NmD** is the electron density of the D layer, which absorbs HF signals on the day side, the more
the lower the frequency. On 160, 80 and 40 metres it decides whether a daytime signal arrives at
all; the low bands open where the D layer fades, near the gray line and at night.

## Gray Line

Near the terminator, the D layer has faded while the F2 layer is still ionized, so absorption on
the low bands is low and the signals are strong. Propagation on 160, 80 and 40 metres is enhanced
when both stations are near the terminator: both at sunrise, both at sunset, or one at sunrise and
the other at sunset.

At the height of the F2 layer, about 300 km, the sun rises earlier and sets later than on the
ground: the layer stays sunlit until the sun is about 17° below the ground's horizon, an hour or
more after sunset on the ground, and comes into sunlight as long before sunrise.

Astronomical twilight, which ends with the sun 18° under the horizon, corresponds to sunrise and
sunset at the F2 layer's height. Set **Twilight** to **Astronomical** in the **Map** section of the
[Settings Dialog](settings.md): the night shadow then begins where the F2 layer goes dark, and the
lighter band between the terminator and the night shadow is where the F2 layer is still sunlit
while the ground is dark.

The terminator's path across the globe changes with the season, so a gray-line opening to a given
station happens only in some months. To find them, show the **Gray Line**
([Layers, Lines and Labels](layers_lines_labels.md)), click the sunrise or sunset lock button in
the [Clock](clock.md) panel, and step the date by one month. The time stays at your sunrise or
sunset; the months in which the gray line passes over the DX station are the months when both
stations are at the gray line.

## Magnetic Dip

The **magnetic dip** is the angle of the Earth's magnetic field to the horizontal. At the dip
equator the field is horizontal, and there the ionization of the F2 layer is lifted and moved
north and south by the combined action of the electric and the magnetic fields. This **equatorial
ionization anomaly** leaves two crests of high foF2 on either side of the dip equator, which the
foF2 map shows on the day side, strongest in the afternoon and the evening.

The crests support **trans-equatorial propagation** (TEP) on 10 and 6 metres: between stations on
opposite sides of the dip equator, roughly the same distance from it, the signal travels from crest
to crest in a chordal hop, at frequencies far above the MUF of ordinary hops. The lines of 40°
dip on either side bound the anomaly, and the dashed lines 2000 km beyond them mark how far from
the anomaly a station can be and still reach it.

## The Aurora Oval

The **aurora oval** is the ring around each magnetic pole where particles from the Sun enter the
upper atmosphere. It grows and moves towards the equator during geomagnetic storms. HF signals that
cross the oval are absorbed, and those that get through arrive weak and fluttering: a polar path,
such as Europe to the west coast of North America, is the first to suffer.

The oval also opens the high bands. **Auroral E**, the ionization of the E layer in the oval,
reflects and scatters signals on 10, 6 and 2 metres; stations beam towards the oval rather than
towards each other, and the signals have a characteristic rasp.

The map shows the probability of aurora from the NOAA Space Weather Prediction Center's OVATION
model, downloaded every 15 minutes while the map is shown.

## HF Propagation

The **HF Propagation** map shows the signal strength from your home location, on the band and at
the hour set, at every point of the globe, computed with the VOACAP model for the median day of
the month, and with **Use STORM Model** on, corrected for the geomagnetic activity of the day. The
reading is in S units of 6 dB, for the transmitter power and the antenna gains set
in the **Propagation** section of the [Settings Dialog](settings.md).

When a station differs from the settings, shift the reading:

- every 6 dB of power or antenna gain is one S unit: four times the power, or an antenna of 6 dBi
  in place of 0 dBi, adds one S unit, and a quarter of the power takes one away;
- the gains at both ends count, so a beam at the receiving station adds as much as one at yours;
- doubling the power adds only 3 dB, half an S unit.

## Finding an Alternate Route

When the predicted path fails, read the maps together:

- **a polar path absorbed in the aurora oval** - show the Aurora over the HF Propagation map. If
  the short path crosses the oval, try the long path (**Long Path** in the Ionosphere menu), or a
  skewed path that passes south of the oval, where the foF2 map shows the band is supported;
- **a path through low foF2** - show the foF2 or MUF(3000) map, and look along and beside the great
  circle for a region where the band is below the MUF. A signal skewed through it arrives off the
  great-circle bearing, so turn the beam towards that region;
- **a path across the dip equator on 10 or 6 metres** - show the Magnetic Dip lines over the foF2
  map. In the afternoon and evening, the equatorial crests may carry the signal in chordal hops
  well above the predicted MUF;
- **a low band closed in daytime** - show the NmD map and the Gray Line. Absorption falls first
  where the D layer fades along the terminator, so the low bands open along the gray line.

Fix the [Clock](clock.md) and step it through the hours to see how each map, and so each route,
changes through the day.

## Further Reading

- Carl Luetzelschwab, K9LA, [k9la.us](https://k9la.us/);
- OH3AC, *F-Region Propagation and the Equatorial Ionospheric Anomaly*,
  [QEX, November 2016](http://www.oh3ac.fi/QEX-2016-11.pdf);
- Dean Straw, N6BV, [Visalia 2010 paper](https://www.voacap.com/2023/documents/N6BV_Visalia_2010.pdf)
  on reading predictions in S units;
- the [VOACAP papers](https://www.voacap.com/2023/voacap-papers.html).
