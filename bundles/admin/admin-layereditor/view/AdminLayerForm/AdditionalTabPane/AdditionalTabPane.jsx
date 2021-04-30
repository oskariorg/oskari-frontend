import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Realtime } from './Realtime';
import { SingleTile } from './SingleTile';
import { SelectedTime } from './SelectedTime';
import { GfiType } from './GfiType';
import { GfiContent } from './GfiContent';
import { GfiStyle } from './GfiStyle';
import { Attributes } from './Attributes';
import { Attributions } from './Attributions';
import { MetadataId } from './MetadataId';
import { Capabilities } from './Capabilities';

const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');
const {
    CAPABILITIES,
    SELECTED_TIME,
    METADATAID,
    REALTIME,
    SINGLE_TILE,
    GFI_CONTENT,
    GFI_TYPE,
    GFI_XSLT,
    ATTRIBUTIONS,
    ATTRIBUTES
} = LayerComposingModel;

export const AdditionalTabPane = ({ layer, propertyFields, controller }) => {
    const isQueryable = layer.attributes.isQueryable || layer.capabilities.isQueryable;
    return (
        <Fragment>
            { propertyFields.includes(CAPABILITIES) &&
                <Capabilities layer={layer} controller={controller} />
            }
            { propertyFields.includes(ATTRIBUTIONS) &&
                <Attributions layer={layer} controller={controller} />
            }
            { propertyFields.includes(SELECTED_TIME) &&
                <SelectedTime layer={layer} controller={controller} />
            }
            { propertyFields.includes(METADATAID) &&
                <MetadataId layer={layer} controller={controller} />
            }
            { propertyFields.includes(SINGLE_TILE) &&
                <SingleTile layer={layer} controller={controller} />
            }
            { propertyFields.includes(REALTIME) &&
                <Realtime layer={layer} controller={controller} />
            }
            { isQueryable && propertyFields.includes(GFI_CONTENT) &&
                <GfiContent layer={layer} controller={controller} />
            }
            { isQueryable && propertyFields.includes(GFI_TYPE) &&
                <GfiType layer={layer} controller={controller}/>
            }
            { isQueryable && propertyFields.includes(GFI_XSLT) &&
                <GfiStyle layer={layer} controller={controller} />
            }
            { propertyFields.includes(ATTRIBUTES) &&
                <Attributes layer={layer} controller={controller} />
            }
        </Fragment>
    );
};
AdditionalTabPane.propTypes = {
    layer: PropTypes.object.isRequired,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
