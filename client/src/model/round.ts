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
        /* It seems that new turn message may be obtained before 
           the end of movement on one of the clients. If this slower client
           is active, this value is set to negative value and can't buy fields. */
        movementCommands = 0;

        constructor() {
            this.reset();
        }

        reset(): void {
            this.mode = ActionMode.NONE;
            this.playerMoved = false;
            this.tradingWith = "";
            this.offeredFields = [];
            this.demandedFields = [];
        }
    }
}