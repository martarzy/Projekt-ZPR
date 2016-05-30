/// <reference path="message.ts" />
/// <reference path="../model/model.ts" />
/// <reference path="../view/view.ts" />

namespace controller {

    export class UserActions {

        constructor(private sender_: (arg: any) => void,
                    private model_: model.Model,
                    private viewChanges_: ViewChanges) {
        }

        chooseName(name: string): void {
            let toSend: any = {};
            toSend[message.messageTitle] = message.MyName.message;
            toSend[message.MyName.name] = name;
            this.model_.players.setMyUsername(name);
            this.sender_(toSend);
        }

        rollDice(): void {
            let toSend: any = {};
            toSend[message.messageTitle] = message.RollDice.message;
            this.sender_(toSend);
            this.viewChanges_.enable(ViewElement.ROLL_BTN, false);
        }

        playerIsReady(): void {
            let toSend: any = {};
            toSend[message.messageTitle] = message.Ready.message;
            this.sender_(toSend);
            this.viewChanges_.enable(ViewElement.READY_BTN, false);
        }

        playerBuysField(): void {
            let toSend: any = {};
            toSend[message.messageTitle] = message.BuyField.message;
            this.sender_(toSend);
            this.viewChanges_.enable(ViewElement.BUY_FIELD_BTN, false);
        }

        playerEndsTurn(): void {
            if (!this.model_.round.playerMoved)
                return;
            let toSend: any = {};
            toSend[message.messageTitle] = message.EndOfTurn.message;
            this.sender_(toSend);
            this.viewChanges_.disableAllButtons();
        }

        playerBuildsHouse(): void {
            // TODO
        }

        playerCollateralizesField(): void {
            // TODO
        }

        playerSellsHouse(): void {
            // TODO
        }

        fieldClicked(fieldId: number): void {
            // TODO handle the click depending on current mode
            // (none, sell, buy, collateralize)
        }
    }

}