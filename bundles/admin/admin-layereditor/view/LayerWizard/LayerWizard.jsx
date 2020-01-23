import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Steps, Step, Button, Message, Alert, Spin } from 'oskari-ui';
import { LayerTypeSelection } from './LayerTypeSelection';
import { LayerURLForm } from './LayerURLForm';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { LayerCapabilitiesListing } from './LayerCapabilitiesListing';
import styled from 'styled-components';

const { CAPABILITIES } = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

const PaddedAlert = styled(Alert)`
    margin-bottom: 5px;
`;

const PaddedStepsDiv = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
`;

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

const LayerTypeTitle = ({ layer, LabelComponent }) => (
    <React.Fragment>
        <Message messageKey='wizard.type' LabelComponent={LabelComponent} />
        { layer.type && <React.Fragment><span>:</span><div>{layer.type}</div></React.Fragment>}
    </React.Fragment>
);
LayerTypeTitle.propTypes = {
    layer: PropTypes.object.isRequired,
    LabelComponent: PropTypes.elementType
};

const Loading = ({ loading, children }) => {
    if (loading) {
        return <Spin>{children}</Spin>;
    }
    return children;
};
Loading.propTypes = {
    loading: PropTypes.bool,
    children: PropTypes.node
};

const Header = styled('h4')``;
const Paragraph = styled('p')``;

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
            { messages.map(({ key, type }) => <PaddedAlert key={key} message={<Message messageKey={key} />} type={type} />) }
            <Loading loading={loading}>
                <PaddedStepsDiv>
                    { (layer.isNew || currentStep !== WIZARD_STEP.DETAILS) &&
                    <Steps current={currentStep}>
                        <Step title={<LayerTypeTitle layer={layer}/>} />
                        <Step title={<Message messageKey='wizard.service'/>} />
                        <Step title={<Message messageKey='wizard.layers'/>} />
                        <Step title={<Message messageKey='wizard.details'/>} />
                    </Steps>
                    }
                </PaddedStepsDiv>
                { currentStep === WIZARD_STEP.INITIAL &&
                    <React.Fragment>
                        <LayerTypeTitle layer={layer} LabelComponent={Header}/>
                        <Message messageKey='wizard.typeDescription' LabelComponent={Paragraph}/>
                        <LayerTypeSelection
                            types={layerTypes || []}
                            onSelect={(type) => controller.setType(type)} />
                    </React.Fragment>
                }
                { currentStep === WIZARD_STEP.SERVICE &&
                    <React.Fragment>
                        <Message messageKey='wizard.service' LabelComponent={Header}/>
                        <Message messageKey='wizard.serviceDescription' LabelComponent={Paragraph}/>
                        <LayerURLForm
                            layer={layer}
                            loading={loading}
                            controller={controller}
                            versions= {versions}
                            credentialsCollapseOpen = {credentialsCollapseOpen}/>
                    </React.Fragment>
                }
                { currentStep === WIZARD_STEP.LAYER &&
                    <React.Fragment>
                        <Message messageKey='wizard.layers' LabelComponent={Header}/>
                        <Message messageKey='wizard.layersDescription' LabelComponent={Paragraph}/>
                        <LayerCapabilitiesListing
                            onSelect={(item) => controller.layerSelected(item.name)}
                            capabilities={capabilities} />
                    </React.Fragment>
                }
                { currentStep === WIZARD_STEP.DETAILS &&
                    <React.Fragment>
                        {children}
                    </React.Fragment>
                }
                { !isFirstStep && !isDetailsForOldLayer &&
                    <Button onClick={() => {
                        setStep(controller, getStep(layer) - 1, hasCapabilitiesSupport);
                        onCancel();
                    }}>
                        {<Message messageKey='cancel'/>}
                    </Button>
                }
            </Loading>
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
