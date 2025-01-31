import React from 'react';
import { LabeledInput, Select, Option, Message, Label } from 'oskari-ui';
import styled from 'styled-components';
import { InfoIcon } from 'oskari-ui/components/icons';
import { PropTypes } from 'prop-types';
const FieldWithInfo = styled('div')`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const BUNDLE_KEY = 'Publisher2';

export const GeneralInfoForm = ({ onChange, data }) => {
    const languages = Oskari.getSupportedLanguages();
    return (
        <div>
            <FieldWithInfo>
                <LabeledInput
                    type='text'
                    label={<Message messageKey='BasicView.name.label' bundleKey={BUNDLE_KEY} />}
                    name='name'
                    value={data.name}
                    mandatory={true}
                    onChange={(e) => {
                        onChange('name', e.target.value);
                    }}
                    placeholder={Oskari.getMsg(BUNDLE_KEY, 'BasicView.name.placeholder')}
                />
                <InfoIcon><Message messageKey='BasicView.name.tooltip' bundleKey={BUNDLE_KEY} /></InfoIcon>
            </FieldWithInfo>
            <FieldWithInfo>
                <LabeledInput
                    type='text'
                    label={<Message messageKey='BasicView.domain.label' bundleKey={BUNDLE_KEY} />}
                    name='domain'
                    value={data.domain}
                    onChange={(e) => {
                        onChange('domain', e.target.value);
                    }}
                    placeholder={Oskari.getMsg(BUNDLE_KEY, 'BasicView.domain.placeholder')}
                />
                <InfoIcon><Message messageKey='BasicView.domain.tooltip' bundleKey={BUNDLE_KEY} /></InfoIcon>
            </FieldWithInfo>
            <Label>
                <Message messageKey='BasicView.language.label' bundleKey={BUNDLE_KEY} />
            </Label>
            <FieldWithInfo>
                <Select
                    name='language'
                    value={data.language}
                    onChange={(lang) => {
                        onChange('language', lang);
                    }}
                    popupMatchSelectWidth={false}
                >
                    {languages.map(lang => (
                        <Option value={lang} key={lang}>
                            <Message messageKey={`BasicView.language.options.${lang}`} bundleKey={BUNDLE_KEY} />
                        </Option>
                    ))}
                </Select>
                <InfoIcon><Message messageKey='BasicView.language.tooltip' bundleKey={BUNDLE_KEY} /></InfoIcon>
            </FieldWithInfo>
        </div>
    );
};

GeneralInfoForm.propTypes = {
    onChange: PropTypes.func,
    data: PropTypes.object
};
