import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button as AntButton } from 'antd';
import { ThemeConsumer } from 'oskari-ui/util';
import { getNavigationTheme } from 'oskari-ui/theme';

export const Button = ({ children, className, loading = false, ...other }) => {
    let modifiedClass = className || '';
    if (!modifiedClass.includes('t_button')) {
        modifiedClass = 't_button ' + className;
    }
    return (<AntButton className={modifiedClass} loading={loading} {...other}>{children}</AntButton>);
};

Button.propTypes = {
    children: PropTypes.any
};

const StyledButton = styled(Button)`
    background: ${props => props.theme.getAccent()};
    border: none;
    color: inherit;
    fill: currentColor;

    &:focus,
    &:active,
    &&&:hover {
        background: ${props => props.theme.getAccentHover()};
        color: inherit;
        border: none;
    }
`;

export const ThemedButton = ThemeConsumer(({ theme, children, ...other }) => {
    return <StyledButton theme={getNavigationTheme(theme)} {...other}>{children}</StyledButton>;
});

ThemedButton.propTypes = {
    theme: PropTypes.object.isRequired,
    children: PropTypes.any
};
