import { TimerModel } from './timer_model';
import { TimerView } from './timer_view';

export class TimerController {
    private _timerModel: TimerModel;
    private _timerView: TimerView;

    constructor(timerModel: TimerModel, timerView: TimerView) {
        this._timerView = timerView;

        this._timerModel = timerModel;

        this._timerModel.contentEditableCallback = (value: boolean) => {
            this._timerView.contentEditable(value);
        };

        this._timerModel.runningCallback = (value: boolean) => {
            if (value) { 
                // 動き始めたら「Stop」ボタンを表示
                this._timerView.showStop();
                this._timerView.addMoveClass();
            } else { 
                // 止まったら「Start」ボタンを表示
                this._timerView.showStart();
                this._timerView.removeMoveClass();
            }
        };

        this._timerModel.resetCallback = (min: number, sec: number) => {
            this._timerView.min = min;
            this._timerView.sec = sec;
        }

        this._timerView.urlSearchParamsCallback = (urlSearchParams: URLSearchParams) => {
            this._timerModel.urlSearchParams = urlSearchParams;
        }
    }

    public toggleRunningState(): void {
        this._timerModel.isRunning = !this._timerModel.isRunning;
    }
}