/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/*
 * SimpleModal 1.4.2 - jQuery Plugin
 * http://simplemodal.com/
 * Copyright (c) 2011 Eric Martin
 * Licensed under MIT and GPL
 * Date: Sat, Dec 17 2011 15:35:38 -0800
 */

/**
 * SimpleModal is a lightweight jQuery plugin that provides a simple
 * interface to create a modal dialog.
 *
 * The goal of SimpleModal is to provide developers with a cross-browser
 * overlay and container that will be populated with data provided to
 * SimpleModal.
 *
 * There are two ways to call SimpleModal:
 * 1) As a chained function on a jQuery object, like $('#myDiv').modal();.
 * This call would place the DOM object, #myDiv, inside a modal dialog.
 * Chaining requires a jQuery object. An optional options object can be
 * passed as a parameter.
 *
 * @example $('<div>my data</div>').modal({options});
 * @example $('#myDiv').modal({options});
 * @example jQueryObject.modal({options});
 *
 * 2) As a stand-alone function, like $.modal(data). The data parameter
 * is required and an optional options object can be passed as a second
 * parameter. This method provides more flexibility in the types of data
 * that are allowed. The data could be a DOM object, a jQuery object, HTML
 * or a string.
 *
 * @example $.modal('<div>my data</div>', {options});
 * @example $.modal('my data', {options});
 * @example $.modal($('#myDiv'), {options});
 * @example $.modal(jQueryObject, {options});
 * @example $.modal(document.getElementById('myDiv'), {options});
 *
 * A SimpleModal call can contain multiple elements, but only one modal
 * dialog can be created at a time. Which means that all of the matched
 * elements will be displayed within the modal container.
 *
 * SimpleModal internally sets the CSS needed to display the modal dialog
 * properly in all browsers, yet provides the developer with the flexibility
 * to easily control the look and feel. The styling for SimpleModal can be
 * done through external stylesheets, or through SimpleModal, using the
 * overlayCss, containerCss, and dataCss options.
 *
 * SimpleModal has been tested in the following browsers:
 * - IE 6+
 * - Firefox 2+
 * - Opera 9+
 * - Safari 3+
 * - Chrome 1+
 *
 * @name SimpleModal
 * @type jQuery
 * @requires jQuery v1.2.4
 * @cat Plugins/Windows and Overlays
 * @author Eric Martin (http://ericmmartin.com)
 * @version 1.4.2
 */

