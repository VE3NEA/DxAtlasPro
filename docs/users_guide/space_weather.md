# Space Weather

The propagation and ionospheric maps show the ionosphere of a typical day of the month. The Space
Weather panel tells you how today differs from that typical day: whether to expect better
conditions than predicted on the high bands, or a storm that will close the polar paths. Click the
**Ionosphere** button on the map toolbar and tick **Space Weather** to show the panel in the lower right corner of the map; the values
come from the NOAA Space Weather Prediction Center and update by themselves while the panel is shown.

## Before You Get on the Air

Glance at the panel to decide which bands and which paths are worth trying:

- **SFI**, the solar flux, tells you how high the bands go. Around 70, 15 and 10 m are seldom open
  beyond short skip; above 150, expect 10 m to open in daytime on long paths; the higher the SFI,
  the earlier the high bands open and the later they close;
- **Kp** tells you whether the geomagnetic field is quiet. At Kp 0 to 2, conditions are as
  predicted, and the low bands are at their best. At Kp 4 and above, expect paths that pass near
  the poles - Europe to the west coast of North America, North America to Asia - to be weak or
  closed, and look for another route: see [Finding an Alternate Route](reading_the_maps.md#finding-an-alternate-route).

## Watching for a Storm

**Wind** and **Bz** tell you what is coming, a few hours before Kp shows it:

- a solar wind over 500 km/s often brings a disturbance within a day or two;
- a Bz that stays negative (southward) for hours, especially with a fast wind, means a storm is
  starting.

When you see these signs, show the **Aurora** map ([Ionospheric Maps](ionospheric_maps.md)) to watch
the oval grow towards the equator. A storm closes the polar paths, but it also brings auroral E on
10 and 6 m to stations near the oval, and good conditions on the paths that cross the equator.

## Using the Values in the Predictions

The maps do not use the SFI and Kp shown on the panel. With **Use STORM Model** ticked in
**Tools > Ionospheric Parameters...**, the maps follow geomagnetic disturbances by themselves from the
Ap index. To see how the bands would look at a different solar activity, enter a sunspot number of
your own in the same dialog; see [Ionospheric Maps](ionospheric_maps.md#the-ionospheric-parameters-dialog).

## Is the Value Current?

Hover over the panel to see how old each value is. A dash means the program has no value recent
enough to trust - over 1 hour old for the wind and Bz, over 36 hours for the SFI and Kp - usually
because there is no Internet connection. The values are downloaded only while the panel is shown.

The panel is shown on one map at a time: ticking it under the other map's
Ionosphere button moves it there.
