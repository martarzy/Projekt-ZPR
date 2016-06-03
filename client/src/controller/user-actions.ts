/// <reference path="message.ts" />
/// <reference path="../model/model.ts" />
/// <reference path="../view/view.ts" />

namespace controller {

    export class UserActions {

        private onClickHandlers_: { [mode: number]: (id: number) => boolean } = {};

        constructor(private sender_: (arg: any) => void,
                    private model_: model.Model,
                    private viewChanges_: ViewChanges) {
            this.initOnClick();
        }

        private initOnClick(): void {
            this.onClickHandlers_[model.ActionMode.NONE] = (id) => { return false; };
            this.onClickHandlers_[model.ActionMode.BUILD] = this.buyHouse.bind(this);
            this.onClickHandlers_[model.ActionMode.SELL] = this.sellHouse.bind(this);
            this.onClickHandlers_[model.ActionMode.MORTGAGE] = this.mortgageField.bind(this);
            this.onClickHandlers_[model.ActionMode.UNMORTGAGE] = this.unmortgageField.bind(this);
        }

        chooseName(name: string): void {
            let toSend = this.prepareMessage(message.MyName.message);
            toSend[message.MyName.name] = name;
            this.sender_(toSend);
            this.model_.users.setMyUsername(name);
        }

        rollDice(): void {
            this.sender_(this.prepareMessage(message.RollDice.message));
            this.viewChanges_.enable(view.ViewElement.ROLL_BTN, false);
        }

        playerIsReady(): void {
            this.sender_(this.prepareMessage(message.Ready.message));
            this.viewChanges_.enable(view.ViewElement.READY_BTN, false);
        }

        playerBuysField(): void {
            this.sender_(this.prepareMessage(message.BuyField.message));
            this.viewChanges_.enable(view.ViewElement.BUY_FIELD_BTN, false);
        }

        playerEndsTurn(): void {
            this.sender_(this.prepareMessage(message.EndOfTurn.message));
            this.viewChanges_.disableAllButtons();
        }

        private prepareMessage(title: string): any {
            let toSend: any = {};
            toSend[message.messageTitle] = title;
            return toSend;
        }

        activateBuildMode(): void {
            const buildable = this.model_.board.buildableFields(this.model_.users.myUsername());
            this.activateMode(model.ActionMode.BUILD, buildable);
        }

        activateSellMode(): void {
            const sellable = this.model_.board.fieldsWithSellableHouses(this.model_.users.myUsername());
            this.activateMode(model.ActionMode.SELL, sellable);
        }

        activateMortgageMode(): void {
            const toMortgage = this.model_.board.fieldsToMortgage(this.model_.users.myUsername());
            this.activateMode(model.ActionMode.MORTGAGE, toMortgage);
        }

        activateUnmortgageMode(): void {
            const toUnmortgage = this.model_.board.fieldsToUnmortgage(this.model_.users.myUsername());
            this.activateMode(model.ActionMode.UNMORTGAGE, toUnmortgage);
        }

        private activateMode(mode: model.ActionMode, toHighlight: Array<model.Field>): void {
            if (!this.model_.users.isMyTurn())
                return;
            this.setRoundMode(mode);
            this.viewChanges_.unhighlightAllFields();
            this.highlightOnly(toHighlight);
        }

        private highlightOnly(fields: Array<model.Field>): void {
            this.viewChanges_.unhighlightAllFields();
            this.viewChanges_.highlightFields(fields.map(f => f.id));
        }

        private setRoundMode(mode: model.ActionMode): void {
            this.model_.round.mode = mode;
        }

        fieldClicked(fieldId: number): void {
            if (!this.model_.users.isMyTurn()
                || this.model_.round.mode === model.ActionMode.NONE)
                return;
            if (!this.onClickHandlers_[this.model_.round.mode](fieldId))
                return;
            /* The model is updated when server sends confirmation message.
               The mode is set to NONE to avoid situation when server haven't
               responded yet and user clicked the field multiple times. */
            this.setRoundMode(model.ActionMode.NONE);
        }

        private buyHouse(fieldId: number): boolean {
            const blockIf = () => !this.model_.board.houseMayBeBoughtOn(fieldId, this.model_.users.myUsername())
                || this.model_.users.activeCash() < this.model_.board.priceOfHouseOn(fieldId);
            return this.sendMessageWithCheck(fieldId, blockIf, message.BuyHouse);
        }

        private sellHouse(fieldId: number): boolean {
            const blockIf = () => !this.model_.board.houseMayBeSoldOn(fieldId, this.model_.users.myUsername());
            return this.sendMessageWithCheck(fieldId, blockIf, message.SellHouse);
        }

        private mortgageField(fieldId: number): boolean {
            const blockIf = () => !this.model_.board.fieldMayBeMortgaged(fieldId, this.model_.users.myUsername());
            return this.sendMessageWithCheck(fieldId, blockIf, message.Mortgage);
        }

        private unmortgageField(fieldId: number): boolean {
            const blockIf = () => !this.model_.board.fieldMayBeUnmortgaged(fieldId, this.model_.users.myUsername());
            return this.sendMessageWithCheck(fieldId, blockIf, message.UnmortgageField);
        }

        private sendMessageWithCheck(fieldId: number,
                                     failureCondition: () => boolean,
                                     msgData: { message: string, field: string }): boolean {
            if (failureCondition())
                return false;
            let toSend = this.prepareMessage(msgData.message);
            toSend[msgData.field] = fieldId;
            this.sender_(toSend);
            return true;
        }
    }

}