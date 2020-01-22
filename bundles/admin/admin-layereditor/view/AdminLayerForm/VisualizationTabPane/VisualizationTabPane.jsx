import React from 'react';
import PropTypes from 'prop-types';
import { StyledTab, StyledColumnLeft, StyledColumnRight } from '../StyledFormComponents';
import { Controller } from 'oskari-ui/util';
import { Opacity } from './Opacity';
import { Style } from './Style';
import { StyleJson } from './StyleJson';
import { ExternalStyleJson } from './ExternalStyleJson';
import { HoverJson } from './HoverJson';
import { Scale } from './Scale';
import { ClusteringDistance } from './ClusteringDistance';
import { WfsRenderMode } from './WfsRenderMode';

const {
    OPACITY,
    CLUSTERING_DISTANCE,
    WFS_RENDER_MODE,
    STYLE, STYLE_JSON,
    EXTERNAL_STYLE_JSON,
    HOVER_JSON,
    SCALE
} = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

export const VisualizationTabPane = ({ layer, capabilities, propertyFields, controller }) => (
    <StyledTab>
        <StyledColumnLeft>
            { propertyFields.includes(OPACITY) &&
                <Opacity layer={layer} controller={controller} />
            }
            { propertyFields.includes(CLUSTERING_DISTANCE) &&
                <ClusteringDistance layer={layer} controller={controller} />
            }
            { propertyFields.includes(WFS_RENDER_MODE) &&
                <WfsRenderMode layer={layer} controller={controller} />
            }
            { propertyFields.includes(STYLE) &&
                <Style layer={layer} capabilities={capabilities} controller={controller} propertyFields={propertyFields} />
            }
            { propertyFields.includes(STYLE_JSON) &&
                <StyleJson layer={layer} controller={controller} />
            }
            { propertyFields.includes(EXTERNAL_STYLE_JSON) &&
                <ExternalStyleJson layer={layer} controller={controller} />
            }
            { propertyFields.includes(HOVER_JSON) &&
                <HoverJson layer={layer} controller={controller} />
            }
        </StyledColumnLeft>
        <StyledColumnRight>
            { propertyFields.includes(SCALE) &&
                <Scale layer={layer} controller={controller} />
            }
        </StyledColumnRight>
    </StyledTab>
);

VisualizationTabPane.propTypes = {
    layer: PropTypes.object.isRequired,
    capabilities: PropTypes.object,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
