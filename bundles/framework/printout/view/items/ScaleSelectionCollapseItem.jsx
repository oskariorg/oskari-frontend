import React from 'react';
import PropTypes from 'prop-types';
import { PanelHeader } from './PanelHeader';
import { BUNDLE_KEY, RadioGroup } from '../PrintoutPanel';
import { SCALE_OPTIONS } from '../../constants';
import { Message, Radio, Select, Option } from 'oskari-ui';

const ScaleSelectionPanelContent = ({ state, controller, scaleOptions }) => {
    return <RadioGroup value={state.scaleType}
        onChange={(e) => controller.updateScaleType(e.target.value)}>
        {SCALE_OPTIONS?.map(option => (
            <Radio.Choice value={option} key={option}>
                <Message bundleKey={BUNDLE_KEY} messageKey={`BasicView.scale.${option}`} />
            </Radio.Choice>
        ))}
        {state.scaleType === 'configured' && (
            <Select
                value={state.scale}
                onChange={(val) => controller.updateField('scale', val)}
            >
                {scaleOptions?.map(option => (
                    <Option value={option} key={option}>
                        {`1:${option}`}
                    </Option>
                ))}
            </Select>
        )}
    </RadioGroup>;
};

ScaleSelectionPanelContent.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.object,
    scaleOptions: PropTypes.object
};

export const getScaleSelectionItem = (key, state, controller, scaleOptions) => {
    return {
        key,
        label: <PanelHeader headerMsg='BasicView.scale.label' infoMsg='BasicView.scale.tooltip' />,
        children: <ScaleSelectionPanelContent state={state} controller={controller} scaleOptions={scaleOptions} />
    };
};
