import React from 'react';
import PropTypes from 'prop-types';
import { StyleSelect } from './StyleSelect';
import { StyledTab, StyledComponent, StyledColumnLeft, StyledColumnRight } from './StyledFormComponents';
import { Slider, TextAreaInput, Opacity } from 'oskari-ui';
import { withLocale } from 'oskari-ui/util';
import styled from 'styled-components';

const VerticalComponent = styled(StyledComponent)`
    height: 400px;
    padding-bottom: 20px;
    margin-left: 25%;
`;

const VisualizationTabPane = (props) => {
    const { layer, service, getMessage } = props;
    return (
        <StyledTab>
            <StyledColumnLeft>
                <label>{getMessage('opacity')}</label>
                <StyledComponent>
                    <Opacity key={layer.id} defaultValue={layer.opacity} onChange={(value) => service.setOpacity(value)} />
                </StyledComponent>
                <label>{getMessage('style')}</label>
                <StyledComponent>
                    <StyleSelect styles={layer.styles} currentStyle={layer.style} service={service} />
                </StyledComponent>
                <label>{getMessage('styleJSON')}</label>
                <StyledComponent>
                    <TextAreaInput rows={6} value={layer.styleJSON} onChange={(evt) => service.setStyleJSON(evt.target.value)} />
                </StyledComponent>
                <label>{getMessage('hoverJSON')}</label>
                <StyledComponent>
                    <TextAreaInput rows={6} value={layer.hoverJSON} onChange={(evt) => service.setHoverJSON(evt.target.value)}/>
                </StyledComponent>
            </StyledColumnLeft>
            <StyledColumnRight>
                <label>{getMessage('minAndMaxScale')}</label>
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
    visualizationProps: PropTypes.any,
    getMessage: PropTypes.func
};

const contextWrap = withLocale(VisualizationTabPane);
export { contextWrap as VisualizationTabPane };
