/// <reference path="../model/model.ts" />

namespace view {
    /**
    * enum with buttons ID
    */
    export enum ID {
        ROLL, READY, END_TURN, BUY_FIELD,
        ACCEPT_TRADE, DECLINE_TRADE, OFFER_TRADE,
        JAIL_PAY, JAIL_USE_CARD, BANKRUPTCY,
        CHOOSE_PLAYER_TO_TRADE, CHOOSE_FIELDS_TO_OFFER,
        CHOOSE_FIELDS_TO_REQUIRE, OFFERED_MONEY, REQUESTED_MONEY
    }

    /**
     * Represents View in MVC in client.
     * Stores Board and Dices.
     */
    export class View {
        private board: Board;
        private dices: Dices;

        private buttonsIds: { [elem: number]: string } = {};

        /**
         * Assigns names to buttons.
         */
        private initButtonsIds(): void {
            this.buttonsIds[ID.ROLL] = "roll-button";
            this.buttonsIds[ID.READY] = "ready-button";
            this.buttonsIds[ID.BUY_FIELD] = "buy-button";
            this.buttonsIds[ID.END_TURN] = "end-turn-button";
            this.buttonsIds[ID.ACCEPT_TRADE] = "accept-offer-button";
            this.buttonsIds[ID.DECLINE_TRADE] = "decline-offer-button";
            this.buttonsIds[ID.OFFER_TRADE] = "make-bid-button";
            this.buttonsIds[ID.JAIL_PAY] = "jail-pay-button";
            this.buttonsIds[ID.JAIL_USE_CARD] = "jail-use-card-button";
            this.buttonsIds[ID.BANKRUPTCY] = "bankruptcy-button";
            this.buttonsIds[ID.CHOOSE_PLAYER_TO_TRADE] = "player-to-trade-button";
            this.buttonsIds[ID.CHOOSE_FIELDS_TO_OFFER] = "offered-field-button";
            this.buttonsIds[ID.CHOOSE_FIELDS_TO_REQUIRE] = "requested-field-button";
            this.buttonsIds[ID.OFFERED_MONEY] = "offered-money";
            this.buttonsIds[ID.REQUESTED_MONEY] = "requested-money";
        }

        /**
         * Creates board and dices, shows window to sign in game.
         */
        constructor() {
            this.board = new Board();
            this.showSignInWindow();
            this.initButtonsIds();
            this.initTabs();
            this.dices = new Dices();
        }

        /**
         * Returns button id
         * @param id 
         */
        idOf(id: view.ID): string {
            return this.buttonsIds[id];
        }

        /**
         * Initializes tabs in DOM. Adds click event on tabs.
         */
        private initTabs() {
            $('.nav-tabs a').click(function(e) {
                e.preventDefault();
                $(this).tab('show');
            })
        }

        /**
         * Initializes pawns dictionary.
         * @param list list of players
         */
        initPawnsDictionary(list: Array<view.PlayerDTO>): void {
            for (let i = 0; i < list.length; i++)
                this.board.addPawn(list[i].username, list[i].color);
        }

        /**
        * Moves chosen pawn on chosen field.
        * @param pawnName
        * @param fieldNumber
        * @param onMovingEnd
        * @param forward
        */
        movePawn(pawnName: string, fieldNumber: number, onMovingEnd: () => any, forward: boolean): void {
            this.board.movePawn(pawnName, fieldNumber, onMovingEnd, forward);
        }
        /**
         * Makes chosen button enable.
         * @param id button id
         */
        enableButton(id: ID | number): void {
            $("#" + this.buttonsIds[id]).removeAttr("disabled");
        }

       /**
         * Makes chosen button disable.
         * @param id button id
         */
        disableButton(id: ID | number): void {
            $("#" + this.buttonsIds[id]).attr("disabled", 1);
        }

        /**
         * Shows sign in window.
         */
        showSignInWindow(): void {
            $("#myModal").modal('show');
        }

       /**
         * Hide sign in window.
         */
        hideSignInWindow(): void {
            $("#myModal").modal('hide');
        }

        /**
         * Shows error in sign in window.
         * @param msg message to show
         */
        showError(msg: string): void {
            document.getElementById("message").innerHTML = msg;
        }

