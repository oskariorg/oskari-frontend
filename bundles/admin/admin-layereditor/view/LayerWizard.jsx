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
    if (typeof layer.layerName === 'undefined') {
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
    return (
        <div>
            { (layer.isNew || getStep(layer) !== WIZARD_STEP.DETAILS) &&
            <Steps current={getStep(layer)}>
                <Step title={ typeTitle } />
                <Step title={getMessage('wizard.service')} />
                <Step title={getMessage('wizard.layers')} />
                <Step title={getMessage('wizard.details')} />
            </Steps>
            }
            { getStep(layer) === WIZARD_STEP.INITIAL &&
                <LayerTypeSelection
                    types={layerTypes || []}
                    onSelect={(type) => mutator.setType(type)} />
            }
            { getStep(layer) === WIZARD_STEP.SERVICE &&
                <div>
                    <LayerURLForm
                        layer={layer}
                        loading={loading}
                        service={mutator} />
                    <hr/>
                    <Button onClick={() => setStep(mutator, WIZARD_STEP.INITIAL)}>{getMessage('cancel')}</Button>
                </div>
            }
            { getStep(layer) === WIZARD_STEP.LAYER &&
                <div>
                    <LayerCapabilitiesListing
                        onSelect={(item) => mutator.layerSelected(item.layerName)}
                        capabilities={capabilities} />
                    <hr/>
                    <Button onClick={() => setStep(mutator, WIZARD_STEP.SERVICE)}>{getMessage('cancel')}</Button>
                </div>
            }
            { getStep(layer) === WIZARD_STEP.DETAILS &&
                <div>
                    {children}
                    { layer.isNew &&
                        <Button onClick={() => setStep(mutator, WIZARD_STEP.LAYER)}>{getMessage('cancel')}</Button>
                    }
                </div>
            }
        </div>
    );
};

LayerWizard.propTypes = {
    layer: PropTypes.object.isRequired,
    mutator: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    capabilities: PropTypes.array,
    layerTypes: PropTypes.array,
    getMessage: PropTypes.func,
    children: PropTypes.any
};

const contextWrap = withMutator(withLocale(LayerWizard));
export { contextWrap as LayerWizard };
