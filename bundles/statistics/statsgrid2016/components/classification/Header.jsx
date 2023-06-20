import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tooltip, Message, Select, Option } from 'oskari-ui';
import { EditOutlined } from '@ant-design/icons';

const Component = styled.div`
    display: flex;
    padding: 5px;
    max-height: 20vh;
    overflow-y: auto;
    & ${Select} {
        width: 90%;
        flex-grow: 1;
    }
`;
const Single = styled.div`
    width: 90%;
    font-weight: bold;
    flex-grow: 1;
    padding: 5px;
`;
const EditIcon = styled(EditOutlined)`
    font-size: 16px;
    margin: 6px;
`;
const editStyle = {
    background: '#ffd400',
    borderRadius: '50%'
};

export const Header = ({ selected, indicators, isEdit, toggleEdit, onChange }) => {
    const { title = '' } = indicators.find(indicator => indicator.hash === selected) || {};
    const renderSelect = indicators.length > 1;

    return (
        <Component className='classification-header'>
            {!renderSelect && <Single>{title}</Single>}
            {renderSelect && (
                <Select value={selected} onChange={onChange}>
                    {indicators.map(opt => <Option key={opt.hash} value={opt.hash}>{opt.title}</Option>)}
                </Select>
            )}
            <Tooltip placement='topRight' title={<Message messageKey={`classify.edit.${isEdit ? 'close' : 'open'}`}/>}>
                <div style={isEdit ? editStyle : {}}>
                    <EditIcon className='t_toggle-edit' onClick = {toggleEdit} twoToneColor={isEdit ? '' : '#ffd400'}/>
                </div>
            </Tooltip>
        </Component>
    );
};

Header.propTypes = {
    selected: PropTypes.string.isRequired,
    indicators: PropTypes.array.isRequired,
    isEdit: PropTypes.bool.isRequired,
    toggleEdit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
};
