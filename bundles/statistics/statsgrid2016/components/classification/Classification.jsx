import React from 'react';
import PropTypes from 'prop-types';
import { withContext, handleBinder } from 'oskari-ui/util';
import { EditClassification } from './editclassification/EditClassification';
import { Legend } from './Legend';
import { Header } from './Header';
import './classification.scss';

class Classification extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isEdit: false
        };
        handleBinder(this);
    }
    componentDidUpdate () {
        this.props.onRenderChange(this.state.isEdit);
    }
    handleToggleClassification () {
        this.setState(oldState => ({ isEdit: !oldState.isEdit }));
    }
    getContentWrapperStyle () {
        const docHeight = document.documentElement.offsetHeight;
        return {
            maxHeight: docHeight - 50 + 'px', // header + border,
            overflowY: 'auto'
        };
    }

    render () {
        const { classifications, pluginState } = this.props;
        if (!pluginState.visible) {
            return null;
        }
        const isEdit = this.state.isEdit;
        let containerClass = pluginState.transparent ? 'statsgrid-classification-container transparent-classification' : 'statsgrid-classification-container';

        return (
            <div className={containerClass}>
                <Header active = {this.props.indicators.active} isEdit = {isEdit}
                    handleClick = {this.handleToggleClassification}
                    indicators = {this.props.indicators.selected}
                    mutator = {this.props.mutator}/>
                <div className="classification-content-wrapper" style={this.getContentWrapperStyle()}>
                    {isEdit &&
                        <EditClassification classifications = {classifications}
                            indicators = {this.props.indicators}
                            editEnabled = {pluginState.editEnabled}
                            mutator = {this.props.mutator}
                            indicatorData = {this.props.indicatorData}
                            manualView = {this.props.manualView}/>
                    }
                    <Legend legendProps = {this.props.legendProps}
                        indicatorData = {this.props.indicatorData}
                        transparency = {classifications.values.transparency}
                        mutator = {this.props.mutator}/>
                </div>
            </div>
        );
    }
}

Classification.propTypes = {
    indicators: PropTypes.object.isRequired,
    indicatorData: PropTypes.object.isRequired,
    classifications: PropTypes.object.isRequired,
    pluginState: PropTypes.object.isRequired,
    legendProps: PropTypes.object.isRequired,
    manualView: PropTypes.object,
    onRenderChange: PropTypes.func.isRequired,
    mutator: PropTypes.object.isRequired,
    loc: PropTypes.func.isRequired
};

const cls = withContext(Classification);
export { cls as Classification };
