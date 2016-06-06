/// <reference path="message.ts" />
/// <reference path="../model/model.ts" />

namespace controller {

    /**
     * Describes all actions that client needs to accomplish after specified
     * user actions (events on DOM elements).
     */
    export class UserActions {
        private recentlyOpenedField_ = 0;

        /**
         * Uses view parameter only in constructor and doesn't store it.
         * It needs it only to assign callback triggered when field is clicked
         * on the board.
         * @param sender_ Function taking message to send as the parameter
         * @param model_ 
         * @param view
         * @param viewChanges_ 
         */
        constructor(private sender_: (arg: any) => void,
                    private model_: model.Model,
                    view_: view.View,
                    private viewChanges_: ViewChanges) {
            this.bindDOMElements();
            view_.assignFieldClickedCallback(this.fieldClicked.bind(this));
        }

        bindDOMElements(): void {
            const usernameField = this.byId("username");
            this.byId("submit-username").onclick = () => this.chooseName(usernameField.value);
            this.byId("ready-button").onclick = () => this.playerIsReady();
            this.byId("roll-button").onclick = () => this.rollDice();
            this.byId("buy-button").onclick = () => this.playerBuysField();
            this.byId("end-turn-button").onclick = () => this.playerEndsTurn();
            this.byId("jail-pay-button").onclick = () => this.exitJailPaying();
            this.byId("jail-use-card-button").onclick = () => this.exitJailUsingChanceCard();
            this.byId("bankruptcy-button").onclick = () => this.declareBankruptcy();
            this.byId("make-bid-button").onclick = () => this.offerTrade();
            this.byId("accept-offer-button").onclick = () => this.responseTrade(true);
            this.byId("decline-offer-button").onclick = () => this.responseTrade(false);
            this.byId("player-to-trade-button").onclick = () => this.choosePlayerToTrade();
            this.byId("offered-field-button").onclick = () => this.chooseMyFieldsToTrade();
            this.byId("requested-field-button").onclick = () => this.chooseEnemyFieldsToTrade();
        }

        byId(id: string): HTMLInputElement {
            return document.getElementById(id) as HTMLInputElement;
        }

        /**
         * Prepares and sends message specifying
         * chosen username of the new player.
         * @param name chosen username to verify
         */
        chooseName(name: string): void {
            let toSend = this.prepareMessage(message.MyName.message);
            toSend[message.MyName.name] = name;
            this.sender_(toSend);
            this.model_.users.setMyUsername(name);
        }

        playerIsReady(): void {
            this.sender_(this.prepareMessage(message.Ready.message));
            this.viewChanges_.disable(view.ID.READY);
        }

        rollDice(): void {
            this.sender_(this.prepareMessage(message.RollDice.message));
            this.viewChanges_.disable(view.ID.ROLL);
        }

