

define(["oskari"], function(Oskari) {

	return Oskari.eventCls("sample.SampleEvent", function(message) {
		this.message = message;
	}, {
		getMessage : function() {
			return this.message;
		}
	});

});