;(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals
		factory(jQuery);
	}
}
(function ($) {
	var d = [],
		doc = $(document),
		ie6 = $.browser.msie && parseInt($.browser.version) === 6 && typeof window['XMLHttpRequest'] !== 'object',
		ie7 = $.browser.msie && parseInt($.browser.version) === 7,
		ieQuirks = null,
		wndw = $(window),
		w = [];

	/*
	 * Create and display a modal dialog.
	 *
	 * @param {string, object} data A string, jQuery object or DOM object
	 * @param {object} [options] An optional object containing options overrides
	 */
	$.modal = function (data, options) {
		return $.modal.impl.init(data, options);
	};

	/*
	 * Close the modal dialog.
	 */
	$.modal.close = function () {
		$.modal.impl.close();
	};

	/*
	 * Set focus on first or last visible input in the modal dialog. To focus on the last
	 * element, call $.modal.focus('last'). If no input elements are found, focus is placed
	 * on the data wrapper element.
	 */
	$.modal.focus = function (pos) {
		$.modal.impl.focus(pos);
	};

	/*
	 * Determine and set the dimensions of the modal dialog container.
	 * setPosition() is called if the autoPosition option is true.
	 */
	$.modal.setContainerDimensions = function () {
		$.modal.impl.setContainerDimensions();
	};

	/*
	 * Re-position the modal dialog.
	 */
	$.modal.setPosition = function () {
		$.modal.impl.setPosition();
	};

	/*
	 * Update the modal dialog. If new dimensions are passed, they will be used to determine
	 * the dimensions of the container.
	 *
	 * setContainerDimensions() is called, which in turn calls setPosition(), if enabled.
	 * Lastly, focus() is called is the focus option is true.
	 */
	$.modal.update = function (height, width) {
		$.modal.impl.update(height, width);
	};

	/*
	 * Chained function to create a modal dialog.
	 *
	 * @param {object} [options] An optional object containing options overrides
	 */
	$.fn.modal = function (options) {
		return $.modal.impl.init(this, options);
	};

	/*
	 * SimpleModal default options
	 *
	 * appendTo:		(String:'body') The jQuery selector to append the elements to. For .NET, use 'form'.
	 * focus:			(Boolean:true) Focus in the first visible, enabled element?
	 * opacity:			(Number:50) The opacity value for the overlay div, from 0 - 100
	 * overlayId:		(String:'simplemodal-overlay') The DOM element id for the overlay div
	 * overlayCss:		(Object:{}) The CSS styling for the overlay div
	 * containerId:		(String:'simplemodal-container') The DOM element id for the container div
	 * containerCss:	(Object:{}) The CSS styling for the container div
	 * dataId:			(String:'simplemodal-data') The DOM element id for the data div
	 * dataCss:			(Object:{}) The CSS styling for the data div
	 * minHeight:		(Number:null) The minimum height for the container
	 * minWidth:		(Number:null) The minimum width for the container
	 * maxHeight:		(Number:null) The maximum height for the container. If not specified, the window height is used.
	 * maxWidth:		(Number:null) The maximum width for the container. If not specified, the window width is used.
	 * autoResize:		(Boolean:false) Automatically resize the container if it exceeds the browser window dimensions?
	 * autoPosition:	(Boolean:true) Automatically position the container upon creation and on window resize?
	 * zIndex:			(Number: 1000) Starting z-index value
	 * close:			(Boolean:true) If true, closeHTML, escClose and overClose will be used if set.
	 							If false, none of them will be used.
	 * closeHTML:		(String:'<a class="modalCloseImg" title="Close"></a>') The HTML for the default close link.
								SimpleModal will automatically add the closeClass to this element.
	 * closeClass:		(String:'simplemodal-close') The CSS class used to bind to the close event
	 * escClose:		(Boolean:true) Allow Esc keypress to close the dialog?
	 * overlayClose:	(Boolean:false) Allow click on overlay to close the dialog?
	 * fixed:			(Boolean:true) If true, the container will use a fixed position. If false, it will use a
								absolute position (the dialog will scroll with the page)
	 * position:		(Array:null) Position of container [top, left]. Can be number of pixels or percentage
	 * persist:			(Boolean:false) Persist the data across modal calls? Only used for existing
								DOM elements. If true, the data will be maintained across modal calls, if false,
								the data will be reverted to its original state.
	 * modal:			(Boolean:true) User will be unable to interact with the page below the modal or tab away from the dialog.
								If false, the overlay, iframe, and certain events will be disabled allowing the user to interact
								with the page below the dialog.
	 * onOpen:			(Function:null) The callback function used in place of SimpleModal's open
	 * onShow:			(Function:null) The callback function used after the modal dialog has opened
	 * onClose:			(Function:null) The callback function used in place of SimpleModal's close
	 */
	$.modal.defaults = {
		appendTo: 'body',
		focus: true,
		opacity: 50,
		overlayId: 'simplemodal-overlay',
		overlayCss: {},
		containerId: 'simplemodal-container',
		containerCss: {},
		dataId: 'simplemodal-data',
		dataCss: {},
		minHeight: null,
		minWidth: null,
		maxHeight: null,
		maxWidth: null,
		autoResize: false,
		autoPosition: true,
		zIndex: 1000,
		close: true,
		closeHTML: '<a class="modalCloseImg" title="Close"></a>',
		closeClass: 'simplemodal-close',
		escClose: true,
		overlayClose: false,
		fixed: true,
		position: null,
		persist: false,
		modal: true,
		onOpen: null,
		onShow: null,
		onClose: null
	};

	/*
	 * Main modal object
	 * o = options
	 */
	$.modal.impl = {
		/*
		 * Contains the modal dialog elements and is the object passed
		 * back to the callback (onOpen, onShow, onClose) functions
		 */
		d: {},
		/*
		 * Initialize the modal dialog
		 */
		init: function (data, options) {
			var s = this;

			// don't allow multiple calls
			if (s.d.data) {
				return false;
			}

			// $.boxModel is undefined if checked earlier
			ieQuirks = $.browser.msie && !$.boxModel;

			// merge defaults and user options
			s.o = $.extend({}, $.modal.defaults, options);

			// keep track of z-index
			s.zIndex = s.o.zIndex;

			// set the onClose callback flag
			s.occb = false;

			// determine how to handle the data based on its type
			if (typeof data === 'object') {
				// convert DOM object to a jQuery object
				data = data instanceof jQuery ? data : $(data);
				s.d.placeholder = false;

				// if the object came from the DOM, keep track of its parent
				if (data.parent().parent().size() > 0) {
					data.before($('<span></span>')
						.attr('id', 'simplemodal-placeholder')
						.css({display: 'none'}));

					s.d.placeholder = true;
					s.display = data.css('display');

					// persist changes? if not, make a clone of the element
					if (!s.o.persist) {
						s.d.orig = data.clone(true);
					}
				}
			}
			else if (typeof data === 'string' || typeof data === 'number') {
				// just insert the data as innerHTML
				data = $('<div></div>').html(data);
			}
			else {
				// unsupported data type!
				alert('SimpleModal Error: Unsupported data type: ' + typeof data);
				return s;
			}

			// create the modal overlay, container and, if necessary, iframe
			s.create(data);
			data = null;

			// display the modal dialog
			s.open();

			// useful for adding events/manipulating data in the modal dialog
			if ($.isFunction(s.o.onShow)) {
				s.o.onShow.apply(s, [s.d]);
			}

			// don't break the chain =)
			return s;
		},
		/*
		 * Create and add the modal overlay and container to the page
		 */
		create: function (data) {
			var s = this;

			// get the window properties
			s.getDimensions();

			// add an iframe to prevent select options from bleeding through
			if (s.o.modal && ie6) {
				s.d.iframe = $('<iframe src="javascript:false;"></iframe>')
					.css($.extend(s.o.iframeCss, {
						display: 'none',
						opacity: 0,
						position: 'fixed',
						height: w[0],
						width: w[1],
						zIndex: s.o.zIndex,
						top: 0,
						left: 0
					}))
					.appendTo(s.o.appendTo);
			}

			// create the overlay
			s.d.overlay = $('<div></div>')
				.attr('id', s.o.overlayId)
				.addClass('simplemodal-overlay')
				.css($.extend(s.o.overlayCss, {
					display: 'none',
					opacity: s.o.opacity / 100,
					height: s.o.modal ? d[0] : 0,
					width: s.o.modal ? d[1] : 0,
					position: 'fixed',
					left: 0,
					top: 0,
					zIndex: s.o.zIndex + 1
				}))
				.appendTo(s.o.appendTo);

			// create the container
			s.d.container = $('<div></div>')
				.attr('id', s.o.containerId)
				.addClass('simplemodal-container')
				.css($.extend(
					{position: s.o.fixed ? 'fixed' : 'absolute'},
					s.o.containerCss,
					{display: 'none', zIndex: s.o.zIndex + 2}
				))
				.append(s.o.close && s.o.closeHTML
					? $(s.o.closeHTML).addClass(s.o.closeClass)
					: '')
				.appendTo(s.o.appendTo);

			s.d.wrap = $('<div></div>')
				.attr('tabIndex', -1)
				.addClass('simplemodal-wrap')
				.css({height: '100%', outline: 0, width: '100%'})
				.appendTo(s.d.container);

			// add styling and attributes to the data
			// append to body to get correct dimensions, then move to wrap
			s.d.data = data
				.attr('id', data.attr('id') || s.o.dataId)
				.addClass('simplemodal-data')
				.css($.extend(s.o.dataCss, {
						display: 'none'
				}))
				.appendTo('body');
			data = null;

			s.setContainerDimensions();
			s.d.data.appendTo(s.d.wrap);

			// fix issues with IE
			if (ie6 || ieQuirks) {
				s.fixIE();
			}
		},
		/*
		 * Bind events
		 */
		bindEvents: function () {
			var s = this;

			// bind the close event to any element with the closeClass class
			$('.' + s.o.closeClass).bind('click.simplemodal', function (e) {
				e.preventDefault();
				s.close();
			});

			// bind the overlay click to the close function, if enabled
			if (s.o.modal && s.o.close && s.o.overlayClose) {
				s.d.overlay.bind('click.simplemodal', function (e) {
					e.preventDefault();
					s.close();
				});
			}

			// bind keydown events
			doc.bind('keydown.simplemodal', function (e) {
				if (s.o.modal && e.keyCode === 9) { // TAB
					s.watchTab(e);
				}
				else if ((s.o.close && s.o.escClose) && e.keyCode === 27) { // ESC
					e.preventDefault();
					s.close();
				}
			});

			// update window size
			wndw.bind('resize.simplemodal orientationchange.simplemodal', function () {
				// redetermine the window width/height
				s.getDimensions();

				// reposition the dialog
				s.o.autoResize ? s.setContainerDimensions() : s.o.autoPosition && s.setPosition();

				if (ie6 || ieQuirks) {
					s.fixIE();
				}
				else if (s.o.modal) {
					// update the iframe & overlay
					s.d.iframe && s.d.iframe.css({height: w[0], width: w[1]});
					s.d.overlay.css({height: d[0], width: d[1]});
				}
			});
		},
		/*
		 * Unbind events
		 */
		unbindEvents: function () {
			$('.' + this.o.closeClass).unbind('click.simplemodal');
			doc.unbind('keydown.simplemodal');
			wndw.unbind('.simplemodal');
			this.d.overlay.unbind('click.simplemodal');
		},
		/*
		 * Fix issues in IE6 and IE7 in quirks mode
		 */
		fixIE: function () {
			var s = this, p = s.o.position;

			// simulate fixed position - adapted from BlockUI
			$.each([s.d.iframe || null, !s.o.modal ? null : s.d.overlay, s.d.container.css('position') === 'fixed' ? s.d.container : null], function (i, el) {
				if (el) {
					var bch = 'document.body.clientHeight', bcw = 'document.body.clientWidth',
						bsh = 'document.body.scrollHeight', bsl = 'document.body.scrollLeft',
						bst = 'document.body.scrollTop', bsw = 'document.body.scrollWidth',
						ch = 'document.documentElement.clientHeight', cw = 'document.documentElement.clientWidth',
						sl = 'document.documentElement.scrollLeft', st = 'document.documentElement.scrollTop',
						s = el[0].style;

					s.position = 'absolute';
					if (i < 2) {
						s.removeExpression('height');
						s.removeExpression('width');
						s.setExpression('height','' + bsh + ' > ' + bch + ' ? ' + bsh + ' : ' + bch + ' + "px"');
						s.setExpression('width','' + bsw + ' > ' + bcw + ' ? ' + bsw + ' : ' + bcw + ' + "px"');
					}
					else {
						var te, le;
						if (p && p.constructor === Array) {
							var top = p[0]
								? typeof p[0] === 'number' ? p[0].toString() : p[0].replace(/px/, '')
								: el.css('top').replace(/px/, '');
							te = top.indexOf('%') === -1
								? top + ' + (t = ' + st + ' ? ' + st + ' : ' + bst + ') + "px"'
								: parseInt(top.replace(/%/, '')) + ' * ((' + ch + ' || ' + bch + ') / 100) + (t = ' + st + ' ? ' + st + ' : ' + bst + ') + "px"';

							if (p[1]) {
								var left = typeof p[1] === 'number' ? p[1].toString() : p[1].replace(/px/, '');
								le = left.indexOf('%') === -1
									? left + ' + (t = ' + sl + ' ? ' + sl + ' : ' + bsl + ') + "px"'
									: parseInt(left.replace(/%/, '')) + ' * ((' + cw + ' || ' + bcw + ') / 100) + (t = ' + sl + ' ? ' + sl + ' : ' + bsl + ') + "px"';
							}
						}
						else {
							te = '(' + ch + ' || ' + bch + ') / 2 - (this.offsetHeight / 2) + (t = ' + st + ' ? ' + st + ' : ' + bst + ') + "px"';
							le = '(' + cw + ' || ' + bcw + ') / 2 - (this.offsetWidth / 2) + (t = ' + sl + ' ? ' + sl + ' : ' + bsl + ') + "px"';
						}
						s.removeExpression('top');
						s.removeExpression('left');
						s.setExpression('top', te);
						s.setExpression('left', le);
					}
				}
			});
		},
		/*
		 * Place focus on the first or last visible input
		 */
		focus: function (pos) {
			var s = this, p = pos && $.inArray(pos, ['first', 'last']) !== -1 ? pos : 'first';

			// focus on dialog or the first visible/enabled input element
			var input = $(':input:enabled:visible:' + p, s.d.wrap);
			setTimeout(function () {
				input.length > 0 ? input.focus() : s.d.wrap.focus();
			}, 10);
		},
		getDimensions: function () {
			// fix a jQuery/Opera bug with determining the window height
			var s = this,
				h = $.browser.opera && $.browser.version > '9.5' && $.fn.jquery < '1.3'
						|| $.browser.opera && $.browser.version < '9.5' && $.fn.jquery > '1.2.6'
				? wndw[0].innerHeight : wndw.height();

			d = [doc.height(), doc.width()];
			w = [h, wndw.width()];
		},
		getVal: function (v, d) {
			return v ? (typeof v === 'number' ? v
					: v === 'auto' ? 0
					: v.indexOf('%') > 0 ? ((parseInt(v.replace(/%/, '')) / 100) * (d === 'h' ? w[0] : w[1]))
					: parseInt(v.replace(/px/, '')))
				: null;
		},
		/*
		 * Update the container. Set new dimensions, if provided.
		 * Focus, if enabled. Re-bind events.
		 */
		update: function (height, width) {
			var s = this;

			// prevent update if dialog does not exist
			if (!s.d.data) {
				return false;
			}

			// reset orig values
			s.d.origHeight = s.getVal(height, 'h');
			s.d.origWidth = s.getVal(width, 'w');

			// hide data to prevent screen flicker
			s.d.data.hide();
			height && s.d.container.css('height', height);
			width && s.d.container.css('width', width);
			s.setContainerDimensions();
			s.d.data.show();
			s.o.focus && s.focus();

			// rebind events
			s.unbindEvents();
			s.bindEvents();
		},
		setContainerDimensions: function () {
			var s = this,
				badIE = ie6 || ie7;

			// get the dimensions for the container and data
			var ch = s.d.origHeight ? s.d.origHeight : $.browser.opera ? s.d.container.height() : s.getVal(badIE ? s.d.container[0].currentStyle['height'] : s.d.container.css('height'), 'h'),
				cw = s.d.origWidth ? s.d.origWidth : $.browser.opera ? s.d.container.width() : s.getVal(badIE ? s.d.container[0].currentStyle['width'] : s.d.container.css('width'), 'w'),
				dh = s.d.data.outerHeight(true), dw = s.d.data.outerWidth(true);

			s.d.origHeight = s.d.origHeight || ch;
			s.d.origWidth = s.d.origWidth || cw;

			// mxoh = max option height, mxow = max option width
			var mxoh = s.o.maxHeight ? s.getVal(s.o.maxHeight, 'h') : null,
				mxow = s.o.maxWidth ? s.getVal(s.o.maxWidth, 'w') : null,
				mh = mxoh && mxoh < w[0] ? mxoh : w[0],
				mw = mxow && mxow < w[1] ? mxow : w[1];

			// moh = min option height
			var moh = s.o.minHeight ? s.getVal(s.o.minHeight, 'h') : 'auto';
			if (!ch) {
				if (!dh) {ch = moh;}
				else {
					if (dh > mh) {ch = mh;}
					else if (s.o.minHeight && moh !== 'auto' && dh < moh) {ch = moh;}
					else {ch = dh;}
				}
			}
			else {
				ch = s.o.autoResize && ch > mh ? mh : ch < moh ? moh : ch;
			}

			// mow = min option width
			var mow = s.o.minWidth ? s.getVal(s.o.minWidth, 'w') : 'auto';
			if (!cw) {
				if (!dw) {cw = mow;}
				else {
					if (dw > mw) {cw = mw;}
					else if (s.o.minWidth && mow !== 'auto' && dw < mow) {cw = mow;}
					else {cw = dw;}
				}
			}
			else {
				cw = s.o.autoResize && cw > mw ? mw : cw < mow ? mow : cw;
			}

			s.d.container.css({height: ch, width: cw});
			s.d.wrap.css({overflow: (dh > ch || dw > cw) ? 'auto' : 'visible'});
			s.o.autoPosition && s.setPosition();
		},
		setPosition: function () {
			var s = this, top, left,
				hc = (w[0]/2) - (s.d.container.outerHeight(true)/2),
				vc = (w[1]/2) - (s.d.container.outerWidth(true)/2),
				st = s.d.container.css('position') !== 'fixed' ? wndw.scrollTop() : 0;

			if (s.o.position && Object.prototype.toString.call(s.o.position) === '[object Array]') {
				top = st + (s.o.position[0] || hc);
				left = s.o.position[1] || vc;
			} else {
				top = st + hc;
				left = vc;
			}
			s.d.container.css({left: left, top: top});
		},
		watchTab: function (e) {
			var s = this;

			if ($(e.target).parents('.simplemodal-container').length > 0) {
				// save the list of inputs
				s.inputs = $(':input:enabled:visible:first, :input:enabled:visible:last', s.d.data[0]);

				// if it's the first or last tabbable element, refocus
				if ((!e.shiftKey && e.target === s.inputs[s.inputs.length -1]) ||
						(e.shiftKey && e.target === s.inputs[0]) ||
						s.inputs.length === 0) {
					e.preventDefault();
					var pos = e.shiftKey ? 'last' : 'first';
					s.focus(pos);
				}
			}
			else {
				// might be necessary when custom onShow callback is used
				e.preventDefault();
				s.focus();
			}
		},
		/*
		 * Open the modal dialog elements
		 * - Note: If you use the onOpen callback, you must "show" the
		 *			overlay and container elements manually
		 *		 (the iframe will be handled by SimpleModal)
		 */
		open: function () {
			var s = this;
			// display the iframe
			s.d.iframe && s.d.iframe.show();

			if ($.isFunction(s.o.onOpen)) {
				// execute the onOpen callback
				s.o.onOpen.apply(s, [s.d]);
			}
			else {
				// display the remaining elements
				s.d.overlay.show();
				s.d.container.show();
				s.d.data.show();
			}

			s.o.focus && s.focus();

			// bind default events
			s.bindEvents();
		},
		/*
		 * Close the modal dialog
		 * - Note: If you use an onClose callback, you must remove the
		 *         overlay, container and iframe elements manually
		 *
		 * @param {boolean} external Indicates whether the call to this
		 *     function was internal or external. If it was external, the
		 *     onClose callback will be ignored
		 */
		close: function () {
			var s = this;

			// prevent close when dialog does not exist
			if (!s.d.data) {
				return false;
			}

			// remove the default events
			s.unbindEvents();

			if ($.isFunction(s.o.onClose) && !s.occb) {
				// set the onClose callback flag
				s.occb = true;

				// execute the onClose callback
				s.o.onClose.apply(s, [s.d]);
			}
			else {
				// if the data came from the DOM, put it back
				if (s.d.placeholder) {
					var ph = $('#simplemodal-placeholder');
					// save changes to the data?
					if (s.o.persist) {
						// insert the (possibly) modified data back into the DOM
						ph.replaceWith(s.d.data.removeClass('simplemodal-data').css('display', s.display));
					}
					else {
						// remove the current and insert the original,
						// unmodified data back into the DOM
						s.d.data.hide().remove();
						ph.replaceWith(s.d.orig);
					}
				}
				else {
					// otherwise, remove it
					s.d.data.hide().remove();
				}

				// remove the remaining elements
				s.d.container.hide().remove();
				s.d.overlay.hide();
				s.d.iframe && s.d.iframe.hide().remove();
				s.d.overlay.remove();

				// reset the dialog object
				s.d = {};
			}
		}
	};
}));
/**
 * @class Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance
 * Handles modules implementing Stateful protocol to get application state 
 * and uses the registered plugin to handle saving the state.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance",
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} config
 * 		JSON config with params needed to run the bundle
 * 
 */
