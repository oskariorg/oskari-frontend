import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Confirm, Message, Button, Space } from 'oskari-ui';
import { LocaleConsumer } from 'oskari-ui/util';
import { Card } from 'oskari-ui/components/Card';
import { FeatureForm } from './FeatureForm';
import { GeometryPanel } from './GeometryPanel';
import { GeoJSONPanel } from './GeoJSONPanel';
import { Helper } from './Helper';
import { DrawingHelper } from './DrawingHelper';
import { StyledSpace, Row } from './styled';

export const FeaturePanel = ({ layer = {}, feature = {}, onCancel, onSave, onDelete, startNewFeature}) => {
    const type = Helper.detectGeometryType(layer.geometryType);
    const isMulti = type.includes('Multi');
    const [isDrawing, setDrawingMode] = useState(false);
    const [currentFeature, setCurrentFeature] = useState(feature);
    // TODO: if feature === currentFeature differs -> there have been edits made
    const isNew = !currentFeature.id;
    const stopDrawing = (clearPrevious = false) => {
        setDrawingMode(false);
        DrawingHelper.stopDrawing(clearPrevious);
    };
    
    const cancelCb = () => {
        stopDrawing(true);
        onCancel();
    };

    const saveCb = () => {
        stopDrawing(true);
        onSave(currentFeature);
    };
    
    const startNewCb = () => {
        stopDrawing(true);
        startNewFeature();
    };

    const onPropsChange = (updated) => {
        setCurrentFeature({
            ...currentFeature,
            properties: updated.properties
        });
    };

    useEffect(() => {
        // workaround for state issue when changing target feature
        if (currentFeature.id !== feature.id) {
            setCurrentFeature(feature);
        }
    });

    const updateGeometry = (updatedFeature) => {
        setCurrentFeature({
            ...currentFeature,
            geometry: updatedFeature.geometry
        });
    };
    const startDrawing = (type) => {
        DrawingHelper.startDrawing(type, isMulti, currentFeature.geometry, updateGeometry);
        setDrawingMode(true);
    };

    let title = <Message messageKey="FeatureEditorView.newTitle" />;
    if (!isNew) {
        title = `${currentFeature.id}`;
    }
    const canSave = !isDrawing && !!currentFeature.geometry;
    return (<React.Fragment>
        <StyledSpace direction="vertical">
            <Card title={title}>
                <StyledSpace direction="vertical">
                    <FeatureForm config={layer}
                        feature={currentFeature}
                        original={feature}
                        onChange={onPropsChange} />

                    { isDrawing &&
                        <React.Fragment>
                            <Message messageKey="FeatureEditorView.geometrylist.editing" />
                            <Row>
                                <Button type="primary" onClick={() => stopDrawing(false)}>
                                    <Message messageKey="FeatureEditorView.tools.finishSketch" />
                                </Button>
                                <Button type="default" onClick={() => { 
                                    // reset geometry with the original feature and clear drawing.
                                    updateGeometry(feature); 
                                    stopDrawing(true); 
                                }}>
                                    <Message messageKey="FeatureEditorView.restoreOriginal" />
                                </Button>
                            </Row>
                        </React.Fragment>
                    }
                    { !isDrawing &&
                        <GeometryPanel
                            type={layer.geometryType}
                            feature={currentFeature}
                            original={feature}
                            startDrawing={startDrawing}
                            stopDrawing={stopDrawing}
                            updateGeometry={updateGeometry} />
                    }
                    { !isDrawing &&
                        <GeoJSONPanel feature={currentFeature} />
                    }
                </StyledSpace>
            </Card>
            <Space>
                {!isNew && <Button onClick={startNewCb}>
                    <Message messageKey="FeatureEditorView.buttons.addFeature" />
                </Button>
                }
                <Button onClick={cancelCb}>
                    <Message messageKey="FeatureEditorView.buttons.cancel" />
                </Button>
                {!isNew && <DeleteButton disabled={!canSave} onDelete={() => onDelete(currentFeature.id)} />}
                <Button disabled={!canSave} type="primary" onClick={saveCb}>
                    <Message messageKey="FeatureEditorView.buttons.save" />
                </Button>
            </Space>
        </StyledSpace>
    </React.Fragment>);
};

const DeleteButton = LocaleConsumer(({ getMessage, onDelete, disabled }) => {
    return (
        <Confirm
            title={getMessage('FeatureEditorView.deleteFeature.text')}
            onConfirm={onDelete}
            okText={getMessage('FeatureEditorView.buttons.yes')}
            cancelText={getMessage('FeatureEditorView.buttons.no')}>
            <Button type="danger" disabled={disabled}>
                <Message messageKey="FeatureEditorView.buttons.deleteFeature" />
            </Button>
        </Confirm>);
});

FeaturePanel.propTypes = {
    layer: PropTypes.object,
    feature: PropTypes.object,
    editing: PropTypes.bool,
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    onDelete: PropTypes.func
};
