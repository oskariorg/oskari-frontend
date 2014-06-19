/**
 * http://dotnetbyexample.blogspot.fi/2013/03/enabling-basic-openlayers-pinch-zooming.html
 */
OpenLayers.Control.OskariWindowsPinchZoom = OpenLayers.Class(OpenLayers.Control,
  {
    autoActivate: true,

    gesture: null,

    defaultHandlerOptions: {},

    initialize: function (options)
    {
      this.handlerOptions = OpenLayers.Util.extend({}, this.defaultHandlerOptions);
      OpenLayers.Control.prototype.initialize.apply(this, options);
    },

  /* @method setup */
  setup : function(mapmodule) {
    this.mapmodule = mapmodule;
  },
    activate: function ()
    {
      if (OpenLayers.Control.prototype.activate.apply(this, arguments))
      {
        if (window.navigator.msPointerEnabled)
        {
          jQuery(this.mapmodule.getMapEl()).css("ms-touch-action", "none");
          this.map.fractionalZoom = true;

          this.gesture = new MSGesture();
          this.gesture.target = this.map.layerContainerDiv;
          var self = this;

          this.gesture.target.addEventListener("MSPointerDown", function (evt)
          {
            self.gesture.addPointer(evt.pointerId);
          });

          this.gesture.target.addEventListener("MSGestureChange", function (evt)
          {
            // Make scale result smaller to prevent high zoom speeds.
            if (evt.scale !== 1)
            {
              var scale = 1;
              if (evt.scale > 1)
              {
                scale = (evt.scale - 1) / 4 + 1;
              }
              else
              {
                scale = 1 - ((1 - evt.scale) / 4);
              }
              // map.zoomTo is buggy as hell so I use this convoluted way to 
              // calculate a new zoom area
              var resolution = self.map.getResolutionForZoom(self.map.zoom * scale);
              var bounds = self.map.calculateBounds(self.map.getCenter(), resolution);
              self.mapmodule.zoomToExtent(bounds);
            }
          });
        }
        return true;
      }
      else
      {
        return false;
      }
    },

    CLASS_NAME: "OpenLayers.Control.OskariWindowsPinchZoom"
  }
);