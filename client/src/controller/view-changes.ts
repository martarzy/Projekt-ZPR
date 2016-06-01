/// <reference path="../view/view.ts" />
/// <reference path="../../lib/collections.d.ts" />

namespace controller {

    export enum ViewElement {
        ROLL_BTN, READY_BTN, END_TURN_BTN, BUY_FIELD_BTN,
        JOIN_MODAL, BUY_HOUSE, SELL_HOUSE, MORTGAGE_BTN
    }

    export class ViewChanges {
        private enablers_: collections.Dictionary<ViewElement, () => void>;
        private disablers_: collections.Dictionary<ViewElement, () => void>;

        constructor(private view_: view.View, private model_: model.Model) {
            this.initialiseButtonEnablers();
            this.disableAllButtons([ViewElement.JOIN_MODAL]);
        }

        private initialiseButtonEnablers() {
            this.enablers_ = new collections.Dictionary<ViewElement, () => void>();
            this.disablers_ = new collections.Dictionary<ViewElement, () => void>();
            this.enablers_.setValue(ViewElement.ROLL_BTN, this.view_.setActiveRollButton);
            this.disablers_.setValue(ViewElement.ROLL_BTN, this.view_.setDisabledRollButton);
            this.enablers_.setValue(ViewElement.READY_BTN, this.view_.setActiveReadyButton);
            this.disablers_.setValue(ViewElement.READY_BTN, this.view_.setDisabledReadyButton);
            this.enablers_.setValue(ViewElement.END_TURN_BTN, this.view_.setActiveEndTurnButton);
            this.disablers_.setValue(ViewElement.END_TURN_BTN, this.view_.setDisabledEndTurnButton);
            this.enablers_.setValue(ViewElement.BUY_FIELD_BTN, this.view_.setActiveBuyButton);
            this.disablers_.setValue(ViewElement.BUY_FIELD_BTN, this.view_.setDisabledBuyButton);
            this.enablers_.setValue(ViewElement.BUY_HOUSE, this.view_.setActiveBuilButton);
            this.disablers_.setValue(ViewElement.BUY_HOUSE, this.view_.setDisabledBuildButton);
            this.enablers_.setValue(ViewElement.SELL_HOUSE, this.view_.setActiveSellButton);
            this.disablers_.setValue(ViewElement.SELL_HOUSE, this.view_.setDisabledSellButton);
            this.enablers_.setValue(ViewElement.MORTGAGE_BTN, this.view_.setActiveMortgageButton);
            this.disablers_.setValue(ViewElement.MORTGAGE_BTN, this.view_.setDisabledMortgageButton);
            this.enablers_.setValue(ViewElement.JOIN_MODAL, this.view_.showSignInWindow);
            this.disablers_.setValue(ViewElement.JOIN_MODAL, this.view_.hideSignInWindow);
        }

        enable(name: ViewElement, visible: boolean) {
            const map = visible ? this.enablers_ : this.disablers_;
            map.getValue(name).call(this.view_);
        }

        enableButtonsOnRoundStart(): void {
            const buttons = [ViewElement.BUY_HOUSE, ViewElement.SELL_HOUSE, ViewElement.ROLL_BTN, ViewElement.MORTGAGE_BTN];
            for (const button of buttons)
                this.enable(button, true);
        }

        errorMessage(msg: string) {
            this.view_.showError(msg);
        }

        disableAllButtons(except: Array<ViewElement> = []) {
            this.disablers_.forEach((k, v) => {
                if (except.indexOf(k) < 0)
                    v.call(this.view_)
            });
        }

        updatePlayerList(players: Array<view.PlayerDTO>) {
            this.view_.updateUserList(players);
        }

        startGame(players: Array<view.PlayerDTO>) {
            this.view_.initPawnsDictionary(players);
        }

        movePawn(player: string, targetField: number, onPawnMoveEnd: () => void) {
            this.enable(ViewElement.END_TURN_BTN, false);
            this.enable(ViewElement.BUY_FIELD_BTN, false);
            this.view_.movePawn(player, targetField, onPawnMoveEnd);
        }

        colorField(fieldNumber: number, color: string) {
            this.view_.setBoughtFieldColor(fieldNumber, color);
        }

        highlightFields(fieldIds: Array<number>): void {
            this.view_.highlightFields(fieldIds);
        }

        unhighlightAllFields(): void {
            this.view_.unhighlightAllFields();
        }

        drawHousesOnField(fieldId: number, houseAmount: number) {
            this.view_.drawHousesOnField(fieldId, houseAmount);
        }

        mortgageField(id: number): void {
            this.view_.mortgageField(id);
        }

        unmortgageField(id: number): void {
            this.view_.unmortgageField(id);
        }
    }

}