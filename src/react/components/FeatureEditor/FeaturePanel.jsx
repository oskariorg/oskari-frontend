import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Confirm, Message, Button } from 'oskari-ui';
import { LocaleConsumer } from 'oskari-ui/util';
import { Card } from 'oskari-ui/components/Card';
import { PrimaryButton, SecondaryButton } from '../buttons';
import { FeatureForm } from './FeatureForm';
import { GeometryPanel } from './GeometryPanel';
import { GeoJSONPanel } from './GeoJSONPanel';
import { Helper } from './Helper';
import { DrawingHelper } from './DrawingHelper';
import { StyledSpace, Row } from './styled';
import styled from 'styled-components';

const WrappingRow = styled(Row)`
    flex-wrap: wrap;
    width: 100%;
`;

const CardSubtitle = styled('div')`
    margin-top: 0.15em;
    font-size: 0.85em;
    font-weight: normal;
    color: inherit;
`;

export const FeaturePanel = ({ layer = {}, feature = {}, onCancel, onSave, onDelete, startNewFeature, showGeoJSONPanel = true, showGeometryNotRecognizedAlert = true }) => {
    const type = Helper.detectGeometryType(layer.geometryType);
    const isMulti = type.includes('Multi');
    const [isDrawing, setDrawingMode] = useState(false);
    const [isGeometryValid, setGeometryValid] = useState(true);
    const [currentFeature, setCurrentFeature] = useState(feature);
    // TODO: if feature === currentFeature differs -> there have been edits made
    const isNew = !currentFeature.id;
    const stopDrawing = (clearPrevious = false, finishDrawing = false) => {
        setDrawingMode(false);
        DrawingHelper.stopDrawing(clearPrevious, finishDrawing);
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
        setGeometryValid(updatedFeature.properties?.valid !== false);
        setCurrentFeature({
            ...currentFeature,
            geometry: updatedFeature.geometry
        });
    };
    const startDrawing = (type) => {
        setGeometryValid(true);
        DrawingHelper.startDrawing(type, isMulti, currentFeature.geometry, updateGeometry, setGeometryValid);
        setDrawingMode(true);
    };

    const subtitleKey = isNew ? 'FeatureEditorView.newTitle' : 'FeatureEditorView.editTitle';
    const cardTitle = (
        <>
            {layer.name || ''}
            <CardSubtitle>
                <Message messageKey={subtitleKey} />
            </CardSubtitle>
        </>
    );
    const canSave = !isDrawing && !!currentFeature.geometry && isGeometryValid;
    return (<React.Fragment>
        <StyledSpace direction="vertical">
            <Card title={cardTitle}>
                <StyledSpace direction="vertical">
                    <FeatureForm config={layer}
                        feature={currentFeature}
                        original={feature}
                        disabled={isDrawing}
                        onChange={onPropsChange} />

                    { isDrawing &&
                        <React.Fragment>
                            <Message messageKey="FeatureEditorView.geometrylist.editing" />
                            <WrappingRow>
                                <Button type="primary" disabled={!isGeometryValid} onClick={() => {
                                    stopDrawing(false, true);
                                }}>
                                    <Message messageKey="FeatureEditorView.tools.finishSketch" />
                                </Button>
                                <Button type="default" onClick={() => {
                                    // reset geometry with the original feature and clear drawing.
                                    updateGeometry(feature);
                                    stopDrawing(true);
                                }}>
                                    <Message messageKey="FeatureEditorView.restoreOriginal" />
                                </Button>
                            </WrappingRow>
                        </React.Fragment>
                    }
                    { !isDrawing &&
                        <GeometryPanel
                            type={layer.geometryType}
                            feature={currentFeature}
                            original={feature}
                            startDrawing={startDrawing}
                            stopDrawing={stopDrawing}
                            updateGeometry={updateGeometry}
                            showGeometryNotRecognizedAlert={showGeometryNotRecognizedAlert} />
                    }
                    { !isDrawing && showGeoJSONPanel &&
                        <GeoJSONPanel feature={currentFeature} />
                    }
                </StyledSpace>
            </Card>
            <WrappingRow>
                {!isNew && <Button onClick={startNewCb}>
                    <Message messageKey="FeatureEditorView.buttons.addFeature" />
                </Button>
                }
                <SecondaryButton type='cancel' onClick={cancelCb}/>
                {!isNew && <DeleteButton disabled={!canSave} onDelete={() => onDelete(currentFeature.id)} />}
                <PrimaryButton type='save' disabled={!canSave} onClick={saveCb}/>
            </WrappingRow>
        </StyledSpace>
    </React.Fragment>);
};

const DeleteButton = LocaleConsumer(({ getMessage, onDelete, disabled }) => {
    return (
        <Confirm
            title={getMessage('FeatureEditorView.deleteFeature.text')}
            onConfirm={onDelete}
            okText={getMessage('buttons.yes')}
            cancelText={getMessage('buttons.no')}>
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
    onDelete: PropTypes.func,
    showGeoJSONPanel: PropTypes.bool,
    showGeometryNotRecognizedAlert: PropTypes.bool
};
