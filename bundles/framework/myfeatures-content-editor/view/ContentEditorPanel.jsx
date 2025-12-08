import React, { useState, useEffect } from 'react';
import { Message, Confirm } from 'oskari-ui';
import { LocaleProvider, LocaleConsumer } from 'oskari-ui/util';
import { FeaturePanel } from './FeaturePanel';
import { ErrorPanel } from './ErrorPanel';
import { InfoPanel } from './InfoPanel';
import { CloseCircleFilled } from '@ant-design/icons';

import styled from 'styled-components';
import { ContentEditorPanelHandler } from './ContentEditorPanelHandler';

const StyledPanel = styled('div')`
    background: #FFF;
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
    // TODO: we should ditch this header and add confirm to the flyouts header close-box. How?
    return (
        <div className="header">
            <FloatingIcon>
                <Confirm
                    disabled={!confirmExit}
                    title={<Message messageKey='ContentEditorView.exitConfirm'/>}
                    onConfirm={onClose}
                    okText={<Message messageKey='ContentEditorView.buttons.yes'/>}
                    cancelText={<Message messageKey='ContentEditorView.buttons.no'/>}>
                    <CloseCircleFilled {...iconProps}/>
                </Confirm>
            </FloatingIcon>
            <h3><Message messageKey="ContentEditorView.title" /></h3>
        </div>);
});


export const ContentEditorPanel = ({ layerId, loading = false, onSave, onDelete, onClose, onCancel, startNewFeature}) => {

    const [handlerState, setHandlerState] = useState(null);
    useEffect(() => {
        const panelHandler = new ContentEditorPanelHandler(layerId);
        panelHandler.addStateListener((newState) => {
            setHandlerState(newState);
        });
        panelHandler.init(layerId);
    }, []);

    if (!handlerState) {
        return null;
    }

    const { currentLayer, feature } = handlerState;
    return <EditorPanel
        layer = { currentLayer }
        feature = { feature }
        loading = {false }
        onSave = { (featureToSave) => onSave(currentLayer, featureToSave) }
        onDelete = { (featureToDelete) => onDelete(handlerState?.currentLayer, featureToDelete) }
        onClose = { onClose }
        onCancel = { onCancel }
        startNewFeature = { startNewFeature }
    />;
};

const EditorPanel = ({ layer = {}, feature = {}, loading = false, onSave, onDelete, onClose, onCancel, startNewFeature}) => {
    const hasLayer = !!layer.geometryType;
    const hasFeature = hasLayer && feature?.type === 'Feature';
    const showHelpText = hasLayer && !hasFeature;
    return (
        <LocaleProvider value={{ bundleKey: 'ContentEditor' }}>
            <StyledPanel className="content-editor">
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
                            onSave={(feature) => onSave(feature)}
                            onDelete={onDelete}
                            feature={feature} />
                    }
                </div>
            </StyledPanel>
        </LocaleProvider>
    );
};
