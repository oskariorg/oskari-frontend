StatsView = Polymer({
  is: "oskari-statsview",
  properties: {
    "locale": Object,
    "layerId": String,
    "language": String,
    "ajaxUrl": String,
    "user": Object,
    "selectedLayer": {
      "type": Number,
      "value": 9,
      "notify": true
    },
    "embedded": {
      "type": Boolean,
      "notify": true
    },
    "selectedIndicators": {
      "type": Array,
      "notify": true
    }
  },
  "sendTooltipData": function(feature) {
    return this.$.indicatorselector.sendTooltipData(feature);
  }
});
