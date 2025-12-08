import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Select } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from '../styled';
import { MandatoryIcon } from '../Mandatory';

export const DataProvider = ({ layer, dataProviders, controller }) => (
    <Fragment>
        <Message messageKey='fields.dataProviderId'/>  <MandatoryIcon />
        <StyledFormField>
            <Select
                showSearch
                optionFilterProp='children'
                value={layer.dataProviderId}
                onChange={value => controller.setDataProviderId(value)}
                options={dataProviders.map(dataProvider => (
                    {
                        value: dataProvider.id,
                        label: dataProvider.name
                    }
                ))}
            />
        </StyledFormField>
    </Fragment>
);
DataProvider.propTypes = {
    layer: PropTypes.object.isRequired,
    dataProviders: PropTypes.arrayOf(PropTypes.object).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
