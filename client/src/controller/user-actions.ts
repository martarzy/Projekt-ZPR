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
            let toSend = this.prepareMessage(message.MyName.message);
            toSend[message.MyName.name] = name;
            this.sender_(toSend);
            this.model_.players.saveMyUsername(name);
        }

        rollDice(): void {
            this.sender_(this.prepareMessage(message.RollDice.message));
            this.viewChanges_.enable(ViewElement.ROLL_BTN, false);
        }

        playerIsReady(): void {
            this.sender_(this.prepareMessage(message.Ready.message));
            this.viewChanges_.enable(ViewElement.READY_BTN, false);
        }

        playerBuysField(): void {
            this.sender_(this.prepareMessage(message.BuyField.message));
            this.viewChanges_.enable(ViewElement.BUY_FIELD_BTN, false);
        }

        playerEndsTurn(): void {
            if (!this.model_.round.playerMoved)
                return;
            this.sender_(this.prepareMessage(message.EndOfTurn.message));
            this.viewChanges_.disableAllButtons();
        }

        private prepareMessage(title: string): any {
            let toSend: any = {};
            toSend[message.messageTitle] = title;
            return toSend;
        }

        activateBuildMode(): void {
            if (!this.model_.players.myTurnInProgress())
                return;
            
            this.setRoundMode(model.ActionMode.BUILD);
            const buildable = this.model_.board.expansibleFields(this.model_.players.myUsername());
            this.viewChanges_.unhighlightAllFields();
            this.highlightOnly(buildable);
        }

        activateCollateralizesMode(): void {
            if (!this.model_.players.myTurnInProgress())
                return;
            this.setRoundMode(model.ActionMode.COLLATERALIZE);
            // TODO
        }

        activateSellMode(): void {
            if (!this.model_.players.myTurnInProgress())
                return;
            
            this.setRoundMode(model.ActionMode.SELL);
            const sellable = this.model_.board.fieldsWithSellableHouses(this.model_.players.myUsername());
            this.viewChanges_.unhighlightAllFields();
            this.highlightOnly(sellable);
        }

        private highlightOnly(fields: Array<model.Field>): void {
            this.viewChanges_.unhighlightAllFields();
            this.viewChanges_.highlightFields(fields.map(f => f.id));
        }

        private setRoundMode(mode: model.ActionMode): void {
            this.model_.round.mode = mode;
        }

        fieldClicked(fieldId: number): void {
            console.log(fieldId);
            if (!this.model_.players.myTurnInProgress()
                || this.model_.round.mode === model.ActionMode.NONE)
                return;
             /* The model is updated when server sends confirmation message.
                The mode is set to NONE to avoid situation when server haven't
                responded yet and user clicked the field multiple times. */  
            this.setRoundMode(model.ActionMode.NONE);
            switch (this.model_.round.mode) {
                case model.ActionMode.BUILD:
                    this.buyHouse(fieldId);
                    break;
                case model.ActionMode.SELL:
                    this.sellHouse(fieldId);
                    break;
            }
        }

        private buyHouse(fieldId: number) {
            if (!this.model_.board.houseMayBeBoughtOn(fieldId, this.model_.players.myUsername()))
                return;
            let toSend = this.prepareMessage(message.BuyHouse.message);
            toSend[message.BuyHouse.field] = fieldId;
            console.log(toSend);
            this.sender_(toSend);
        }

        private sellHouse(fieldId: number) {
            if (this.model_.board.houseMayBeSoldOn(fieldId, this.model_.players.myUsername()))
                return;
            let toSend = this.prepareMessage(message.SellHouse.message);
            toSend[message.SellHouse.field] = fieldId;
            this.sender_(toSend);
        }
    }

}