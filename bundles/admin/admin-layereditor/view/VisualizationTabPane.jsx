import React from 'react';
import styled from 'styled-components';
import { Select, Option } from '../components/Select';
import { Slider } from '../components/Slider';
import { TextAreaInput } from '../components/TextAreaInput';
import { Opacity } from '../components/Opacity';

export class VisualizationTabPane extends React.Component {
    render () {
        const StyledRoot = styled('div')`
            & > label {
                font-weight: bold;
            }
        `;

        const StyledComponent = styled('div')`
            padding-top: 5px;
            padding-bottom 10px;
        `;

        return (
            <StyledRoot>
                <label>Opacity</label>
                <StyledComponent>
                    <Opacity />
                </StyledComponent>
                <label>Min and max scale</label>
                <StyledComponent style={{height: 200}}>
                    <Slider vertical range />
                </StyledComponent>
                <label>Default style</label>
                <StyledComponent>
                    <Select defaultValue='styleone'>
                        <Option value='styleone'>Style One</Option>
                        <Option value='styletwo'>Style Two</Option>
                    </Select>
                </StyledComponent>
                <label>Style JSON</label>
                <StyledComponent>
                    <TextAreaInput rows={6} />
                </StyledComponent>
                <label>Hover JSON</label>
                <StyledComponent>
                    <TextAreaInput rows={6} />
                </StyledComponent>
            </StyledRoot>
        );
    }
}
