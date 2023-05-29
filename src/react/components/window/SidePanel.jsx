import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ThemeConsumer } from '../../util/contexts';
import { getFontClass, getHeaderTheme } from '../../theme/ThemeHelper';
import { CloseIcon } from './CloseIcon';
import { ICON_SIZE } from './constants';

const StyledPanel = styled('div')`
    background: #FFF;
    position: relative;
    height: 100%;
    top: 0;
    /* sidebar has 3, we want to open it on top of this */
    z-index: 2;
    width: 252px;
    display: flex;
    flex-direction: column;
    font-family: ${props => props.font};

    div.content {
        padding: 10px;
        overflow: auto;
        height: calc(100% - 46px);
    }
`;
const Content = styled('div')`
    overflow: auto;
    padding-bottom: 20px;
`;
const StyledHeader = styled('div')`
    background: ${props => props.background};
    padding: 15px 15px 10px 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;
const StyledTitle = styled('h3')`
    color: ${props => props.color};
    margin-bottom: 0;
    padding: 0;
`;
const IconContainer = styled.span`
    font-size: ${ICON_SIZE}px;
    > button {
        color: ${props => props.iconColor};
    }
    > button:hover {
        color: ${props => props.hoverColor};
    }
    align-self: center;
    margin-left: 10px;
`;

const Header = ({ title, onClose, theme }) => {
    return (
        <StyledHeader
            className="header"
            background={theme.getBgColor()}
        >
            {title && (
                <StyledTitle
                    color={theme.getTextColor()}
                >
                    {title}
                </StyledTitle>
            )}
            <IconContainer
                iconColor={theme.getToolColor()}
                hoverColor={theme.getToolHoverColor()}
            >
                <CloseIcon
                    onClose={onClose}
                />
            </IconContainer>
        </StyledHeader>);
};

export const SidePanel = ThemeConsumer(({ title, onClose, children, theme = {} }) => {
    const headerTheme = getHeaderTheme(theme);
    return (
        <StyledPanel className={`t_print_panel ${getFontClass(theme)}`}>
            <Content>
                <Header title={title} onClose={onClose} theme={headerTheme} />
                {children}
            </Content>
        </StyledPanel>
    )
});

SidePanel.propTypes = {
    onClose: PropTypes.func.isRequired
};
