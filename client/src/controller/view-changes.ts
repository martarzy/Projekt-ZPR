/// <reference path="../view/view.ts" />

namespace controller {

    export class ViewChanges {
        constructor(private view_: view.View) {
            this.disableAllButtons();
        }

        showJoinModal(decision: boolean): void {
            decision ? this.view_.showSignInWindow():
                       this.view_.hideSignInWindow();
        }

        enable(button: view.ViewElement, visible: boolean) {
            visible ? this.view_.enableButton(button) :
                      this.view_.disableButton(button);
        }

        enableButtonsOnRoundStart(): void {
            const buttons = [view.ViewElement.BUY_HOUSE,
                             view.ViewElement.SELL_HOUSE,
                             view.ViewElement.ROLL_BTN,
                             view.ViewElement.MORTGAGE_BTN,
                             view.ViewElement.UNMORTGAGE_BTN];
            for (const button of buttons)
                this.enable(button, true);
        }

        errorMessage(msg: string) {
            this.view_.showError(msg);
        }

        disableAllButtons() {
            for (const elem in view.ViewElement) {
                const toNumber = parseInt(elem);
                if (!isNaN(toNumber))
                    this.view_.disableButton(toNumber);
            }
        }

        updatePlayerList(players: Array<view.PlayerDTO>) {
            this.view_.updateUserList(players);
        }

        startGame(players: Array<view.PlayerDTO>) {
            this.view_.initPawnsDictionary(players);
        }

        movePawn(player: string, targetField: number, onPawnMoveEnd: () => void) {
            this.enable(view.ViewElement.END_TURN_BTN, false);
            this.enable(view.ViewElement.BUY_FIELD_BTN, false);
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