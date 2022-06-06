import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Tooltip, LabeledInput, UrlInput, Select, Button, Option } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { SecondaryButton, PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { PlusCircleOutlined } from '@ant-design/icons';
import { showPopup, PLACEMENTS } from 'oskari-ui/components/window';
import { LOCALE_KEY, PLACE_FORM } from '../constants';

const POPUP_OPTIONS = {
    id: PLACE_FORM,
    placement: PLACEMENTS.BL
};

const Content = styled.div`
    padding: 10px;
    width: 400px;
`;

const Label = styled.div`
    margin-bottom: 10px;
`;

const Styled = styled.div`
    display: flex;
`;
const StyledSelect = styled(Select)`
    margin-right: 10px;
    flex-grow: 1; 
`;

const getLabel = key => Oskari.getMsg(LOCALE_KEY, `placeform.fields.${key}`);
const openLayerDialog = () => Oskari.getSandbox().postRequestByName('MyPlaces.OpenAddLayerDialogRequest');

const LayerSelect = ({ selected, categories, onChange }) => (
    <Fragment>
        <Label>
            <Message messageKey='placeform.category.choose' />
        </Label>
        <Styled>
            <StyledSelect value={selected} onChange={onChange}>
                {categories.map(category => {
                    const { categoryId, name } = category;
                    return (
                        <Option key={categoryId} value={categoryId}>{name}</Option>
                    );
                })}
            </StyledSelect>
            <Tooltip title={<Message messageKey='placeform.category.newLayer' />}>
                <Button className='t_add-category' onClick={openLayerDialog}>
                    <PlusCircleOutlined/>
                </Button>
            </Tooltip>
        </Styled>
    </Fragment>
);

LayerSelect.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.object),
    selected: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};

const PlaceForm = ({ values = {}, categoryId, categories, controller }) => {
    const [state, setState] = useState({ ...values });
    const updateState = newState => setState({ ...state, ...newState });
    const hasName = state.name && state.name.trim();
    return (
        <Content>
            <LabeledInput minimal mandatory type='text' value={state.name}
                label={getLabel('name')} onChange={e => updateState({ name: e.target.value })} />

            <LabeledInput minimal type='textarea' value={state.description}
                label={getLabel('description')} onChange={e => updateState({ description: e.target.value })} />

            <LabeledInput minimal type='text' value={state.attentionText}
                label={getLabel('attentionText')} onChange={e => updateState({ attentionText: e.target.value })} />

            <Tooltip title={getLabel('link')}>
                <UrlInput
                    url={state.link}
                    placeholder={getLabel('link')}
                    onChange={link => updateState({ link })}/>
            </Tooltip>
            <Tooltip title={getLabel('imagelink')}>
                <UrlInput
                    url={state.imageLink}
                    placeholder={getLabel('imagelink')}
                    onChange={imageLink => updateState({ imageLink })}/>
            </Tooltip>
            { categories &&
                <LayerSelect
                    categories={categories}
                    selected={categoryId}
                    onChange={categoryId => controller.handleCategoryId(categoryId)}
                />
            }
            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={controller.onClose}/>
                <Tooltip title={hasName ? null : <Message messageKey='placeform.validation.mandatoryName'/>}>
                    <PrimaryButton disabled={!hasName} type='save' onClick={() => controller.onSave(state, categoryId) }/>
                </Tooltip>
            </ButtonContainer>
        </Content>
    );
};

PlaceForm.propTypes = {
    values: PropTypes.object,
    categoryId: PropTypes.number.isRequired,
    categories: PropTypes.array,
    controller: PropTypes.object.isRequired
};

export const showPlacePopup = (values, categoryId, categories, controller) => {
    const controls = showPopup(
        <Message messageKey={ 'placeform.title' } bundleKey = {LOCALE_KEY}/>,
        (<LocaleProvider value={{ bundleKey: LOCALE_KEY }}>
            <PlaceForm
                values={values}
                categoryId={categoryId}
                categories={categories}
                controller={controller}/>
        </LocaleProvider>),
        controller.onClose,
        POPUP_OPTIONS
    );
    return {
        ...controls,
        update: (categoryId, categories) => {
            // use added category id
            controls.update(<Message messageKey={ 'placeform.title' } bundleKey = {LOCALE_KEY}/>,
                (<LocaleProvider value={{ bundleKey: LOCALE_KEY }}>
                    <PlaceForm values={values} categoryId={categoryId} categories={categories} controller={controller}/>
                </LocaleProvider>));
        }
    };
};
