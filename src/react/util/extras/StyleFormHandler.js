import { StateHandler } from 'oskari-ui/util';

/**
 * Non-async state handling
 */
export class StyleFormHandler extends StateHandler {
    constructor (styleSettings) {
        super();

        this.state = {
            ...styleSettings
        }
        console.log('initializing');
        console.log(styleSettings);

        this.stateSetCallback = null;
        this.formSetCallback = null;
        //this.stateSetCallback = stateSetCallback;
    }

    setCallbacks (stateSetCallback, formSetCallback) {
        this.stateSetCallback = stateSetCallback;
        this.formSetCallback = formSetCallback;
    }

    getCurrentStyle () {
        return this.state;
    }

    getCurrentFormat () {
        return this.state.format;
    }

    /**
     * @method _populateWithStyle
     * @description Populate form with selected style from the list
     *
     * @param {String} styleSelected - name of the style selected from the list 
     */
    populateWithStyle (currentStyle) {
       for (const single in currentStyle) {
           const targetToSet = typeof currentStyle[single] !== 'object' ? '' : currentStyle[single];
           const valueToSet = typeof currentStyle[single] === 'object' ? null : currentStyle[single]; //set value if it is on the first level
           this._composeTargetString(targetToSet, single, valueToSet);
        }

        this.setState({ ...this.state, ...currentStyle});
        this.stateSetCallback(this.state);
    }

    /**
     * @method _composeTargetString
     * @description Loop through provided target with recursive loop if target contains child objects and compose target string to set field values correctly
     *
     * @param {Object|String} target             - target to loop through
     * @param {String} container                 - containing object key as String to use as a base for name
     * @param {Object|Boolean|String} valueToSet - value to set in the end. If object provided we go through it recursively.
     */
    _composeTargetString (target, container, valueToSet) {
        if (typeof valueToSet !== 'object' && typeof target !== 'object') {
            this.formSetCallback({ [container]: valueToSet });
        } else {
            for (const singleTarget in target) {
                this._composeTargetString(target[singleTarget], (container + '.' + singleTarget), target[singleTarget]);
            }
        }
    }

    /**
     * @method setFormState
     * @description Updates state of handler and sets form state via callback
     * @param {String} targetString - target parameter in object provided in full dot notation 
     * @param {String|Number} value - value to be set 
     */
    setFormState (values) {
        for (const [key, value] of Object.entries(values)) {
            const firstTarget = key.substr(0, key.indexOf('.'));
            let currentTarget = this.state;
            currentTarget = this._parseStateValue(currentTarget, key, value);

            this.setState({
                ...this.state,
                [firstTarget]: {
                    ...this.state[firstTarget],
                    currentTarget
                }
            });
        }

        this.stateSetCallback( this.state );
    };

    /**
     * @method _parseStateValue
     * @description Parses through and sets provided value into state based on provided target parameter as dot-notation string
     *
     * @param {Object} targetObject - state provided as object
     * @param {String} targetString - target parameter in object provided in full dot notation 
     * @param {String|Number} value - value to be set
     *
     * @returns {Object} - returns object where new value is set
     */
    _parseStateValue (targetObject, targetString, value) {
        if (typeof targetString === 'string') {
            return this._parseStateValue(targetObject, targetString.split('.'), value); // first cycle of recursion converts targetString into array
        } else if (targetString.length == 1 && value !== undefined) {
            return targetObject[targetString[0]] = value; // We reach end of the recursion
        } else if (targetString.length === 0) {
            return targetObject; // target is already on level 0 so no need for recursion
        } else {
            return this._parseStateValue(targetObject[targetString[0]], targetString.slice(1), value); // recursive call and remove first element from array
        }
    }
}