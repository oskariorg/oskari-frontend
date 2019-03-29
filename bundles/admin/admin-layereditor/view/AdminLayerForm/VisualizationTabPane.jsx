import React from 'react';
import PropTypes from 'prop-types';
import {StyleSelect} from './StyleSelect';
import {Slider} from '../../components/Slider';
import {TextAreaInput} from '../../components/TextAreaInput';
import {Opacity} from '../../components/Opacity';
import {StyledTab, StyledComponent, StyledColumnLeft, StyledColumnRight} from './AdminLayerFormStyledComponents';
import {GenericContext} from '../../../../../src/react/util.jsx';

export const VisualizationTabPane = ({layer, service}) => {
    return (
        <GenericContext.Consumer>
            {value => {
                const loc = value.loc;
                return (
                    <StyledTab>
                        <StyledColumnLeft>
                            <label>{loc('opacity')}</label>
                            <StyledComponent>
                                <Opacity defaultValue={layer.opacity} onChange={(value) => service.setOpacity(value)} />
                            </StyledComponent>
                            <label>{loc('style')}</label>
                            <StyledComponent>
                                <StyleSelect styles={layer.styles} currentStyle={layer.style} service={service} />
                            </StyledComponent>
                            <label>{loc('styleJSON')}</label>
                            <StyledComponent>
                                <TextAreaInput rows={6} value={layer.styleJSON} onChange={(evt) => service.setStyleJSON(evt.target.value)} />
                            </StyledComponent>
                            <label>{loc('hoverJSON')}</label>
                            <StyledComponent>
                                <TextAreaInput rows={6} value={layer.hoverJSON} onChange={(evt) => service.setHoverJSON(evt.target.value)}/>
                            </StyledComponent>
                        </StyledColumnLeft>
                        <StyledColumnRight>
                            <label>{loc('minAndMaxScale')}</label>
                            <StyledComponent style={{height: 400, paddingBottom: 20, marginLeft: '25%'}}>
                                <Slider vertical range defaultValue={[layer.minScale, layer.maxScale]} min={0} max={100000000} onChange={(values) => service.setMinAndMaxScale(values)} />
                            </StyledComponent>
                        </StyledColumnRight>
                    </StyledTab>
                );
            }}
        </GenericContext.Consumer>

    );
};

VisualizationTabPane.propTypes = {
    layer: PropTypes.object,
    service: PropTypes.any,
    visualizationProps: PropTypes.any
};
