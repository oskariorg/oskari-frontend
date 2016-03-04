Polymer.require(["/Oskari/libraries/mathjs/math.2.4.1.min.js"], function(math) {
  return {
    "is": "oskari-statsgrid",
    "properties": {
      "ajaxUrl": String,
      "locale": Object,
      "language": String,
      "embedded": Boolean,
      "sandbox": {
        "type": Object,
        "notify": true
      },
      "sources": {
        "type": Object,
        "notify": true
      },
      "selectedLayer": {
        "type": String,
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
      "rowHeaders": {
        "value": function() { return [];},
        "type": Array,
        "notify": true
      },
      "rows": {
        "type": Array,
        "notify": true
      },
      "statsrows": {
        "type": Array,
        "notify": true
      },
      "selectedIndicators": {
        "type": Array,
        "notify": true
      },
      "cache": {
        "type": Object,
        "notify": true
      },
      /**
       * For example the indicator selector can notify of selected indicator with this.
       */
      "selectorSelectedIndicatorKey": {
        "type": String,
        "notify": true
      },
      /**
       * For example the indicator selector can notify of selected indicator with this.
       */
      "selectedIndicatorKey": {
        "type": String,
        "notify": true
      },
      /**
       * This designates the indicator that is currently active in the map.
       */
      "selectedIndicator": {
        "type": Object,
        "notify": true
      },
      "showSpinner": {
        "type": Boolean,
        "notify": true,
        "value": false
      },
      "indicatorExpanded": {
        "type": Boolean,
        "notify": true
      }
    },
    "listeners": {
      "onSort": "onSort",
      "onDelete": "onDelete",
      "onFilter": "onFilter",
      "onSelectionsChanged": "updateStatistics"
    },
    "observers": [
      "selectedLayerChanged(ajaxUrl, selectedLayer, sources)",
      "selectedIndicatorsChanged(ajaxUrl, selectedIndicators.splices, sources, selectedIndicators, regionInfo)",
      "sortChanged(sortColumnIdx, sortDirection)",
      "updateSelectedIndicators(sources)",
      "selectedIndicatorChanged(selectedIndicatorKey, rows, rowHeaders)"
    ],
    "ajaxError": function(e) {
      var me = this;
      console.log("Error: " + e);
      window.alert(me.locale.connectionError + ": " + e);
    },
    "sendTooltipData": function(feature) {
      var featureAttributes = feature.attributes,
      regionCode = featureAttributes[this.layerInfo[this.selectedLayer].idTag],
      eventBuilder = this.sandbox.getEventBuilder(
          'MapStats.HoverTooltipContentEvent'
      ),
      item = this.selectedIndicator && this.selectedIndicator.data[regionCode] || null,
      content;

      if (item === null || item === undefined) {
        this.sandbox.printWarn(
            'sendTooltipData: item not found for',
            regionCode,
            'in',
            this.selectedIndicator && this.selectedIndicator.data
        );
      }

      content = '<p>' + this.regionInfo[regionCode].localizedName;
      content += item ? '<br />' + item : '';
      content += '</p>';

      if (eventBuilder) {
        var event = eventBuilder(content);
        this.sandbox.notifyAll(event);
      }
    },
    "showIndicatorOnMap": function(cacheKey, index, header) {
      var me = this,
      eventBuilder = me.sandbox.getEventBuilder('StatsGrid.StatsDataChangedEvent'),
      indicatorValues = me.cache[cacheKey],
      cur_col = {
        // TODO: This is a legacy code workaround. Now unnecessary, but the classification plugin wants it.
        field: "indicator: " + (header && header.title || header)
      },
      layer = me.sandbox.findMapLayerFromAllAvailable(me.selectedLayer),
      vis_name = layer.getLayerName(),
      vis_attr = me.layerInfo[me.selectedLayer].idTag,
      vis_codes = indicatorValues && Object.keys(indicatorValues).filter(function(regionCode) {
        return indicatorValues[regionCode] !== null && indicatorValues[regionCode] !== undefined;
      }) || [],
      col_values = vis_codes.map(function(regionKey) {
        return indicatorValues[regionKey];
      }).filter(function(value) {
        return value !== null && value !== undefined;
      });
      me.set("selectedIndicatorKey", cacheKey);
      if (eventBuilder) {
        // CUR_COL:"indicator..." , VIS_NAME: "ows:kunnat2013", VIS_ATTR: "kuntakoodi", VIS_CODES: munArray, COL_VALUES: statArray
        var data = {
            CUR_COL: cur_col,
            VIS_NAME: vis_name,
            VIS_ATTR: vis_attr,
            VIS_CODES: vis_codes,
            COL_VALUES: col_values
        },
        // Oskari.mapframework.domain.WmsLayer
        // layertype STATS
        event = eventBuilder(layer, data);
        try {
          me.sandbox.notifyAll(event);
        } catch (e) {
          // Sometimes the map throws weird exceptions.
        }
      }
    },
    "onSort": function(event) {
      var id = event.target.id,
      index = event.detail.index,
      header = event.detail.header;
      this.selectedIndicatorKey = header.id;
      if (id === "indicator-data-grid") {
        // The statistics summary grid is not sortable.
        this.sortBasedOnColumn(index);
        // This also selects the indicator into the map.
        this.showIndicatorOnMap(header.id, index, header);
      }
      this.updateStatistics();
    },
    "onDelete": function(event) {
      var id = event.target.id,
      index = event.detail.index,
      header = event.detail.header;
      this.deleteIndicator(index - 1);
    },
    "onFilter": function(event) {
      var id = event.target.id,
      index = event.detail.index,
      header = event.detail.header;
      this.filterOnValue(index);
    },
    "selectedIndicatorChanged": function(indicatorKey) {
      var me = this,
      indicatorHeader,
      i = 0,
      index;
      me.rowHeaders.forEach(function (header) {
        if (header.id === indicatorKey) {
          indicatorHeader = header;
          index = i;
        }
        i = i + 1;
      });
      if (!indicatorHeader) {
        return;
      }
      me.set("selectedIndicator", {
        header: indicatorHeader,
        data: me.cache[indicatorHeader.id]
      });
      this.showIndicatorOnMap(indicatorHeader.id, index, indicatorHeader);
      this.updateSize();
    },
    "filterOnValue": function(index) {
      var me = this;
      var filterDialog = document.createElement("oskari-filter-on-value-dialog");
      me.dialogs.push(filterDialog);
      filterDialog.locale = me.locale;
      filterDialog.label = me.rowHeaders[index].title;
      filterDialog.id = "filterDialog";
      filterDialog.columnId = me.rowHeaders[index].id;
      filterDialog.columnIndex = index;
      filterDialog.rows = me.rows;
      filterDialog.onClose = function() {
        me.dialogs.forEach(function(dialog) {
          // In some cases if you click filtering many times, the other dialogs linger around invisible.
          // This removes them all.
          dialog.remove();
        });
        me.dialogs = [];
        me.$["indicator-data-grid"].selectionsChanged();
      };
      me.appendChild(filterDialog);
    },
    /**
     * Converts the selector array into selectors key-value object required by the interface.
     */
    "toSelectorsParameter": function(selectorsArray) {
      var selectors = {};
      selectorsArray.forEach(function(selector) {
        selectors[selector.selectorId] = selector.value;
      });
      return selectors;
    },
    "getLayerInfoAsArray": function(layerInfo) {
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
    "selectedLayerChanged": function(ajaxUrl, layer) {
      var me = this;
      $.ajax({
        url: me.ajaxUrl,
        data: me.getRegionInfoParams(layer),
        dataType: 'json',
        success: function(results){
          me.regionInfo = results;
          Object.keys(me.regionInfo).forEach(function (regionKey) {
            me.regionInfo[regionKey].localizedName =
              me.localize(me.locale.regionCategories, me.regionInfo[regionKey].name);
          });
          me.selectedIndicatorsChanged();
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log("Error: " + textStatus + ", " + errorThrown);
          window.alert(me.locale.connectionError + ": " + textStatus);
        }
      });
      var statsLayer = me.sandbox.findMapLayerFromSelectedMapLayers(layer);
      if (!statsLayer) {
          statsLayer = me.sandbox.findMapLayerFromAllAvailable(layer);
          if (statsLayer) {
              // add layer to selection if it's available but not yet added.
              me.sandbox.postRequestByName('AddMapLayerRequest', [statsLayer.getId(), false, statsLayer.isBaseLayer()]);
          }
      }
      if (statsLayer) {
          // Moving this layer to the top.
          me.sandbox.postRequestByName('RearrangeSelectedMapLayerRequest', [statsLayer.getId(), -1]);
          // Highlighting this layer to enable mouse interaction.
          me.sandbox.postRequestByName('HighlightMapLayerRequest', [statsLayer.getId()]);
      }
    },
    "selectedIndicatorsChanged": function() {
      var me = this,
      indicators = this.selectedIndicators || [],
      layer = me.sandbox.findMapLayerFromAllAvailable(me.selectedLayer),
      layerName = layer.getLayerName();
      // This is needed to initialize the native dropdown to the correct value.
      this.$.selectRegionCategory.value = this.selectedLayer;
      this.set("rowHeaders", [{
        title: me.localize(me.locale.regionCategories, layerName),
        sort: true,
        filter: true
      }].concat(
          indicators.map(function(indicator) {
            var selectors = me.toSelectorsParameter(indicator.selectors),
            selectorsKey = JSON.stringify(selectors),
            cacheKey = me.getCacheKey(indicator.datasourceId, indicator.indicatorId,
                me.selectedLayer, selectorsKey),
                selectorsAsString = indicator.selectors.map(function(selector) {
                  return selector.value;
                }).join("/");
            indicator.id = cacheKey;
            if (indicator.indicatorValues) {
              // This is a published indicator in an embedded view with inlined data.
              return {
                id: cacheKey,
                indicatorId: indicator.indicatorId,
                title: indicator.title[me.language] +
                  ((selectorsAsString.length > 0) ? "/" : "") + selectorsAsString,
                sort: true,
                filter: true,
                delete: true
              }
            }
            return {
              id: cacheKey,
              indicatorId: indicator.indicatorId,
              title: me.sources[indicator.datasourceId].indicators[indicator.indicatorId].name[me.language] +
                ((selectorsAsString.length > 0) ? "/" : "") + selectorsAsString,
              sort: true,
              filter: true,
              delete: true
            }
          })));
      var ajaxCallMade = false;
      indicators.forEach(function(indicator) {
        var selectors = me.toSelectorsParameter(indicator.selectors),
        selectorsString = JSON.stringify(selectors),
        cacheKey = me.getCacheKey(indicator.datasourceId, indicator.indicatorId,
            me.selectedLayer, selectorsString);
        if (me.cache[cacheKey]) {
          me.handleResponse(me.cache[cacheKey]);
          return;
        } else if (indicator.indicatorValues) {
          // This is a published indicator in an embedded view with inlined data.
          // Making a new copy to trigger all the observers.
          var newKeyVal = {};
          newKeyVal[cacheKey] = indicator.indicatorValues;
          me.set("cache", jQuery.extend({}, me.cache, newKeyVal));

          return;
        }
        ajaxCallMade = true;
        $.ajax({
          url: me.ajaxUrl,
          data: {
            "action_route": "GetIndicatorData",
            "plugin_id": indicator.datasourceId,
            "indicator_id": indicator.indicatorId,
            "layer_id": me.selectedLayer,
            "selectors": selectorsString
          },
          dataType: 'json',
          success: function(results) {
            me.showSpinner = false;
            me.cache[cacheKey] = results;
            me.handleResponse(me.cache[cacheKey]);
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error: " + textStatus + ", " + errorThrown);
            window.alert(me.locale.connectionError + ": " + textStatus);
            me.showSpinner = false;
          }
        });
      });
      if (ajaxCallMade) {
        me.showSpinner = true;
      }
    },
    "getRegionInfoParams": function(selectedLayer) {
      var res = {
          "action_route": "GetRegionInfo",
          "layer_id": selectedLayer
      };
      return res;
    },
    "isDefined": function(value) {
      return value !== undefined && value !== null;
    },
    "summarize": {
      "min": function(values) {
        return math.min(values);
      },
      "max": function(values) {
        return math.max(values);
      },
      "avg": function(values) {
        return math.mean(values);
      },
      "mde": function(values) {
        return math.mode(values);
      },
      "mdn": function(values) {
        return math.median(values);
      },
      "std": function(values) {
        return math.std(values);
      },
      "sum": function(values) {
        return math.sum(values);
      }
    },
    "localize": function(prefix, key) {
      return prefix[key] || key;
    },
    "deleteIndicator": function(index) {
      // FIXME: When indicators are deleted, the selected indicator on the map should be changed also
      //        so that it will not be an indicator that was deleted.
      this.splice("rowHeaders", index + 1, 1);
      this.splice("selectedIndicators", index, 1);
    },
    "onDeleteIndicator": function(event) {
      var me = this,
      // The first index is the header column.
      index = event.target.index - 1;
      this.deleteIndicator(index);
    },
    "updateStatistics": function() {
      var me = this,
      // For average, min, max, etc.
      summaryIds = ["min", "max", "avg", "mde", "mdn", "std", "sum"],
      regionSelected = {};
      me.rows.forEach(function (row) {
        if (row.selected) {
          regionSelected[row.regionKey] = true;
        }
      });

      var
      // An array of {'min': value, 'max': value, ...} objects in the order of selectedIndicators.
      summariesForIndicators = me.selectedIndicators.map(function(indicator) {
        // In ES6 we should definitely use "const" here.
        var cacheKey = indicator.id,
        indicatorValues = me.cache[cacheKey],
        values = indicatorValues && Object.keys(indicatorValues).map(function(regionKey) {
          return {regionKey: regionKey, value: indicatorValues[regionKey]};
        }).filter(function(regionValue) {
          return regionSelected[regionValue.regionKey];
        }).map(function(regionValue) {
          return regionValue.value;
        }) || [],
        // In ES6 we could use { [summaryFunction]: ... }
        summary = {},
        definedValues = values.filter(me.isDefined);
        // FIXME: Filter based on selected value
        if (definedValues && values.length > 0) {
          summaryIds.forEach(function(summaryFunction) {
            summary[summaryFunction] = me.summarize[summaryFunction](definedValues);
          });
        }
        return summary;
      }),
      summaryRows = summaryIds.map(function(summaryFunction) {
        return {
          selected: true,
          data: [me.locale.statistic[summaryFunction]].concat(
              summariesForIndicators.map(function(summaryValuesForIndicator) {
                return summaryValuesForIndicator[summaryFunction];
              }))
        };
      });

      this.set("statsrows", summaryRows);
    },
    "handleResponse": function(response) {
      var me = this;
      if (!me.selectedIndicators.every(function(indicator) {
        // TODO: This would be cleaner using promises.
        // If we haven't fetched all the indicator values yet, we will do nothing.
        return me.cache[indicator.id] != undefined;
      })) {
        return;
      }
      var regionKeyedValues = {};

      // Transposing the array keyed by indicators in cache to being keyed by regions.
      me.selectedIndicators.forEach(function(indicator) {
        var cacheKey = indicator.id,
        indicatorValues = me.cache[cacheKey];
        if (indicatorValues) {
          Object.keys(indicatorValues).forEach(function(regionKey) {
            var value = indicatorValues[regionKey];
            if (!regionKeyedValues[regionKey]) {
              regionKeyedValues[regionKey] = {};
            }
            regionKeyedValues[regionKey][cacheKey] = value;
          });
        }
      });

      var newRows = Object.keys(regionKeyedValues).map(function(regionKey) {
        var indicatorValues = regionKeyedValues[regionKey],

        row = {
            selected: true,
            data: ((me.regionInfo[regionKey]) && [me.regionInfo[regionKey].localizedName] ||
                [me.localize(me.locale, "defunctRegion") + " (" + regionKey + ")"])
                .concat(me.selectedIndicators.map(function(indicator) {
                  return indicatorValues[indicator.id];
                })),
                regionKey: regionKey
        };
        return row;
      });
      this.set("rows", newRows);

      me.updateStatistics();
      if (me.selectedIndicators.length === 1 || (me.embedded && me.selectedIndicators.length > 0)) {
        // If this is the first added indicator, or the only indicator left, we will update the map.
        // We will also update the map if we are in embedded mode, because we can fetch several indicators at once, and the first
        // indicator check will in that case fail.
        var theOnlyIndicator = me.selectedIndicators[0];
        me.selectedIndicatorChanged(theOnlyIndicator.id);
      }
    },
    "getCacheKey": function(datasourceId, indicatorId, selectedLayer, selectorsString) {
      return datasourceId + ":" + indicatorId + ":" + selectedLayer + ":" + selectorsString;
    },
    "sortIndicatorDataGrid": function (idx, direction) {
      var me = this;
      return function(a, b) {
        var lesser = direction == 'asc' ? -1 : 1;
        // Ambiguous order, using region name order.
        if (((a.data[idx] === undefined) && (b.data[idx] === undefined)) ||
            (a.data[idx] === b.data[idx])) {
          return me.sortIndicatorDataGrid(0, direction)(a, b);
        }
        // Undefined values are considered the smallest.
        if (a.data[idx] === undefined) {
          return lesser;
        } else if (b.data[idx] === undefined) {
          return -lesser;
        }
        return (a.data[idx] < b.data[idx]) ? lesser : -lesser;
      };
    },
    "sortChanged": function() {
      var me = this;
      me.rows.sort(me.sortIndicatorDataGrid(me.sortColumnIdx, me.sortDirection));
      // TODO: It might be a bit cleaner to use Polymer repeat element sort functionality here.
      this.$["indicator-data-grid"].refresh();
    },
    "sortBasedOnColumn": function(idx) {
      if (this.sortColumnIdx === idx) {
        this.sortDirection = this.sortDirection == "asc" ? "desc" : "asc";
      } else {
        this.sortDirection = "asc";
      }
      this.sortColumnIdx = idx;
    },
    "updateSelectedIndicators": function(sources) {
      if (sources) {
        this.selectedIndicatorsChanged(this.ajaxUrl, this.selectedIndicators);
      }
    },
    "updateSize": function() {
      var windowHeight = jQuery(window).height();
      var catSelHeight = jQuery('#region-category-selector').height();
      var indSelHeight = jQuery('#indicatorSelectorDiv').height();
      jQuery('#oskariGrid').height( windowHeight - catSelHeight
          - indSelHeight);
      jQuery('#oskari-grid-panel').height(windowHeight - catSelHeight
          - indSelHeight);
      jQuery('#oskari-stats-data-grid').height(windowHeight
          - indSelHeight);
    },
    "attached": function() {
      var me = this;
      if (this.embedded && this.selectedIndicators && this.selectedIndicators.length > 0) {
        var indicatorKey = this.selectedIndicators[0].id;
        this.set("selectedIndicator", this.selectedIndicators[0]);
        this.set("selectedIndicatorKey", indicatorKey);
      }
      this.updateSize();
    },
    "ready": function() {
      this.cache = {};
      this.dialogs = [];
    }
  };
});
