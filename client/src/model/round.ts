namespace model {
    export enum ActionMode {
        NONE, BUILD, SELL, MORTGAGE, UNMORTGAGE
    }

    export class Round {
        mode: ActionMode = ActionMode.NONE;

        reset(): void {
            this.mode = ActionMode.NONE
        }
    }
}