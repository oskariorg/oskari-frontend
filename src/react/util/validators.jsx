import React from 'react';
import { MandatoryIcon } from 'oskari-ui/components/icons';

// This checks if the param is a React component. React.isValidElement() checks if it's a valid element that might not be a component
const isReactComponent = (el) => el && el.$$typeof === Symbol.for('react.element');

const isNonEmptyString = value => typeof value === 'string' && value.trim().length > 0;

export const getMandatoryIcon = (mandatory, elementValue) => {
    if (typeof mandatory === 'boolean') {
        // generate default check for mandatory field
        return (<MandatoryIcon isValid={isNonEmptyString(elementValue)} />);
    } else if (isReactComponent(mandatory)) {
        // use icon send through props
        // Admin-layereditor has custom mandatory context with own mechanism for validation
        return (<mandatory.type {...mandatory.props}/>);
    }
    return null;
};
