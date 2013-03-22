/**
 * 
 */
Oskari.clazz.category('Oskari.statistics.bundle.patiopoc.View', 'main-view-hacks', {

	/**
	 * @method attachToMainView
	 * attaches element to main view (temp fix)
	 * these shall be 'generalized'
	 */
	_attachToMainView : function(el) {
		/*mapElement.width(312);
		 mapElement.height(jQuery(window).height());*/
		var elCenter = jQuery('.oskariui-center');
		var elLeft = jQuery('.oskariui-left');

		elCenter.removeClass('span12');
		elCenter.addClass('span5');

		elLeft.removeClass('oskari-closed');
		elLeft.addClass('span7');
		elLeft.addClass('patiopoc_100');

		elLeft.append(el);
	},
	/**
	 * @method detachFromMainView
	 * detaches element from main view (temp fix)
	 * these shall be 'generalized'
	 */
	_detachFromMainView : function(el) {
		var elCenter = jQuery('.oskariui-center');
		var elLeft = jQuery('.oskariui-left');

		el.remove();
		el.empty();

		elCenter.removeClass('span5');
		elCenter.addClass('span12');

		elLeft.removeClass('patiopoc_100');
		elLeft.addClass('oskari-closed');
		elLeft.removeClass('span7');
	}
});
