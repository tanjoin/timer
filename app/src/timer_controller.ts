import { SoundController } from './sound_controller';
import { TimerModel } from './timer_model';
import { TimerView } from './timer_view';

export class TimerController {
    private _timerModel: TimerModel = new TimerModel();
    private _timerView: TimerView = new TimerView();
    private _soundController: SoundController = new SoundController();

    constructor() {
        this._timerModel.contentEditableCallback = (value: boolean) => {
            this._timerView.contentEditable(value);
        };

        this._timerModel.runningCallback = (value: boolean) => {
            if (value) { 
                // 動き始めたら「Stop」ボタンを表示
                this._timerView.showStop();
                this._timerView.addMoveClass();
                this._timerView.contentEditable(false);
                this._timerModel.start();
                this._soundController.playPreSound();
            } else { 
                // 止まったら「Start」ボタンを表示
                this._timerView.showStart();
                this._timerView.removeMoveClass();
                this._timerView.contentEditable(true);
                this._timerModel.stop();
            }
        };

        this._timerModel.resetCallback = (min: number, sec: number) => {
            this._timerView.min = min;
            this._timerView.sec = sec;
        };

        this._timerModel.countDownCallback = (min: number, sec: number) => {
            if (min <= 0 && sec <= 0) {
                this._timerView.focus();
                this._timerModel.stop();
                if (this._timerModel.url) {
                    this._timerView.launchUrl(this._timerModel.url);
                }
                this._soundController.playSound();
            }
        };

        this._timerView.mouseMoveCallback = (isHover: boolean) => {
            if (isHover && this._timerModel.isRunning) {
                this._timerView.addMoveClass();
            } else {
                this._timerView.removeMoveClass();
            }
        }

        this._timerView.urlSearchParamsCallback = (urlSearchParams: URLSearchParams) => {
            this._timerModel.urlSearchParams = urlSearchParams;
        }

        this._timerView.buttonAreaClickCallback = () => {
            this.toggleRunningState();
        }
    }

    public toggleRunningState(): void {
        this._timerModel.isRunning = !this._timerModel.isRunning;
    }
}