        /**
         * Shows message in window after the end of game.
         * @param messageGameEnd message to show in window after the end of game
         */
        showEndOfGameWindow(messageGameEnd: string): void {
            $("#game-end").modal('show');
            $("#message-game-end").text(messageGameEnd);
        }

        /**
         * Allows player to click od chosen buuton in field's information window.
         * @param id button id
         * @param listener calback after clicking 
         */
        enableInfoWindowButton(id: string, listener: () => any): void {
            var info_button = d3.select("#" + id);
            info_button.select("text").attr("fill", "black");
            info_button.on("click", listener);
        }

        /**
         * Prohibits player to click od chosen buuton in field's information window.
         * @param id button id
         */
        disableInfoWindowButton(id: string): void {
            var info_button = d3.select("#" + id);
            info_button.select("text").attr("fill", "gray");
            info_button.on("click", null);
        }

        /**
         * Initializes players list in DOM.
         * @param list list of players
         */
        initUserList(list: Array<view.PlayerDTO>): void {
            d3.selectAll(".player-row")
                .style("background-color", "white");
            d3.selectAll(".player-money")
                .text("");
            d3.selectAll(".player-name")
                .text("");

            for (let i = 0; i < list.length; i++) {
                $(".player-name")[i].innerHTML = list[i].username;
                $(".player-money")[i].innerHTML = (list[i].cash).toString();
                $(".player-row")[i].style.backgroundColor = list[i].color;
            }
        }

        /**
         * Updates list of players in DOM.
         * @param list list of players
         */
        updateUserList(list: Array<view.PlayerDTO>): void {
            for (let i = 0; i < list.length; i++) {
                if (list[i].active) {
                    $(".player-name")[i].style.textDecoration = "underline";
                    $(".player-money")[i].style.textDecoration = "underline";
                }
                else {
                    $(".player-name")[i].style.textDecoration = "none";
                    $(".player-money")[i].style.textDecoration = "none";
                }
            }
        }

        /**
         * Changes color of bought field.
         * @param fieldNumber field's number
         * @param color color
         */
        setBoughtFieldColor(fieldNumber: number, color: string): void {
            var field = this.board.getField(fieldNumber);
            field.changeBoughtFieldColor(color);
        }

        /**
         * Assigns callback to clicked field.
         * @param callback callback after clicking on chosen field
         */
        assignFieldClickedCallback(callback: (clickedId: number) => void): void {
            var gAllElements = d3.selectAll("g");
            gAllElements.on("click", function () {
                callback(parseInt((<HTMLElement>this).getAttribute("game-id")));
            });
        }

        /**
         * Draws colorful rectagles on fields - houses. Calls board method to build house.
         * @param fieldNumber field's number
         * @param houseAmount amount of houses to draw
         */
        drawHousesOnField(fieldNumber: number, houseAmount: number): void {
            this.board.getField(fieldNumber).buildHouses(fieldNumber, houseAmount);
        }

        /**
         * Calls board method to mortgage field.
         * @param fieldNumber field's number
         */
        mortgageField(fieldNumber: number): void {
            this.board.getField(fieldNumber).mortgageField(fieldNumber);
        }

       /**
         * Calls board method to unmortgage field.
         * @param fieldNumber field's number
         */
        unmortgageField(fieldNumber: number): void {
            this.board.getField(fieldNumber).unmortgageField(fieldNumber);
        }

        /**
         * Shows message in textarea in DOM.
         * @param message message to show
         */
        addHistoryMessage(message: string): void {
            $("#history-box").val(message + "\n" + $("#history-box").val());
        }

        /**
         * Cwitch to trade panel view.
         */
        switchToTradePanel(): void {
            $("#trade-panel > a").click();
        }

        /**
         * To choose from dropdown menu
         * @param dropdownId dropdown menu id in DOM
         */
        selectValueFromDropdownMenu(dropdownId: string): void {
            $("#" + dropdownId).children("li").click(function (e) {
                $(this).parents(".btn-group").find('.btn').html(
                    $(this).text() + "<span class=\"caret\"></span>"
                );
                e.preventDefault();
            });
        }

