

define(["oskari"], function(Oskari) {

	return Oskari.requestCls("sample.SampleRequest", function(Message) {
		this._Message = Message;
	}, {
		getMessage : function() {
			return this._Message;
		}
	});

});
