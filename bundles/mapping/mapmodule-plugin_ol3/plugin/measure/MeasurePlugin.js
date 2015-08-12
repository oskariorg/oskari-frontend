/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.MeasurePlugin
 *
 * Provides measure functionality for map. Possible to measure line or area.
 *
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.plugin.MeasurePlugin',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     *
     */
    function (config) {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.MeasurePlugin';
        me._name = 'MeasurePlugin';
    }, {

      var map = this.getMapModule().getMap();
      var source = new ol.source.Vector();

      var vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
          }),
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
              color: '#ffcc33'
            })
          })
        })
      });


      /**
       * Currently drawed feature
       * @type {ol.Feature}
       */
      var sketch;


      /**
       * Element for currently drawed feature
       * @type {Element}
       */
      var sketchElement;


      /**
       * handle pointer move
       * @param {Event} evt
       */
      var mouseMoveHandler = function(evt) {
        if (sketch) {
          var output;
          var geom = (sketch.getGeometry());
          if (geom instanceof ol.geom.Polygon) {
            output = formatArea(/** @type {ol.geom.Polygon} */ (geom));

          } else if (geom instanceof ol.geom.LineString) {
            output = formatLength( /** @type {ol.geom.LineString} */ (geom));
          }
          sketchElement.innerHTML = output;
        }
      };


      $(map.getViewport()).on('mousemove', mouseMoveHandler);
;

      var draw; // global so we can remove it later

      addInteraction: function (type) {
        draw = new ol.interaction.Draw({
          source: source,
          type: type
        });
        map.addInteraction(draw);

        draw.on('drawstart',
            function(evt) {
              // set sketch
              sketch = evt.feature;
              sketchElement = document.createElement('li');
              var outputList = document.getElementById('measureOutput');

              if (outputList.childNodes) {
                outputList.insertBefore(sketchElement, outputList.firstChild);
              } else {
                outputList.appendChild(sketchElement);
              }
            }, this);

        draw.on('drawend',
            function(evt) {
              // unset sketch
              sketch = null;
              sketchElement = null;
            }, this);
      }


      /**
       * Let user change the geometry type.
       * @param {Event} e Change event.
       */
      typeSelect.onchange = function(e) {
        map.removeInteraction(draw);
        addInteraction();
      };


      /**
       * format length output
       * @param {ol.geom.LineString} line
       * @return {string}
       */
      var formatLength = function(line) {
        var length = Math.round(line.getLength() * 100) / 100;
        var output;
        if (length > 100) {
          output = (Math.round(length / 1000 * 100) / 100) +
              ' ' + 'km';
        } else {
          output = (Math.round(length * 100) / 100) +
              ' ' + 'm';
        }
        return output;
      };


      /**
       * format length output
       * @param {ol.geom.Polygon} polygon
       * @return {string}
       */
      var formatArea = function(polygon) {
        var area = polygon.getArea();
        var output;
        if (area > 10000) {
          output = (Math.round(area / 1000000 * 100) / 100) +
              ' ' + 'km<sup>2</sup>';
        } else {
          output = (Math.round(area * 100) / 100) +
              ' ' + 'm<sup>2</sup>';
        }
        return output;
      };

      addInteraction();
    }, {
      'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
      /**
       * @static @property {string[]} protocol array of superclasses
       */
      'protocol': [
          'Oskari.mapframework.module.Module',
          'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
      ]
  });