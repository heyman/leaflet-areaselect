# Leaflet AreaSelect [![npm version](https://badge.fury.io/js/@jonatanheyman%2Fleaflet-areaselect.svg)](https://badge.fury.io/js/@jonatanheyman%2Fleaflet-areaselect)

AreaSelect is a leaflet plugin for letting users select a square area (bounding box), 
using a resizable centered box on top of the map. 

![longitude.me](https://s3-eu-west-1.amazonaws.com/heyman.info/screenshots/leaflet-areaselect.jpg)

Another similar plugin is [leaflet-locationfilter](https://github.com/kajic/leaflet-locationfilter), 
which solves the same problem but provides a rectangle that is movable and not fixed to the center, 
but doesn't support keeping the aspect ratio.

## Example Code
```javascript
    // Add it to the map
    var areaSelect = L.areaSelect({width:200, height:300, minWidth:40, minHeight:40, minHorizontalSpacing:40, minVerticalSpacing:100, keepAspectRatio:false});
    areaSelect.addTo(map);
    
    // Read the bounding box
    var bounds = areaSelect.getBounds();
    
    // Get a callback when the bounds change
    areaSelect.on("change", function() {
        console.log("Bounds:", this.getBounds());
    });
    
    // Set the dimensions of the box
    areaSelect.setDimensions({width: 500, height: 500})

    // And to remove it do:
    //areaSelect.remove();
```

#### To make it keep the aspect ratio:

```javascript
    var areaSelect = L.areaSelect({width:200, height:300, keepAspectRatio:true});
```

#### To set the selected area (not compatible with `keepAspectRatio:true`):

```javascript
    areaSelect.setBounds([{lat:59.2272559, lng:17.7606917}, {lat:59.4402838, lng:18.2000673}]);
```

## See it in action

Check out the [bundled example](http://heyman.github.io/leaflet-areaselect/example/).

## Author

AreaSelect is developed by [Jonatan Heyman](http://heyman.info).

## License

MIT License
