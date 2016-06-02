namespace model {
    export enum ActionMode {
        NONE, BUILD, SELL, MORTGAGE, UNMORTGAGE
    }

    export class Round {
        private currentMode_: ActionMode;

        constructor() {
            this.reset();
        }

        set mode(mode: ActionMode) {
            this.currentMode_ = mode;
        }

        get mode(): ActionMode {
            return this.currentMode_;
        }

        reset(): void {
            this.currentMode_ = ActionMode.NONE
        }
    }
}