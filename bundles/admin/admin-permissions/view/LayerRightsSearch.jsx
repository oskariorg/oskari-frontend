import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Message, Confirm, TextInput } from 'oskari-ui';
import { PrimaryButton, SecondaryButton } from 'oskari-ui/components/buttons';
import styled from 'styled-components';

const SearchContainer = styled('div')`
    display: flex;
    flex-direction: row;
    margin-left: auto;
`;
const SearchInput = styled(TextInput)`
    width: 250px;
`;

export const LayerRightsSearch = ({ controller, state }) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchConfirmOpen, setSearchConfirmOpen] = useState(false);
    const [pendigClear, setPendingClear] = useState(false);
    const hasChanges = Object.keys(state.unSavedChanges).length > 0;
    const hasFilter = Array.isArray(state.filtered);

    const search = isClear => {
        const value = isClear ? '' : searchValue;
        controller.search(value);
        // update internal state
        setSearchValue(value);
    };
    const onSearchConfirm = confirm => {
        if (confirm) {
            search(pendigClear);
        }
        setSearchConfirmOpen(false);
        setPendingClear(false);
    };
    const onSearch = isClear => {
        if (hasChanges) {
            setPendingClear(isClear);
            setSearchConfirmOpen(true);
        } else {
            search(isClear);
        }
    };
    return (
        <SearchContainer>
            <SearchInput
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}/>
            <Confirm
                title={<Message messageKey='flyout.unsavedChangesConfirm'/>}
                open={searchConfirmOpen}
                onConfirm={() => onSearchConfirm(true)}
                onCancel={() => onSearchConfirm(false)}
                okText={<Message bundleKey='oskariui' messageKey='buttons.yes'/>}
                cancelText={<Message bundleKey='oskariui' messageKey='buttons.cancel'/>}
                placement='top'
                popupStyle={{ zIndex: '999999' }}>
                <PrimaryButton
                    type='search'
                    onClick={() => onSearch()}
                    disabled={state.resources.length === 0}/>
            </Confirm>
            { hasFilter && <SecondaryButton type='clear' onClick={() => onSearch(true) } /> }
        </SearchContainer>
    );
};

LayerRightsSearch.propTypes = {
    controller: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired
};