function() {
    this._localization = null;
    this._pluginInstances = {};
    this._startupState = null;
    
    this._historyPollingInterval = 1500;
    this._historyTimer = null;
    this._historyPrevious = [];
    this._historyEnabled = true;
    this._historyNext = [];

    this._currentViewId = 1;
}, {
	/**
	 * @static
	 * @property __name
	 */
	__name : 'StateHandler',
	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
	"getName" : function() {
		return this.__name;
	},
	/**
	 * @method setSandbox
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 * Sets the sandbox reference to this component
	 */
	setSandbox : function(sandbox) {
		this.sandbox = sandbox;
	},
	/**
	 * @method getSandbox
	 * @return {Oskari.mapframework.sandbox.Sandbox}
	 */
	getSandbox : function() {
		return this.sandbox;
	},
    /**
     * @method start
     * implements BundleInstance start methdod
     */
    "start" : function() {

		var me = this;
		if(me.started) {
			return;
		}
		me.started = true;

		var sandbox = Oskari.$("sandbox");
		me.sandbox = sandbox;
		sandbox.register(me);
		for(p in me.eventHandlers) {
			sandbox.registerForEventByName(me, p);
		}
		
        // sends a request that adds button described in config
        /*var rb = sandbox.getRequestBuilder('MapControls.ToolButtonRequest');
        if(rb) {
        	sandbox.request(this, rb(this.toolbar.config, 'add'));
        }*/

        // TODO: move to some less generic init place (application start) because
        // we only want this for mapfull?
    	var ajaxUrl = "/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_Portti2Map_WAR_portti2mapportlet_fi.mml.baseportlet.CMD=ajax.jsp&";
        var sessionPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.statehandler.plugin.SaveViewPlugin', ajaxUrl);
        this.registerPlugin(sessionPlugin);
        this.startPlugin(sessionPlugin);
        
		sandbox.addRequestHandler('StateHandler.SetStateRequest', this.requestHandlers.setStateHandler);
		sandbox.addRequestHandler('StateHandler.SaveStateRequest', this.requestHandlers.saveStateHandler);

        // only use saved state if we have no controlling querystring params in
        // url (linked location etc)
        // server should return the saved session state on startup
        /*var queryStr = location.search;
        if(!queryStr) {
            this.useState(sessionPlugin.getState());
        }*/
    },
  
    /**
     * @method update
     *
     * implements bundle instance update method
     */
    "update" : function() {

    },
	/**
	 * @method stop
	 * implements BundleInstance protocol stop method
	 */
    "stop" : function() {
		var sandbox = this.sandbox();
		sandbox.removeRequestHandler('StateHandler.SetStateRequest', this.requestHandlers.setStateHandler);
		sandbox.removeRequestHandler('StateHandler.SaveStateRequest', this.requestHandlers.saveStateHandler);
        // sends a request that removes button described in config
        var rb = sandbox.getRequestBuilder('MapControls.ToolButtonRequest');
        if(rb) {
        	sandbox.request(this, rb(this.toolbar.config, 'remove'));
        }

		for(p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}
		this.sandbox.unregister(this);
		this.started = false;
    },
    
	/**
	 * @method init
	 * implements Module protocol init method
	 */
	"init" : function() {
		var me = this;
        // config for toolbutton that is used to reset state to original
        this.toolbar = {
            config : {
                group : this.getName(),
                toolId : 'statehandler.reset',
                iconCls : 'statehandler_reset_tool',
                tooltip : this.getLocalization('reset'),
                callback : function() {
                    me.resetState();
                }
            }
        };
		var sandbox = Oskari.$("sandbox");
		this.requestHandlers = {
			setStateHandler : Oskari.clazz.create('Oskari.mapframework.bundle.statehandler.request.SetStateRequestHandler', sandbox, this),
			saveStateHandler : Oskari.clazz.create('Oskari.mapframework.bundle.statehandler.request.SaveStateRequestHandler', sandbox, this)
		};
        // headless
		return null;
	},
    /**
     * @method getLocalization
     * Returns JSON presentation of bundles localization data for current language.
     * If key-parameter is not given, returns the whole localization data.
     * 
     * @param {String} key (optional) if given, returns the value for key
     * @return {String/Object} returns single localization string or
     * 		JSON object for complete data depending on localization
     * 		structure and if parameter key is given
     */
    getLocalization : function(key) {
    	if(!this._localization) {
    		this._localization = Oskari.getLocalization(this.getName());
    	}
    	if(key) {
    		return this._localization[key];
    	}
        return this._localization;
    },
    
	/**
	 * @method onEvent
	 * @param {Oskari.mapframework.event.Event} event a Oskari event object
	 * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
	 */
	onEvent : function(event) {

		var handler = this.eventHandlers[event.getName()];
		if(!handler)
			return;

		return handler.apply(this, [event]);

	},
    /**
     * @property {Object} eventHandlers
     * @static
     */
	eventHandlers : {
        'AfterMapMoveEvent' : function(event) {
            var me = this;
            if(this._historyEnabled === true) {
                
                // we might get multiple events on one move so give a bit tolerance between moves
                if(this._historyTimer) {
                    clearTimeout(this._historyTimer);
                    this._historyTimer = null;
                }
                this._historyTimer = setTimeout(function() {
                    var mapfull = me.sandbox.getStatefulComponents()['mapfull'];
                    if(mapfull) {
                        var state = mapfull.getState();
                        //this._currentHistoryStep = state;
                        me._historyPrevious.push(state);
                    }
                }, this._historyPollingInterval);
            }
        }
	},
    historyMoveNext : function() {
        if(this._historyNext.length > 0) {
            var state = this._historyNext.pop();
            this._historyPrevious.push(state);
            var mapfull = this.sandbox.getStatefulComponents()['mapfull'];
            if(mapfull) {
                this._historyEnabled = false;
                mapfull.setState(state);
                this._historyEnabled = true;
            }
        }
    },
    historyMovePrevious : function() {
        if(this._historyPrevious.length > 0) {
            var state = this._historyPrevious.pop();
            // insert to first
            //this._historyNext.splice(0,0,state);
            this._historyNext.push(state);
            var mapfull = this.sandbox.getStatefulComponents()['mapfull'];
            if(mapfull) {
                this._historyEnabled = false;
                mapfull.setState(state);
                this._historyEnabled = true;
            }
        }
    },
	
    /**
     * @method registerPlugin
     * @param {Oskari.mapframework.bundle.statehandler.plugin.Plugin} plugin
     *    Implementation of the stateHandler plugin protocol/interface
     *
     * Registers the plugin to be used with this state handler implementation.
     */
    registerPlugin : function(plugin) {
        plugin.setHandler(this);
        var pluginName = plugin.getName();
        this.sandbox.printDebug('[' + this.getName() + ']' + ' Registering ' + pluginName);
        this._pluginInstances[pluginName] = plugin;
    },
    /**
     * @method unregisterPlugin
     * @param {Oskari.mapframework.bundle.statehandler.plugin.Plugin} plugin
     *    Implementation of the stateHandler plugin protocol/interface
     *
     * Tears down the registration of the plugin that was previously registered
     * to this state handler implementation.
     */
    unregisterPlugin : function(plugin) {
        var pluginName = plugin.getName();
        this.sandbox.printDebug('[' + this.getName() + ']' + ' Unregistering ' + pluginName);
        this._pluginInstances[pluginName] = undefined;
        plugin.setHandler(null);
    },
    /**
     * @method startPlugin
     * @param {Oskari.mapframework.bundle.statehandler.plugin.Plugin} plugin
     *    Implementation of the stateHandler plugin protocol/interface
     *
     * Starts the plugin. Calls plugins startPlugin()-method.
     */
    startPlugin : function(plugin) {
        var pluginName = plugin.getName();

        this.sandbox.printDebug('[' + this.getName() + ']' + ' Starting ' + pluginName);
        plugin.startPlugin(this.sandbox);
    },
    /**
     * @method stopPlugin
     * @param {Oskari.mapframework.bundle.statehandler.plugin.Plugin} plugin
     *    Implementation of the stateHandler plugin protocol/interface
     *
     * Stops the plugin. Calls plugins stopPlugin()-method.
     */
    stopPlugin : function(plugin) {
        var pluginName = plugin.getName();

        this.sandbox.printDebug('[' + this.getName() + ']' + ' Starting ' + pluginName);
        plugin.stopPlugin(this.sandbox);
    },

    /**
     * @method setCurrentViewId
     * @param {Number} Current view ID
     */
    setCurrentViewId : function(currentViewId) {
	this._currentViewId = currentViewId;
    },
    /**
     * @method getCurrentViewId
     * @return Current view ID
     */
    getCurrentViewId : function() {
	return this._currentViewId;
    }

}, {
    "protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module']
});
Oskari.clazz.category('Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance', 'state-methods', {
	
    /**
     * @method useState
     * @param {Object} savedState
     * 		JSON presentation of application state, created with #getCurrentState()
     * method.
     *
     * Sends out Oskari.mapframework.request.common.RemoveMapLayerRequest,
     * Oskari.mapframework.request.common.AddMapLayerRequest,
     * Oskari.mapframework.request.common.ChangeMapLayerOpacityRequest and
     * Oskari.mapframework.request.common.MapMoveRequest to control the
     * application state
     */
    useState : function(state) {
        if(!state) {
            // dont do anything if we dont have a saved state
            return;
        }
        var components = this.sandbox.getStatefulComponents();
        var loopedComponents = [];
        for(var id in state) {
            if(components[id]) {
                // safety check that we have the component in current config
                components[id].setState(state[id].state);
            }
            loopedComponents.push(id);
        }
        return loopedComponents;
    },
    
    /**
     * @method resetState
     * Used to return the application to its original state.
     * Calls resetState-methods for all plugins and returns the application state
     * by
     * calling #useState with config gathered/saved on bundle start.
     *
     * All plugins should handle themselves what this means in the plugins
     * implementation.
     */
    resetState : function() {
        for(var pluginName in this._pluginInstances) {
            this.sandbox.printDebug('[' + this.getName() + ']' + ' resetting state on ' + pluginName);
            this._pluginInstances[pluginName].resetState();
        }
        // reinit with startup params
        var me = this;
		// get initial state from server
		// TODO: some parameter needs to tell we dont want the state saved in session
		if(this._startupState) {
            me._resetComponentsWithNoStateData(me.useState(this._startupState));
		}
		else {
            jQuery.ajax({
                dataType : "json",
                type : "GET",
                url : me.sandbox.getAjaxUrl() + 'action_route=GetMapConfiguration&noSavedState=true',
                success : function(data) {
                    me._startupState = data;
                    me._resetComponentsWithNoStateData(me.useState(data));
                },
                error : function() {
                    alert('error loading conf');
                }
            });
		}
        
    },
    /**
     * @method _resetComponentsWithNoStateData
     * Used to return the application to its original state. 
     * Loops through all the stateful components and calls their setState()
     * with no parameters to reset them. Ignores the components whose IDs are listed in 
     * the parameter array.
     * @param {String[]}  loopedComponents 
     *      list of component IDs that had state data and should not be resetted
     *
     */
    _resetComponentsWithNoStateData : function(loopedComponents) {
        // loop all stateful components and reset their state they are not in loopedComponents
        var components = this.sandbox.getStatefulComponents();
        for(var cid in components) {
            var found = false;
            for(var i = 0; i < loopedComponents.length; ++i) {
                if(cid == loopedComponents[i]) {
                    found = true;
                    break;
                }
            }
            if(!found)  {
                // set empty state for resetting state
                components[cid].setState();
            }
        }
    },
    /**
     * @method saveState
     * @param {String} pluginName (optional)
     * 	Calls the saveState method of the given plugin or if not given, calls it
     * for each plugin
     *
     * Used to store the application state though the module/bundle does nothing
     * itself.
     * All actual implementations are done in plugins.
     */
    saveState : function(pluginName) {
        if(!pluginName) {
            for(var pluginName in this._pluginInstances) {
                this.saveState(pluginName);
            }
            return;
        }
        this.sandbox.printDebug('[' + this.getName() + ']' + ' saving state with ' + pluginName);
        this._pluginInstances[pluginName].saveState();
    },
    /**
     * @method getCurrentState
     * @return {Object} JSON object presenting the state of the application at
     * the moment.
     */
    getCurrentState : function() {
        var state = {};
    	var components = this.sandbox.getStatefulComponents();
    	for(var id in components) {
    	    state[id] = {
    	        // wrap with additional state property so we can use the same json as in startup configuration
    	        'state' : components[id].getState()
    	    };
    	}
        return state;
    },
    /**
     * @method getSavedState
     * @param {String} pluginName
     * Calls the plugins getState()-method.
     * It should return a JSON object created by #getCurrentState on earlier
     * time.
     */
    getSavedState : function(pluginName) {
        return this._pluginInstances[pluginName].getState();
    }
});

	/**
 * @class Oskari.mapframework.bundle.statehandler.Plugin
 * 
 * Protocol/interface declaration for 
 * Oskari.mapframework.bundle.ui.module.statehandler.StateHandlerModule plugins.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.statehandler.plugin.Plugin', 
/**
 * @method create called automatically on construction
 * @static
 *
 * @throws "Oskari.mapframework.bundle.statehandler.Plugin should not be instantiated"
 */
