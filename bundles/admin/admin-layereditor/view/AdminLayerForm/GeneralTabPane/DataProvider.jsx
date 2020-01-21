import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Select, Option } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledComponent } from '../StyledFormComponents';

export const DataProvider = ({ layer, dataProviders, controller }) => (
    <Fragment>
        <Message messageKey='dataProvider'/>
        <StyledComponent>
            <Select
                value={layer.dataProviderId}
                onChange={value => controller.setDataProviderId(value)}>
                { dataProviders.map(dataProvider =>
                    <Option key={dataProvider.id}>{dataProvider.name}</Option>
                )}
            </Select>
        </StyledComponent>
    </Fragment>
);
DataProvider.propTypes = {
    layer: PropTypes.object.isRequired,
    dataProviders: PropTypes.arrayOf(PropTypes.object).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
