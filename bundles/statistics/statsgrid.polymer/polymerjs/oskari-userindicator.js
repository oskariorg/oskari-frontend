Polymer({
  "is": "oskari-userindicator",
  "properties": {
    "ajaxUrl": String,
    "locale": Object,
    "language": String,
    "user": Object,
    "sources": {
      "type": Object,
      "notify": true
    },
    "selectedLayer": {
      "type": Number,
      "notify": true
    },
    "layerInfo": {
      "type": Object,
      "notify": true
    },
    "regionInfo": {
      "type": Object,
      "notify": true
    },
    "regionItems": {
      "type": Object,
      "notify": true
    },
    "showUserIndicatorView": {
      "type": Boolean,
      "value": false,
      "notify": true
    }
  },
  "observers": [
    "getRegionItems(regionInfo)",
    "show(showUserIndicatorView)"
    ],
    "getLayerName": function(locale, layerKey) {
      var layer = this.sandbox.findMapLayerFromAllAvailable(layerKey);
      if (layer) {
        var layerName = layer.getLayerName();
        return this.localize(this.locale.regionCategories, layerName);
      } else {
        return "";
      }
    },
    "show": function() {
      // This is needed to initialize the native dropdown to the correct value.
      this.$.selectRegionCategory.value = this.selectedLayer;
    },
    "getRegionItems": function(regionInfo) {
      var me = this;
      me.set("regionItems", Object.keys(regionInfo).map(function (regionKey) {
        return {
          key: regionKey,
          text: regionInfo[regionKey].name
        };
      }));
    },
    "startImport": function() {
      var me = this,
      layer = me.sandbox.findMapLayerFromAllAvailable(me.selectedLayer),
      layerName = layer.getLayerName();
      //update form regions / municipalities
      var updateValue = function (name, value) {
        var row;
        //if code instead of name...
        if (/^\d+$/.test(name)) {
          // add prefix zeros to the code if needed (in case of municipality)
          // FIXME: Test if we need kuntakoodis here some other way.
          if (layerName === "oskari:kunnat2013") {
            if (name.length === 1) {
              name = '00' + name;
            }
            if (name.length === 2) {
              name = '0' + name;
            }
          }
          var found = false;
          me.regionItems.forEach(function(regionItem, index) {
            if (regionItem.key === name) {
              me.set("regionItems." + index + ".value", value);
              found = true;
            }
          });
          return found;
        } else {
          var found = false;
          me.regionItems.forEach(function(regionItem, index) {
            var regionName = me.regionInfo[regionItem.key].name;
            if (regionName === name) {
              me.set("regionItems." + index + ".value", value);
              found = true;
            }
          });
          return found;
        }
        return false;
      };
      var lines = this.$["indicator_text-import"].value.match(/[^\r\n]+/g),
      updated = 0,
      unrecognized = [];
      //loop through all the lines and parse municipalities (name or code)
      _.each(lines, function (line) {
        // separator can be tabulator, comma or colon
        var matches = line.match(/([^\t:,]+) *[\t:,]+ *(.*)/);
        if (matches && matches.length === 3) {
          var region = matches[1];
          value = (matches[2] || '').replace(',', '.').replace(/\s/g, '');
          // update municipality values
          if (updateValue(jQuery.trim(region), jQuery.trim(value))) {
            updated += 1;
          } else if (value && value.length > 0) {
            unrecognized.push({
              region: region,
              value: value
            });
          }
        }
      });

      // alert user of unrecognized lines
      var unrecognizedInfo = '';

      if (unrecognized.length > 0) {
        unrecognizedInfo = me.locale.parsedDataUnrecognized + ': ' + unrecognized.length;
      }
      // TODO: Tell user about how many regions were imported
    },
    "clearImport": function() {
      this.$["indicator_text-import"].value = "";
    },
    "cancelForm": function() {
      this.set("showUserIndicatorView", false);
    },
    "submitForm": function() {
      /*
          An example message:
          {
            title:{"fi":"c"}
            source:{"fi":"c"}
            description:{"fi":"c"}
            year:2015
            published:true
            category:"oskari:nuts1"
            data:[{"region":"727","primary value":"4"},{"region":"728","primary value":"5"}]
          }
       */
      var me = this,
        title = {},
        source = {},
        description = {},
        layer = me.sandbox.findMapLayerFromAllAvailable(me.selectedLayer),
        layerName = layer.getLayerName(),
        loggedIn = this.user._loggedIn,
        pluginName = 'fi.nls.oskari.control.statistics.plugins.user.UserIndicatorsStatisticalDatasourcePlugin';

      // TODO: If the user is not logged in, we will just put this indicator into user's browser session.
      title[this.language] = this.$.indicator_title.value;
      source[this.language] = this.$.indicator_sources.value;
      description[this.language] = this.$.indicator_description.value;
      var rows = this.regionItems.map(function (regionItem) {
        return {
          "region": regionItem.key,
          "primary value": regionItem.value
        };
      });
      if (loggedIn) {
        var formData = "title=" + encodeURIComponent(JSON.stringify(title)) + "&" +
          "source=" + encodeURIComponent(JSON.stringify(source)) + "&" +
          "description=" + encodeURIComponent(JSON.stringify(description)) + "&" +
          "year=" + encodeURIComponent(this.$.indicator_year.value) + "&" +
          "published=" + encodeURIComponent(this.$.indicator_publicity.value) + "&" +
          "material="+ encodeURIComponent(this.selectedLayer) + "&" +
          "category="+ encodeURIComponent(layerName) + "&" +
          "data=" + encodeURIComponent(JSON.stringify(rows));
        $.ajax({
          // For old jQuery.
          type: "POST",
          url: this.ajaxUrl + "?action_route=SaveUserIndicator",
          data: formData,
          success: function(response) {
            me.fire("onUserIndicatorsChanged", {pluginName: pluginName, id: title[this.language]});
          }
        });
      } else {
        var newIndicator = {
          datasourceId: pluginName,
          indicatorId: title[this.language],
          name: title,
          title: title,
          source: source,
          description: description,
          selectors: [],
          indicatorValues: {}
        };
        this.regionItems.forEach(function (regionItem) {
          newIndicator.indicatorValues[regionItem.key] = regionItem.value && Number(regionItem.value) || null;
        });
        me.fire("onUserIndicatorsChanged", {pluginName: pluginName, id: title[this.language], indicator: newIndicator});
      }
      this.set("showUserIndicatorView", false);
    },
    "clearForm": function() {
      var me = this;
      this.$.indicator_title.value = "";
      this.$.indicator_sources.value = "";
      this.$.indicator_description.value = "";
      this.$.indicator_year.value = "";
      this.$.indicator_publicity.value = false;
      this.regionItems.forEach(function (regionItem, index) {
        me.set("regionItems." + index + ".value", "");
      });
    },
    "localize": function(prefix, key) {
      return prefix[key] || key;
    },
    "getLayerInfoAsArray": function(layerInfo) {
      // FIXME: This is duplicated to oskari-statsgrid. Store layerinfo as array and pass it instead.
      var me = this,
      array = [];
      Object.keys(layerInfo).forEach(function(layerId) {
        var layer = me.sandbox.findMapLayerFromAllAvailable(layerId),
        layerName = layer.getLayerName();

        array.push({
          "val": layerId,
          "text": me.localize(me.locale.regionCategories, layerName)
        });
      });
      return array;
    },
    /**
     * This stops for example the F key from propagating to the OpenLayers map fullscreen toggle.
     */
    "stopWindowEvents": function(e) {
      e.stopPropagation();
    }
});
