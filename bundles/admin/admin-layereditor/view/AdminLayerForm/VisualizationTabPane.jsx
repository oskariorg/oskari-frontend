import React from 'react';
import PropTypes from 'prop-types';
import { StyleSelect } from './StyleSelect';
import { StyledTab, StyledComponent, StyledColumnLeft, StyledColumnRight } from './StyledFormComponents';
import { Slider, TextAreaInput, Opacity, Message } from 'oskari-ui';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import styled from 'styled-components';

const VerticalComponent = styled(StyledComponent)`
    height: 400px;
    padding-bottom: 20px;
    margin-left: 25%;
`;

const VisualizationTabPane = (props) => {
    const { layer, controller } = props;
    return (
        <StyledTab>
            <StyledColumnLeft>
                <Message messageKey='opacity'/>
                <StyledComponent>
                    <Opacity key={layer.id} defaultValue={layer.opacity} onChange={(value) => controller.setOpacity(value)} />
                </StyledComponent>
                <Message messageKey='style'/>
                <StyledComponent>
                    <StyleSelect styles={layer.styles} currentStyle={layer.style} controller={controller} />
                </StyledComponent>
                <Message messageKey='styleJSON'/>
                <StyledComponent>
                    <TextAreaInput rows={6} value={layer.styleJSON} onChange={(evt) => controller.setStyleJSON(evt.target.value)} />
                </StyledComponent>
                <Message messageKey='hoverJSON'/>
                <StyledComponent>
                    <TextAreaInput rows={6} value={layer.hoverJSON} onChange={(evt) => controller.setHoverJSON(evt.target.value)}/>
                </StyledComponent>
            </StyledColumnLeft>
            <StyledColumnRight>
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
            </StyledColumnRight>
        </StyledTab>
    );
};

VisualizationTabPane.propTypes = {
    layer: PropTypes.object,
    controller: PropTypes.instanceOf(Controller).isRequired,
    visualizationProps: PropTypes.any
};

const contextWrap = LocaleConsumer(VisualizationTabPane);
export { contextWrap as VisualizationTabPane };
