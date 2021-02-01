import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Opacity } from './Opacity';
import { Style } from './Style';
import { StyleJson } from './StyleJson';
import { ExternalStyleJson } from './ExternalStyleJson';
import { Hover } from './Hover';
import { Scale } from './Scale';
import { ClusteringDistance } from './ClusteringDistance';
import { WfsRenderMode } from './WfsRenderMode';
import { StyledColumn } from './styled';
import { RasterStyle } from './RasterStyle';

const {
    OPACITY,
    CLUSTERING_DISTANCE,
    WFS_RENDER_MODE,
    STYLE,
    CAPABILITIES_STYLES,
    STYLES_JSON,
    EXTERNAL_STYLES_JSON,
    HOVER,
    SCALE
} = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

export const VisualizationTabPane = ({ layer, scales, propertyFields, controller }) => (
    <Fragment>
        <StyledColumn.Left>
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
                <Style layer={layer} controller={controller} propertyFields={propertyFields} />
            }
            { propertyFields.includes(CAPABILITIES_STYLES) &&
                <RasterStyle layer={layer} controller={controller} />
            }
            { propertyFields.includes(STYLES_JSON) &&
                <StyleJson layer={layer} controller={controller} />
            }
            { propertyFields.includes(EXTERNAL_STYLES_JSON) &&
                <ExternalStyleJson layer={layer} controller={controller} />
            }
            { propertyFields.includes(HOVER) &&
                <Hover layer={layer} controller={controller} />
            }
        </StyledColumn.Left>
        <StyledColumn.Right>
            { propertyFields.includes(SCALE) &&
                <Scale layer={layer} scales={scales} controller={controller} />
            }
        </StyledColumn.Right>
    </Fragment>
);

VisualizationTabPane.propTypes = {
    layer: PropTypes.object.isRequired,
    scales: PropTypes.array.isRequired,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
