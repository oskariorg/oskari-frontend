import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import styled from 'styled-components';

const StyledContent = styled.div`
    width: 100%;
`;

export const FlyoutContent = ({ loginStatus, children }) => {

    if (!loginStatus.loggedIn) {
        return (
            <StyledContent>
                {<Message messageKey='notLoggedIn' />}
                <br />
                {loginStatus.loginUrl && <a href={loginStatus.loginUrl}><Message messageKey='notLoggedInText' /></a>}
                <br />
                {loginStatus.registerUrl && <a href={loginStatus.registerUrl}><Message messageKey='register' /></a>}
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
