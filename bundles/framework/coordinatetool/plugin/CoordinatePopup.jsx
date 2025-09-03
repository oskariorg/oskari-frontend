import React from 'react';
import { showPopup } from 'oskari-ui/components/window';
import { Message, Button, TextInput, Checkbox, Select, Option, Spin } from 'oskari-ui';
import { Content, CoordinateFields, CoordinateField, DegreeContainer, CoordinateLabel, SelectField, EmergencyInfoContainer, SelectLabel, ReverseGeoCodes, Approximation } from './styled';
import { ButtonContainer } from 'oskari-ui/components/buttons';
import { LocaleProvider } from 'oskari-ui/util';
import { formatDegrees, isTransformAllowed } from './helper';
import PropTypes from 'prop-types';

const BUNDLE_KEY = 'coordinatetool';
const ENTER_KEY = 'Enter';

const OPTIONS = {
    id: 'coordinates'
};

const formatLeadingZero = (number) => {
    if (parseFloat(number) < 10) return `0${number}`;
    return number;
};
const isMarkersSupported = () => {
    const builder = Oskari.requestBuilder('MapModulePlugin.AddMarkerRequest');
    return !!builder;
};

const ProjectionChanger = ({ projection, onChange, supportedProjections = [] }) => {
    if (!isTransformAllowed(supportedProjections) || typeof onChange !== 'function') {
        return (
            <Message messageKey={`display.crs.${projection}`} fallback={
                <Message messageKey='display.crs.default' messageArgs={{ crs: projection }} />
            }/>);
    }
    return (
        <SelectField>
            <SelectLabel>
                <Message messageKey='display.coordinatesTransform.header' />
            </SelectLabel>
            <Select
                value={projection}
                onChange={onChange}
            >
                {supportedProjections.map(option => (
                    <Option key={option} value={option}>
                        <Message messageKey={`display.coordinatesTransform.projections.${option}`} />
                    </Option>
                )) }
            </Select>
        </SelectField>
    );
};

ProjectionChanger.propTypes = {
    projection: PropTypes.string,
    onChange: PropTypes.func,
    supportedProjections: PropTypes.array.isRequired,
    children: PropTypes.any
};

const LatLabel = ({ isDegrees }) => {
    if (isDegrees) {
        return <Message messageKey={'display.compass.lat'} LabelComponent={ CoordinateLabel } />;
    }
    return <Message messageKey={'display.compass.n'} LabelComponent={ CoordinateLabel } />;
};
LatLabel.propTypes = {
    isDegrees: PropTypes.bool
};

const LonLabel = ({ isDegrees }) => {
    if (isDegrees) {
        return <Message messageKey={'display.compass.lon'} LabelComponent={ CoordinateLabel } />;
    }
    return <Message messageKey={'display.compass.e'} LabelComponent={ CoordinateLabel } />;
};
LonLabel.propTypes = {
    isDegrees: PropTypes.bool
};

const DegreesDisplay = ({ isDegrees, lon, lat, isLat }) => {
    if (!isDegrees) {
        return null;
    }
    const dec = Oskari.util.coordinateDegreesToMetric([lon, lat], 20);
    const decimalSeparator = Oskari.getDecimalSeparator();
    const degmin = formatDegrees(dec[0], dec[1], 'min');
    if (isLat) {
        return (
            <DegreeContainer>
                <span>{`${degmin.degreesY}° ${formatLeadingZero(degmin.minutesY)}'`}</span>
                <span>{`${parseFloat(dec[1]).toFixed(9).replace('.', decimalSeparator)}°`}</span>
            </DegreeContainer>
        );
    }
    return (
        <DegreeContainer>
            <span>{`${degmin.degreesX}° ${formatLeadingZero(degmin.minutesX)}'`}</span>
            <span>{`${parseFloat(dec[0]).toFixed(9).replace('.', decimalSeparator)}°`}</span>
        </DegreeContainer>
    );
};
DegreesDisplay.propTypes = {
    isDegrees: PropTypes.bool,
    lon: PropTypes.string,
    lat: PropTypes.string,
    isLat: PropTypes.bool
};

const HoverToggle = ({ isShowing, onChange }) => {
    if (!Oskari.util.mouseExists()) {
        return null;
    }
    return (
        <Checkbox
            checked={isShowing}
            onChange={onChange}
        >
            <Message messageKey='display.popup.showMouseCoordinates' />
        </Checkbox>
    );
};
HoverToggle.propTypes = {
    isShowing: PropTypes.bool,
    onChange: PropTypes.func
};

const MarkerButton = ({ isSupported, addMarker }) => {
    if (!isSupported) {
        return null;
    }
    return (
        <Button
            type='default'
            onClick={addMarker}
            className='t_add'
        >
            <Message messageKey='display.popup.addMarkerButton' />
        </Button>
    );
};
MarkerButton.propTypes = {
    isSupported: PropTypes.bool,
    addMarker: PropTypes.func
};

const ReverseGeocodeCheckBox = ({ showCheckbox, showResults, toggleResults }) => {
    if (!showCheckbox) {
        return null;
    }
    return (
        <Checkbox
            checked={showResults}
            onChange={toggleResults}
        >
            <Message messageKey='display.reversegeocode.moreInfo' />
        </Checkbox>
    );
};

ReverseGeocodeCheckBox.propTypes = {
    showCheckbox: PropTypes.bool,
    showResults: PropTypes.bool,
    toggleResults: PropTypes.func
};

const ReverseGeocodeResults = ({ showResults, results = [] }) => {
    if (!showResults || results.length === 0) {
        return null;
    }
    return (
        <ReverseGeoCodes>
            {results.map((geoCode, index) => (
                <span key={index}>{geoCode.title} <u>{geoCode.name}</u></span>
            ))}
        </ReverseGeoCodes>
    );
};

