import { TimerController } from './timer_controller.js';
import { ClockController } from './clock_controller.js';
import { SoundController } from './sound_controller.js';

class App {
    private readonly _sound: SoundController = new SoundController();
    private readonly _timerController: TimerController;
    private readonly _clockController: ClockController;
    private _mode: 'timer' | 'clock' = 'timer';
    private _savedTimerMin: number = 0;
    private _savedTimerSec: number = 0;

    constructor() {
        this._timerController = new TimerController(this._sound);
        this._clockController = new ClockController(this._sound);

        this._clockController.onDeactivateRequest = () => {
            this.disableClockMode();
        };

        // タイマーモードで起動してからURLパラメータを適用
        this._timerController.activate();
        const params = new URLSearchParams(decodeURI(window.location.search));
        this._timerController.initFromUrlParams(params);
        const target = params.get('target') || params.get('t');
        if (target) this._clockController.setTarget(target);

        this.bindKeyboard();
    }

    private enableClockMode(): void {
        const saved = this._timerController.deactivate();
        this._savedTimerMin = saved.min;
        this._savedTimerSec = saved.sec;
        this._mode = 'clock';
        this._clockController.activate(this._timerController.url);
    }

    private disableClockMode(): void {
        this._clockController.deactivate();
        this._mode = 'timer';
        this._timerController.activate(this._savedTimerMin, this._savedTimerSec);
    }

    private setURLSearchParam(key: string, value: string): void {
        const searchParams = new URLSearchParams(decodeURI(window.location.search));
        searchParams.set(key, value);
        window.history.replaceState(null, '', '?' + searchParams.toString());
    }

    private bindKeyboard(): void {
        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'c') {
                if (this._mode === 'clock') this.disableClockMode();
                else this.enableClockMode();
                return;
            }

            if (event.key === 'h') {
                window.alert([
                    '機能一覧',
                    '- s: タイマー開始/停止',
                    '- c: 時計モードON/OFF',
                    '- u: 終了時に開くURL設定',
                    '- t: 終了目標時刻(HH:mm)設定',
                    '- h: このヘルプを表示',
                ].join('\n'));
                return;
            }

            if (this._mode === 'clock') {
                if (event.key === 't') {
                    const userInput = window.prompt('何時まで？（HH:mm）', this._clockController.target ?? '');
                    if (userInput && this._clockController.setTarget(userInput)) {
                        this.setURLSearchParam('t', userInput);
                    }
                }
                return;
            }

            // タイマーモードのキー操作
            if (event.key === 's') {
                this._timerController.toggleRunning();
                return;
            }

            if (event.key === 'u') {
                const userInput = window.prompt('URL', this._timerController.url ?? '');
                if (userInput && this._timerController.setUrl(userInput)) {
                    this.setURLSearchParam('u', userInput);
                }
                return;
            }

            if (event.key === 't') {
                const userInput = window.prompt('何時まで？（HH:mm）', this._timerController.target ?? '');
                if (userInput && this._timerController.setTarget(userInput)) {
                    this._clockController.setTarget(userInput); // 時計モードにも同期
                    this.setURLSearchParam('t', userInput);
                }
            }
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new App());
} else {
    new App();
}