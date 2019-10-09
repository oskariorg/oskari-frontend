import React from 'react';
import PropTypes from 'prop-types';
import { Steps, Step, Button } from 'oskari-ui';
import { LayerTypeSelection } from './LayerWizard/LayerTypeSelection';
import { LayerURLForm } from './LayerWizard/LayerURLForm';
import { withLocale, withMutator } from 'oskari-ui/util';
import { LayerCapabilitiesListing } from './LayerWizard/LayerCapabilitiesListing';

function setStep (mutator, requested) {
    switch (requested) {
    case 0:
        mutator.setType();
        break;
    case 1:
        mutator.setVersion();
        break;
    case 2:
        mutator.setLayerName();
        break;
    }
}

function getStep (layer) {
    if (typeof layer.type === 'undefined') {
        return 0;
    }
    if (typeof layer.version === 'undefined') {
        return 1;
    }
    if (typeof layer.layerName === 'undefined') {
        return 2;
    }
    return 3;
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
    let typeTitle = 'Layer type';
    if (layer.type) {
        typeTitle = `${typeTitle}: ${layer.type}`;
    }
    return (
        <div>
            { getStep(layer) !== 3 &&
            <Steps current={getStep(layer)}>
                <Step title={ typeTitle } />
                <Step title="Service" />
                <Step title="Layers" />
                <Step title="Details" />
            </Steps>
            }
            { getStep(layer) === 0 &&
                <LayerTypeSelection
                    types={layerTypes || []}
                    onSelect={(type) => mutator.setType(type)} />
            }
            { getStep(layer) === 1 &&
                <div>
                    <LayerURLForm
                        layer={layer}
                        loading={loading}
                        service={mutator} />
                    <hr/>
                    <Button onClick={() => setStep(mutator, 0)}>Back</Button>
                </div>
            }
            { getStep(layer) === 2 &&
                <div>
                    <LayerCapabilitiesListing
                        onSelect={(item) => mutator.setName(item.name)}
                        capabilities={capabilities} />
                    <hr/>
                    <Button onClick={() => setStep(mutator, 1)}>Back</Button>
                </div>
            }
            { getStep(layer) === 3 &&
                <div>
                    {children}
                    <Button onClick={() => setStep(mutator, 2)}>Back</Button>
                </div>
            }
        </div>
    );
}

LayerWizard.propTypes = {
    layer: PropTypes.object.isRequired,
    mutator: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    capabilities: PropTypes.array,
    layerTypes: PropTypes.array,
    children: PropTypes.any
};

const contextWrap = withMutator(withLocale(LayerWizard));
export { contextWrap as LayerWizard };
