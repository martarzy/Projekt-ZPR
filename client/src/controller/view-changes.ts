﻿/// <reference path="../view/view.ts" />

namespace controller {

    /**
     * Class used by the UserActions and ServerHandler to manipulate
     * view. It was meant to be convenient facade but it contains many
     * methods which just forward arguments to the View class. Even though
     * it contains nice methods transforming data to and from TradeOfferDTO.
     * It should be rewritten to provide more methods of this kind.
     */
    export class ViewChanges {
        constructor(private view_: view.View) {
            this.disableAllButtons();
        }

        closeJoinModal(): void {
            this.view_.hideSignInWindow();
        }

        enable(button: view.ID): void {
            this.view_.enableButton(button);
        }

        disable(button: view.ID): void {
            this.view_.disableButton(button);
        }

        enableTradeDecisions(): void {
            this.enable(view.ID.ACCEPT_TRADE);
            this.enable(view.ID.DECLINE_TRADE);
            this.view_.switchToTradePanel();
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
            const buttons = [view.ID.ROLL,
                view.ID.BANKRUPTCY,
                view.ID.CHOOSE_PLAYER_TO_TRADE];
            for (const button of buttons)
                this.enable(button);
        }

        clearTradePanel(): void {
            this.view_.clearTradeWindow();
        }

        displayErrorMessage(msg: string): void {
            this.view_.showError(msg);
        }

        disableAllButtons(): void {
            for (const elem in view.ID) {
                const toNumber = parseInt(elem);
                if (!isNaN(toNumber))
                    this.view_.disableButton(toNumber);
            }
        }

        updatePlayersList(players: Array<view.PlayerDTO>): void {
            this.view_.updateUserList(players);
            this.view_.initUserList(players);
        }

        logMessage(message: string): void {
            this.view_.addHistoryMessage(message);
        }

        startGame(players: Array<view.PlayerDTO>): void {
            this.view_.initPawnsDictionary(players);
        }

        disableButtonsWhilePawnIsMoving(): void {
            this.disable(view.ID.BUY_FIELD);
            this.disable(view.ID.END_TURN);
        }

        movePawn(player: string,
                 targetField: number,
                 onPawnMoveEnd: () => void,
                 forward: boolean = true): void {
            this.view_.movePawn(player, targetField, onPawnMoveEnd, forward);
        }

        colorField(fieldNumber: number, color: string): void {
            this.view_.setBoughtFieldColor(fieldNumber, color);
        }

        drawHousesOnField(fieldId: number, houseAmount: number): void {
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

        showRollResults(dice1: number, dice2: number): void {
            this.view_.showDices(dice1, dice2);
        }

        enemyChosenToTrade(): string {
            return this.view_.getSelectedPlayer();
        }

        showGameOverScreen(gameOverMsg: string): void {
            this.view_.showEndOfGameWindow(gameOverMsg);
        }

        /**
         * Collects trade info from view. In the current version of the game
         * cash is not considered to be a real number. Moreover view sends everything
         * in the string form so parsing is neccessary. As the not filled elements
         * are passed as the undefined, the default values were required ( in the form
         * of emptyArrayIfNaN and zeroIfNaN ).
         */
        collectTradeInfo(): model.TradeOfferDTO {
            const cashOffered = parseInt(this.view_.getOfferedMoney());
            const cashRequired = parseInt(this.view_.getRequestedMoney());
            const fieldsOffered = parseInt(this.view_.getOfferedField());
            const fieldsRequired = parseInt(this.view_.getRequestedField());
            return new model.TradeOfferDTO(this.zeroIfNaN(cashOffered),
                                           this.zeroIfNaN(cashRequired),
                                           this.emptyArrayIfNaN(fieldsOffered),
                                           this.emptyArrayIfNaN(fieldsRequired));
        }

        /**
         * Displays offered trade on the screen of the target player the active
         * wants to trade with. 
         * @param info trade offer to display
         */
        displayTradeInfo(info: model.TradeOfferDTO): void {
            this.view_.setOfferedMoney(String(info.cashOffered));
            this.view_.setRequestedMoney(String(info.cashRequired));
            if (info.offeredFields.length > 0)
                this.view_.setOfferedField(String(info.offeredFields[0]));
            if (info.requiredFields.length > 0)
                this.view_.setRequestedField(String(info.requiredFields[0]));
        }

        private zeroIfNaN(toTest: number): number {
            return isNaN(toTest) ? 0 : toTest;
        }

        private emptyArrayIfNaN(toTest: number): number[] {
            return isNaN(toTest) ? [] : [toTest];
        }

        /**
         * Enables buttons and fields after choosing the other player
         * to trade with.
         */
        enableAfterTradeTargetChoose(): void {
            const toEnable = [view.ID.CHOOSE_FIELDS_TO_OFFER,
                              view.ID.CHOOSE_FIELDS_TO_REQUIRE,
                              view.ID.OFFERED_MONEY,
                              view.ID.REQUESTED_MONEY,
                              view.ID.OFFER_TRADE];
            this.enableGroup(toEnable);
        }

        private enableGroup(toEnable: view.ID[]): void {
            toEnable.forEach(id => this.enable(id));
        }

        enableFieldCardButton(id: string, callback: () => void) {
            this.view_.enableInfoWindowButton(id, callback);
        }

        disableFieldCardButton(id: string): void {
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
            this.enable(view.ID.OFFER_TRADE);
        }

        enableButtonsForAcceptableCash(playerAlreadyMoved: boolean): void {
            this.disableAllButtonsButBankruptcy();
            this.enableButtonsOnRoundStart();
            if (playerAlreadyMoved)
                this.enable(view.ID.END_TURN);
            this.disable(view.ID.ROLL);
        }

        private disableAllButtonsButBankruptcy(): void {
            this.disableAllButtons();
            this.enable(view.ID.BANKRUPTCY);
        }
    }
}
