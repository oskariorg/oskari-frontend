import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LocaleProvider } from 'oskari-ui/util';
import { FeaturePanel } from './FeaturePanel';
import { ErrorPanel } from './ErrorPanel';
import { InfoPanel } from './InfoPanel';

import styled from 'styled-components';
import { FeatureEditorPanelHandler } from './FeatureEditorPanelHandler';

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

export const FeatureEditorPanel = ({ layerId, featureId, loading = false, onSave, onDelete, onClose, onCancel}) => {
    const helperRef = useRef(null);
    const [handlerState, setHandlerState] = useState(null);
    const { currentLayer = null, feature = null } = handlerState || {};
    useEffect(() => {
        helperRef.current = new FeatureEditorPanelHandler();
        helperRef.current.addStateListener((newState) => {
            setHandlerState(newState);
        });
        helperRef.current.init(layerId, featureId);

        // clean up
        return () => {
            helperRef.current.destroy();
        }
    }, []);

    const startNewFeature = useCallback(() => {
        helperRef.current.startNewFeature();
    }, []);

    if (!handlerState) {
        return null;
    }

    return <EditorPanel
        layer = { currentLayer }
        feature = { feature }
        loading = { false }
        onSave = { (featureToSave) => onSave(currentLayer, featureToSave) }
        onDelete = { (featureIdToDelete) => onDelete(currentLayer, featureIdToDelete) }
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
        <LocaleProvider value={{ bundleKey: 'oskariui' }}>
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
                            onSave={onSave}
                            onDelete={onDelete}
                            feature={feature} />
                    }
                </div>
            </StyledPanel>
        </LocaleProvider>
    );
};
