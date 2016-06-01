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
            this.model_.playersModel.saveMyUsername(name);
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
            if (!this.model_.playersModel.myTurnInProgress())
                return;
            
            this.setRoundMode(model.ActionMode.BUILD);
            const buildable = this.model_.boardModel.expansibleFields(this.model_.playersModel.myUsername());
            this.viewChanges_.unhighlightAllFields();
            this.highlightOnly(buildable);
        }

        activateMortageMode(): void {
            if (!this.model_.playersModel.myTurnInProgress())
                return;
            this.setRoundMode(model.ActionMode.MORTGAGE);
            // TODO
        }

        activateSellMode(): void {
            if (!this.model_.playersModel.myTurnInProgress())
                return;
            
            this.setRoundMode(model.ActionMode.SELL);
            const sellable = this.model_.boardModel.fieldsWithSellableHouses(this.model_.playersModel.myUsername());
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
            if (!this.model_.playersModel.myTurnInProgress()
                || this.model_.round.mode === model.ActionMode.NONE)
                return;
            switch (this.model_.round.mode) {
                case model.ActionMode.BUILD:
                    if (!this.buyHouse(fieldId))
                        return;
                    break;
                case model.ActionMode.SELL:
                    if (!this.sellHouse(fieldId))
                        return;
                    break;
                case model.ActionMode.MORTGAGE:
                    if (!this.mortgageField(fieldId))
                        return;
                    break;
                default: return;
            }
            /* The model is updated when server sends confirmation message.
               The mode is set to NONE to avoid situation when server haven't
               responded yet and user clicked the field multiple times. */
            this.setRoundMode(model.ActionMode.NONE);
        }

        private buyHouse(fieldId: number): boolean {
            if (!this.model_.boardModel.houseMayBeBoughtOn(fieldId, this.model_.playersModel.myUsername())
                || this.model_.playersModel.activePlayerFunds() < this.model_.boardModel.priceOfHouseOn(fieldId))
                return false;
            let toSend = this.prepareMessage(message.BuyHouse.message);
            toSend[message.BuyHouse.field] = fieldId;
            console.log(toSend);
            this.sender_(toSend);
            return true;
        }

        private sellHouse(fieldId: number): boolean {
            if (!this.model_.boardModel.houseMayBeSoldOn(fieldId, this.model_.playersModel.myUsername()))
                return false;
            let toSend = this.prepareMessage(message.SellHouse.message);
            toSend[message.SellHouse.field] = fieldId;
            this.sender_(toSend);
            return true;
        }

        private mortgageField(fieldId: number): boolean {
            if (!this.model_.boardModel.fieldMayBeMortgaged(fieldId, this.model_.playersModel.myUsername()))
                return false;
            let toSend = this.prepareMessage(message.MortgageField.message);
            toSend[message.MortgageField.field] = fieldId;
            this.sender_(toSend);
            return true;
        }
    }

}