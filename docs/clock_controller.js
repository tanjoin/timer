import { ClockModel } from './clock_model.js';
import { ClockView } from './clock_view.js';
export class ClockController {
    constructor(sound) {
        this._model = new ClockModel();
        this._view = new ClockView();
        this._timer = null;
        this._url = null;
        // 時計モードの終了を外部（App）に要求するコールバック
        this.onDeactivateRequest = null;
        this._sound = sound;
        this._view.hoverCallback = (isHover) => {
            // Done 表示中はホバーで上書きしない
            if (this._model.targetReached)
                return;
            this._view.showLabel('Clock');
            // timer.js と同じ: 上部外にいる間は隠し、上部に乗せると表示
            if (isHover) {
                this._view.removeMoveClass();
            }
            else {
                this._view.addMoveClass();
            }
        };
        this._view.clickCallback = () => {
            if (this._model.targetReached) {
                // Done メッセージをクリックで解除
                this._view.showLabel('Clock');
                this._model.resetTargetReached();
                this._view.addMoveClass();
                return;
            }
            // Clock 表示はクリックしても何もしない
        };
    }
    activate(url) {
        this._url = url;
        this._view.activate();
        this._view.showLabel('Clock');
        this._view.addMoveClass();
        this._timer = window.setInterval(() => {
            this._view.showCurrentTime();
            if (this._model.checkTargetReached()) {
                window.focus();
                this._sound.playSound();
                if (this._url)
                    window.open(this._url);
                this._view.showLabel('Done');
                this._view.removeMoveClass();
            }
        }, 1000);
    }
    deactivate() {
        if (this._timer !== null) {
            clearInterval(this._timer);
            this._timer = null;
        }
        this._view.deactivate();
    }
    setTarget(target) {
        return this._model.setTarget(target);
    }
    get target() {
        return this._model.target;
    }
}
