import React from 'react';
import { LabeledInput, Select, Option, Message, Label } from 'oskari-ui';
import styled from 'styled-components';
import { InfoIcon } from 'oskari-ui/components/icons';
import PropTypes from 'prop-types';
import { BUNDLE_KEY } from '../../constants';

const FieldWithInfo = styled('div')`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const GeneralInfoForm = ({ name, domain, language, controller }) => {
    const languages = Oskari.getSupportedLanguages();
    return (
        <div className={'t_generalInfo'}>
            <FieldWithInfo>
                <LabeledInput
                    type='text'
                    label={<Message messageKey='BasicView.generalInfo.name.label' />}
                    name='name'
                    value={name}
                    mandatory={true}
                    onChange={(e) => controller.onChange('name', e.target.value)}
                    placeholder={Oskari.getMsg(BUNDLE_KEY, 'BasicView.generalInfo.name.placeholder')}
                />
                <InfoIcon title={<Message messageKey='BasicView.generalInfo.name.tooltip'/> }/>
            </FieldWithInfo>
            <FieldWithInfo>
                <LabeledInput
                    type='text'
                    label={<Message messageKey='BasicView.generalInfo.domain.label' />}
                    name='domain'
                    value={domain}
                    onChange={(e) => controller.onChange('domain', e.target.value)}
                    placeholder={Oskari.getMsg(BUNDLE_KEY, 'BasicView.generalInfo.domain.placeholder')}
                />
                <InfoIcon title={<Message messageKey='BasicView.generalInfo.domain.tooltip'/> }/>
            </FieldWithInfo>
            <Label>
                <Message messageKey='BasicView.generalInfo.language.label'/>
            </Label>
            <FieldWithInfo>
                <Select
                    name='language'
                    value={language}
                    onChange={(lang) => controller.onChange('language', lang)}
                    popupMatchSelectWidth={false}
                >
                    {languages.map(lang => (
                        <Option value={lang} key={lang}>
                            <Message messageKey={`BasicView.generalInfo.language.options.${lang}`} />
                        </Option>
                    ))}
                </Select>
                <InfoIcon title={<Message messageKey='BasicView.generalInfo.language.tooltip'/> }/>
            </FieldWithInfo>
        </div>
    );
};

GeneralInfoForm.propTypes = {
    name: PropTypes.string,
    domain: PropTypes.string,
    language: PropTypes.string,
    controller: PropTypes.object
};
