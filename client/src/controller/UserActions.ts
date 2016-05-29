/// <reference path="message.ts" />
/// <reference path="../model/model.ts" />
/// <reference path="../view/view.ts" />
/// <reference path="../../lib/collections.d.ts" />

namespace controller {

    export class UserActions {

        constructor(private sender_: (arg: any) => void,
                    private model_: model.Model,
                    private view_: view.View) {
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
            this.view_.setDisabledRollButton();
        }

        playerIsReady(): void {
            let toSend: any = {};
            toSend[message.messageTitle] = message.Ready.message;
            this.sender_(toSend);
            this.view_.setDisabledReadyButton();
        }

        playerBuysField(): void {
            let toSend: any = {};
            toSend[message.messageTitle] = message.BuyField.message;
            this.sender_(toSend);
            //TODO disable buy button
        }

        playerEndsTurn(): void {
            if (!this.model_.round.playerMoved)
                return;
            let toSend: any = {};
            toSend[message.messageTitle] = message.EndOfTurn.message;
            this.sender_(toSend);
            //TODO disable all buttons
        }

    }

}