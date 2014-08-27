/**
 * @class Oskari.analysis.bundle.analyse.view.StartAnalyse.validationMethods
 *
 * Adds validation methods to the StartAnalyse class.
 */
Oskari.clazz.category('Oskari.analysis.bundle.analyse.view.StartAnalyse',
    'validation-methods', {

        /**
         * Validates analyse selection parameters
         *
         * @method _checkSelections
         * @private
         * @param {Object} selections Selections to validate
         * @return {Boolean} returns true if no validation errors, false otherwise
         */
        _checkSelections: function (selections) {
            var errorBase = this.loc.error.invalidSetup,
                noErrors = true;

            if (!selections) {
                this._notifyValidationError(this.loc.error.noParameters);
                noErrors = false;
                return noErrors;
            }
            if (!selections.layerId) {
                this._notifyValidationError(this.loc.error.noLayer);
                noErrors = false;
            }
            var selectedMethod = selections.method;
            // Find the right method validator
            var methodValidator = this['_validate_method_' + selectedMethod];
            if (methodValidator) {
                // and call for it if found
                noErrors = methodValidator.call(this, selections, errorBase);
            } else {
                // otherwise notify user of unknown method.
                this._notifyValidationError(this.loc.error.invalidMethod + selectedMethod);
                noErrors = false;
            }

            return noErrors;
        },
        /**
         * Validates selections for analysis method buffer
         *
         * @method _validate_method_buffer
         * @private
         * @param {Object} selections Selections for output JSON
         * @param {String} errorTitle Error title to display to the user
         * @return {Boolean} returns true if no validation errors, false otherwise
         */
        _validate_method_buffer: function (selections, errorTitle) {
            var bufferSize = selections.methodParams.distance,
                noErrors = true;

            if (bufferSize === '') {
                this._notifyValidationError(this.loc.error.bufferSize, errorTitle);
                noErrors = false;
            } else if (isNaN(bufferSize)) {
                this._notifyValidationError(this.loc.error.illegalCharacters, errorTitle);
                noErrors = false;
            } else if (Number(bufferSize) > -1 && Number(bufferSize) < 1) {
                this._notifyValidationError(this.loc.error.bufferSize, errorTitle);
                noErrors = false;
            }
            return noErrors;
        },
        /**
         * Validates selections for analysis method aggregate
         *
         * @method _validate_method_aggregate
         * @private
         * @param {Object} selections Selections for output JSON
         * @param {String} errorTitle Error title to display to the user
         * @return {Boolean} returns true if no validation errors, false otherwise
         */
        _validate_method_aggregate: function (selections, errorTitle) {
            var noErrors = true;

            if (!selections.methodParams.functions || selections.methodParams.functions.length === 0) {
                this._notifyValidationError('Aggregate functions not selected', errorTitle);
                noErrors = false;
            }
         /*   if (!selections.methodParams.attribute) {
                this._notifyValidationError('Aggregate attribute not selected', errorTitle);
                noErrors = false;
            }  */
            return noErrors;
        },
        /**
         * Validates selections for analysis method union
         *
         * @method _validate_method_union
         * @private
         * @param {Object} selections Selections for output JSON
         * @param {String} errorTitle Error title to display to the user
         * @return {Boolean} returns true if no validation errors, false otherwise
         */
        _validate_method_union: function (selections, errorTitle) {
            var noErrors = true;

            /* decrecated     if (!selections.methodParams.layerId) {
            this._notifyValidationError('Union layer is not selected', errorTitle);
            noErrors = false;
        } else if (selections.layerId == selections.methodParams.layerId) {
            this._notifyValidationError('No unions to itself', errorTitle);
            noErrors = false;
        }  */
            return noErrors;
        },
        /**
         * Validates selections for analysis method clip
         *
         * @method _validate_method_clip
         * @private
         * @param {Object} selections Selections for output JSON
         * @param {String} errorTitle Error title to display to the user
         * @return {Boolean} returns true if no validation errors, false otherwise
         */
        _validate_method_clip: function (selections, errorTitle) {
            var noErrors = true;
            if (!selections.methodParams.layerId) {
                this._notifyValidationError('Clipping layer is not selected', errorTitle);
                noErrors = false;
            }
            return noErrors;
        },
        /**
         * Validates selections for analysis method intersect
         *
         * @method _validate_method_intersect
         * @private
         * @param {Object} selections Selections for output JSON
         * @param {String} errorTitle Error title to display to the user
         * @return {Boolean} returns true if no validation errors, false otherwise
         */
        _validate_method_intersect: function (selections, errorTitle) {
            var noErrors = true;

            if (!selections.methodParams.layerId) {
                this._notifyValidationError('Intersecting layer is not selected', errorTitle);
                noErrors = false;
            } else if (selections.layerId == selections.methodParams.layerId) {
                this._notifyValidationError('No intersections to itself', errorTitle);
                noErrors = false;
            }
            return noErrors;
        },
        /**
         * Validates selections for analysis method intersect
         *
         * @method _validate_method_layer_union
         * @param  {Object} selections Selections for output JSON
         * @param  {String} errorTitle Error title to display to the user
         * @return {Boolean} returns true if no validation errors, false otherwise
         */
        _validate_method_layer_union: function (selections, errorTitle) {
            var noErrors = true;

            if (!selections.methodParams.layers) {
                this._notifyValidationError(this.loc.error.noLayer, errorTitle);
                noErrors = false;
            }
            if (selections.methodParams.layers && selections.methodParams.layers.length < 2) {
                this._notifyValidationError(this.loc.error.noAnalyseUnionLayer, errorTitle);
                noErrors = false;
            }
            return noErrors;
        },

        /**
         * Validates selections for analysis method areas and sectors
         *
         * @method _validate_method_areas_and_sectors
         * @private
         * @param {Object} selections Selections for output JSON
         * @param {String} errorTitle Error title to display to the user
         * @return {Boolean} returns true if no validation errors, false otherwise
         */
        _validate_method_areas_and_sectors: function (selections, errorTitle) {
            var areaCount = selections.methodParams.areaCount,
                areaSize = selections.methodParams.areaSize,
                sectorCount = selections.methodParams.sectorCount,
                noErrors = true;

            // FIXME add validation once we know:
            // - which fields are mandatory
            // - what are the allowed ranges

            return noErrors;
        },

        /**
         * Validates selections for analysis method difference
         *
         * @method _validate_method_difference
         * @private
         * @param {Object} selections Selections for output JSON
         * @param {String} errorTitle Error title to display to the user
         * @return {Boolean} returns true if no validation errors, false otherwise
         */
        _validate_method_difference: function (selections, errorTitle) {
            var noErrors = true;
            if (!selections.methodParams.layerId) {
                this._notifyValidationError('Second layer is not selected', errorTitle);
                noErrors = false;
            }
            if (!selections.methodParams.fieldA1) {
                this._notifyValidationError('First layer\'s field is not selected', errorTitle);
                noErrors = false;
            }
            if (!selections.methodParams.fieldB1) {
                this._notifyValidationError('Second layer\'s field is not selected', errorTitle);
                noErrors = false;
            }
            if (!selections.methodParams.keyA1 || !selections.methodParams.keyB1) {
                this._notifyValidationError('Key field is not selected', errorTitle);
                noErrors = false;
            }
            return noErrors;
        },

        /**
         * Notifies the user of a validation error.
         *
         * @method _notifyValidationError
         * @private
         * @param {String} msg Message to display
         * @param {String} title Title for the pop-up
         *        (optional, uses default error title if not provided)
         */
        _notifyValidationError: function (msg, title) {
            if (!title) {
                title = this.loc.error.title;
            }
            this.instance.showMessage(title, msg);
        }
    });