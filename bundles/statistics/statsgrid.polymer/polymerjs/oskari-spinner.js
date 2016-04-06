Polymer.require(['/Oskari/bundles/statistics/statsgrid.polymer/libs/spinner/spin.min.js'], function(Spinner) {
  return {
    "is": "oskari-spinner",
    "properties": {
      "spinnerId": {
        "type": String,
        "value": "spinner"
      },
      "visible": {
        "type": Boolean,
        "notify": true
      }
    },
    /**
     * @static
     * @property __opts default opts for spinner
     */
    "__opts": {
      // The number of lines to draw
      lines: 15,
      // The length of each line
      length: 0,
      // The line thickness
      width: 5,
      // The radius of the inner circle
      radius: 16,
      // Corner roundness (0..1)
      corners: 0,
      // The rotation offset
      rotate: 0,
      // #rgb or #rrggbb
      color: '#000',
      // Rounds per second
      speed: 0.6,
      // Afterglow percentage
      trail: 59,
      // Whether to render a shadow
      shadow: false,
      // Whether to use hardware acceleration
      hwaccel: false,
      // The CSS class to assign to the spinner
      className: 'spinner',
      // The z-index (defaults to 2000000000)
      zIndex: 2e9,
      // Top position relative to parent in px
      top: 'auto',
      // Left position relative to parent in px
      left: 'auto'
    },
    "attached": function() {
      var target = document.getElementById(this.spinnerId);
      var spinner = new Spinner(this.__opts).spin(target);
    }
  };
});
