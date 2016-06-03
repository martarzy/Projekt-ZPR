namespace model {
    export enum ActionMode {
        NONE, BUILD, SELL, MORTGAGE, UNMORTGAGE
    }

    export class Round {
        mode: ActionMode;
        tradingWith: string;
        offeredFields: Array<number>;
        demandedFields: Array<number>;
        playerMoved: boolean;
        movementCommands: number;

        constructor() {
            this.reset();
        }

        reset(): void {
            this.mode = ActionMode.NONE;
            this.playerMoved = false;
            this.tradingWith = "";
            this.offeredFields = [];
            this.demandedFields = [];
            this.movementCommands = 0;
        }
    }
}