import React from 'react';
import PropTypes from 'prop-types';
import { StyleSelect } from './StyleSelect';
import { Slider } from '../components/Slider';
import { TextAreaInput } from '../components/TextAreaInput';
import { Opacity } from '../components/Opacity';
import { StyledTab, StyledComponent, StyledColumnLeft, StyledColumnRight } from './AdminLayerFormStyledComponents';

export const VisualizationTabPane = ({layer, service}) => {
    return (
        <StyledTab>
            <StyledColumnLeft>
                <label>Opacity</label>
                <StyledComponent>
                    <Opacity defaultValue={layer.opacity} onChange={(value) => service.setOpacity(value)} />
                </StyledComponent>
                <label>Default style</label>
                <StyledComponent>
                    <StyleSelect styles={layer.styles} defaultStyle={layer.defaultStyle} />
                </StyledComponent>
                <label>Style JSON</label>
                <StyledComponent>
                    <TextAreaInput rows={6} value={layer.styleJSON} onChange={(evt) => service.setStyleJSON(evt.target.value)} />
                </StyledComponent>
                <label>Hover JSON</label>
                <StyledComponent>
                    <TextAreaInput rows={6} value={layer.hoverJSON} onChange={(evt) => service.setHoverJSON(evt.target.value)}/>
                </StyledComponent>
            </StyledColumnLeft>
            <StyledColumnRight>
                <label>Min and max scale</label>
                <StyledComponent style={{height: 400, paddingBottom: 20, marginLeft: '25%'}}>
                    <Slider vertical range defaultValue={[layer.minScale, layer.maxScale]} min={0} max={1000000} onChange={(values) => service.setMinAndMaxScale(values)} />
                </StyledComponent>
            </StyledColumnRight>
        </StyledTab>
    );
};

VisualizationTabPane.propTypes = {
    layer: PropTypes.object,
    service: PropTypes.any,
    visualizationProps: PropTypes.any
};
