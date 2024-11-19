import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, Select, Message } from 'oskari-ui';
import styled from 'styled-components';
import { PrimaryButton } from 'oskari-ui/components/buttons';
import { getDatasources, getRegionsets } from '../../helper/ConfigHelper';

const Content = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
`;
const StyledSelect = styled(Select)`
    width: 200px;
    margin-right: 10px;
`;
const YearField = styled(TextInput)`
    width: 100px;
    margin-right: 10px;
`;

export const StatisticalInfo = ({ state, controller }) => {
    const { regionset, indicator, selection } = state;
    const { regionsets = [] } = getDatasources().find(({ id }) => id === indicator.ds) || {};
    const options = getRegionsets()
        .filter(rs => regionsets.includes(rs.id))
        .map(rs => ({ value: rs.id, label: rs.name }));
    return (
        <Content>
            <YearField
                type='number'
                placeholder={Oskari.getMsg('StatsGrid', 'parameters.year')}
                value={selection}
                onChange={(e) => controller.setSelection(e.target.value)} />
            <StyledSelect
                placeholder={<Message messageKey='panels.newSearch.selectRegionsetPlaceholder' />}
                value={regionset}
                onChange={(value) => controller.setRegionset(value)}
                options={options}/>
            <PrimaryButton type='add' onClick={() => controller.addStatisticalData()} />
        </Content>
    );
};
StatisticalInfo.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired
};
