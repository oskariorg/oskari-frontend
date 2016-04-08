Polymer({
  "is": "oskari-indicatorselector",
  "properties": {
    "ajaxUrl": String,
    "locale": Object,
    "language": String,
    "user": Object,
    "embedded": {
      "type": Boolean,
      "notify": true,
      "value": false
    },
    "selectedLayer": {
      "type": Number,
      "notify": true
    },
    "sources": {
      "type": Object,
      "notify": true
    },
    "datasourceId": {
      "type": String,
      "notify": true
    },
    "indicatorId": {
      "type": String,
      "notify": true
    },
    "indicatorSelected": {
      "type": Boolean,
      "value": false,
      "notify": true
    },
    "indicatorExpanded": {
      "type": Boolean,
      "value": false,
      "notify": true
    },
    "allSelectorsSelected": {
      "type": Boolean,
      "value": false,
      "notify": true
    },
    "selectors": {
      "type": Array,
      "value": function() { return [];},
      "notify": true
    },
    "selectorItems": {
      "type": Array,
      "value": function() { return [];},
      "notify": true
    },
    "selectedIndicators": {
      "type": Array,
      "value": function() { return [];},
      "notify": true
    },
    "showUserIndicatorView": {
      "type": Boolean,
      "value": false,
      "notify": true
    },
    "hideGrid": {
      "type": Boolean,
      "notify": true,
      "value": false
    },
    "selectorSelectedIndicatorKey": {
      "type": String,
      "notify": true
    },
    "showSpinner": {
      "type": Boolean,
      "notify": true,
      "value": true
    },
    "dialog": Object
  },
  "listeners": {
    // This is fired when the user indicators have been changed, so the indicator info is fetched again.
    "onUserIndicatorsChanged": "onUserIndicatorsChanged"
  },
  "observers": [
    "datasourceChanged(datasourceId)",
    "indicatorChanged(indicatorId)",
    "getSelectors(sources, datasourceId, indicatorId)",
    "selectedIndicatorsChanged(ajaxUrl, selectedIndicators.splices, sources)",
    "evaluateHideGrid(showUserIndicatorView, selectedIndicators.splices)",
    "evaluateHideGrid(showUserIndicatorView, selectedIndicators)",
    "selectorsChanged(selectorItems.splices)",
    "selectorsChanged(selectors)"
  ],
  "ajaxError": function(e) {
    var me = this;
    console.log("Error: " + e && e.detail && e.detail.error || '');
    window.alert(me.locale.connectionError + ": " + e && e.detail && e.detail.error || '');
  },
  "hideSpinner": function(e, response) {
    this.showSpinner = false;
  },
  "onUserIndicatorsChanged": function(params) {
    if (this.user._loggedIn) {
      // We will only fetch new user indicators from the server if the user is logged in.
      this.$.indicatorsAjax.generateRequest();
    } else if (params && params.detail) {
      this.datasourceId = params.detail.pluginName;
      this.indicatorId = params.detail.id;
      var cacheKey = this.$.statsgrid.getCacheKey(params.detail.pluginName, params.detail.id,
          this.selectedLayer, "[]");
      params.detail.indicator.id = cacheKey;
      params.detail.indicator.public = false;
      this.sources[params.detail.pluginName].indicators[params.detail.id] = params.detail.indicator;

      this.push('selectedIndicators', params.detail.indicator);
      this.$.statsgrid.cache[cacheKey] = params.detail.indicator;
      this.$.statsgrid.handleResponse();
    }
  },
  "sendTooltipData": function(feature) {
    return this.$.statsgrid.sendTooltipData(feature);
  },
  "selectedIndicatorsChanged": function() {
    this.set("showGrid", !this.showUserIndicatorView && !!this.selectedIndicators
        && this.selectedIndicators.length > 0);
  },
  "selectorsChanged": function() {
    var me = this;
    me.set("allSelectorsSelected", true);
    if (this.selectorItems === undefined || this.selectorItems === null) {
      return;
    }
    this.selectorItems.forEach(function(select) {
      if (!select.value || select.value === null || select.value === "undefined") {
        me.set("allSelectorsSelected", false);
      }
    });
  },
  "hideIndicatorSelector": function(embedded, showUserIndicatorView) {
    return embedded || showUserIndicatorView;
  },
  "evaluateHideGrid": function(showUserIndicatorView, selectedIndicatorsSplices) {
    this.hideGrid = !!this.showUserIndicatorView;
  },
  "datasourceChanged": function(datasourceId) {
    var me = this;
    this.set("indicatorId", undefined);
  },
  "indicatorChanged": function(indicatorId) {
    var me = this;
    this.indicatorSelected = indicatorId !== undefined && indicatorId !== null && indicatorId !== "undefined";
    $.ajax({
      url: me.ajaxUrl,
      data: {
        "action_route": "GetIndicatorSelectorMetadata",
        "plugin_id": me.datasourceId,
        "indicator_id": indicatorId
      },
      dataType: 'json',
      success: function(results) {
        me.set("indicator", results);
        me.sources[me.datasourceId].indicators[me.indicatorId] = results;
        me.set("selectors", me.indicator && me.indicator.selectors || []);
        me.getSelectors(me.sources, me.datasourceId, me.indicatorId);
      }
    });
  },
  "onAddUserIndicator": function() {
    var me = this;
    this.showUserIndicatorView = true;
    // Warn the user if they're not logged in
    if (!me.user || !me.user.isLoggedIn()) {
      var dialog = Oskari.clazz.create(
          'Oskari.userinterface.component.Popup'
      ),
      okBtn = Oskari.clazz.create(
          'Oskari.userinterface.component.buttons.OkButton'
      );
      okBtn.setPrimary(true);
      okBtn.setHandler(function () {
        dialog.close(true);
      });
      dialog.show(
          me.locale.addDataTitle,
          me.locale.loginToSaveIndicator, [okBtn]
      );
    }
  },
  "getLocalizationFrom": function(localizedNames, fallback, lang) {
    var name = localizedNames[lang];
    if (!name) {
      name = localizedNames["fi"];
    }
    if (!name) {
      name = localizedNames["en"];
    }
    if (!name) {
      if (Object.keys(localizedNames) > 0) {
        // Taking the first one.
        name = localizedNames[Object.keys(localizedNames)[0]];
      } else {
        name = fallback;
      }
    }
    return name;
  },
  "showIndicatorInfo": function() {
    var me = this,
    indicatorCont = new jQuery('<div>' +
        '<h4 class="indicator-msg-popup-title"></h4>' +
        '<p class="indicator-msg-popup-title"></p>' +
        '<h4 class="indicator-msg-popup-source"></h4>' +
        '<p class="indicator-msg-popup-source"></p>' +
    '</div>'),
    indicators = me.sources[me.datasourceId].indicators,
    indicator = indicators[me.indicatorId],
    source = indicator.source,
    description = indicator.description;
    indicatorCont.find('h4.indicator-msg-popup-title').append(me.locale.stats.descriptionTitle);
    indicatorCont.find('p.indicator-msg-popup-title').append(
        me.getLocalizationFrom(description, "", me.language));
    indicatorCont.find('h4.indicator-msg-popup-source').append(me.locale.stats.sourceTitle);
    indicatorCont.find('p.indicator-msg-popup-source').append(
        me.getLocalizationFrom(source, "", me.language));
    me.showDialog(me.getLocalizationFrom(indicator.name, "", me.language), indicatorCont);
  },
  "showDialog": function(title, message, buttons) {
    var me = this;
    // Oskari components aren't available in a published map.
    if (me.dialog) {
      me.dialog.close(true);
      me.dialog = null;
      return;
    }

    me.dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
    if (buttons) {
      me.dialog.show(title, message, buttons);
    } else {
      var okBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton');
      okBtn.setHandler(function () {
        me.dialog.close(true);
        me.dialog = null;
      });
      me.dialog.show(title, message, [okBtn]);
    }
  },
  "getDatasources": function(sources) {
    var me = this;
    if (!sources) {
      return [];
    }
    return [{text: me.locale.selectDataSource}]
    .concat(Object.keys(sources).map(function(sourceId) {
      return {
        val: sourceId,
        text: sources[sourceId].locale[me.language].name
      };
    }));
  },
  "getIndicators": function(sources, datasourceId) {
    var me = this,
    indicators = sources[datasourceId] && sources[datasourceId].indicators || [];
    return [{text: me.locale.selectIndicator}].concat(Object.keys(indicators).map(function(indicatorId) {
      var indicator = indicators[indicatorId];
      return {
        val: indicatorId,
        text: indicator.name[me.language] || indicator.name.fi || indicatorId
      };
    }));
  },
  "resize": function() {
    this.$.statsgrid.$['indicator-data-grid'].resize();
  },
  "setSelectorsToDefaultValues": function() {
    this.selectors.forEach(function(selector) {
      this.$$('#' + selector.id).selectedIndex = "1";
    }.bind(this));
    this.selectorItems.forEach(function(item) {
      item.value = item.values[1].val;
    });
    this.allSelectorsSelected = true;
  },
  "getSelectors": function(sources, datasourceId, indicatorId) {
    var me = this,
    indicator = sources[datasourceId].indicators[indicatorId];
    me.set("selectors", indicator && indicator.selectors || []);
    me.set("selectorItems", me.selectors.map(function(selector) {
      return {
        name: selector.id,
        values: [{text: me.locale.selectorPlaceholders[selector.id]}].concat(
            selector.allowedValues.map(function (allowedValue) {
              return {
                val: allowedValue,
                text: allowedValue
              };
            }))
      };
    }));
    setTimeout(this.setSelectorsToDefaultValues.bind(this), 50);
    setTimeout(this.resize.bind(this), 100);
  },
  "getIndicatorKey": function(datasourceId, indicatorId, selectedLayer, selectorsString) {
    return datasourceId + ":" + indicatorId + ":" + selectedLayer + ":" + selectorsString;
  },
  /**
   * Converts the selector array into selectors key-value object required by the interface.
   */
  "toSelectorsParameter": function(selectorsArray) {
    var selectors = {};
    selectorsArray.forEach(function(selector) {
      // This works for both the selector boxes and the indicator selectors.
      selectors[selector.name || selector.selectorId] = selector.value;
    });
    return selectors;
  },
  /**
   * A stable stringify for JSON objects.
   */
  "stringify": function(obj) {
    return "{" + Object.keys(obj).sort().map(function(key) {return key + ":" + obj[key]}).join(",") + "}";
  },
  "onAddIndicatorToGrid": function(e) {
    var selectors = this.$.indicatorSelectors,
    selects = this.selectorItems,
    values = [];
    this.selectorItems.forEach(function(select) {
      values.push({
        selectorId: select.name,
        value: select.value
      });
    });
    this.selectorSelectedIndicatorKey = this.getIndicatorKey(this.datasourceId, this.indicatorId,
        this.selectedLayer, this.stringify(this.toSelectorsParameter(this.selectorItems)));
    var indicatorAlreadyAdded = false;
    this.selectedIndicators.forEach(function(selectedIndicator) {
      var thisIndicatorKey = this.getIndicatorKey(selectedIndicator.datasourceId, selectedIndicator.indicatorId,
          this.selectedLayer, this.stringify(this.toSelectorsParameter(selectedIndicator.selectors)));
      if (this.selectorSelectedIndicatorKey == thisIndicatorKey) {
        this.$.statsgrid.selectedIndicatorChanged(thisIndicatorKey);
        indicatorAlreadyAdded = true;
      }
    }.bind(this));
    if (!indicatorAlreadyAdded) {
      this.push('selectedIndicators', {
        datasourceId: this.datasourceId,
        indicatorId: this.indicatorId,
        selectors: values,
        public: this.sources[this.datasourceId].indicators[this.indicatorId].public
      });
    }
  },
  "attached": function() {
    jQuery('#statsgrid').height(jQuery(window).height() - jQuery('#indicatorSelectorDiv').height());
    jQuery('#userindicatordiv').height(jQuery(window).height() - jQuery('#indicatorSelectorDiv').height());
  }
});

