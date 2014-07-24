L.AreaSelect = L.Class.extend({
    'includes': L.Mixin.Events,

    'options': {
        'width': 300,
        'height': 300,
        'minWidth': 30,
        'minHeight': 30,
        'maxWidth': window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        'maxHeight': window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
        'keepAspectRatio': false
    },

    'initialize': function (options) {
        L.Util.setOptions(this, options);

        this._width = this.options.width;
        this._height = this.options.height;
        this._minWidth = this.options.minWidth;
        this._minHeight = this.options.minHeight;
        this._maxWidth = this.options.maxWidth - 5;
        this._maxHeight = this.options.maxHeight - 5;
        this._keepAspectRatio = this.options.keepAspectRatio;
        if (this._keepAspectRatio)
            this._ratio = this._width / this._height;
    },

    'addTo': function (map) {
        this.map = map;
        this._createElements();
        this._render();
        return this;
    },

    'getBounds': function () {
        var size = this.map.getSize();
        var topRight = new L.Point();
        var bottomLeft = new L.Point();

        bottomLeft.x = Math.round((size.x - this._width) / 2);
        topRight.y = Math.round((size.y - this._height) / 2);
        topRight.x = size.x - bottomLeft.x;
        bottomLeft.y = size.y - topRight.y;

        var sw = this.map.containerPointToLatLng(bottomLeft);
        var ne = this.map.containerPointToLatLng(topRight);

        return new L.LatLngBounds(sw, ne);
    },

    'remove': function () {
        this.map.off('moveend', this._onMapChange);
        this.map.off('zoomend', this._onMapChange);
        this.map.off('resize', this._onMapResize);

        this._container.remove();
    },

    '_createElements': function () {
        if (!!this._container)
            return;

        this._container = L.DomUtil.create('div', 'leaflet-areaselect-container', this.map._controlContainer);
        this._topShade = L.DomUtil.create('div', 'leaflet-areaselect-shade', this._container);
        this._bottomShade = L.DomUtil.create('div', 'leaflet-areaselect-shade', this._container);
        this._leftShade = L.DomUtil.create('div', 'leaflet-areaselect-shade', this._container);
        this._rightShade = L.DomUtil.create('div', 'leaflet-areaselect-shade', this._container);

        this._nwHandle = L.DomUtil.create('div', 'leaflet-areaselect-handle', this._container);
        this._swHandle = L.DomUtil.create('div', 'leaflet-areaselect-handle', this._container);
        this._neHandle = L.DomUtil.create('div', 'leaflet-areaselect-handle', this._container);
        this._seHandle = L.DomUtil.create('div', 'leaflet-areaselect-handle', this._container);

        this._setUpHandlerEvents(this._nwHandle);
        this._setUpHandlerEvents(this._neHandle, -1, 1);
        this._setUpHandlerEvents(this._swHandle, 1, -1);
        this._setUpHandlerEvents(this._seHandle, -1, -1);

        this.map.on('moveend', this._onMapChange, this);
        this.map.on('zoomend', this._onMapChange, this);
        this.map.on('resize', this._onMapResize, this);

        this.fire('change');
    },

    '_setUpHandlerEvents': function (handle, xMod, yMod) {
        xMod = xMod || 1;
        yMod = yMod || 1;

        var self = this;
        function onMouseDown (event) {
            event.stopPropagation();
            L.DomEvent.removeListener(this, 'mousedown', onMouseDown);
            var curX = event.x;
            var curY = event.y;
            var size = self.map.getSize();

            function onMouseMove (event) {
                self._width += (curX - event.originalEvent.x) * 1.5 * xMod;
                self._height += (curY - event.originalEvent.y) * 1.5 * yMod;

                // stick to maximum bounds ...
                self._width = Math.min(self._maxWidth, self._width);
                self._height = Math.min(self._maxHeight, self._height);
                // .. and minimum bounds
                self._width = Math.max(self._minWidth, self._width);
                self._height = Math.max(self._minHeight, self._height);

                if (self._keepAspectRatio) {
                    // var maxHeight = Math.max((self._height >= self._width ? size.y : size.y * (1/ratio) ) - 30, this._maxHeight);
                    // self._height += (curY - event.originalEvent.y) * 2 * yMod;
                    // self._height = Math.max(30, self._height);
                    // self._height = Math.min(maxHeight, self._height);
                    // self._width = self._height * ratio;
                    // self._width *= self._ratio;
                    // self._height *= (1 / self._ratio);
                    // self._width = Math.max(self._minWidth * self._ratio, self._width);
                    // self._height = Math.max(self._minHeight * (1 / self._ratio), self._height);
                }

                curX = event.originalEvent.x;
                curY = event.originalEvent.y;
                self._render();
            }
            function onMouseUp(event) {
                L.DomEvent.removeListener(self.map, 'mouseup', onMouseUp);
                L.DomEvent.removeListener(self.map, 'mousemove', onMouseMove);
                L.DomEvent.addListener(handle, 'mousedown', onMouseDown);
                self.fire('change');
            }

            L.DomEvent.addListener(self.map, 'mousemove', onMouseMove);
            L.DomEvent.addListener(self.map, 'mouseup', onMouseUp);
        }
        L.DomEvent.addListener(handle, 'mousedown', onMouseDown);
    },

    '_onMapResize': function () {
        this._render();
    },

    '_onMapChange': function () {
        this.fire('change');
    },

    '_render': function () {
        var size = this.map.getSize();
        var handleOffset = Math.round(this._nwHandle.offsetWidth / 2);

        var topBottomHeight = Math.round((size.y - this._height) / 2);
        var leftRightWidth = Math.round((size.x - this._width) / 2);

        function setDimensions (element, dimension) {
            element.style.width = dimension.width + 'px';
            element.style.height = dimension.height + 'px';
            element.style.top = dimension.top + 'px';
            element.style.left = dimension.left + 'px';
            element.style.bottom = dimension.bottom + 'px';
            element.style.right = dimension.right + 'px';
        }

        setDimensions(this._topShade, {
            'width': size.x,
            'height': topBottomHeight,
            'top': 0,
            'left': 0
        });
        setDimensions(this._bottomShade, {
            'width': size.x,
            'height': topBottomHeight,
            'bottom': 0,
            'left': 0
        });
        setDimensions(this._leftShade, {
            'width': leftRightWidth,
            'height': size.y - (topBottomHeight * 2),
            'top': topBottomHeight,
            'left': 0
        });
        setDimensions(this._rightShade, {
            'width': leftRightWidth,
            'height': size.y - (topBottomHeight * 2),
            'top': topBottomHeight,
            'right': 0
        });

        setDimensions(this._nwHandle, {
            'left': leftRightWidth - handleOffset,
            'top': topBottomHeight - 7
        });
        setDimensions(this._neHandle, {
            'right': leftRightWidth - handleOffset,
            'top': topBottomHeight - 7
        });
        setDimensions(this._swHandle, {
            'left': leftRightWidth - handleOffset,
            'bottom': topBottomHeight - 7
        });
        setDimensions(this._seHandle, {
            'right': leftRightWidth - handleOffset,
            'bottom': topBottomHeight - 7
        });
    }
});

L.areaSelect = function (options) {
    return new L.AreaSelect(options);
};
