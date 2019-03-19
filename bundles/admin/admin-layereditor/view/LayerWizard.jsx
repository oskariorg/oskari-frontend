import React from 'react';
import styled from 'styled-components';
import { Steps, Step } from '../components/Steps';
import { LayerTypeSelection } from './LayerWizard/LayerTypeSelection';
import { LayerURLForm } from './LayerWizard/LayerURLForm';
import { LayerDetails } from './LayerWizard/LayerDetails';
import { LayerCapabilitiesListing } from './LayerWizard/LayerCapabilitiesListing';
import { Button } from '../components/Button';
import { StateHandler } from './LayerWizard/StateHandler';

const StyledRootEl = styled('div')`
margin: 10px;
padding: 10px;
`;

export class LayerWizard extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
        this.service = new StateHandler(() => this.setState({ layer: this.service.getLayer() }));
    }
    setStep (requested) {
        switch (requested) {
        case 0:
            this.service.getMutator().setType();
            break;
        case 1:
            this.service.getMutator().setVersion();
            break;
        case 2:
            this.service.getMutator().setName();
            break;
        }
    }
    getStep () {
        if (!this.service.hasType()) {
            return 0;
        }
        if (!this.service.hasVersion()) {
            return 1;
        }
        if (!this.service.getLayer().name) {
            return 2;
        }
        return 3;
    }
    isStep (input) {
        return this.getStep() === input;
    }
    render () {
        const layer = this.state.layer || {};
        const service = this.service;
        let typeTitle = 'Layer type';
        if (layer.type) {
            typeTitle = `${typeTitle}: ${layer.type}`;
        }
        const mutator = service.getMutator();
        return (
            <StyledRootEl>
                <Steps current={this.getStep()}>
                    <Step title={typeTitle} />
                    <Step title="Service" />
                    <Step title="Layers" />
                    <Step title="Details" />
                </Steps>
                { this.isStep(0) &&
                    <LayerTypeSelection
                        types={service.getLayerTypes()}
                        onSelect={(type) => mutator.setType(type)} />
                }
                { this.isStep(1) &&
                    <div>
                        <LayerURLForm
                            layer={layer}
                            loading={service.isLoading()}
                            service={mutator} />
                        <hr/>
                        <Button onClick={() => this.setStep(0)}>Back</Button>
                    </div>
                }
                { this.isStep(2) &&
                    <div>
                        <LayerCapabilitiesListing
                            onSelect={(item) => mutator.setName(item.name)}
                            capabilities={service.getCapabilities()} />
                        <hr/>
                        <Button onClick={() => this.setStep(1)}>Back</Button>
                    </div>
                }
                { this.isStep(3) &&
                    <div>
                        <LayerDetails
                            layer={layer} />
                        <hr/>
                        <Button onClick={() => this.setStep(2)}>Back</Button>
                    </div>
                }
            </StyledRootEl>
        );
    }
}
