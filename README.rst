==================
Leaflet AreaSelect
==================

AreaSelect is a leaflet plugin for letting users select a square area (bounding box), 
using a resizable centered box on top of the map.

.. image:: https://s3-eu-west-1.amazonaws.com/heyman.info/screenshots/leaflet-areaselect.jpg
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

Check out the `bundled example <http://heyman.github.com/leaflet-areaselect/example/>`_, 
or `this JSFiddle <http://jsfiddle.net/heyman/3N2DN/>`_ where I've set *keepAspectRatio:true*.

Author
======

AreaSelect is developed by `Jonatan Heyman <http://heyman.info>`_.

License
=======

MIT License
