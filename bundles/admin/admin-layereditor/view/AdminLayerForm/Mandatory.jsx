import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'oskari-ui';

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
export const Mandatory = ({ children }) => {
    return <MandatoryContext.Provider value={true}>{children}</MandatoryContext.Provider>;
};

Mandatory.propTypes = {
    children: PropTypes.any
};

// TODO: isValid should probably be a prop in Mandatory instead
export const MandatoryIcon = ({ isValid = false }) => (
    <MandatoryContext.Consumer>
        {
            isMandatory => {
                if (!isMandatory) {
                    // Not wrapped in MandatoryContext -> Don't return any UI element
                    return null;
                }
                // This was wrapped in mandatory -> Show users it's required
                // red by default and when isValid=false
                // green when isValid=true
                return <Icon type="star" theme="twoTone" twoToneColor={isValid ? '#52c41a' : '#da5151'} />;
            }
        }
    </MandatoryContext.Consumer>
);

MandatoryIcon.propTypes = {
    isValid: PropTypes.bool
};
