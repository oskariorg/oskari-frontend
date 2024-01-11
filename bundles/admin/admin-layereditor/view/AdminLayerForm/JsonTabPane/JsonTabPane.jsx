import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, TextAreaInput, TextInput, Collapse, CollapsePanel } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from '../styled';
import { IconButton } from 'oskari-ui/components/buttons';

const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');
const {
    CAPABILITIES,
    ATTRIBUTES
} = LayerComposingModel;

const textAreaSize = {
    minRows: 6,
    maxRows: 15
};

const Block = styled.div`
    display: flex;
    flex-direction: row;
    border: 1px solid #999;
    min-height: 50px;
    align-items: center;
    padding: 0 10px;
    justify-content: space-between;
    font-size: 16px;
    background-color: #F3F3F3;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    > * {
        margin-left: 10px;
    }
`;
const SpacedInput = styled(TextInput)`
    margin-left: 10px;
`;

const EditBlock = ({ edit, onUpdate }) => {
    const [ key, setKey ] = useState();
    const [ value, setValue ] = useState();
    const onAccept = () => {
        if (!key) {
            return;
        }
        if (edit === 'delete') {
            onUpdate(key);
            return;
        }
        try {
            // parses number, boolean, Array and Object
            const parsed = JSON.parse(value);
            onUpdate({ [key]: parsed });
            return;
        } catch (e) {}
        onUpdate({ [key]: value });
    }
    return (
        <Block>
            <TextInput
                value={key}
                onChange={(e) => setKey(e.target.value)}
            />
            {edit === 'add' &&
                <SpacedInput value={value}
                    onChange={(e) => setValue(e.target.value)}/>
            }
            <ButtonContainer>
                <IconButton type='accept' onClick={() => onAccept()} />
                <IconButton type='reject' onClick={() => onUpdate() } />
            </ButtonContainer>
        </Block>
    );
}

const PanelExtra = ({ setEdit, skipEdit = false }) => {
    if (skipEdit) {
        return null;
    }
    return (
        <ButtonContainer onClick={e => e.stopPropagation()}>
            <IconButton type='add' onClick={() => setEdit('add')}/>
            <IconButton type='delete' onClick={() => setEdit('delete')}/>
        </ButtonContainer>
    );
};

const ParsedCollapse = ({ json = {}, jsonKey, controller }) => {
    const [edit, setEdit] = useState();
    const prettier = JSON.stringify(json, null, 4);
    const onUpdate = value => {
        if (typeof value === 'string') {
            const updated = { ...json };
            delete updated[value];
            controller.setValueForLayer(jsonKey, updated);
        } else {
            controller.setValueForLayer(jsonKey, {...json, ...value });
        }
        setEdit();
    };
    return (
        <Collapse>
            <CollapsePanel header={<Message messageKey={`jsonFields.${jsonKey}`}/>}
                extra={<PanelExtra setEdit={setEdit} skipEdit={!controller} />}>
                { edit && <EditBlock edit={edit} onUpdate={onUpdate}/> }
                <TextAreaInput value={prettier} autoSize={textAreaSize} />
            </CollapsePanel>
        </Collapse>
    );
};
ParsedCollapse.propTypes = {
    json: PropTypes.object.isRequired,
    jsonKey: PropTypes.string.isRequired,
    controller: PropTypes.instanceOf(Controller)
};

export const JsonTabPane = ({ layer, propertyFields, controller }) => {
    return (
        <Fragment>
            <StyledFormField>
                <Message messageKey='jsonTab.info'/>
            </StyledFormField>
            <StyledFormField>
                <Collapse>
                    { propertyFields.includes(ATTRIBUTES) &&
                        <ParsedCollapse json={layer.attributes} jsonKey='attributes' controller={controller}/>
                    }
                    { propertyFields.includes(CAPABILITIES) &&
                        <ParsedCollapse skipEdit json={layer.capabilities} jsonKey='capabilities'/>
                    }
                    <ParsedCollapse json={layer.options} jsonKey='options' controller={controller}/>
                    <ParsedCollapse json={layer.params} jsonKey='params' controller={controller}/>
                </Collapse>
            </StyledFormField>
        </Fragment>
    );
};
JsonTabPane.propTypes = {
    layer: PropTypes.object.isRequired,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};