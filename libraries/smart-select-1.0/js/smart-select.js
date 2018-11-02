/**
 * smart-select - Smart select is replacing and beautifying standard selects while keeping them async
 * @version v0.2.0
 * @link https://github.com/davidecantoni/smart-select#readme
 * @license MIT
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['exports'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    factory(exports);
  } else {
    // Browser globals
    factory(root);
  }
})(window, function (exports) {
  // Create the defaults once
  var pluginName = 'smartSelect';

  var defaults = {
    toggleButton: false,
    wrapperClass: 'ms-parent',
    textStandard: 'Placeholder',
    textCountSelected: '%d Selected',
    textAllSelected: 'All selected',
    textSelectAll: 'Select all',
    textUnselectAll: 'Unselect all'
  };

  // The actual plugin constructor

  var SmartSelect = (function () {
    function SmartSelect(element, newOptions) {
      _classCallCheck(this, SmartSelect);

      // querySelector if string
      this.el = typeof element === 'string' ? document.querySelector(element) : element;

      this.container = '';
      this.button = '';
      this.dropdown = '';

      this.changeListener = true;
      this.selectedValue = [];

      this.options = this._helperExtend(defaults, newOptions);
      this._defaults = {
        multiple: false
      };

      // check if multiple or not
      this._defaults.multiple = !!this.el.hasAttribute('multiple');

      // convert selected values as array
      this._resetSelectedValue();

      // build button and element
      this._buildElement();

      // define change events
      this._defineEvents();

      // listen on origin change and rebuild element
      this._listener('bind');

      // load select
      this._syncOption();
    }

    // convert to a jquery plugin

    /**
     * _buildElement() construct the basic markup for the custom select
     *
     **/

    _createClass(SmartSelect, [{
      key: '_buildElement',
      value: function _buildElement() {
        this.container = document.createElement('div');
        this.container.className = this.options.wrapperClass;

        this.button = document.createElement('button');
        this.button.className = 'ms-choice';

        this.button.appendChild(document.createElement('span'));
        this.button.appendChild(document.createElement('div'));

        this.dropdown = document.createElement('div');
        // this is needed because js let you only know inline defined css properties
        this.dropdown.style.display = 'none';
        this.dropdown.className = 'ms-drop' + (this._defaults.multiple ? ' multiple' : '');

        // append
        this.container.appendChild(this.button);
        this.container.appendChild(this.dropdown);
        this.el.parentNode.insertBefore(this.container, this.el.nextSibling);
        // this.el.insertAdjacentElement('afterend', this.container); doesn't work on FF

        // hide element
        this.el.style.display = 'none';
      }

      /**
       * _defineEvents() define all events
       *
       **/
    }, {
      key: '_defineEvents',
      value: function _defineEvents() {
        var _this = this;

        // listen on origin change and rebuild element
        this.selectChange = function () {
          if (_this.changeListener) {
            _this._syncOption();
          }
        };

        // button
        this.buttonClick = function () {
          _this._toggleList();
        };

        // close if clicked outside
        this.windowClose = function (e) {
          var div = _this.button.querySelector('div');
          // trigger only if specific dropdown is open and event target is not present in container
          if (div.classList.contains('open') && e.target.tagName !== 'HTML' && !_this.container.contains(e.target)) {
            _this._toggleList(false);
          }
        };

        this.dropdownClick = function (e) {
          // If it was a list item and not select toggler
          if (e.target && e.target.nodeName === 'LI' && !e.target.classList.contains('select-toggle')) {
            // single / multiple select
            _this._updateSelected(e.target.getAttribute('data-value'));
          }

          // if single close drowdown
          if (!_this._defaults.multiple) {
            _this._toggleList(false);
          }
        };

        this.togglerClick = function () {
          // select or unselect all items
          _this._toggleAll();
        };
      }

      /**
       * _setSelectedValue() set the current selected value
       * for the multi select toggle value
       *
       **/
    }, {
      key: '_setSelectedValue',
      value: function _setSelectedValue(val) {
        if (this._defaults.multiple) {
          var position = this.selectedValue.indexOf(val);
          if (position !== -1) {
            this.selectedValue.splice(position, 1);
          } else {
            this.selectedValue.push(val);
          }
        } else {
          this.selectedValue[0] = val;
        }
      }

      /**
       * _resetSelectedValue() make sure the selected values are empty
       * for the multi select empty the array
       *
       **/
    }, {
      key: '_resetSelectedValue',
      value: function _resetSelectedValue() {
        this.selectedValue = [];
      }

      /**
       * _updateNativeSelect() sync native select
       *
       **/
    }, {
      key: '_updateNativeSelect',
      value: function _updateNativeSelect() {
        var options = this.el.querySelectorAll('option');
        for (var i = 0; i < options.length; i++) {
          if (this.selectedValue.indexOf(options[i].value) !== -1) {
            options[i].selected = true;
          } else {
            options[i].selected = false;
          }
        }
      }

      /**
       * _syncOption() sync the original select with the custom one and rebind events
       *
       **/
    }, {
      key: '_syncOption',
      value: function _syncOption() {
        var html = '<ul>';
        if (this._defaults.multiple && this.options.toggler) {
          html += '\n                <li class="select-toggle" data-translate-toggle="' + this.options.textUnselectAll + '">\n                    ' + this.options.textSelectAll + '\n                </li>';
        }
        this._resetSelectedValue();

        var options = this.el.querySelectorAll('option');
        for (var i = 0; i < options.length; i++) {
          var option = options[i];
          var classes = ['item'];
          classes.push(option.classList);
          if (option.selected) {
            this._setSelectedValue(option.value.toString());
            classes.push('selected');
          }

          html += '\n                <li class="' + classes.join(' ') + '" data-value="' + option.value + '">\n                    ' + option.text + '\n                </li>';
        }
        html += '</ul>';

        // reset all select items
        for (var i = 0; i < this.el.options.length; i++) {
          this.el.options[i].selected = false;
        }

        this._updateNativeSelect();

        // insert into dropdown
        this.dropdown.innerHTML = html;

        if (this._defaults.multiple && this.options.toggler) {
          this.toggler = this.dropdown.querySelector('li.select-toggle');
        }

        // set label
        this._setLabel();

        // bind event
        this._event('unbind');
        this._event('bind');
      }

      /**
       * _bindListener() on changes to the original select sync the custom one
       *
       **/
    }, {
      key: '_listener',
      value: function _listener() {
        var type = arguments.length <= 0 || arguments[0] === undefined ? 'bind' : arguments[0];

        this._helperAddEvent(type, 'change', this.el, this.selectChange);
        this._helperAddEvent(type, 'click', this.button, this.buttonClick);
        this._helperAddEvent(type, 'click', window, this.windowClose);
      }
    }, {
      key: '_setLabel',
      value: function _setLabel() {
        // first item
        var label = this.el.options[0].text;

        // check if there is an empty value item and use it as default
        for (var i = 0; i < this.el.options.length; i++) {
          if (this.el.options[i].value === '') {
            label = this.el.options[i].text;
          }
        }

        if (this._defaults.multiple) {
          // on init set item
          label = this.options.textStandard;

          var items = this.dropdown.querySelectorAll('li:not(.select-toggle)');
          if (this.options.toggler) {
            this._setToggleLabel('off');
          }

          if (this.selectedValue.length >= 2 && this.selectedValue.length < items.length) {
            label = this.options.textCountSelected.replace('%d', this.selectedValue.length);
          } else if (this.selectedValue.length === items.length) {
            label = this.options.textAllSelected;
            // toggle label
            if (this.options.toggler) {
              this._setToggleLabel('on');
            }
          } else if (this.selectedValue.length === 1) {
            label = this.el.querySelector('option[value="' + this.selectedValue[0] + '"]').text;
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (this.selectedValue.length === 1) {
            for (var i = 0; i < this.el.options.length; i++) {
              if (this.el.options[i].value === this.selectedValue[0]) {
                label = this.el.options[i].text;
              }
            }
          } else if (this.selectedValue[0] === 0) {
            for (var i = 0; i < this.el.options.length; i++) {
              if (this.el.options[i].value === '0') {
                label = this.el.options[i].text;
              }
            }
          }
        }

        this.button.querySelector('span').innerHTML = label;
      }
    }, {
      key: '_setToggleLabel',
      value: function _setToggleLabel() {
        var action = arguments.length <= 0 || arguments[0] === undefined ? 'on' : arguments[0];

        if (action === 'on') {
          if (this.toggler.classList.contains('all')) {
            return;
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (!this.toggler.classList.contains('all')) {
            return;
          }
        }

        // toggle class
        this.toggler.classList.toggle('all', action === 'on');
        var text = this.toggler.textContent;
        this.toggler.textContent = this.toggler.getAttribute('data-translate-toggle');
        this.toggler.setAttribute('data-translate-toggle', text);
      }
    }, {
      key: '_event',
      value: function _event() {
        var action = arguments.length <= 0 || arguments[0] === undefined ? 'bind' : arguments[0];

        if (action === 'unbind') {
          // items
          this._helperAddEvent('unbind', 'click', this.dropdown, this.dropdownClick);

          // items toggler
          if (this._defaults.multiple && this.options.toggler) {
            this._helperAddEvent('unbind', 'click', this.toggler, this.togglerClick);
          }
        } else {
          // items
          this._helperAddEvent('bind', 'click', this.dropdown, this.dropdownClick);

          // items toggler
          if (this._defaults.multiple && this.options.toggler) {
            this._helperAddEvent('bind', 'click', this.toggler, this.togglerClick);
          }
        }
      }
    }, {
      key: '_toggleAll',
      value: function _toggleAll() {
        if (this.toggler.classList.contains('all')) {
          // empty array
          this._resetSelectedValue();

          // set value to original select
          this._updateNativeSelect();

          // unselect all list items
          var items = this.dropdown.querySelectorAll('li:not(.select-toggle)');
          for (var i = 0; i < items.length; i++) {
            items[i].classList.remove('selected');
          }

          // toggle label
          this._setToggleLabel('off');
        } else {
          var collection = [];
          // select all option
          var options = this.el.querySelectorAll('option');
          for (var i = 0; i < this.el.options.length; i++) {
            collection.push(options[i].value);
          }
          this.selectedValue = collection;

          // set value to original select
          this._updateNativeSelect();

          // select all list items
          var items = this.dropdown.querySelectorAll('li:not(.select-toggle)');
          for (var i = 0; i < items.length; i++) {
            items[i].classList.add('selected');
          }

          // toggle label
          this._setToggleLabel('on');
        }

        // change button label
        this._setLabel();

        // avoid infinitive loop
        this.changeListener = false;

        // trigger change
        var event = document.createEvent('HTMLEvents');
        event.initEvent('change', true, true);
        this.el.dispatchEvent(event);

        // end avoid infinitive loop
        this.changeListener = true;
      }
    }, {
      key: '_toggleList',
      value: function _toggleList(state) {
        // close all choice button class except this one
        var buttons = document.querySelectorAll('button.ms-choice');
        for (var i = 0; i < buttons.length; i++) {
          if (this.button !== buttons[i]) {
            buttons[i].classList.remove('open');
          }
        }

        // close all drop downs except current one
        var dropdowns = document.querySelectorAll('.ms-drop');
        for (var i = 0; i < dropdowns.length; i++) {
          if (this.dropdown !== dropdowns[i]) {
            dropdowns[i].style.display = 'none';
          }
        }

        // if nothing defined, toggle choice button class and dropdown display status
        if (typeof state === 'undefined') {
          // toggle choice button class
          this.button.querySelector('div').classList.toggle('open');
          this.dropdown.style.display = this.dropdown.style.display !== 'none' ? 'none' : 'block';
        } else {
          // set choice button class depending on the status
          this.button.querySelector('div').classList.toggle('open', state);

          // change display status of dropdown depending on the status
          this.dropdown.style.display = state ? 'block' : 'none';
        }
      }
    }, {
      key: '_updateSelected',
      value: function _updateSelected(value) {
        // add value to selected values
        this._setSelectedValue(value);

        // set value to original select
        this._updateNativeSelect();

        // change button label
        this._setLabel();

        if (this._defaults.multiple) {
          // toggle specific one
          this.dropdown.querySelector('li[data-value="' + value + '"]').classList.toggle('selected');
        } else {
          // remove specific one
          this.dropdown.querySelector('li.selected').classList.remove('selected');

          // select specific one
          this.dropdown.querySelector('li[data-value="' + value + '"]').classList.add('selected');
        }

        // avoid infinitive loop
        this.changeListener = false;

        // trigger change
        var e = document.createEvent('HTMLEvents');
        e.initEvent('change', true, true);
        this.el.dispatchEvent(e);

        // end avoid infinitive loop
        this.changeListener = true;
      }
    }, {
      key: '_helperExtend',
      value: function _helperExtend(origin, obj) {
        var newObj = origin;
        Object.keys(obj).forEach(function (key) {
          newObj[key] = obj[key];
        });
        return newObj;
      }
    }, {
      key: '_helperAddEvent',
      value: function _helperAddEvent(type, evnt, elem, func) {
        if (elem.addEventListener) {
          // W3C DOM
          if (type === 'bind') {
            elem.addEventListener(evnt, func);
          } else {
            elem.removeEventListener(evnt, func);
          }
        } else if (elem.attachEvent) {
          // IE DOM
          if (type === 'bind') {
            elem.attachEvent('on' + evnt, func);
          } else {
            elem.detachEvent('on' + evnt, func);
          }
        } else {
          // No much to do
          elem[evnt] = func; // eslint-disable-line no-param-reassign
        }
      }
    }, {
      key: 'refresh',
      value: function refresh() {
        this._syncOption();
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this._listener('unbind');
        this.container.outerHTML = '';
        delete this.container;
        this.el.style.display = 'block';
      }
    }]);

    return SmartSelect;
  })();

  if (window.jQuery) {
    $.fn[pluginName] = function (options) {
      var args = arguments;
      var response = undefined;

      if (options === undefined || typeof options === 'object') {
        response = this.each(function () {
          if (!$.data(this, 'plugin_' + pluginName)) {
            $.data(this, 'plugin_' + pluginName, new SmartSelect(this, options));
          }
        });
      } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
        var returns = undefined;

        this.each(function () {
          var instance = $.data(this, 'plugin_' + pluginName);
          if (typeof instance[options] === 'function') {
            returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
          }
          if (options === 'destroy') {
            $.data(this, 'plugin_' + pluginName, null);
          }
        });
        response = returns !== undefined ? returns : this;
      }
      return response;
    };
  }

  exports.SmartSelect = SmartSelect; // eslint-disable-line no-param-reassign
});