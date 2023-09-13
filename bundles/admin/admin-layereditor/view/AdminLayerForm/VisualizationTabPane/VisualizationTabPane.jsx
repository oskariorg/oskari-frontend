import React from 'react';
import PropTypes from 'prop-types';
import { Controller, ErrorBoundary } from 'oskari-ui/util';
import { Opacity } from './Opacity';
import { Hover } from './Hover';
import { DynamicScreensPaceErrorOptions } from './DynamicScreensSpaceErrorOptions';
import { Scale } from './Scale';
import { Coverage } from './Coverage';
import { ClusteringDistance } from './ClusteringDistance';
import { WfsRenderMode } from './WfsRenderMode';
import { StyledColumn } from './styled';
import { RasterStyle } from './RasterStyle';
import { HoverModal } from './VectorStyle/HoverModal';
import { TimeSeries } from './TimeSeries';
import { VectorStyle } from './VectorStyle';
import { LayerTypeNotSupported } from '../LayerTypeNotSupported';
import { Declutter } from './Declutter';

const {
    OPACITY,
    CLUSTERING_DISTANCE,
    WFS_LAYER,
    CAPABILITIES_STYLES,
    VECTOR_STYLES,
    EXTERNAL_VECTOR_STYLES,
    HOVER,
    SCALE,
    COVERAGE,
    TIMES,
    CESIUM_ION,
    DECLUTTER
} = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');


export const VisualizationTabPane = ({ layer, scales, propertyFields, controller }) => {
    const isLayerTypeSupported = propertyFields.length > 0;
    if (!isLayerTypeSupported) {
        return (<LayerTypeNotSupported type={layer.type} />);
    }
    const showExternalVectorStyle = propertyFields.includes(EXTERNAL_VECTOR_STYLES);
    const showVectorStyle = propertyFields.includes(VECTOR_STYLES) || showExternalVectorStyle;
    return (<ErrorBoundary>
        <StyledColumn.Left>
            { propertyFields.includes(OPACITY) &&
                <Opacity layer={layer} controller={controller} />
            }
            { propertyFields.includes(COVERAGE) &&
                <Coverage id={layer.id} controller={controller} />
            }
            { propertyFields.includes(DECLUTTER) &&
                <Declutter layer={layer} controller={controller} />
            }
            { (propertyFields.includes(TIMES) && layer.capabilities.times) &&
                <TimeSeries layer={layer} scales={scales} controller={controller} />
            }
            { propertyFields.includes(CLUSTERING_DISTANCE) &&
                <ClusteringDistance layer={layer} controller={controller} />
            }
            { propertyFields.includes(WFS_LAYER) &&
                <WfsRenderMode layer={layer} controller={controller} />
            }
            { propertyFields.includes(CAPABILITIES_STYLES) &&
                <RasterStyle layer={layer} controller={controller} />
            }
            { showVectorStyle &&
                <VectorStyle layer={layer} controller={controller} external={showExternalVectorStyle}/>
            }
            { propertyFields.includes(HOVER) &&
                <HoverModal layer={layer} controller={controller} />
            }
            { propertyFields.includes(HOVER) &&
                <Hover layer={layer} controller={controller} />
            }
            { propertyFields.includes(CESIUM_ION) &&
                <DynamicScreensPaceErrorOptions layer={layer} controller={controller} />
            }
        </StyledColumn.Left>
        <StyledColumn.Right>
            { propertyFields.includes(SCALE) &&
                <Scale layer={layer} scales={scales} controller={controller} />
            }
        </StyledColumn.Right>
    </ErrorBoundary>);
};

VisualizationTabPane.propTypes = {
    layer: PropTypes.object.isRequired,
    scales: PropTypes.array.isRequired,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