        /**
         * Removes list in dropdown menu
         * @param id dropdown menu id
         */
        removeDropdownMenuChildren(id: string): void {
            $("#" + id).children().remove();
        }

        /**
         * Sets player name on button after making a choice
         * @param list list of players
         */
        selectPlayerToTrade(list: Array<string>): void {
            this.removeDropdownMenuChildren("players-menu");
            for (var i = 0; i < list.length; i++)
                $("#players-menu").append('<li><a href="#">' + list[i] + '</a></li>');
            this.selectValueFromDropdownMenu("players-menu");
        }

        /**
         * Sets offered field to trade on button after making a choice
         * @param list list of players
         */
        selectOfferedFieldsToTrade(list: Array<string>): void {
            this.removeDropdownMenuChildren("offered-menu");
            for (var i = 0; i < list.length; i++)
                $("#offered-menu").append('<li><a href="#">' + list[i] + '</a></li>');
            // empty field
            $("#offered-menu").append('<li><a href="#">Brak</a></li>');
            this.selectValueFromDropdownMenu("offered-menu");
        }

        /**
         * Sets requested field to trade on button after making a choice
         * @param list list of players
         */
        selectRequestedFieldsToTrade(list: Array<string>): void {
            this.removeDropdownMenuChildren("requested-menu");
            $("#").children().remove();
            for (var i = 0; i < list.length; i++)
                $("#requested-menu").append('<li><a href="#">' + list[i] + '</a></li>');
            $("#requested-menu").append('<li><a href="#">Brak</a></li>');

            this.selectValueFromDropdownMenu("requested-menu");
        }

        /**
         * To actions on dropdown menu.
         * @param listener callback to trade events
         */
        onPlayerChosen(listener: () => any): void
        {
            $("#players-menu").children("li").click(function (e) {
                listener();
                e.preventDefault();
            });
        }

        /**
         * Clears trade window after making a deal.
         */
        clearTradeWindow(): void {
            this.setOfferedMoney("");
            this.setRequestedMoney("");
            
            this.setOfferedField("Wybierz pole");
            this.setRequestedField("Wybierz pole");
            this.setSelectedPlayer("Wybierz gracza");
            

            this.removeDropdownMenuChildren("players-menu");
            this.removeDropdownMenuChildren("offered-menu");
            this.removeDropdownMenuChildren("requested-menu");
        }

        /**
         * Returns field with chosen player
         */
        getSelectedPlayer(): string {
            return $("#player-to-trade-button").text();
        }

       /**
         * Returns field with offered money
         */
        getOfferedMoney(): string {
            var offeredMoney = $('#offered-money').val();
            return offeredMoney;
        }

       /**
         * Returns field with requested money
         */
        getRequestedMoney(): string {
            var requestedMoney = $('#requested-money').val();
            return requestedMoney;
        }

       /**
         * Returns field with offered field
         */
        getOfferedField(): string {
            return $("#offered-field-button").text();
        }

       /**
         * Returns chosen field
         */
        getRequestedField(): string {
            return $("#requested-field-button").text();
        }

       /**
         * Sets button with chosen player
         */
        setSelectedPlayer(playerName: string): void {
            $("#player-to-trade-button").text(playerName);
        }

       /**
         * Sets field with offered money
         */
        setOfferedMoney(offeredMoney: string): void {
            $("#offered-money").val(offeredMoney);
        }

       /**
         * Sets field with requested money
         */
        setRequestedMoney(requestedMoney: string): void {
            $("#requested-money").val(requestedMoney);
        }

       /**
         * Sets button with offered field
         */
        setOfferedField(offeredFieldName: string): void {
            $("#offered-field-button").text(offeredFieldName);
        }

       /**
         * Sets button with chosen field
         */
        setRequestedField(requestedFieldName: string): void {
            $("#requested-field-button").text(requestedFieldName);
        }

        /**
         * Calls dices methon to show right images.
         * @param firstDice number on first dice
         * @param secondDice number on second dice
         */
        public showDices(firstDice: number, secondDice: number) {
            this.dices.setValue(firstDice, secondDice);
        }
	}
}
