import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import styled from 'styled-components';

const BUNDLE_NAME = 'PersonalData';

const StyledContent = styled.div`
    width: 750px;
`;

export const FlyoutContent = ({ loginStatus, children }) => {

    if (!loginStatus.loggedIn) {
        return (
            <StyledContent>
                {<Message messageKey='notLoggedIn' bundleKey={BUNDLE_NAME} />}
                <br />
                {loginStatus.loginUrl && <a href={loginStatus.loginUrl}><Message messageKey='notLoggedInText' bundleKey={BUNDLE_NAME} /></a>}
                <br />
                {loginStatus.registerUrl && <a href={loginStatus.registerUrl}><Message messageKey='register' bundleKey={BUNDLE_NAME} /></a>}
            </StyledContent>
        )
    }

    return (
        <StyledContent>
            {children}
        </StyledContent>
    );
}

FlyoutContent.propTypes = {
    loginStatus: PropTypes.object
};