ReverseGeocodeResults.propTypes = {
    showResults: PropTypes.bool,
    results: PropTypes.array
};

const EmergencyInfo = ({ coords }) => {
    if (!coords) {
        return null;
    }
    const degmin = formatDegrees(coords.lon, coords.lat, 'min', 3);
    // Coordinates are now on separate row
    // the text would flow better if emergencyCallLabel Message-tag is used as wrapper for the other content
    // But it might be intended to be on a separate row for clarity?
    return (
        <EmergencyInfoContainer>
            <Message messageKey='display.coordinatesTransform.emergencyCallLabel' />
            <Message messageKey='display.compass.p'>{` ${degmin.degreesY}° `}{` ${formatLeadingZero(degmin.minutesY)}' `}</Message>
            {' '}<Message messageKey='display.coordinatesTransform.emergencyCallLabelAnd' />{' '}
            <Message messageKey='display.compass.i'> {` ${degmin.degreesX}° `}{` ${formatLeadingZero(degmin.minutesX)}'`}</Message>
        </EmergencyInfoContainer>
    );
};
EmergencyInfo.propTypes = {
    coords: PropTypes.object
};

const PopupContent = ({ state = {}, controller, supportedProjections, showReverseGeoCodeCheckbox }) => {
    const isDegrees = controller.isCurrentUnitDegrees();

    return (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <Spin spinning={state.loading}>
                <Content>
                    <Message messageKey='display.popup.info' />
                    <ProjectionChanger
                        projection={state.selectedProjection}
                        onChange={value => controller.setSelectedProjection(value)}
                        supportedProjections={supportedProjections} />
                    <CoordinateFields>
                        <CoordinateField>
                            <LatLabel isDegrees={isDegrees}/>
                            <Approximation>
                                {state.approxValue && ('~')}
                            </Approximation>
                            <TextInput
                                value={state?.latField}
                                onChange={(e) => controller.setLatInputValue(e.target.value)}
                                onBlur={() => controller.useUserDefinedCoordinates()}
                                onKeyUp={(evt) => { if (evt.key === ENTER_KEY) controller.useUserDefinedCoordinates(); }}
                                disabled={state.showMouseCoordinates}
                                className='t_lat'
                            />
                        </CoordinateField>
                        <DegreesDisplay
                            isDegrees={isDegrees}
                            lat={state?.latField}
                            lon={state.lonField}
                            isLat={true} />
                        <CoordinateField>
                            <LonLabel isDegrees={isDegrees}/>
                            <Approximation>
                                {state.approxValue && ('~')}
                            </Approximation>
                            <TextInput
                                value={state?.lonField}
                                onChange={(e) => controller.setLonInputValue(e.target.value)}
                                onBlur={() => controller.useUserDefinedCoordinates()}
                                onKeyUp={(evt) => { if (evt.key === ENTER_KEY) controller.useUserDefinedCoordinates(); }}
                                disabled={state.showMouseCoordinates}
                                className='t_lon'
                            />
                        </CoordinateField>
                        <DegreesDisplay
                            isDegrees={isDegrees}
                            lat={state?.latField}
                            lon={state?.lonField}
                            isLat={false} />
                    </CoordinateFields>
                    <HoverToggle
                        isShowing={state.showMouseCoordinates}
                        onChange={() => controller.toggleMouseCoordinates()} />
                    <ReverseGeocodeCheckBox
                        showCheckbox={showReverseGeoCodeCheckbox}
                        showResults={state.showReverseGeoCode}
                        toggleResults={() => controller.toggleReverseGeoCode()} />
                    <ReverseGeocodeResults
                        showResults={!showReverseGeoCodeCheckbox || state.showReverseGeoCode}
                        results={state.reverseGeoCode} />
                    <EmergencyInfo coords={state.emergencyInfo} />
                    <ButtonContainer>
                        <Button
                            type='default'
                            disabled={state.showMouseCoordinates || controller.isMapCentered()}
                            onClick={() => controller.centerMap()}
                            className='t_center'
                        >
                            <Message bundleKey={BUNDLE_KEY} messageKey='display.popup.searchButton' />
                        </Button>
                        <MarkerButton
                            isSupported={isMarkersSupported()}
                            addMarker={() => controller.setMarker()} />
                    </ButtonContainer>
                </Content>
            </Spin>
        </LocaleProvider>
    );
};

PopupContent.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired,
    supportedProjections: PropTypes.array,
    showReverseGeoCodeCheckbox: PropTypes.bool
};

export const showCoordinatePopup = (state, controller, location, supportedProjections = [], showReverseGeoCodeCheckbox, onClose) => {
    const mapModule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
    const options = {
        ...OPTIONS,
        placement: location,
        theme: mapModule.getMapTheme()
    };
    const controls = showPopup(
        <Message bundleKey={BUNDLE_KEY} messageKey='display.popup.title' />,
        <PopupContent
            state={state}
            controller={controller}
            supportedProjections={supportedProjections}
            showReverseGeoCodeCheckbox={showReverseGeoCodeCheckbox}
        />,
        onClose, options
    );
    return {
        ...controls,
        update: (state) => {
            controls.update(
                <Message bundleKey={BUNDLE_KEY} messageKey='display.popup.title' />,
                <PopupContent
                    state={state}
                    controller={controller}
                    supportedProjections={supportedProjections}
                    showReverseGeoCodeCheckbox={showReverseGeoCodeCheckbox}
                />
            );
        }
    };
};
