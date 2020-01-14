import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { StyleSelect } from './StyleSelect';
import { StyledTab, StyledComponent, StyledColumnLeft, StyledColumnRight } from './StyledFormComponents';
import { Slider, TextAreaInput, Opacity, Message } from 'oskari-ui';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { InfoTooltip } from './InfoTooltip';
import styled from 'styled-components';

const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');
const VerticalComponent = styled(StyledComponent)`
    height: 400px;
    padding-bottom: 20px;
    margin-left: 25%;
`;

const VisualizationTabPane = ({ layer, propertyFields, controller }) => {
    const opacityInput =
        <Fragment>
            <Message messageKey='opacity'/>
            <StyledComponent>
                <Opacity key={layer.id} defaultValue={layer.opacity} onChange={(value) => controller.setOpacity(value)} />
            </StyledComponent>
        </Fragment>;

    const styleInfoKeys = propertyFields.includes(LayerComposingModel.CAPABILITIES_STYLE)
        ? ['styleDesc', 'styleDescCapabilities'] : 'styleDesc';
    const styleSelect =
        <Fragment>
            <Message messageKey='style'/>
            <InfoTooltip messageKeys={styleInfoKeys} />
            <StyledComponent>
                <StyleSelect styles={layer.styles} currentStyle={layer.style} controller={controller} />
            </StyledComponent>
        </Fragment>;

    const styleInput =
        <Fragment>
            <Message messageKey='styleJSON'/>
            <StyledComponent>
                <TextAreaInput rows={6} value={layer.styleJSON} onChange={(evt) => controller.setStyleJSON(evt.target.value)} />
            </StyledComponent>
        </Fragment>;

    const hoverInput =
        <Fragment>
            <Message messageKey='hoverJSON'/>
            <StyledComponent>
                <TextAreaInput rows={6} value={layer.hoverJSON} onChange={(evt) => controller.setHoverJSON(evt.target.value)}/>
            </StyledComponent>
        </Fragment>;

    const scaleInput =
        <Fragment>
            <Message messageKey='minAndMaxScale'/>
            <VerticalComponent>
                <Slider key={layer.id}
                    vertical
                    range
                    defaultValue={[layer.minscale, layer.maxscale]}
                    min={0}
                    max={100000000}
                    onChange={(values) => controller.setMinAndMaxScale(values)} />
            </VerticalComponent>
        </Fragment>;

    return (
        <StyledTab>
            <StyledColumnLeft>
                { propertyFields.includes(LayerComposingModel.OPACITY) && opacityInput }
                { propertyFields.includes(LayerComposingModel.STYLE) && styleSelect }
                { propertyFields.includes(LayerComposingModel.STYLE_JSON) && styleInput }
                { propertyFields.includes(LayerComposingModel.HOVER_JSON) && hoverInput }
            </StyledColumnLeft>
            <StyledColumnRight>
                { propertyFields.includes(LayerComposingModel.SCALE) && scaleInput }
            </StyledColumnRight>
        </StyledTab>
    );
};

VisualizationTabPane.propTypes = {
    layer: PropTypes.object,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    visualizationProps: PropTypes.any
};

const contextWrap = LocaleConsumer(VisualizationTabPane);
export { contextWrap as VisualizationTabPane };
