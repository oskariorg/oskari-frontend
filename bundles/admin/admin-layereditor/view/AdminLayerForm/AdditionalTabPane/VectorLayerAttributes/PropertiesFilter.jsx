import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Select, Option, Switch, Divider, Badge } from 'oskari-ui';
import { Draggable, DragDropContext, Droppable } from '@hello-pangea/dnd';
import { DragIcon } from 'oskari-ui/components/icons';
import { IconButton } from 'oskari-ui/components/buttons';
import { UpOutlined, DownOutlined } from '@ant-design/icons';

const Content = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledBox = styled.div`
    box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 0.23);
    border-radius: 3px;
    padding: 10px;
    margin-top: 10px;
    border: 1px #fff solid;
    background-color: #fff;
    display: flex;
    align-items: center;
`;

// DragIcon is bigger than arrows -> adjust (maybe should fix icon size)
const StyledDrag = styled(IconButton)`
    vertical-align: -5px;
`;

const SelectRow = styled.div`
    padding-top: 5px;
    padding-bottom: 10px;
    display: flex;
    justify-content: space-between;
    & ${Select} {
        width: 100%;
    }
`;

const Buttons = styled.div`
    margin-left: auto;
    button {
        margin-left: 10px;
    }
`;

const Label = styled.span`
    margin-left: 10px;
    font-weight: bold;
`;

const Italic = styled.div`
    font-style: italic;
`;

const StyledBadge = styled(Badge)`
    margin-left: 10px;
`;

const FilteredProperty = ({name, label, toggle}) => {
    return (
        <StyledBox>
            <Switch size='small' checked={false} onChange={checked => toggle(name, checked)} />
            <Label>{label ? `${name} (${label})` : name}</Label>
        </StyledBox>
    );
};

const SelectedProperty = ({name, label, index, reorder, toggle}) => {
    return (
        <Draggable draggableId={name} index={index}>
            { provided => (
                <StyledBox ref={provided.innerRef} {...provided.draggableProps}>
                    <Switch size='small' checked={true} onChange={checked => toggle(name, checked)} />
                    <Label>{label ? `${name} (${label})` : name}</Label>
                    <Buttons>
                        <StyledDrag {...provided.dragHandleProps} icon={<DragIcon/>} />
                        <IconButton icon={<UpOutlined/>} onClick={() => reorder(index, index - 1)} />
                        <IconButton icon={<DownOutlined/>} onClick={() => reorder(index, index + 1)} />
                    </Buttons>
                </StyledBox>
            )}
        </Draggable>
    );
};

export const PropertiesFilter = ({ filter = {}, update, properties, labels }) => {
    const [lang, setLang] = useState('default');
    const options = ['default', ...Oskari.getSupportedLanguages()];
    const selectedProps = filter[lang] || filter.default || properties;

    const reorder = (from, to = -1) => {
        const max = selectedProps.length - 1;
        if (from === to || from > max || to < 0 || to > max) {
            return;
        }
        const props = [...selectedProps];
        const removed = props.splice(from, 1)[0];
        props.splice(to, 0, removed);
        update({ ...filter, [lang]: props });
    };
    const toggle = (name, selected) => {
        const props = selected
            ? [...selectedProps, name]
            : selectedProps.filter(f => f !== name)
        update({ ...filter, [lang]: props });
    };
    const deleteFilter = () => {
        const updated = { ...filter };
        delete updated[lang];
        update(updated);
    };
    // TODO: Droppable: unsupported nested scroll container detected.
    const showFromDefault = !filter[lang] && !!filter.default;
    const filteredProps = properties.filter(p => !selectedProps.includes(p));

    return (
        <div>
            <Message messageKey='attributes.filter.lang'/>
            <SelectRow>
                <Select
                    value={lang}
                    onChange={setLang}>
                    { options.map(opt => (
                        <Option key={opt} value={opt}>
                            { opt === 'default'
                                ? <Message messageKey='attributes.filter.default'/>
                                : <Message messageKey={`LocalizationComponent.locale.${opt}`} bundleKey='oskariui' />
                            }
                            { Array.isArray(filter[opt]) && <StyledBadge count={filter[opt].length} showZero={false} /> }
                        </Option>))
                    }
                </Select>
                { !!filter[lang] && <IconButton type='delete' bordered onClick={() => deleteFilter()}/> }
            </SelectRow>
            { showFromDefault && <Italic><Message messageKey='attributes.filter.fromDefault'/></Italic> }
            <DragDropContext onDragEnd={result => reorder(result.source.index, result.destination?.index)}>
                <Droppable droppableId="properties">
                    {provided => (
                        <Content ref={provided.innerRef} {...provided.droppableProps}>
                            { selectedProps.map((name, index) =>
                                <SelectedProperty key={name} index={index} name={name} reorder={reorder}
                                    toggle={toggle} label={labels[name]} />
                            )}
                            { provided.placeholder }
                        </Content>
                    )}
                </Droppable>
            </DragDropContext>
            { filteredProps.length > 0 && <Divider/> }
            { filteredProps.map((name) =>
                <FilteredProperty key={name} name={name} toggle={toggle} label={labels[name]}/>) }
        </div>
    );
};

PropertiesFilter.propTypes = {
    filter: PropTypes.object,
    update: PropTypes.func.isRequired,
    properties: PropTypes.array.isRequired,
    labels: PropTypes.object.isRequired
};
