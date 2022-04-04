import React from 'react';
import PropTypes from 'prop-types';

export const FlyoutContent = ({ loggedIn, getLoginUrl, children }) => {

    if (!loggedIn) {
        return (
            <div>
                {getLoginUrl()}
            </div>
        )
    }

    return (
        <div>
            {children}
        </div>
    );
}

FlyoutContent.propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    getLoginUrl: PropTypes.func.isRequired
};
