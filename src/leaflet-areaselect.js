L.AreaSelect = L.Class.extend({
    includes: L.Mixin.Events,
    
    options: {
        width: null,
        height: null,
        keepAspectRatio: false,
        aspectRatio : null,
    },

    initialize: function(options) {
        L.Util.setOptions(this, options);
        this._width = this.options.width;
        this._height = this.options.height;
    },
    
    addTo: function(map) {
        map.addLayer(this);
        return this;
    },

    getBounds: function() {
        var size = this._map.getSize();
        var topRight = new L.Point();
        var bottomLeft = new L.Point();
        
        bottomLeft.x = Math.round((size.x - this._width) / 2);
        topRight.y = Math.round((size.y - this._height) / 2);
        topRight.x = size.x - bottomLeft.x;
        bottomLeft.y = size.y - topRight.y;
        
        var sw = this._map.containerPointToLatLng(bottomLeft);
        var ne = this._map.containerPointToLatLng(topRight);
        
        return new L.LatLngBounds(sw, ne);
    },

    remove: function() {
        this._map.removeLayer(this);
    },

    onAdd: function (map) {
        this._map = map;

        size = map.getSize();
        if (! this._width) this._width = size.x / 2;
        if (! this._height) this._height = size.y / 2;
        if (this.options.keepAspectRatio && (!this.options.aspectRatio)) {
            this.options.aspectRatio = this._width / this._height;
        }

        this._shades = [];
        for(var i=0; i<4; i++) this._shades.push(this._createShade());

        this._handles = [
            this._createHandle( 1, 1),
            this._createHandle( 1,-1),
            this._createHandle(-1, 1),
            this._createHandle(-1,-1),
        ];
        this._shades.concat(this._handles).forEach(function(elem) {
            map.getPanes().overlayPane.appendChild(elem);
        });
        this._render();
        map.on('viewreset', this._render, this);
        map.on('move', this._render, this);
    },

    _createHandle: function(dx,dy) {
        var that = this;
        var handle = L.DomUtil.create('div', 'leaflet-areaselect-handle');
        var drag = new L.Draggable(handle);
        drag.on('drag', function(e) {that._onHandleDrag(e, handle,  dx, dy);}).enable();
        return handle;
    },

    _createShade: function() {
        return L.DomUtil.create('div', 'leaflet-areaselect-shade');
    },


    onRemove: function (map) {
        this._handles.concat(this._shades).forEach(function(elem) {
                map.getPanes().overlayPane.removeChild(elem);
        });
        map.off('viewreset', this._render, this);
        map.off('move', this._render, this);
    },

    _onHandleDrag: function(e, handle, dx, dy) {
        var p = this._map.layerPointToContainerPoint(L.DomUtil.getPosition(handle));
        var offset = handle.offsetWidth;
        var size = this._map.getSize();
        this._width  = (offset + p.x*2 - size.x) * dx;
        this._height = (offset + p.y*2 - size.y) * dy;
        this._render();
    },

    _setPosition: function (element, x,y) {
        L.DomUtil.setPosition(element, this._map.containerPointToLayerPoint(new L.Point(x,y)));
    },

    _setDimensions: function (element, x, y, w, h) {
        this._setPosition(element,x, y);
        element.style.width = w + "px";
        element.style.height = h + "px";
    },

    _render: function () {
        var size = this._map.getSize();
        var offset = this._handles[0].offsetWidth;
        this._width  = Math.round(Math.min(size.x-offset, Math.max(offset, this._width)));
        this._height = Math.round(Math.min(size.y-offset, Math.max(offset, this._height)));
        if (this.options.aspectRatio) {
              var aspectRatio = this._width / this._height;
            if (aspectRatio > this.options.aspectRatio) {
                this._width = Math.round(this._height * this.options.aspectRatio);
            } else {
                this._height = Math.round(this._width / this.options.aspectRatio);
            }
        }
        var n = Math.round((size.y - this._height)/2);
        var w = Math.round((size.x - this._width )/2);
        var s = n + this._height;
        var e = w + this._width;
        this._setDimensions(this._shades[0], 0, 0, size.x, n);
        this._setDimensions(this._shades[1], 0, n, w, this._height);
        this._setDimensions(this._shades[2], e, n, size.x-e, this._height);
        this._setDimensions(this._shades[3], 0, s, size.x, size.y-s);
        offset = Math.round(offset / 2);
        n -= offset;
        s -= offset;
        e -= offset;
        w -= offset;
        this._setPosition(this._handles[0], e, s);
        this._setPosition(this._handles[1], e, n);
        this._setPosition(this._handles[2], w, s);
        this._setPosition(this._handles[3], w, n);
        this.fire("change");
    },


});

L.areaSelect = function(options) {
    return new L.AreaSelect(options);
}
