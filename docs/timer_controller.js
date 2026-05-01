import { TimerModel } from './timer_model.js';
import { TimerView } from './timer_view.js';
export class TimerController {
    constructor(sound) {
        this._model = new TimerModel();
        this._view = new TimerView();
        this._active = false;
        this._sound = sound;
        this._model.runningCallback = (value) => {
            if (value) {
                this._model.start();
                this._sound.playPreSound();
            }
            else {
                this._model.stop();
            }
            if (!this._active)
                return;
            if (value) {
                this._view.showStop();
                this._view.addMoveClass();
                this._view.contentEditable(false);
            }
            else {
                this._view.showStart();
                this._view.removeMoveClass();
                this._view.contentEditable(true);
            }
        };
        this._model.resetCallback = (min, sec) => {
            if (!this._active)
                return;
            this._view.min = min;
            this._view.sec = sec;
        };
        this._model.countDownCallback = (min, sec) => {
            if (this._active) {
                this._view.min = min;
                this._view.sec = sec;
            }
            if (min <= 0 && sec <= 0 && this._model.isRunning) {
                this._model.isRunning = false;
                if (this._active) {
                    this._view.focus();
                    if (this._model.url)
                        this._view.launchUrl(this._model.url);
                }
                this._sound.playSound();
            }
        };
        this._view.mouseMoveCallback = (isHover) => {
            if (isHover && this._model.isRunning) {
                this._view.addMoveClass();
            }
            else {
                this._view.removeMoveClass();
            }
        };
        this._view.buttonAreaClickCallback = () => {
            this.toggleRunning();
        };
    }
    activate(savedMin, savedSec) {
        this._active = true;
        if (savedMin !== undefined)
            this._view.min = savedMin;
        if (savedSec !== undefined)
            this._view.sec = savedSec;
        this._view.activate(this._model.isRunning);
    }
    deactivate() {
        const min = this._view.min;
        const sec = this._view.sec;
        this._active = false;
        this._view.deactivate();
        return { min, sec };
    }
    toggleRunning() {
        if (!this._model.isRunning) {
            this._model.min = this._view.min;
            this._model.sec = this._view.sec;
        }
        this._model.isRunning = !this._model.isRunning;
    }
    initFromUrlParams(params) {
        this._model.urlSearchParams = params;
    }
    setUrl(url) {
        return this._model.setUrlByUserInput(url);
    }
    setTarget(target) {
        return this._model.updateTargetTime(target);
    }
    get url() {
        return this._model.url;
    }
    get target() {
        return this._model.target;
    }
}
