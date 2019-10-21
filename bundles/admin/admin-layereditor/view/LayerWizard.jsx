import React from 'react';
import PropTypes from 'prop-types';
import { Steps, Step, Button } from 'oskari-ui';
import { LayerTypeSelection } from './LayerWizard/LayerTypeSelection';
import { LayerURLForm } from './LayerWizard/LayerURLForm';
import { withLocale, withMutator } from 'oskari-ui/util';
import { LayerCapabilitiesListing } from './LayerWizard/LayerCapabilitiesListing';

const WIZARD_STEP = {
    INITIAL: 0,
    SERVICE: 1,
    LAYER: 2,
    DETAILS: 3
};

function setStep (mutator, requested) {
    switch (requested) {
    case WIZARD_STEP.INITIAL:
        mutator.setType();
        break;
    case WIZARD_STEP.SERVICE:
        mutator.setVersion();
        break;
    case WIZARD_STEP.LAYER:
        mutator.setLayerName();
        break;
    }
}

function getStep (layer) {
    if (typeof layer.type === 'undefined') {
        return WIZARD_STEP.INITIAL;
    }
    if (typeof layer.version === 'undefined') {
        return WIZARD_STEP.SERVICE;
    }
    if (typeof layer.name === 'undefined') {
        return WIZARD_STEP.LAYER;
    }
    return WIZARD_STEP.DETAILS;
}

const LayerWizard = ({
    mutator,
    layer,
    capabilities = [],
    layerTypes = [],
    loading,
    children,
    getMessage
}) => {
    let typeTitle = getMessage('wizard.type');
    if (layer.type) {
        typeTitle = `${typeTitle}: ${layer.type}`;
    }
    const currentStep = getStep(layer);
    const isFirstStep = currentStep === WIZARD_STEP.INITIAL;
    const isDetailsForOldLayer = !layer.isNew && currentStep === WIZARD_STEP.DETAILS;
    return (
        <div>
            { (layer.isNew || currentStep !== WIZARD_STEP.DETAILS) &&
            <Steps current={currentStep}>
                <Step title={ typeTitle } />
                <Step title={getMessage('wizard.service')} />
                <Step title={getMessage('wizard.layers')} />
                <Step title={getMessage('wizard.details')} />
            </Steps>
            }
            { currentStep === WIZARD_STEP.INITIAL &&
                <React.Fragment>
                    <h4>{typeTitle}</h4>
                    <p>{getMessage('wizard.typeDescription')}</p>
                    <LayerTypeSelection
                        types={layerTypes || []}
                        onSelect={(type) => mutator.setType(type)} />
                </React.Fragment>
            }
            { currentStep === WIZARD_STEP.SERVICE &&
                <React.Fragment>
                    <h4>{getMessage('wizard.service')}</h4>
                    <p>{getMessage('wizard.serviceDescription')}</p>
                    <LayerURLForm
                        layer={layer}
                        loading={loading}
                        service={mutator} />
                </React.Fragment>
            }
            { currentStep === WIZARD_STEP.LAYER &&
                <React.Fragment>
                    <h4>{getMessage('wizard.layers')}</h4>
                    <p>{getMessage('wizard.layersDescription')}</p>
                    <LayerCapabilitiesListing
                        onSelect={(item) => mutator.layerSelected(item.name)}
                        capabilities={capabilities} />
                </React.Fragment>
            }
            { currentStep === WIZARD_STEP.DETAILS &&
                <React.Fragment>
                    {children}
                </React.Fragment>
            }
            { !isFirstStep && !isDetailsForOldLayer &&
                <Button onClick={() => setStep(mutator, getStep(layer) - 1)}>{getMessage('cancel')}</Button>
            }
        </div>
    );
};

LayerWizard.propTypes = {
    layer: PropTypes.object.isRequired,
    mutator: PropTypes.object.isRequired,
    getMessage: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    capabilities: PropTypes.object,
    layerTypes: PropTypes.array,
    children: PropTypes.any
};

const contextWrap = withMutator(withLocale(LayerWizard));
export { contextWrap as LayerWizard };
