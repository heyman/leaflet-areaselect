==================
Leaflet AreaSelect
==================

AreaSelect is a leaflet plugin for letting users select a square area (bounding box), 
using a resizable centered box on top of the map.

.. image:: https://images.weserv.nl/?url=static.longitude.me/img/opengraph-image.jpg
    :alt: longitude.me


Example Code
============

.. code-block:: javascript

    // Add it to the map
    var areaSelect = L.areaSelect({width:200, height:300});
    areaSelect.addTo(map);
    
    // Read the bouding box
    var bounds = areaSelect.getBounds();
    
    // Get a callback when the bounds change
    areaSelect.on("change", function() {
        console.log("Bounds:", this.getBounds());
    });
    
    // And to remove it do:
    //areaSelect.remove();

**You can also make it keep the aspect ratio:**

.. code-block:: javascript

    var areaSelect = L.areaSelect({width:200, height:300, keepAspectRatio:true});


See it in action
================

Check out the `bundled example <http://heyman.github.com/leaflet-areaselect/example/>`_.

Author
======

AreaSelect is developed by `Jonatan Heyman <http://heyman.info>`_.

License
=======

MIT License
