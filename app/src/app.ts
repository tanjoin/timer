import { TimerController } from './timer_controller';

class App {
    private timerController: TimerController;

    constructor() {
        this.timerController = new TimerController();
    }
}

window.onload = () => {
    new App();
}