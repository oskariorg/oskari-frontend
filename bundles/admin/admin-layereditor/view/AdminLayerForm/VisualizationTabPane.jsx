import React from 'react';
import PropTypes from 'prop-types';
import { StyleSelect } from './StyleSelect';
import { StyledTab, StyledComponent, StyledColumnLeft, StyledColumnRight } from './StyledFormComponents';
import { Slider, TextAreaInput, Opacity, Message } from 'oskari-ui';
import { withLocale } from 'oskari-ui/util';
import styled from 'styled-components';

const VerticalComponent = styled(StyledComponent)`
    height: 400px;
    padding-bottom: 20px;
    margin-left: 25%;
`;

const VisualizationTabPane = (props) => {
    const { layer, service } = props;
    return (
        <StyledTab>
            <StyledColumnLeft>
                <Message messageKey='opacity'/>
                <StyledComponent>
                    <Opacity key={layer.id} defaultValue={layer.opacity} onChange={(value) => service.setOpacity(value)} />
                </StyledComponent>
                <Message messageKey='style'/>
                <StyledComponent>
                    <StyleSelect styles={layer.styles} currentStyle={layer.style} service={service} />
                </StyledComponent>
                <Message messageKey='styleJSON'/>
                <StyledComponent>
                    <TextAreaInput rows={6} value={layer.styleJSON} onChange={(evt) => service.setStyleJSON(evt.target.value)} />
                </StyledComponent>
                <Message messageKey='hoverJSON'/>
                <StyledComponent>
                    <TextAreaInput rows={6} value={layer.hoverJSON} onChange={(evt) => service.setHoverJSON(evt.target.value)}/>
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
                        onChange={(values) => service.setMinAndMaxScale(values)} />
                </VerticalComponent>
            </StyledColumnRight>
        </StyledTab>
    );
};

VisualizationTabPane.propTypes = {
    layer: PropTypes.object,
    service: PropTypes.any,
    visualizationProps: PropTypes.any
};

const contextWrap = withLocale(VisualizationTabPane);
export { contextWrap as VisualizationTabPane };