function() {
    throw "Oskari.mapframework.bundle.statehandler.Plugin should not be instantiated";
}, {
	/**
	 * @method getName
	 * @throws "Implement your own"
	 */
    getName : function() {
        throw "Implement your own";
    },
	/**
	 * @method setHandler
	 * @param {Oskari.mapframework.bundle.statehandler.ui.module.StateHandlerModule} stateHandler reference to actual state handler
	 * 
	 * Called by Oskari.mapframework.bundle.statehandler.ui.module.StateHandlerModule when registering the plugin. 
	 * @throws "Implement your own"
	 */
    setHandler : function(stateHandler) {
        throw "Implement your own";
    },
	/**
	 * @method startPlugin
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
	 * @throws "Implement your own"
	 */
    startPlugin : function(sandbox) {
        throw "Implement your own";
    },
	/**
	 * @method stopPlugin
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
	 * @throws "Implement your own"
	 */
    stopPlugin : function(sandbox) {
        throw "Implement your own";
    },
    /**
     * @method getState
     * @return {Object} JSON presentation of application state as seen by the plugin
	 * @throws "Implement your own"
     */
    getState : function() {
        throw "Implement your own";
    },
    /**
     * @method resetState
     * Resets the state in the plugin if applicable
	 * @throws "Implement your own"
     */
    resetState : function() {
        throw "Implement your own";
    },
    /**
     * @method saveState
     * @param {Object} state JSON presentation of application state
     * If param is not given, uses 
     * Oskari.mapframework.bundle.ui.module.statehandler.StateHandlerModule.getCurrentState()
     * to get the current application state.
     * Saves the state.
	 * @throws "Implement your own"
     */
    saveState : function(state) {
        throw "Implement your own";
    }
});
/**
 * @class Oskari.mapframework.bundle.statehandler.plugin.SaveViewPlugin
 * Provides functionality to save the current state as the users My Views.
 * Adds a button to the toolbar for saving a view.
 *
 * Also binds window.onbeforeunload to saving the state for keeping the state between going to other pages in the portal.
 * The server is responsible for returning the saved state as initial state if the user returns to the map.
 */
