﻿/// <reference path="../view/view.ts" />

namespace controller {

    export class ViewChanges {
        constructor(private view_: view.View) {
            this.disableAllButtons();
        }

        closeJoinModal(): void {
            this.view_.hideSignInWindow();
        }

        enable(button: view.ID) {
            this.view_.enableButton(button);
        }

        disable(button: view.ID) {
            this.view_.disableButton(button);
        }

        enableTradeDecisions(): void {
            this.enable(view.ID.ACCEPT_TRADE);
            this.enable(view.ID.DECLINE_TRADE);
        }

        enableReadyIf(condition: boolean): void {
            if (condition)
                this.enable(view.ID.READY);
        }

        enableEndOfTurnIf(condition: boolean): void {
            if (condition)
                this.enable(view.ID.END_TURN);
        }

        enableBuyFieldIf(condition: boolean): void {
            if (condition)
                this.enable(view.ID.BUY_FIELD);
        }

        enableButtonsOnRoundStart(): void {
            const buttons = [ view.ID.ROLL,
                              view.ID.BANKRUPTCY,
                              view.ID.CHOOSE_PLAYER_TO_TRADE];
            for (const button of buttons)
                this.enable(button);
        }

        displayErrorMessage(msg: string) {
            this.view_.showError(msg);
        }

        disableAllButtons() {
            for (const elem in view.ID) {
                const toNumber = parseInt(elem);
                if (!isNaN(toNumber))
                    this.view_.disableButton(toNumber);
            }
        }

        updatePlayersList(players: Array<view.PlayerDTO>) {
            this.view_.updateUserList(players);
            this.view_.initUserList(players);
        }

        startGame(players: Array<view.PlayerDTO>) {
            this.view_.initPawnsDictionary(players);
        }

        disableButtonsWhilePawnIsMoving(): void {
            this.disable(view.ID.BUY_FIELD);
            this.disable(view.ID.END_TURN);
        }

        movePawn(player: string, targetField: number, onPawnMoveEnd: () => void) {
            this.view_.movePawn(player, targetField, onPawnMoveEnd);
        }

        colorField(fieldNumber: number, color: string) {
            this.view_.setBoughtFieldColor(fieldNumber, color);
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

        listEnemiesToTrade(enemiesUsernames: Array<string>, callback: () => void): void {
            this.view_.selectPlayerToTrade(enemiesUsernames);
            this.view_.onPlayerChosen(callback);
        }

        listMyFieldsToTrade(names: Array<string>): void {
            this.view_.selectOfferedFieldsToTrade(names);
        }

        listEnemyFieldsToTrade(names: Array<string>): void {
            this.view_.selectRequestedFieldsToTrade(names);
        }

        showRollResults(dice1: number, dice2: number) {
            this.view_.showDices(dice1, dice2);
        }

        enemyChosenToTrade(): string {
            return this.view_.getSelectedPlayer();
        }

        clearTradePanel(): void {
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

        enableAfterTradeTargetChoose(): void {
            const toEnable = [view.ID.CHOOSE_FIELDS_TO_OFFER, view.ID.CHOOSE_FIELDS_TO_REQUIRE,
                view.ID.OFFERED_MONEY, view.ID.REQUESTED_MONEY, view.ID.OFFER_TRADE];
            this.enableGroup(toEnable);
        }

        private enableGroup(toEnable: view.ID[]): void {
            toEnable.forEach(id => this.enable(id));
        }

        enableDynamic(id: string, callback: () => void) {
            this.view_.enableInfoWindowButton(id, callback);
        }

        disableDynamic(id: string) {
            this.view_.disableInfoWindowButton(id);
        }

        showJailExitOptions(canPay: boolean, canUseCard: boolean) {
            if (canPay)
                this.enable(view.ID.JAIL_PAY);
            if (canUseCard)
                this.enable(view.ID.JAIL_USE_CARD);
        }

        disableJailExitOptions(): void {
            this.disable(view.ID.JAIL_PAY);
            this.disable(view.ID.JAIL_USE_CARD);
        }


        enableButtonsProvidingCash(): void {
            this.disableAllButtonsButBankruptcy();
            const toEnable = [view.ID.OFFER_TRADE];

            toEnable.forEach(button => this.enable(button));
        }

        enableButtonsForAcceptableCash(playerAlreadyMoved: boolean): void {
            this.disableAllButtonsButBankruptcy();
            this.enableButtonsOnRoundStart();
            if (playerAlreadyMoved)
                this.enable(view.ID.END_TURN);
            const toDisable = [view.ID.ROLL];

            toDisable.forEach(button => this.disable(button));
        }

        private disableAllButtonsButBankruptcy(): void {
            this.disableAllButtons();
            this.enable(view.ID.BANKRUPTCY);
        }

    }

}
