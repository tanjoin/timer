export class ClockView {
    constructor() {
        this.hoverCallback = null;
        this.clickCallback = null;
        this._handleMouseMove = (event) => {
            var _a, _b;
            if (this._buttonArea && event.clientY <= this._buttonArea.clientHeight) {
                (_a = this.hoverCallback) === null || _a === void 0 ? void 0 : _a.call(this, true);
            }
            else {
                (_b = this.hoverCallback) === null || _b === void 0 ? void 0 : _b.call(this, false);
            }
        };
        this._handleClick = () => {
            var _a;
            (_a = this.clickCallback) === null || _a === void 0 ? void 0 : _a.call(this);
        };
        this._min = document.getElementById('min');
        this._sec = document.getElementById('sec');
        this._startOrStop = document.getElementById('startOrStop');
        this._buttonArea = document.getElementById('buttonarea');
        this._main = document.getElementById('main');
    }
    activate() {
        var _a, _b;
        if (this._min)
            this._min.contentEditable = 'false';
        if (this._sec)
            this._sec.contentEditable = 'false';
        this.showLabel('');
        this.removeMoveClass();
        this.showCurrentTime();
        (_a = this._main) === null || _a === void 0 ? void 0 : _a.addEventListener('mousemove', this._handleMouseMove);
        (_b = this._buttonArea) === null || _b === void 0 ? void 0 : _b.addEventListener('click', this._handleClick);
    }
    deactivate() {
        var _a, _b;
        (_a = this._main) === null || _a === void 0 ? void 0 : _a.removeEventListener('mousemove', this._handleMouseMove);
        (_b = this._buttonArea) === null || _b === void 0 ? void 0 : _b.removeEventListener('click', this._handleClick);
    }
    showCurrentTime() {
        const now = new Date();
        if (this._min)
            this._min.textContent = now.getHours().toString().padStart(2, '0');
        if (this._sec)
            this._sec.textContent = now.getMinutes().toString().padStart(2, '0');
    }
    showLabel(label) {
        if (this._startOrStop)
            this._startOrStop.textContent = label;
    }
    addMoveClass() {
        var _a;
        (_a = this._buttonArea) === null || _a === void 0 ? void 0 : _a.classList.add('move');
    }
    removeMoveClass() {
        var _a;
        (_a = this._buttonArea) === null || _a === void 0 ? void 0 : _a.classList.remove('move');
    }
}