Oskari.clazz
    .define('Oskari.mapframework.bundle.statehandler.plugin.SaveViewPlugin',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} ajaxUrl
 * 		URL that is called to save the state
 */
function(ajaxUrl) {
    this.handler = null;
    this.pluginName = null;
    this._sandbox = null;
    this._ajaxUrl = ajaxUrl;
}, {
    /** @static @property __name plugin name */
    __name : 'statehandler.SaveViewPlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getHandler
     * @return
     * {Oskari.mapframework.bundle.ui.module.statehandler.StateHandlerModule}
     * reference to state handler
     */
    getHandler : function() {
        return this.handler;
    },
    /**
     * @method setHandler
     * @param
     * {Oskari.mapframework.bundle.ui.module.statehandler.StateHandlerModule}
     * reference to state handler
     */
    setHandler : function(statehandler) {
        this.handler = statehandler;
        this.pluginName = statehandler.getName() + this.__name;
    },
    /**
     * @method getState
     * @return null
     * Does nothing
     */
    getState : function() {
    },
    /**
     * @method resetState
     * Does nothing
     */
    resetState : function() {
    },
    /**
     * @method saveState
     * Uses
     * Oskari.mapframework.bundle.ui.module
     *     .statehandler.StateHandlerModule.getCurrentState()
     * to get the current application state and saves it to a cookie.
     */
    saveState : function() {
        var state = this.handler.getCurrentState();

        var me = this;
	var loc = this.handler.getLocalization('save');

	var title = loc.title ? loc.title.save_view : 'Näkymän tallennus';
	var msg = loc.msg ? loc.msg.view_name : 'Näkymän nimi';
	var msg =
	    '<div class="e_noname" ' + 
	    'style="display: inline-block; ' + 
	    'color: red; display: none;">' + 
	    '<br />' +
	    (loc.error_noname ? 
	     loc.error_noname : 
	     "Nimi ei voi olla tyhjä!") +
	    '<br />' +
	    '</div>' + 
	    '<div class="e_illegal" ' + 
	    'style="display: inline-block; ' + 
	    'color: red; display: none;">' + 
	    '<br />' +
	    (loc.error_illegalchars ?
	     loc.error_illegalchars :
	     'Nimessä on virheellisiä merkkejä') +
	    '<br />' +
	    '</div>' +
	    msg + ": " +
	    '<input name="viewName" ' + 
	    'type="text" class="viewName" />';

	var save = {
	    name : 'button_save',
	    text : loc.button ? loc.button.save : 'Tallenna',
	    close : false,
	    onclick : function(e) {
                var viewName = 
		    jQuery('div.modalmessage input.viewName').val();
		if (viewName) {
		    if (viewName.indexOf('<') >= 0) {
			jQuery('div.modalmessage div.e_illegal').show();
		    } else {
			me._saveState(viewName);
			$.modal.close();
		    }
                } else {
                    jQuery('div.modalmessage div.e_noname').show();
                }
	    }	
	};
	var cancel = {
	    name : 'button_cancel',
	    text : loc.button ? loc.button.cancel : 'Peruuta',
	    close : true
	};

	var reqName = 'userinterface.ModalDialogRequest';
	var reqBuilder = me._sandbox.getRequestBuilder(reqName);
	var req = reqBuilder(title, msg, [ save, cancel ]);
	me._sandbox.request(me.handler, req);
    },
    /**
     * @method saveState
     * @private
     * Actual saving so we dont ask view name when exiting map
     */
    _saveState : function(viewName) {
        var state = this.handler.getCurrentState();
        var name = "";

        if(viewName) {
            name = "myViewName=" + viewName + '&';
        }
        var me = this;
        var loc = this.handler.getLocalization('save');
        // save to ajaxUrl
        jQuery.ajax({
            dataType : "json",
            type : "POST",
            beforeSend: function(x) {
              if(x && x.overrideMimeType) {
               x.overrideMimeType("application/j-son;charset=UTF-8");
              }
             },
            url : this._ajaxUrl + 'action_route=AddView',
            data : name + 
		"myViewState=" + me.serializeJSON(state) +
		"currentViewId=" + me.handler.getCurrentViewId(),
            success : function(newView) {
                alert(loc.success);
                var builder = me._sandbox.getEventBuilder('StateSavedEvent');
                var event = builder(viewName, state);
                me._sandbox.notifyAll(event);
		me.handler.setCurrentViewId(newView.id);
            },
            error : function() {
                // only show error if explicitly calling save
                if(viewName) {
                    alert(loc.error);
                    var builder = 
			me._sandbox.getEventBuilder('StateSavedEvent');
                    var event = builder(viewName, state);
                    me._sandbox.notifyAll(event);
                }
            }
        });
    },
    // TODO: move to some util
    serializeJSON : function(obj) {
        var me = this;
        var t = typeof (obj);
        if(t != "object" || obj === null) {
            // simple data type
            if(t == "string")
                obj = '"' + obj + '"';
            return String(obj);
        } else {
            // array or object
            var json = [], arr = (obj && obj.constructor == Array);

            jQuery.each(obj, function(k, v) {
                t = typeof (v);
                if(t == "string") {
                    v = '"' + v + '"';
                } else if(t == "object" & v !== null) {
                    v = me.serializeJSON(v);
                }
                json.push(( arr ? "" : '"' + k + '":') + String(v));
            });
            return ( arr ? "[" : "{") + String(json) + ( arr ? "]" : "}");
        }
    },
    /**
     * @method startPlugin
     *
     * Interface method for the plugin protocol.
     * Binds window.onbeforeunload to saving the state.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        var me = this;
        jQuery(document).ready(function() {
            window.onbeforeunload = function() {
                // save state to session when leaving map window
                me._saveState();
            };
        });
    },
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    stopPlugin : function(sandbox) {
        this._sandbox = null;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.bundle' + '.statehandler.plugin.Plugin']
});
/**
 * @class Oskari.mapframework.bundle.statehandler.request.SetStateRequest
 * Requests state to be set
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.statehandler.request.SetStateRequest',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} state JSON presentation of application state (optional - uses startup state if not given)
 */
function(state) {
    this._creator = null;
    this._state = state;
    this._currentViewId = 1;
}, {
    /** @static @property __name request name */
    __name : "StateHandler.SetStateRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getState
     * @return {Object} JSON presentation of application state 
     */
    getState : function() {
        return this._state;
    },

    /**
     * @method getCurrentViewId
     * @return {Number} Current view ID
     */
    getCurrentViewId : function() {
	return this._currentViewId;
    },
    /**
     * @method setCurrentViewId
     */
    setCurrentViewId : function(currentViewId) {
	this.currentViewId = currentViewId;
    }
    
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});/**
 * @class Oskari.mapframework.bundle.statehandler.request.SetStateRequestHandler
 */
