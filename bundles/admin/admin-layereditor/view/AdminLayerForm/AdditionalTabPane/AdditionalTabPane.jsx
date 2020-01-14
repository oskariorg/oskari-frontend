import React from 'react';
import PropTypes from 'prop-types';
import { StyledTab } from '../StyledFormComponents';
import { Controller } from 'oskari-ui/util';
import { LegendImage } from './LegendImage';
import { Realtime } from './Realtime';
import { SelectedTime } from './SelectedTime';
import { GfiType } from './GfiType';
import { GfiContent } from './GfiContent';
import { GfiStyle } from './GfiStyle';
import { Attributes } from './Attributes';
import { MetadataId } from './MetadataId';

const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

export const AdditionalTabPane = ({ layer, propertyFields, controller }) => (
    <StyledTab>
        { propertyFields.includes(LayerComposingModel.SELECTED_TIME) &&
            <SelectedTime layer={layer} controller={controller} />
        }
        { propertyFields.includes(LayerComposingModel.METADATAID) &&
            <MetadataId layer={layer} controller={controller} />
        }
        { propertyFields.includes(LayerComposingModel.LEGEND_IMAGE) &&
            <LegendImage layer={layer} controller={controller} />
        }
        { propertyFields.includes(LayerComposingModel.GFI_CONTENT) &&
            <GfiContent layer={layer} controller={controller} />
        }
        { propertyFields.includes(LayerComposingModel.GFI_TYPE) &&
            <GfiType layer={layer} />
        }
        { propertyFields.includes(LayerComposingModel.GFI_XSLT) &&
            <GfiStyle layer={layer} controller={controller} />
        }
        { propertyFields.includes(LayerComposingModel.ATTRIBUTES) &&
            <Attributes layer={layer} controller={controller} />
        }
        { propertyFields.includes(LayerComposingModel.REALTIME) &&
            <Realtime layer={layer} controller={controller} />
        }
    </StyledTab>
);
AdditionalTabPane.propTypes = {
    layer: PropTypes.object,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    additionalProps: PropTypes.any
};
