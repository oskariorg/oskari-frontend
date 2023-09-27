import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { showPopup } from 'oskari-ui/components/window';
import { FeatureFilter, Message, Button } from 'oskari-ui/';
import { SecondaryButton } from 'oskari-ui/components/buttons';
import { FEATUREDATA_BUNDLE_ID } from './FeatureDataContainer';
import { FilterTwoTone } from '@ant-design/icons';

const Funnel = styled('div')`
    margin-left: auto;
`;

const ButtonsContainer = styled('div')`
    display: flex;
    padding: 0 .5em .5em .5em;
    justify-content: center;
    margin-top: 1em;
`;

const StyledButton = styled(Button)`
    margin: 0 .5em 0 .5em
`;

const StyledSecondaryButton = styled(SecondaryButton)`
    margin: 0 .5em 0 .5em
`;

const Buttons = (props) => {
    const { closeSelectByPropertiesPopup, resetFilter, applyFilter, hasErrors } = props;
    return <ButtonsContainer>
        <StyledSecondaryButton type='cancel' onClick={() => { closeSelectByPropertiesPopup(); }} />
        <StyledSecondaryButton type='reset' onClick={() => { resetFilter(); }}/>
        <StyledButton type='primary' disabled={hasErrors} onClick={() => { applyFilter(); }}>
            <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'selectByPropertiesPopup.buttons.refresh'}/>
        </StyledButton>
    </ButtonsContainer>;
};

Buttons.propTypes = {
    resetFilter: PropTypes.func,
    closeSelectByPropertiesPopup: PropTypes.func,
    applyFilter: PropTypes.func,
    hasErrors: PropTypes.bool
};

const Container = styled('div')`
    padding: 1em;
    min-width: 25vw;
`;

export const SelectByPropertiesPopup = (props) => {
    const { columnNames, featureProperties, updateFilter, resetFilter, applyFilter, filter, labels, closeSelectByPropertiesPopup } = props;
    return (
        <Container>
            <FeatureFilter onChange={updateFilter}
                properties={columnNames}
                filter={filter || {}}
                labels={labels}
                types={featureProperties}
                disableMultipleMode={true}
            />
            <Buttons closeSelectByPropertiesPopup={closeSelectByPropertiesPopup} resetFilter={resetFilter} applyFilter={applyFilter}/>
        </Container>
    );
};

SelectByPropertiesPopup.propTypes = {
    featureProperties: PropTypes.array,
    columnNames: PropTypes.arrayOf(PropTypes.string),
    labels: PropTypes.object,
    filter: PropTypes.object,
    updateFilter: PropTypes.func,
    closeSelectByPropertiesPopup: PropTypes.func,
    resetFilter: PropTypes.func,
    applyFilter: PropTypes.func
};

export const SelectByPropertiesFunnel = (props) => {
    const { openSelectByPropertiesPopup } = props;
    return props.active ? <Funnel onClick={() => openSelectByPropertiesPopup()}><FilterTwoTone /></Funnel> : <></>;
};

SelectByPropertiesFunnel.propTypes = {
    active: PropTypes.bool,
    openSelectByPropertiesPopup: PropTypes.func
};

const getActiveLayerName = (activeLayerId, layers) => {
    if (!activeLayerId || !layers?.length > 0) {
        return '';
    }

    return layers.find((layer) => layer.getId() === activeLayerId).getName() || null;
};

export const showSelectByPropertiesPopup = (state, controller) => {
    const { activeLayerId, layers, selectByPropertiesFilter, selectByPropertiesFeatureTypes, visibleColumnsSettings } = state;
    const content = <SelectByPropertiesPopup
        featureProperties= { selectByPropertiesFeatureTypes }
        columnNames={ visibleColumnsSettings.allColumns }
        labels={visibleColumnsSettings.activeLayerPropertyLabels}
        filter={selectByPropertiesFilter}
        updateFilter={controller.updateFilter}
        resetFilter={controller.resetFilter}
        applyFilter={controller.applyFilter}
        closeSelectByPropertiesPopup={controller.closeSelectByPropertiesPopup}
    />;

    const title = <><Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'selectByPropertiesPopup.title'}/> {getActiveLayerName(activeLayerId, layers) || ''}</>;
    const controls = showPopup(title, content, () => { controller.closeSelectByPropertiesPopup(); }, {});

    return {
        ...controls,
        update: (state) => {
            const { selectByPropertiesFilter, selectByPropertiesFeatureTypes, visibleColumnsSettings } = state;
            controls.update(title,
                <SelectByPropertiesPopup
                    featureProperties= { selectByPropertiesFeatureTypes }
                    columnNames={ visibleColumnsSettings.allColumns }
                    labels={visibleColumnsSettings.activeLayerPropertyLabels}
                    filter={selectByPropertiesFilter}
                    updateFilter={controller.updateFilter}
                    resetFilter={controller.resetFilter}
                    applyFilter={controller.applyFilter}
                    closeSelectByPropertiesPopup={controller.closeSelectByPropertiesPopup}
                />);
        }
    };
};