Oskari.clazz.define('Oskari.mapframework.bundle.statehandler.request.SetStateRequestHandler', 
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
 * 			reference to application sandbox
 * @param {Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance} statehandler
 * 			reference to statehandler
 */
function(sandbox, statehandler) {
    this.sandbox = sandbox;
    this.statehandler = statehandler; 
}, {
	/**
	 * @method handleRequest 
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.mapframework.bundle.statehandler.request.SaveStateRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
        if(request.getState()) {
	    this.statehandler.setCurrentViewId(request.getCurrentViewId());
            this.statehandler.useState(request.getState());
        }
        else {
            this.statehandler.resetState();
        }
   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
/**
 * @class Oskari.mapframework.bundle.statehandler.event.StateSavedEvent
 * 
 * This is used to notify that application state has been saved and any listing should refresh
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.statehandler.event.StateSavedEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} state JSON presentation of application state 
 */
    function(name, state) {
    	this._name = name;
    	this._state = state;
}, {
    /** @static @property __name event name */
    __name : "StateSavedEvent",
    getName : function() {
        return this.__name;
    },
    /**
     * @method getViewName
     * @return {String} name of the saved view 
     */
    getViewName : function() {
        return this._name;
    },
    /**
     * @method getState
     * @return {Object} JSON presentation of application state 
     */
    getState : function() {
        return this._state;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : [ 'Oskari.mapframework.event.Event' ]
});
/**
 * @class Oskari.mapframework.bundle.statehandler.request.SaveStateRequest
 * Requests state to be saved
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.statehandler.request.SaveStateRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._creator = null;
}, {
    /** @static @property __name request name */
    __name : "StateHandler.SaveStateRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});/**
 * @class Oskari.mapframework.bundle.statehandler.request.SaveStateRequestHandler
 */
Oskari.clazz.define('Oskari.mapframework.bundle.statehandler.request.SaveStateRequestHandler', 
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
 * 			reference to application sandbox
 * @param {Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance} statehandler
 * 			reference to statehandler
 */
function(sandbox, statehandler) {
    this.sandbox = sandbox;
    this.statehandler = statehandler; 
}, {
	/**
	 * @method handleRequest 
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.mapframework.bundle.statehandler.request.SaveStateRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
    	this.statehandler.saveState();
   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
