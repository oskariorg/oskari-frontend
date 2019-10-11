import React from 'react';
import PropTypes from 'prop-types';
import { LayerFilter } from './LayerFilters/LayerFilter';
import { TextInput, Tooltip, Icon, Button } from 'oskari-ui';
import styled from 'styled-components';

const ButtonRow = styled.div`
    color: #949494;
    display: flex;
    margin-bottom: 10px;
`;
const StyledButton = styled(Button)`
    margin-left: auto;
    margin-top: auto;
    margin-bottom: auto;
`;
const InputHolder = styled('div')`
    padding: 0,
    margin: 0
`;
const AddButton = ({ title }) => (
    <StyledButton
        size="large"
        onClick={() => Oskari.getSandbox().postRequestByName('ShowLayerEditorRequest', [])}
        icon="plus"
        shape="circle"
        title={title} />
);
AddButton.propTypes = {
    title: PropTypes.string
};

const SearchInfo = ({ infoText }) => (
    <Tooltip title={infoText}>
        <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
    </Tooltip>
);
SearchInfo.propTypes = {
    infoText: PropTypes.string.isRequired
};

const getFilterButtons = (filters, mutator) => {
    return Object.values(filters).map(filter => (
        <LayerFilter key={filter.id} text={filter.text}
            tooltip={filter.tooltip} filterName = {filter.id}
            currentStyle = {filter.cls.current}
            clickHandler={(event) => {
                const filterName = event.currentTarget.attributes.filtername;
                mutator.setActiveFilterId(filterName.value);
            }}>
        </LayerFilter>
    ));
};

export const LayerFilters = React.forwardRef(({ filters, searchText, showAddButton, locale, mutator }, ref) => (
    <React.Fragment>
        <ButtonRow>
            { getFilterButtons(filters, mutator) }
            { showAddButton && <AddButton/> }
        </ButtonRow>
        <InputHolder ref={ref}>
            <TextInput
                value={searchText}
                autoFocus
                allowClear
                placeholder={locale.text}
                suffix={<SearchInfo infoText={locale.description}/>}
                onChange={(event) => mutator.setSearchText(event.currentTarget.value)}/>
        </InputHolder>
    </React.Fragment>
));
LayerFilters.displayName = 'LayerFilters';

LayerFilters.propTypes = {
    filters: PropTypes.object.isRequired,
    searchText: PropTypes.string,
    showAddButton: PropTypes.bool,
    locale: PropTypes.object.isRequired,
    mutator: PropTypes.object.isRequired
};
