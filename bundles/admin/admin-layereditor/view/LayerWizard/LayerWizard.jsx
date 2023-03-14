import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Message } from 'oskari-ui';
import { LayerTypeSelection } from './LayerTypeSelection';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { LayerCapabilitiesListing } from './LayerCapabilitiesListing';
import { ServiceStep } from './ServiceStep';
import { LoadingIndicator } from './LoadingIndicator';
import { StyledSteps, Paragraph, Header } from './styled';

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
        controller.versionSelected();
        break;
    case WIZARD_STEP.LAYER:
        controller.setLayerName();
        if (!hasCapabilitiesSupport) {
            controller.versionSelected();
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
    credentialsCollapseOpen,
    onCancel
}) => {
    const hasCapabilitiesSupport = propertyFields.includes(CAPABILITIES);
    // For manual adding of layers/skipping capabilities and returning properly from layer details to service endpoint
    const hasCapabilitiesFetched = !!Object.keys(capabilities).length;
    const currentStep = getStep(layer, hasCapabilitiesSupport);
    const isFirstStep = currentStep === WIZARD_STEP.INITIAL;
    const isDetailsForOldLayer = !layer.isNew && currentStep === WIZARD_STEP.DETAILS;
    return (
        <Fragment>
            <LoadingIndicator loading={loading}>
                { (layer.isNew || currentStep !== WIZARD_STEP.DETAILS) &&
                    <StyledSteps
                        current={currentStep}
                        items={[
                            { title: <Message messageKey='wizard.type'/> },
                            { title: <Message messageKey='wizard.service'/> },
                            { title: <Message messageKey='wizard.layers'/> },
                            { title: <Message messageKey='wizard.details'/> },
                        ]}
                    />
                }
                { currentStep === WIZARD_STEP.INITIAL &&
                    <Fragment>
                        <Message messageKey='wizard.type' LabelComponent={Header}/>
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
                        loading={loading}
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
                        setStep(controller, currentStep - 1, hasCapabilitiesFetched && hasCapabilitiesSupport);
                        onCancel();
                    }}>
                        {<Message messageKey='backToPrevious'/>}
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
    credentialsCollapseOpen: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired
};

const contextWrap = LocaleConsumer(LayerWizard);
export { contextWrap as LayerWizard };
