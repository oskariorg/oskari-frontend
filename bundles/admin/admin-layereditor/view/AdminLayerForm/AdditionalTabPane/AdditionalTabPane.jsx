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
import { CapabilitiesUpdateRate } from './CapabilitiesUpdateRate';

const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');
const {
    CAPABILITIES_UPDATE_RATE,
    SELECTED_TIME,
    METADATAID,
    LEGEND_IMAGE,
    REALTIME,
    GFI_CONTENT,
    GFI_TYPE,
    GFI_XSLT,
    ATTRIBUTES
} = LayerComposingModel;

export const AdditionalTabPane = ({ layer, capabilities = {}, propertyFields, controller }) => {
    const { isQueryable } = capabilities;
    return (
        <StyledTab>
            { propertyFields.includes(CAPABILITIES_UPDATE_RATE) &&
                <CapabilitiesUpdateRate layer={layer} controller={controller} />
            }
            { propertyFields.includes(SELECTED_TIME) &&
                <SelectedTime layer={layer} capabilities={capabilities} controller={controller} />
            }
            { propertyFields.includes(METADATAID) &&
                <MetadataId layer={layer} controller={controller} />
            }
            { propertyFields.includes(LEGEND_IMAGE) &&
                <LegendImage layer={layer} controller={controller} />
            }
            { propertyFields.includes(REALTIME) &&
                <Realtime layer={layer} controller={controller} />
            }
            { isQueryable && propertyFields.includes(GFI_CONTENT) &&
                <GfiContent layer={layer} controller={controller} />
            }
            { isQueryable && propertyFields.includes(GFI_TYPE) &&
                <GfiType layer={layer} />
            }
            { isQueryable && propertyFields.includes(GFI_XSLT) &&
                <GfiStyle layer={layer} controller={controller} />
            }
            { propertyFields.includes(ATTRIBUTES) &&
                <Attributes layer={layer} controller={controller} />
            }
        </StyledTab>
    );
};
AdditionalTabPane.propTypes = {
    layer: PropTypes.object.isRequired,
    capabilities: PropTypes.object,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
