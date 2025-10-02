import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CloseIcon } from './CloseIcon';
import { ThemeConsumer } from 'oskari-ui/util';
import { getHeaderTheme } from '../../theme/ThemeHelper';
import { ICON_SIZE } from './constants';

const Container = styled('div')`
    display: flex;
    flex-direction: row;
    background-color: ${props => props.theme.getBgColor()};
    color:  ${props => props.theme.getTextColor()};
    padding: 8px 10px;
    margin: 0px;
    cursor: ${props => props.isDraggable ? 'grab' : undefined};
`;
const ToolsContainer = styled('div')`
    display: flex;
    flex-direction: row;
    font-size: ${ICON_SIZE}px;
    margin-left: 10px;
    height: 16px;
    > button {
        margin-top: -5px;
        color: ${props => props.theme.getToolColor()};
    }
    > button:hover {
        color: ${props => props.theme.getToolHoverColor()};
    }
`;
const TitleContainer = styled('div')`
    flex-grow: 1;
`;
const StyledTitle = styled('h3')`
    padding: 0;
    margin: 0;
    color: ${props => props.theme.getTextColor()};
`;

export const Header = ThemeConsumer(({ title, isDraggable = false, onClose, theme = {}, tools, ...rest }) => {
    const headerTheme = getHeaderTheme(theme);
    return (
        <Container
            isDraggable={isDraggable}
            theme={headerTheme}
            {...rest}
        >
            <TitleContainer>
                {title && (
                    <StyledTitle theme={headerTheme}>{title}</StyledTitle>
                )}
            </TitleContainer>
            <ToolsContainer theme={headerTheme}>
                {tools}
                {onClose && (
                    <CloseIcon
                        onClose={onClose}
                    />
                )}
            </ToolsContainer>
        </Container>
    );
});

Header.propTypes = {
    title: PropTypes.any,
    isDraggable: PropTypes.bool,
    tools: PropTypes.arrayOf(PropTypes.element),
    onClose: PropTypes.func
};
