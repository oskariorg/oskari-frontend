import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { Header, Paragraph } from '../styled';
import { AdminUrlInput } from '../../AdminUrlInput';

const {
    URL,
    CESIUM_ION,
    API_KEY
} = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

export const ServiceStep = ({ layer, controller, versions, propertyFields, credentialsCollapseOpen }) => {

    return (
        <Fragment>
            <Message messageKey='wizard.service' LabelComponent={Header}/>
            <Message messageKey='wizard.serviceDescription' LabelComponent={Paragraph}/>
            { propertyFields.includes(URL) &&
                <AdminUrlInput
                    layer={layer}
                    controller={controller}
                    versions={versions}
                    credentialsCollapseOpen={credentialsCollapseOpen}/>
            }
            { propertyFields.includes(CESIUM_ION) &&
                <AdminUrlInput
                    layer={layer}
                    controller={controller}
                    versions={versions}
                    credentialsCollapseOpen={credentialsCollapseOpen}/>
            }
            { propertyFields.includes(API_KEY) &&
                <AdminUrlInput
                    layer={layer}
                    controller={controller}
                    versions={versions}
                    credentialsCollapseOpen={credentialsCollapseOpen}/>
            }
        </Fragment>
    );
};
ServiceStep.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    propertyFields: PropTypes.array,
    versions: PropTypes.array.isRequired,
    credentialsCollapseOpen: PropTypes.bool.isRequired
}
