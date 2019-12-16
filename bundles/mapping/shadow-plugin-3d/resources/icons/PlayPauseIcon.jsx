import React from 'react';

export const PlayPauseIcon = () => {
    return (
        <svg id='play-svg-1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>
            <path d='M11,8 L26,16 11,24 11,8'>
                <animate attributeName='d' fill='freeze' dur='0.1s'
                    calc-mode='spline' keySplines='0.19 1 0.22 1'/>
            </path>
        </svg>
    );
};

function MorphedSVG (svgId, firstPath, secondPath, styleClass) {
    this.elem = document.getElementById(svgId);
    this.path = this.elem.getElementsByTagName('path')[0];
    this.anim = this.path.getElementsByTagName('animate')[0];
    this.animDur = parseFloat(this.anim.getAttribute('dur')) * 1000;

    this.originalPath = this.path.getAttribute('d');
    this.firstPath = firstPath;
    this.secondPath = secondPath;
    this.state = MorphedSVG.STATE_1;
    this.styleClass = styleClass;

    this.timeout = false;
}

MorphedSVG.STATE_1 = true;
MorphedSVG.STATE_2 = false;

MorphedSVG.prototype.toState = function (state) {
    if (state === this.state) return;

    switch (state) {
    case MorphedSVG.STATE_1:
        this._set(this.firstPath, this.secondPath, this.firstPath);
        this.styleClass ? this.elem.classList.add(this.styleClass) : null;
        break;

    case MorphedSVG.STATE_2:
        this._set(this.secondPath, this.firstPath, this.secondPath);
        this.styleClass ? this.elem.classList.remove(this.styleClass) : null;
        break;
    }

    this.state = state;
    this.anim.beginElement();

    if (this.originalPath && this.animDur) {
        this.timeout ? clearTimeout(this.timeout) : null;
        this.timeout = setTimeout(this._resetOriginal.bind(this), this.animDur);
    }
};

MorphedSVG.prototype.toggle = function () {
    this.toState(!this.state);
};

MorphedSVG.prototype._set = function (d, from, to) {
    this.path.setAttribute('d', d);
    this.anim.setAttribute('from', from);
    this.anim.setAttribute('to', to);
};

MorphedSVG.prototype._resetOriginal = function () {
    if (this.state == MorphedSVG.STATE_1) { this._set(this.originalPath, '', ''); }
};

const PLAY_PATH_1 = 'M11,8 L18,11.74 18,20.28 11,24 11,8 M18,11.74 L26,16 26,16 18,20.28 18,11.74';
const PAUSE_PATH_1 = 'M9,8 L14,8 14,24 9,24 9,8 M19,8 L24,8 24,24 19,24 19,8';

var theButtonHor = new MorphedSVG(
    'play-svg-1', PLAY_PATH_1, PAUSE_PATH_1
);

theButtonHor.elem.parentNode.addEventListener('click', function () {
    this.toggle();
}.bind(theButtonHor));
