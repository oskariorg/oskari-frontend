import React from 'react';
import PropTypes from 'prop-types';
import { Message, Confirm } from 'oskari-ui';
import { LocaleConsumer } from 'oskari-ui/util';
import { FeaturePanel } from './FeaturePanel';
import { ErrorPanel } from './ErrorPanel';
import { InfoPanel } from './InfoPanel';
import { CloseCircleFilled } from '@ant-design/icons';

import styled from 'styled-components';

const StyledPanel = styled('div')`
    background: #FFF;
    position: absolute;
    height: 100%;
    top: 0;
    left: 0;
    /* sidebar has 3, we want to open it on top of this */
    z-index: 2;
    width: 382px;

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

const Header = LocaleConsumer(({ getMessage, onClose, confirmExit }) => {
    const iconProps = {};
    if (!confirmExit) {
        iconProps.onClick = onClose;
    }
    return (
        <div className="header">
            <FloatingIcon>
                <Confirm
                    disabled={!confirmExit}
                    title={getMessage('ContentEditorView.exitConfirm')}
                    onConfirm={onClose}
                    okText={getMessage('ContentEditorView.buttons.yes')}
                    cancelText={getMessage('ContentEditorView.buttons.no')}>
                    <CloseCircleFilled {...iconProps}/>
                </Confirm>
            </FloatingIcon>
            <h3><Message messageKey="ContentEditorView.title" /></h3>
        </div>);
});



export const SidePanel = ({ layer = {}, feature = {}, loading = false, onSave, onDelete, onClose, onCancel, startNewFeature}) => {
    const hasLayer = !!layer.geometryType;
    const hasFeature = hasLayer && feature.type === 'Feature';
    const showHelpText = hasLayer && !hasFeature;
    return (
        <StyledPanel className="content-editor">
            <Header onClose={ onClose } confirmExit={hasFeature} />
            <div className="content">
                { !hasLayer &&
                    <ErrorPanel loading={loading} />
                }
                { showHelpText &&
                    <InfoPanel
                        layer={layer}
                        onClose={onClose}
                        startNewFeature={startNewFeature} />
                }
                { hasFeature &&
                    <FeaturePanel
                        layer={layer}
                        onCancel={onCancel}
                        onSave={onSave}
                        onDelete={onDelete}
                        feature={feature} />
                }
            </div>
        </StyledPanel>
    );
};

SidePanel.propTypes = {
    layer: PropTypes.object,
    feature: PropTypes.object,
    loading: PropTypes.bool,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    onClose: PropTypes.func,
    onCancel: PropTypes.func,
    startNewFeature: PropTypes.func
};
