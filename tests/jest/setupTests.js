import './throwPropTypeErrors';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// Oskari global
import '../../src/global';

// --- setup global jQuery --
import jQuery from 'jquery';
global.MobileDetect = require('mobile-detect');
global.jQuery = jQuery;

// for jQuery.outerHTML() from import 'oskari-frontend/src/polyfills';
jQuery.fn.outerHTML = function (arg) {
    var ret;

    // If no items in the collection, return
    if (!this.length) {
        return typeof arg === 'undefined' ? this : null;
    }
    // Getter overload (no argument passed)
    if (!arg) {
        // eslint-disable-next-line no-return-assign
        return this[0].outerHTML || (ret = this.wrap('<div>').parent().html(), this.unwrap(), ret);
    }
    // Setter overload
    jQuery.each(this, function (i, el) {
        var fnRet;
        var pass = el;
        var inOrOut = el.outerHTML ? 'outerHTML' : 'innerHTML';

        if (!el.outerHTML) {
            el = jQuery(el).wrap('<div>').parent()[0];
        }

        if (jQuery.isFunction(arg)) {
            if ((fnRet = arg.call(pass, i, el[inOrOut])) !== false) {
                el[inOrOut] = fnRet;
            }
        } else {
            el[inOrOut] = arg;
        }

        if (!el.outerHTML) {
            jQuery(el).children().unwrap();
        }
    });

    return this;
};
// --- /setup global jQuery --

configure({ adapter: new Adapter() });

// --- overwrite logging to prevent spamming from warning
global.console = {
    log: jest.fn(), // console.log are ignored in tests
  
    // Keep native behaviour for other methods, use those to print out things in your own tests, not `console.log`
    error: console.error,
    warn: (...args) => console.info('WARN', ...args),
    info: console.info,
    debug: console.debug,
  };