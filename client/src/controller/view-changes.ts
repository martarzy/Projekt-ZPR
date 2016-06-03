﻿/// <reference path="../view/view.ts" />

namespace controller {

    export class ViewChanges {
        constructor(private view_: view.View) {
            this.disableAllButtons();
        }

        closeJoinModal(): void {
            this.view_.hideSignInWindow();
        }

        enable(button: view.Button, visible: boolean) {
            visible ? this.view_.enableButton(button) :
                      this.view_.disableButton(button);
        }

        enableButtonsOnRoundStart(): void {
            const buttons = [view.Button.BUY_HOUSE,
                             view.Button.SELL_HOUSE,
                             view.Button.ROLL,
                             view.Button.MORTGAGE,
                             view.Button.UNMORTGAGE,
                             view.Button.BANKRUPTCY];
            for (const button of buttons)
                this.enable(button, true);
        }

        errorMessage(msg: string) {
            this.view_.showError(msg);
        }

        disableAllButtons() {
            for (const elem in view.Button) {
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
            this.enable(view.Button.END_TURN, false);
            this.enable(view.Button.BUY_FIELD, false);
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

        showTradePanel(enemiesUsernames: Array<string>, myFields: Array<model.Field>) {
            // TODO
        }

        showEnemiesFields(selectedEnemyFields: Array<model.Field>): void {
            // TODO
        }

        clearTradePanel(): void {
            // TODO
        }

        closeTradeDecisionPanel(): void {
            // TODO
        }

        tradeSuccessful(): void {
            // TODO
        }

        tradeUnsuccessful(): void {
            // TODO
        }

        showTradeOffer(offeredCash: number,
                       offeredFields: Array<number>,
                       demandedCash: number,
                       demandedFields: Array<number>): void {
            // TODO
        }

        showJailExitOptions(canPay: boolean, canUseCard: boolean) {
            this.enable(view.Button.JAIL_PAY, canPay);
            this.enable(view.Button.JAIL_USE_CARD, canUseCard);
        }

        enableButtonsForCashBelowZero(): void {
            this.disableAllButtons();
            const toEnable = [view.Button.SELL_HOUSE,
                              view.Button.MORTGAGE,
                              view.Button.OFFER_TRADE,
                              view.Button.BANKRUPTCY];

            toEnable.forEach(button => this.enable(button, true));
        }

        enableButtonsForCashAboveZero(): void {
            this.disableAllButtons();
            this.enableButtonsOnRoundStart();
            const toDisable = [view.Button.ROLL];

            toDisable.forEach(button => this.enable(button, false));
        }


    }

}