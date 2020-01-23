import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Step, Button, Message } from 'oskari-ui';
import { LayerTypeSelection } from './LayerTypeSelection';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { LayerCapabilitiesListing } from './LayerCapabilitiesListing';
import { ServiceStep } from './ServiceStep';
import { LoadingIndicator } from './LoadingIndicator';
import { LayerTypeTitle } from './LayerTypeTitle';
import { StyledAlert, StyledSteps, Paragraph, Header } from './styled';

const { CAPABILITIES } = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

const WIZARD_STEP = {
    INITIAL: 0,
    SERVICE: 1,
    LAYER: 2,
    DETAILS: 3
};

function setStep (controller, requested, hasCapabilitiesSupport) {
    switch (requested) {
    case WIZARD_STEP.INITIAL:
        controller.setType();
        break;
    case WIZARD_STEP.SERVICE:
        controller.setVersion();
        break;
    case WIZARD_STEP.LAYER:
        controller.setLayerName();
        if (!hasCapabilitiesSupport) {
            controller.setVersion();
        }
        break;
    }
}

function getStep (layer, hasCapabilitiesSupport) {
    if (typeof layer.type === 'undefined') {
        return WIZARD_STEP.INITIAL;
    }
    if (typeof layer.version === 'undefined') {
        return WIZARD_STEP.SERVICE;
    }
    if (typeof layer.name === 'undefined' && hasCapabilitiesSupport) {
        return WIZARD_STEP.LAYER;
    }
    return WIZARD_STEP.DETAILS;
}

const LayerWizard = ({
    controller,
    layer,
    capabilities = {},
    propertyFields = [],
    layerTypes = [],
    loading,
    children,
    versions,
    messages = [],
    credentialsCollapseOpen,
    onCancel
}) => {
    const hasCapabilitiesSupport = propertyFields.includes(CAPABILITIES);
    const currentStep = getStep(layer, hasCapabilitiesSupport);
    const isFirstStep = currentStep === WIZARD_STEP.INITIAL;
    const isDetailsForOldLayer = !layer.isNew && currentStep === WIZARD_STEP.DETAILS;
    return (
        <Fragment>
            { messages.map(({ key, type }) => <StyledAlert key={key} message={<Message messageKey={key} />} type={type} />) }
            <LoadingIndicator loading={loading}>
                { (layer.isNew || currentStep !== WIZARD_STEP.DETAILS) &&
                    <StyledSteps current={currentStep}>
                        <Step title={<LayerTypeTitle layer={layer}/>} />
                        <Step title={<Message messageKey='wizard.service'/>} />
                        <Step title={<Message messageKey='wizard.layers'/>} />
                        <Step title={<Message messageKey='wizard.details'/>} />
                    </StyledSteps>
                }
                { currentStep === WIZARD_STEP.INITIAL &&
                    <Fragment>
                        <LayerTypeTitle layer={layer} LabelComponent={Header}/>
                        <Message messageKey='wizard.typeDescription' LabelComponent={Paragraph}/>
                        <LayerTypeSelection
                            types={layerTypes || []}
                            onSelect={(type) => controller.setType(type)} />
                    </Fragment>
                }
                { currentStep === WIZARD_STEP.SERVICE &&
                    <ServiceStep
                        layer={layer}
                        controller={controller}
                        propertyFields={propertyFields}
                        versions={versions}
                        credentialsCollapseOpen={credentialsCollapseOpen} />
                }
                { currentStep === WIZARD_STEP.LAYER &&
                    <Fragment>
                        <Message messageKey='wizard.layers' LabelComponent={Header}/>
                        <Message messageKey='wizard.layersDescription' LabelComponent={Paragraph}/>
                        <LayerCapabilitiesListing
                            onSelect={(item) => controller.layerSelected(item.name)}
                            capabilities={capabilities} />
                    </Fragment>
                }
                { currentStep === WIZARD_STEP.DETAILS &&
                    <Fragment>
                        {children}
                    </Fragment>
                }
                { !isFirstStep && !isDetailsForOldLayer &&
                    <Button onClick={() => {
                        setStep(controller, getStep(layer) - 1, hasCapabilitiesSupport);
                        onCancel();
                    }}>
                        {<Message messageKey='cancel'/>}
                    </Button>
                }
            </LoadingIndicator>
        </Fragment>
    );
};

LayerWizard.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    loading: PropTypes.bool,
    capabilities: PropTypes.object,
    propertyFields: PropTypes.array,
    layerTypes: PropTypes.array,
    children: PropTypes.any,
    versions: PropTypes.array.isRequired,
    messages: PropTypes.array,
    credentialsCollapseOpen: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired
};

const contextWrap = LocaleConsumer(LayerWizard);
export { contextWrap as LayerWizard };
