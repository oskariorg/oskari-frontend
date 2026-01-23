import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LocaleProvider } from 'oskari-ui/util';
import { FeaturePanel } from './FeaturePanel';
import { ErrorPanel } from './ErrorPanel';

import styled from 'styled-components';
import { FeatureEditorPanelHandler } from './FeatureEditorPanelHandler';
import { LayerSelectionPanel } from './LayerSelectionPanel';

const StyledPanel = styled('div')`
    background: #FFF;
    height: 100%;
    top: 0;
    left: 0;
    /* sidebar has 3, we want to open it on top of this */
    z-index: 2;
    width: 20vw;
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

export const FeatureEditorPanel = ({ layerId, featureId, savedFeature, loading = false, onSave, onDelete, onClose, onCancel}) => {
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

    useEffect(() => {
        // savedFeature provided when saving and we can't rely it can be found from the map already.
        if (layerId && savedFeature) {
            helperRef.current.setFeature(savedFeature);
            return;
        }
        if (layerId && featureId) {
            helperRef.current.updateCurrentFeature(layerId, featureId);
        }
    }, [layerId, featureId, savedFeature]);

    const startNewFeature = useCallback(() => {
        helperRef.current.startNewFeature();
    }, []);

    const setCurrentLayer = useCallback((layerId) => {
        helperRef.current.doDescribeLayer(layerId);
    });

    return <EditorPanel
        layer = { currentLayer }
        feature = { feature }
        loading = { false }
        onSave = { (featureToSave) => onSave(currentLayer, featureToSave) }
        onDelete = { (featureIdToDelete) => onDelete(currentLayer, featureIdToDelete) }
        onClose = { onClose }
        onCancel = { onCancel }
        startNewFeature = { startNewFeature }
        setCurrentLayer={setCurrentLayer}
    />;
};

const EditorPanel = ({ layer = {}, feature = {}, loading = false, onSave, onDelete, onClose, onCancel, startNewFeature, setCurrentLayer}) => {
    const hasLayer = !!layer?.geometryType;
    if (hasLayer && !feature) {
        feature = {
            type: 'Feature',
            properties: {}
        };
    }
    return (
        <LocaleProvider value={{ bundleKey: 'oskariui' }}>
            <StyledPanel className="content-editor">
                <div className="content">
                    {
                        loading && <ErrorPanel loading={loading} />

                    }
                    { !hasLayer &&
                        <LayerSelectionPanel setCurrentLayer={setCurrentLayer}/>
                    }
                    { hasLayer &&
                        <FeaturePanel
                            layer={layer}
                            onCancel={onCancel}
                            onSave={onSave}
                            onDelete={onDelete}
                            startNewFeature={startNewFeature}
                            feature={feature} />
                    }
                </div>
            </StyledPanel>
        </LocaleProvider>
    );
};
