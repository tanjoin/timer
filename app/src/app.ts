import { TimerModel } from './timer_model';
import { TimerController } from './timer_controller';
import { TimerView } from './timer_view';

class App {
    private timerModel: TimerModel;
    private timerController: TimerController;
    private timerView: TimerView;

    constructor() {
        this.timerModel = new TimerModel();
        this.timerView = new TimerView();
        this.timerController = new TimerController(this.timerModel, this.timerView);
    }
}

window.onload = () => {
    new App();
}