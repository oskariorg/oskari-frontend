import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { showPopup } from 'oskari-ui/components/window';

const Funnel = styled('div')`
    margin-left: auto;
`;

const SelectByPropertiesPopup = (state, props) => {
    return <div>Lorem ipsum</div>;
};

export const SelectByPropertiesFunnel = (props) => {
    const { openSelectByPropertiesPopup } = props;
    return props.active ? <Funnel className='icon-funnel' onClick={() => openSelectByPropertiesPopup()}/> : <></>;
};

SelectByPropertiesFunnel.propTypes = {
    active: PropTypes.bool,
    openSelectByPropertiesPopup: PropTypes.func
};

export const showSelectByPropertiesPopup = (state, controller) => {
    const content = <SelectByPropertiesPopup state = { state } controller = { controller }/>;
    const title = <h3>{'Lorem ipsum'}</h3>;
    const controls = showPopup(title, content, () => { controller.closePopup(); }, {});

    return {
        ...controls,
        update: (state) => {
            controls.update(title, <SelectByPropertiesPopup state = { state } controller = { controller }/>);
        }
    };
};
