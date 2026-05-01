import { ClockModel } from './clock_model.js';
import { ClockView } from './clock_view.js';
import { SoundController } from './sound_controller.js';

export class ClockController {
    private readonly _model: ClockModel = new ClockModel();
    private readonly _view: ClockView = new ClockView();
    private readonly _sound: SoundController;
    private _timer: number | null = null;
    private _url: string | null = null;

    // 時計モードの終了を外部（App）に要求するコールバック
    onDeactivateRequest: (() => void) | null = null;

    constructor(sound: SoundController) {
        this._sound = sound;

        this._view.hoverCallback = (isHover: boolean) => {
            // Done 表示中はホバーで上書きしない
            if (this._model.targetReached) return;
            this._view.showLabel('Clock');
            // timer.js と同じ: 上部外にいる間は隠し、上部に乗せると表示
            if (isHover) {
                this._view.removeMoveClass();
            } else {
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

    activate(url: string | null): void {
        this._url = url;
        this._view.activate();
        this._view.showLabel('Clock');
        this._view.addMoveClass();
        this._timer = window.setInterval(() => {
            this._view.showCurrentTime();
            if (this._model.checkTargetReached()) {
                window.focus();
                this._sound.playSound();
                if (this._url) window.open(this._url);
                this._view.showLabel('Done');
                this._view.removeMoveClass();
            }
        }, 1000);
    }

    deactivate(): void {
        if (this._timer !== null) {
            clearInterval(this._timer);
            this._timer = null;
        }
        this._view.deactivate();
    }

    setTarget(target: string): boolean {
        return this._model.setTarget(target);
    }

    get target(): string | null {
        return this._model.target;
    }
}
