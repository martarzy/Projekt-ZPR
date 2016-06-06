/// <reference path="../view/view.ts" />

namespace controller {

    export class ViewChanges {
        constructor(private view_: view.View) {
            this.disableAllButtons();
        }

        closeJoinModal(): void {
            this.view_.hideSignInWindow();
        }

        enable(button: view.Button) {
            this.view_.enableButton(button);
        }

        disable(button: view.Button) {
            this.view_.disableButton(button);
        }

        enableTradeDecisions(): void {
            this.enable(view.Button.ACCEPT_TRADE);
            this.enable(view.Button.DECLINE_TRADE);
        }

        enableReadyIf(condition: boolean): void {
            if (condition)
                this.enable(view.Button.READY);
        }

        enableEndOfTurnIf(condition: boolean): void {
            if (condition)
                this.enable(view.Button.END_TURN);
        }

        enableBuyFieldIf(condition: boolean): void {
            if (condition)
                this.enable(view.Button.BUY_FIELD);
        }

        enableButtonsOnRoundStart(): void {
            const buttons = [ view.Button.ROLL,
                              view.Button.BANKRUPTCY];
            for (const button of buttons)
                this.enable(button);
        }

        displayErrorMessage(msg: string) {
            this.view_.showError(msg);
        }

        disableAllButtons() {
            for (const elem in view.Button) {
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
            this.disable(view.Button.BUY_FIELD);
            this.disable(view.Button.END_TURN);
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

        listEnemiesToTrade(enemiesUsernames: Array<string>): void {
            this.view_.selectPlayerToTrade(enemiesUsernames);
        }

        listMyFieldsToTrade(fieldsIds: Array<number>): void {
            //this.view_.selectOfferedFieldToTrade(fieldsIds);
        }

        listEnemyFieldsToTrade(fieldsIds: Array<number>): void {
            //this.view_.selectRequestedFieldToTrade(fieldsIds);
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

        enableDynamic(id: string, callback: () => void) {
            this.view_.enableInfoWindowButton(id, callback);
        }

        disableDynamic(id: string) {
            this.view_.disableInfoWindowButton(id);
        }

        showJailExitOptions(canPay: boolean, canUseCard: boolean) {
            if (canPay)
                this.enable(view.Button.JAIL_PAY);
            if (canUseCard)
                this.enable(view.Button.JAIL_USE_CARD);
        }

        disableJailExitOptions(): void {
            this.disable(view.Button.JAIL_PAY);
            this.disable(view.Button.JAIL_USE_CARD);
        }


        enableButtonsProvidingCash(): void {
            this.disableAllButtonsButBankruptcy();
            const toEnable = [view.Button.OFFER_TRADE];

            toEnable.forEach(button => this.enable(button));
        }

        enableButtonsForAcceptableCash(playerAlreadyMoved: boolean): void {
            this.disableAllButtonsButBankruptcy();
            this.enableButtonsOnRoundStart();
            if (playerAlreadyMoved)
                this.enable(view.Button.END_TURN);
            const toDisable = [view.Button.ROLL];

            toDisable.forEach(button => this.disable(button));
        }

        private disableAllButtonsButBankruptcy(): void {
            this.disableAllButtons();
            this.enable(view.Button.BANKRUPTCY);
        }

    }

}
