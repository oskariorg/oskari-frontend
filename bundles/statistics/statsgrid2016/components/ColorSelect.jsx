import React from 'react';
import handleBinder from '../../../../src/reactUtil/handleBinder';
import {withContext} from '../../../../src/reactUtil/genericContext';

class ColorSelect extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isOpen: false
        };
        handleBinder(this);
    }
    componentDidMount () {
        document.addEventListener('mouseup', this.handleClick);
    }
    componentWillUnmount () {
        document.removeEventListener('mouseup', this.handleClick);
    }
    handleClick (event) {
        if (this.props.disabled) {
            return;
        }
        const outside = this.wrapperRef && !this.wrapperRef.contains(event.target);
        if (outside && this.state.isOpen) {
            this.setState({isOpen: false});
        } else if (!outside) {
            this.setState(oldState => ({ isOpen: !oldState.isOpen }));
        }
    }
    handleWrapperRef (node) {
        this.wrapperRef = node;
    }

    // color: 'deebf7'
    getSimpleColorElement (color) {
        return (
            <div className="color" style={{height: '16px', width: '16px', border: '1px solid rgb(85, 85, 85)'}}>
                <div className="oskari-color" style={{background: '#' + color, width: '100%', height: '100%', opacity: this.props.opacity}}/>
            </div>
        );
    }

    // color: {id:'Blues', value:['deebf7','9ecae1','3182bd']}
    getMultiColorElement (color) {
        const id = color.id;
        const colors = color.value;
        const colorWidth = 6;
        const colorsWidth = colorWidth * colors.length;
        return (
            <div className="color" style={{height: '16px', width: colorsWidth + 'px', border: '1px solid rgb(85, 85, 85)'}}>
                {colors.map(color =>
                    <div className="oskari-color" key = {color} style={{background: '#' + color, width: colorWidth + 'px', height: '100%', opacity: this.props.opacity}}/>
                )}
            </div>
        );
    }

    getColorSelection () {
        if (!this.state.isOpen) {
            return;
        }
        const colors = this.props.colors;
        return (
            <div className="oskari-color-selection" style={{top: '26px', left: '0px', width: '101px'}}>
                {this.props.colors.map((color, index) => {
                    if (this.props.isSimple) {
                        return (
                            <div className="oskari-color-option" key={index} data-id={index} style={{backgroundColor: 'white'}} onMouseDown={() => this.props.handleColorChange(index)}>
                                {this.getSimpleColorElement(color, false)}
                            </div>
                        );
                    } else {
                        return (
                            <div className="oskari-color-option" key={color.id} data-id={color.id} style={{backgroundColor: 'white'}} onMouseDown={() => this.props.handleColorChange(color.id)}>
                                {this.getMultiColorElement(color, false)}
                            </div>
                        );
                    }
                })}
            </div>
        );
    }
    getSelectedColor () {
        const value = this.props.value;
        const colors = this.props.colors;
        let selected;
        if (this.props.isSimple) {
            selected = colors[value];
        } else {
            selected = colors.find(color => color.id === value);
        }
        if (selected) {
            return selected;
        }
        return colors[0];
    }

    render () {
        const selected = this.getSelectedColor();
        return (
            <div className="oskari-color-selection-main">
                <div className = "oskari-selected-color-wrapper" ref={this.handleWrapperRef}>
                    <div className = "oskari-selected-color">
                        <div className="oskari-color-option" style={{backgroundColor: 'transparent'}}>
                            {this.props.isSimple ? this.getSimpleColorElement(selected) : this.getMultiColorElement(selected)}
                        </div>
                    </div>
                    <div className="color-selection-arrow">
                        <div className="icon-arrow-down"/>
                    </div>
                </div>
                {this.getColorSelection()}
            </div>
        );
    }
};
export default withContext(ColorSelect);
