import React from 'react';
import styled from 'styled-components';
import { Select, Option } from '../components/Select';
import { TextInput } from '../components/TextInput';
import { UrlInput } from '../components/UrlInput';
import { Collapse, Panel } from '../components/Collapse';
import { MaplayerGroups } from './MaplayerGroups';

export const GeneralTabPane = (props) => {
    const StyledRoot = styled('div')`
        & > label {
            font-weight: bold;
        }
    `;
    const StyledComponentGroup = styled('div')`
            padding-bottom: 10px;
        `;
    const StyledComponent = styled('div')`
            padding-top: 5px;
            padding-bottom 10px;
        `;
    return (
        <StyledRoot>
            <label>Interface URL</label>
            <StyledComponentGroup>
                <StyledComponent>
                    <div><UrlInput /></div>
                </StyledComponent>
                <StyledComponent>
                    <Collapse>
                        <Panel header='Username and password'>
                            <div>
                                <label>Username</label>
                                <div><TextInput type='text' /></div>
                            </div>
                            <div>
                                <label>Password</label>
                                <div><TextInput type='password' /></div>
                            </div>
                        </Panel>
                    </Collapse>
                </StyledComponent>
            </StyledComponentGroup>
            <label>Unique name</label>
            <StyledComponent>
                <TextInput />
            </StyledComponent>
            <StyledComponentGroup>
                <label>Layer name in Finnish</label>
                <StyledComponent>
                    <TextInput />
                </StyledComponent>
                <StyledComponent>
                    <Collapse>
                        <Panel header='Other languages'>
                            <div>In English <TextInput /></div>
                            <div>In Swedish <TextInput /></div>
                        </Panel>
                    </Collapse>
                </StyledComponent>
            </StyledComponentGroup>
            <label>Data provider</label>
            <StyledComponent>
                <Select defaultValue={1}>
                    <Option value={1}>City of Helsinki</Option>
                    <Option value={2}>City of Espoo</Option>
                </Select>
            </StyledComponent>
            <label>Maplayer groups</label>
            <StyledComponent>
                <MaplayerGroups />
            </StyledComponent>
        </StyledRoot>
    );
};
