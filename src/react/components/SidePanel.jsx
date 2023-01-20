import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Message, Confirm, Spin } from 'oskari-ui';
import { LocaleConsumer } from 'oskari-ui/util';
import { CloseCircleFilled } from '@ant-design/icons';

const BUNDLE_KEY = 'oskariui';

const StyledPanel = styled('div')`
    background: #FFF;
    position: absolute;
    height: 100%;
    top: 0;
    left: 0;
    /* sidebar has 3, we want to open it on top of this */
    z-index: 2;
    width: 100%;

    div.header {
        background-color: #FDF8D9;
        padding: 5px 10px;
        div.icon-close {
            float: right;
        }
    }

    div.content {
        padding: 10px;
        overflow: auto;
        height: calc(100% - 46px);
    }
`;

const FloatingIcon = styled('div')`
    float: right;
`;

const Header = LocaleConsumer(({ title, onClose, confirmExit }) => {
    const iconProps = {};
    if (!confirmExit) {
        iconProps.onClick = onClose;
    }
    return (
        <div className="header">
            <FloatingIcon>
                <Confirm
                    disabled={!confirmExit}
                    title={<Message messageKey='ContentEditorView.exitConfirm' bundleKey={BUNDLE_KEY} />}
                    onConfirm={onClose}
                    okText={<Message messageKey='ContentEditorView.buttons.yes' bundleKey={BUNDLE_KEY} />}
                    cancelText={<Message messageKey='ContentEditorView.buttons.no' bundleKey={BUNDLE_KEY} />}>
                    <CloseCircleFilled {...iconProps}/>
                </Confirm>
            </FloatingIcon>
            {title && (
                <h3>{title}</h3>
            )}
        </div>);
});

export const SidePanel = ({ title, loading = false, onClose, children }) => {
    return (
        <StyledPanel>
            <Header title={title} onClose={onClose} />
            {children}
        </StyledPanel>
    )
};

SidePanel.propTypes = {
    onClose: PropTypes.func.isRequired
};
