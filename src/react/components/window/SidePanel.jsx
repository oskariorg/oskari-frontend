import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { IconButton } from 'oskari-ui/components/buttons';
import { CloseCircleFilled } from '@ant-design/icons';
import { ThemeConsumer } from '../../util/contexts';
import { getFontClass, getHeaderTheme } from '../../theme/ThemeHelper';

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
    background: ${props => props.theme.getBgColor()};
    color: ${props => props.theme.getTextColor()};
    padding: 5px 10px;
`;

const StyledIconButton = styled(IconButton)`
    float: right;
`;

const Header = ({ title, onClose, theme }) => {
    return (
        <StyledHeader
            className="header"
            theme={theme}
        >
            <StyledIconButton
                onClick={onClose}
                icon={<CloseCircleFilled />}
            />
            {title && (
                <h3>{title}</h3>
            )}
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
