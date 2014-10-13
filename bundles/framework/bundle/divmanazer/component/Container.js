/**
 * @class Oskari.userinterface.component.Container
 * Container
 */
Oskari.clazz.define('Oskari.userinterface.component.Container',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        'use strict';
        this._clazz = 'Oskari.userinterface.component.Container';
        this._components = [];
    }, {

        /**
         * @method addComponent
         * @param {HTMLElement} component
         */
        addComponent: function (component) {
            'use strict';
            if(!this._element) {
                Oskari.getSandbox().printWarn(
                    this.getClazz() + '.addComponent: container not initialized'
                );
            }
            if (component === null || component === undefined) {
                throw new TypeError(
                    this.getClazz() + '.addComponent: ' +
                    'no component'
                );
            }
            // check that component is a component somehow
            if (!component.getElement || !component.destroy) {
                Oskari.getSandbox().printWarn(
                    this.getClazz() + '.addComponent:', component,
                    'is not a component'
                );
                throw new TypeError(
                    this.getClazz() + '.addComponent: ' +
                    'component is not a component'
                );
            }
            if (this._getComponentIndex(component) !== -1) {
                Oskari.getSandbox().printWarn(
                    this.getClazz() + '.addComponent:', component,
                    'has already been added'
                );
                throw new Error(
                    this.getClazz() + '.addComponent: ' +
                    'component has already been added'
                );
            }
            this._components.push(component);
            this._element.appendChild(component.getElement());
        },

        /**
         * @method removeComponent
         * @param {HTMLElement} component
         */
        removeComponent: function (component) {
            'use strict';
            if (component === null || component === undefined) {
                throw new TypeError(
                    this.getClazz() + '.removeComponent: ' +
                    'no component'
                );
            }
            // TODO should we fire validate or smthn after this?
            var index = this._getComponentIndex(component);
            if (index !== -1) {
                this._components.splice(index, 1);
                component.destroy(false);
            } else {
                Oskari.getSandbox().printWarn(
                    this.getClazz() + '.removeComponent: ' +
                    'container doesn\'t hold component', component
                );
            }
        },

        /**
         * @method addComponent
         * @param {Array} components
         */
        getComponents: function () {
            'use strict';
            return this._components.slice(0);
        },

        /**
         * @method getValues
         * @param  {Object}      values       Values object
         * @param  {HTMLElement} eventElement Element used to submit
         * @return {Object}                   Values object
         */
        getValues: function (values, eventElement) {
            'use strict';
            var i,
                me,
                component,
                components = this._components,
                val;
            // TODO see http://malsup.com/jquery/form/comp/
            // - only used <input type="submit":s value should be serialized
            //   - we need to get this from event or smthn...
            // - <input type="reset" shouldn't be serialized
            //   - we don't even have a ResetButton yet
            //   - just make ResetButton's getValue return undefined...
            for (i = 0; i < components.length; i += 1) {
                component = components[i];
                if (!component.isDisabled() &&
                        component.getName &&
                        component.getName() &&
                        component.getName() !== '' &&
                        component.getValue &&
                        component.getValue() !== undefined &&
                        component.getValue() !== '') {
                    val = values[component.getName()];
                    if (val) {
                        if (Array.isArray(val)) {
                            val.push(component.getValue());
                        } else {
                            values[component.getName()] = [
                                val,
                                component.getValue()
                            ];
                        }
                    } else {
                        values[component.getName()] = component.getValue();
                    }
                }
                if (component.getValues) {
                    component.getValues(values, eventElement);
                }
            }
            return values;
        },

        /**
         * @method _getComponentIndex
         * @param {HTMLElement} component
         */
        _getComponentIndex: function (component) {
            'use strict';
            var i,
                c,
                ret = -1;

            for (i = 0; i < this._components.length; i += 1) {
                c = this._components[i];
                if (c === component &&
                        c.getElement() === component.getElement()) {
                    ret = i;
                    break;
                }
            }
            return ret;
        }
    }, {
        extend: ['Oskari.userinterface.component.Component']
    }
    );
