import React from 'react';
import PropTypes from 'prop-types';
import { StyledTab, StyledColumnLeft, StyledColumnRight } from '../StyledFormComponents';
import { Controller } from 'oskari-ui/util';
import { Opacity } from './Opacity';
import { Style } from './Style';
import { StyleJson } from './StyleJson';
import { HoverJson } from './HoverJson';
import { Scale } from './Scale';

const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

export const VisualizationTabPane = ({ layer, propertyFields, controller }) => (
    <StyledTab>
        <StyledColumnLeft>
            { propertyFields.includes(LayerComposingModel.OPACITY) &&
                <Opacity layer={layer} controller={controller} />
            }
            { propertyFields.includes(LayerComposingModel.STYLE) &&
                <Style layer={layer} controller={controller} propertyFields={propertyFields} />
            }
            { propertyFields.includes(LayerComposingModel.STYLE_JSON) &&
                <StyleJson layer={layer} controller={controller} />
            }
            { propertyFields.includes(LayerComposingModel.HOVER_JSON) &&
                <HoverJson layer={layer} controller={controller} />
            }
        </StyledColumnLeft>
        <StyledColumnRight>
            { propertyFields.includes(LayerComposingModel.SCALE) &&
                <Scale layer={layer} controller={controller} />
            }
        </StyledColumnRight>
    </StyledTab>
);

VisualizationTabPane.propTypes = {
    layer: PropTypes.object,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    visualizationProps: PropTypes.any
};
