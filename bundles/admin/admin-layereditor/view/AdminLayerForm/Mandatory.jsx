import React from 'react';
import PropTypes from 'prop-types';
import { MandatoryIcon as Icon } from 'oskari-ui/components/icons';

const MandatoryContext = React.createContext();

/** *
 * import { Mandatory, MandatoryIcon } from './Mandatory';
 *
 * const SomeComponent = () => (
 *  <div>... some complex structure with <MandatoryIcon /> inside</div>
 * );
 *
 * Show field as mandatory (placement is determined inside SomeComponent):
 *     <Mandatory><SomeComponent /></Mandatory>
 *
 * Don't show field as mandatory:
 *     <SomeComponent />
 * Note! We could wrap Mandatory with a style to "flash" the field on validation error but that might be too "flashy" on each validation.
 * Maybe we could do it when user clicks save?
 */
export const Mandatory = ({ isValid = false, children }) => {
    return <MandatoryContext.Provider value={{ isValid }}>{children}</MandatoryContext.Provider>;
};

Mandatory.propTypes = {
    isValid: PropTypes.bool,
    children: PropTypes.any
};

export const MandatoryIcon = () => (
    <MandatoryContext.Consumer>
        {
            value => {
                if (!value) {
                    // Not wrapped in MandatoryContext -> Don't return any UI element
                    // reason: this is just a placeholder to show icon if the field is mandatory
                    return null;
                }
                const { isValid } = value;
                // This was wrapped in mandatory -> Show users it's required
                // red by default and when isValid=false
                // green when isValid=true
                return <Icon isValid={isValid} />;
            }
        }
    </MandatoryContext.Consumer>
);