        playerBuysField(): void {
            this.sender_(this.prepareMessage(message.BuyField.message));
            this.viewChanges_.disable(view.ID.BUY_FIELD);
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

        /**
         * Handles click on the board field. Stores clicked field's id
         * for further processing (build, sell etc.)
         * @param fieldId id of clicked field
         */
        fieldClicked(fieldId: number): void {
            this.recentlyOpenedField_ = fieldId;
            this.updateVisibilityOfDynamicButtons();
        }

        private userCanBuyHouseOn(fieldId: number): boolean {
            return this.model_.board.houseMayBeBoughtOn(fieldId, this.model_.users.myUsername())
                && this.model_.users.activeCash() >= this.model_.board.priceOfHouseOn(fieldId);
        }

        private buyHouse(fieldId: number): boolean {
            const passCondition = this.userCanBuyHouseOn.bind(this, fieldId);
            return this.sendMessageWithCheck(fieldId, passCondition, message.BuyHouse);
        }

        private userCanSellHouseOn(fieldId: number): boolean {
            return this.model_.board.houseMayBeSoldOn(fieldId, this.model_.users.myUsername());
        }

        private sellHouse(fieldId: number): boolean {
            const passCondition = this.userCanSellHouseOn.bind(this, fieldId);
            return this.sendMessageWithCheck(fieldId, passCondition, message.SellHouse);
        }

        private userCanMortgageField(fieldId: number): boolean {
            return this.model_.board.fieldMayBeMortgaged(fieldId, this.model_.users.myUsername());
        }

        private mortgageField(fieldId: number): boolean {
            const passCondition = this.userCanMortgageField.bind(this, fieldId);
            return this.sendMessageWithCheck(fieldId, passCondition, message.Mortgage);
        }

        private userCanUnmortgageField(fieldId: number): boolean {
            return this.model_.board.fieldMayBeUnmortgaged(fieldId, this.model_.users.myUsername());
        }

        private unmortgageField(fieldId: number): boolean {
            const passCondition = this.userCanUnmortgageField.bind(this, fieldId);
            return this.sendMessageWithCheck(fieldId, passCondition, message.UnmortgageField);
        }

        private sendMessageWithCheck(fieldId: number,
                                     passCondition: () => boolean,
                                     msgData: { message: string, field: string }): boolean {
            if (!passCondition())
                return false;
            let toSend = this.prepareMessage(msgData.message);
            toSend[msgData.field] = fieldId;
            this.sender_(toSend);
            return true;
        }

        /**
         * Triggers when "choose player" in trade panel clicked.
         * It sends enemies usernames to view so player can choose
         * the enemy to trade with.
         */
        choosePlayerToTrade(): void {
            const others = this.model_.users.getEnemies();
            this.viewChanges_.listEnemiesToTrade(others, () => this.viewChanges_.enableAfterTradeTargetChoose());
        }

        /**
         * Triggers when "select my field" in trade panel clicked.
         * It sends owned fields ids to view so player can choose
         * the field he offers to his enemy.
         */
        chooseMyFieldsToTrade(): void {
            const myFields = this.model_.board.fieldsToMortgage(this.model_.users.myUsername());
            this.viewChanges_.listMyFieldsToTrade(myFields.map(f => String(f.id)));
        }

        /**
         * Triggers when "select enemy field" in trade panel clicked.
         * Enemy's variant of chooseMyFieldsToTrade. The username is
         * taken from view. Sends empty list if enemy was not chosen.
         */
        chooseEnemyFieldsToTrade(): void {
            const enemy = this.viewChanges_.enemyChosenToTrade();
            if (enemy === undefined || enemy === "") {
                this.viewChanges_.listEnemyFieldsToTrade([]);
                return;
            }                
            const myFields = this.model_.board.fieldsToMortgage(enemy);
            this.viewChanges_.listEnemyFieldsToTrade(myFields.map(f => String(f.id)));
        }

        /**
         * Enables or disables buttons displayed on the field card
         * due to user's state. It disables all of them if user is not
         * in his turn or if he is not the owner of the opened field.
         * Otherwise it tests enable condition for every button. 
         */
        updateVisibilityOfDynamicButtons() {
            if (!this.model_.users.isMyTurn()
                || !this.isOwnedByMe(this.recentlyOpenedField_)) {
                this.disableAllDynamicButtons();
                return;
            }

            const field = this.recentlyOpenedField_;

            this.changeDynamicButton("build-button",
                                     this.buyHouse.bind(this, field),
                                     this.userCanBuyHouseOn(field));

            this.changeDynamicButton("sell-button",
                                     this.sellHouse.bind(this, field),
                                     this.userCanSellHouseOn(field));

            this.changeDynamicButton("mortgage-button",
                                     this.mortgageField.bind(this, field),
                                     this.userCanMortgageField(field));

            this.changeDynamicButton("unmortgage-button",
                                     this.unmortgageField.bind(this, field),
                                     this.userCanUnmortgageField(field));
        }

        private changeDynamicButton(id: string, callback: () => void, enable: boolean): void {
            if (enable)
                this.viewChanges_.enableDynamic(id, callback);
            else
                this.viewChanges_.disableDynamic(id);
        }

        private isOwnedByMe(id: number) {
            return this.model_.board.ownsField(this.model_.users.myUsername(), id);
        }

        /**
         * Disables all buttons displayed on the field card without
         * testing user state.
         */
        disableAllDynamicButtons() {
            this.viewChanges_.disableDynamic("build-button");
            this.viewChanges_.disableDynamic("sell-button");
            this.viewChanges_.disableDynamic("mortgage-button");
            this.viewChanges_.disableDynamic("unmortgage-button");
        }

        /**
         * Prepares and sends message with trade offer from active player.
         * Takes neccessary data from the view getters, clears trade
         * panel and disables all buttons.
         */
        offerTrade(): void {
            const offer = this.viewChanges_.collectTradeInfo();
            const toSend = this.prepareMessage(message.Trade.message);
            toSend[message.Trade.otherUsername] = this.viewChanges_.enemyChosenToTrade();
            toSend[message.Trade.offeredCash] = offer.cashOffered;
            toSend[message.Trade.demandedCash] = offer.cashRequired;
            toSend[message.Trade.offeredFields] = offer.offeredFields;
            toSend[message.Trade.demandedFields] = offer.requiredFields;
            this.sender_(toSend);
            this.viewChanges_.clearTradePanel();
            this.viewChanges_.disableAllButtons();
            this.viewChanges_.clearTradePanel();
        }

        /**
         * Prepares and sends message with trade answer.
         * @param decision Specifies if trade was accepted or rejected.
         */
        responseTrade(decision: boolean): void {
            const toSend = this.prepareMessage(message.TradeAnswer.message);
            toSend[message.TradeAnswer.decision] = decision;
            this.sender_(toSend);
            this.clearViewAfterTradeDecision();
        }

        /**
         * Disables all buttons and clears trade panel.
         * Exposed as public to don't duplicate code in server-handler.
         */
        clearViewAfterTradeDecision(): void {
            this.viewChanges_.disableAllButtons();
            this.viewChanges_.clearTradePanel();
        }

        /**
         * Prepares message informing about paying to exit jail.
         * It returns without sending message if player doesn't have neccessary cash to pay.
         */
        exitJailPaying() {
            const me = this.model_.users.getMe();
            if (me.cash < 50)
                return;
            me.inJail = false;
            this.viewChanges_.enableButtonsOnRoundStart();
            this.exitJailWithMethod("pay");
        }

        /**
         * Prepares message informing about using chance card to exit jail.
         * It returns without sending message if player doesn't have mentioned card.
         */
        exitJailUsingChanceCard() {
            const me = this.model_.users.getMe();
            if (me.jailExitCards === 0)
                return;
            me.inJail = false;
            --me.jailExitCards;
            this.viewChanges_.enableButtonsOnRoundStart();
            this.exitJailWithMethod("useCard");
        }

        private exitJailWithMethod(method: string): void {
            this.viewChanges_.enable(view.ID.END_TURN);
            this.viewChanges_.disableJailExitOptions();
            let toSend = this.prepareMessage(message.GetOut.message);
            toSend[message.GetOut.method] = method;
            this.sender_(toSend);
        }

        /**
         * Prepares and sends message with banruptcy declaration.
         */
        declareBankruptcy(): void {
            this.viewChanges_.disableAllButtons();
            this.sender_(this.prepareMessage(message.DeclareBankruptcy.message));
        }
    }

}