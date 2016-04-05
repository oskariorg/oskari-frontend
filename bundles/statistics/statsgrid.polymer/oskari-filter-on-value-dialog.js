Polymer({
  is: "oskari-filter-on-value-dialog",
  properties: {
    "filterCondition": {
      "type": String,
      "notify": true,
      "value": ""
    },
    "input1": {
      "type": String,
      "notify": true,
      "value": ""
    },
    "input2": {
      "type": String,
      "notify": true,
      "value": ""
    },
    "rows": {
      "type": Array,
      "notify": true
    },
    "columnId": String,
    "columnIndex": Number,
    "locale": Object
  },
  "filterConditions": {
    "type": Object,
    "notify": true
  },
  "observers": [
    "localeReady(locale)"
    ],
    "ready": function() {
    },
    "cancel": function() {
      this.$["oskari-filter-on-value-dialog"].close();
      this.onClose();
    },
    "isRange": function(filterCondition) {
      return filterCondition == "...";
    },
    "filter": function() {
      var me = this;
      this.rows.forEach(function(row, index) {
        if (row.selected) {
          var value = row.data[me.columnIndex];
          if (value === null || value === undefined) {
            me.set("rows." + index + ".selected", false);
          }
          switch (me.filterCondition) {
          case '>':
            if (value <= me.input1) {
              me.set("rows." + index + ".selected", false);
            }
            break;
          case '>=':
            if (value < me.input1) {
              me.set("rows." + index + ".selected", false);
            }
            break;
          case '=':
            if (value !== me.input1) {
              me.set("rows." + index + ".selected", false);
            }
            break;
          case '<=':
            if (value > me.input1) {
              me.set("rows." + index + ".selected", false);
            }
            break;
          case '<':
            if (value >= me.input1) {
              me.set("rows." + index + ".selected", false);
            }
            break;
          case '...':
            if (me.input1 >= value || value >= me.input2) {
              me.set("rows." + index + ".selected", false);
            }
            break;
          }
        }
      });
      this.$["oskari-filter-on-value-dialog"].close();
      this.onClose();
    },
    "localeReady": function(locale) {
      this.set("filterConditions", [
        {
          value: "",
          text: locale.filterSelectCondition
        },
        {
          value: ">",
          text: locale.filterGT
        },
        {
          value: ">=",
          text: locale.filterGTOE
        },
        {
          value: "=",
          text: locale.filterE
        },
        {
          value: "<=",
          text: locale.filterLTOE
        },
        {
          value: "<",
          text: locale.filterLT
        },
        {
          value: "...",
          text: locale.filterBetween
        }
        ]);
    },
    /**
     * This stops for example the F key from propagating to the OpenLayers map fullscreen toggle.
     */
    "stopWindowEvents": function(e) {
      e.stopPropagation();
    },
    "ready": function() {
      this.$["oskari-filter-on-value-dialog"].toggle();
    }
});

