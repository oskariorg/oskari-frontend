import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';

const BUNDLE_NAME = 'PersonalData';

export const FlyoutContent = ({ loginStatus, children }) => {

    if (!loginStatus.loggedIn) {
        return (
            <div>
                {<Message messageKey='notLoggedIn' bundleKey={BUNDLE_NAME} />}
                <br />
                {loginStatus.loginUrl && <a href={loginStatus.loginUrl}><Message messageKey='notLoggedInText' bundleKey={BUNDLE_NAME} /></a>}
                <br />
                {loginStatus.registerUrl && <a href={loginStatus.registerUrl}><Message messageKey='register' bundleKey={BUNDLE_NAME} /></a>}
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
    loginStatus: PropTypes.object
};
