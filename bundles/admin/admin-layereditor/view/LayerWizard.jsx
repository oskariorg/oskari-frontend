import React from 'react';
import styled from 'styled-components';
import { Steps, Step } from '../components/Steps';
import { LayerTypeSelection } from './LayerTypeSelection';
import { LayerURLForm } from './LayerURLForm';
import { LayerDetails } from './LayerDetails';
import { Button } from '../components/Button';

export class LayerWizard extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            wizardStep: 0
        };
        this.layerTypes = ['WFS'];
    }
    setStep (requested) {
        this.setState((state) => {
            return {
                ...state,
                wizardStep: requested
            };
        });
    }
    setLayerType (type) {
        this.setState((state) => {
            return {
                wizardStep: 1,
                layerType: type
            };
        });
    }
    showLayerForm (layer) {
        this.setState((state) => {
            layer.type = state.layerType;

            return {
                ...state,
                wizardStep: 2,
                layer
            };
        });
    }
    isStep (input) {
        return this.state.wizardStep === input;
    }
    render () {
        const StyledRootEl = styled('div')`
            margin: 10px;
            padding: 10px;
        `;
        let typeTitle = 'Layer type';
        if (this.state.layerType) {
            typeTitle = `${typeTitle}: ${this.state.layerType}`;
        }
        return (
            <StyledRootEl>
                <Steps current={this.state.wizardStep}>
                    <Step title={typeTitle} />
                    <Step title="URL" />
                    <Step title="Details" />
                </Steps>
                { this.isStep(0) &&
                    <LayerTypeSelection
                        types={this.layerTypes}
                        onSelect={(value) => this.setLayerType(value)} />
                }
                { this.isStep(1) &&
                    <div>
                        <LayerURLForm
                            type={this.state.layerType}
                            onSuccess={(layerInfo) => this.showLayerForm(layerInfo)} />
                        <hr/>
                        <Button onClick={() => this.setStep(0)}>Back</Button>
                    </div>
                }
                { this.isStep(2) &&
                    <div>
                        <LayerDetails
                            layer={this.state.layer} />
                        <hr/>
                        <Button onClick={() => this.setStep(1)}>Back</Button>
                    </div>
                }
            </StyledRootEl>
        );
    }
}
