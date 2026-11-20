import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FLYOUTS } from './handler/ViewHandler';
import searchIcon from './resources/images/tile-search-light.png';
import tableIcon from './resources/images/tile-table-light.png';
import diagramIcon from './resources/images/tile-diagram-light.png';

const ICONS = {
    search: searchIcon,
    grid: tableIcon,
    diagram: diagramIcon
};
const ACTIVATION_KEYS = ['Enter', ' '];

const Container = styled('div')`
    display: flex;
    flex-direction: column;
    background: #fff;
    line-height: 17px;
`;

const SubItem = styled('div')`
    display: inline-flex;
    align-items: center;
    width: 95%;
    height: 34px;
    margin: 0;
    padding: 0;
    border: 0;
    background: #fff;
    font: inherit;
    text-align: left;
    cursor: pointer;
`;

const Icon = styled('span')`
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    margin-left: 16px;
    background-color: ${({ $active }) => $active ? '#ffd400' : 'lightgray'};
    background-image: url("${({ $image }) => $image}");
    background-repeat: no-repeat;
    background-position: center;
`;

const Label = styled('span')`
    width: 95px;
    margin-left: 4px;
    color: #000;
    font-size: 12px;
    font-weight: bold;
`;

export const MenuSubItems = ({ activeViews, onToggle, loc }) => (
    <Container>
        {FLYOUTS.map(id => (
            <SubItem
                key={id}
                role="button"
                tabIndex={0}
                aria-pressed={activeViews.includes(id)}
                onClick={() => onToggle(id)}
                onKeyDown={event => {
                    if (ACTIVATION_KEYS.includes(event.key)) {
                        event.preventDefault();
                        onToggle(id);
                    }
                }}
            >
                <Icon $image={ICONS[id]} $active={activeViews.includes(id)} aria-hidden="true" />
                <Label>{loc(`tile.${id}`)}</Label>
            </SubItem>
        ))}
    </Container>
);

MenuSubItems.propTypes = {
    activeViews: PropTypes.arrayOf(PropTypes.string).isRequired,
    onToggle: PropTypes.func.isRequired,
    loc: PropTypes.func.isRequired
};
