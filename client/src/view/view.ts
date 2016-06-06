/// <reference path="../model/model.ts" />

namespace view {

    export enum ID {
        ROLL, READY, END_TURN, BUY_FIELD,
        ACCEPT_TRADE, DECLINE_TRADE, OFFER_TRADE,
        JAIL_PAY, JAIL_USE_CARD, BANKRUPTCY,
        CHOOSE_PLAYER_TO_TRADE, CHOOSE_FIELDS_TO_OFFER,
        CHOOSE_FIELDS_TO_REQUIRE, OFFERED_MONEY, REQUESTED_MONEY
    }

    export class View {
        private board: Board;
        private dices: Dices;

        private buttonsIds: { [elem: number]: string } = {};

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

        constructor() {
            this.board = new Board();
            this.showSignInWindow();
            this.initButtonsIds();
            this.initTabs();
            this.dices = new Dices();
        }

        idOf(id: view.ID): string {
            return this.buttonsIds[id];
        }

        private initTabs() {
            $('.nav-tabs a').click(function(e) {
                e.preventDefault();
                $(this).tab('show');
            })
        }

        public enableButton(id: ID | number) {
            $("#" + this.buttonsIds[id]).removeAttr("disabled");
        }

        public disableButton(id: ID | number) {
            $("#" + this.buttonsIds[id]).attr("disabled", 1);
        }

        public showSignInWindow() {
            $("#myModal").modal('show');
        }

        public hideSignInWindow() {
            $("#myModal").modal('hide');
        }

        public enableInfoWindowButton(id: string, listener: () => any) {
            var info_button = d3.select("#" + id);
            info_button.select("text").attr("fill", "black");
            info_button.on("click", listener);
        }

        public disableInfoWindowButton(id: string) {
            var info_button = d3.select("#" + id);
            info_button.select("text").attr("fill", "gray");
            info_button.on("click", null);
        }

        public showError(msg: string) {
            document.getElementById("message").innerHTML = msg;
        }

        public initUserList(list: Array<view.PlayerDTO>) {
            for (let i = 0; i < list.length; i++) {
                $(".player-name")[i].innerHTML = list[i].username;
                $(".player-money")[i].innerHTML = (list[i].cash).toString();
                $(".player-row")[i].style.backgroundColor = list[i].color;
            }
        }

        public updateUserList(list: Array<view.PlayerDTO>) {
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

        public switchToTradePanel(): void {
            $("#trade-panel > a").click();
        }

        public initPawnsDictionary(list: Array<view.PlayerDTO>) {
            for (let i = 0; i < list.length; i++)
                this.board.addPawn(list[i].username, list[i].color);
        }

        public movePawn(pawnName: string, fieldNumber: number, onMovingEnd: () => any) {
            this.board.movePawn(pawnName, fieldNumber, onMovingEnd);
        }

        public setBoughtFieldColor(fieldNumber: number, color: string) {
            var field = this.board.getField(fieldNumber);
            field.changeBoughtFieldColor(color);
        }

        public assignFieldClickedCallback(callback: (clickedId: number) => void) {
            var gAllElements = d3.selectAll("g");
            gAllElements.on("click", function () {
                callback(parseInt((<HTMLElement>this).getAttribute("game-id")));
            });
        }

        public drawHousesOnField(fieldNumber: number, houseAmount: number) {
            this.board.getField(fieldNumber).buildHouses(fieldNumber, houseAmount);
        }

        public mortgageField(fieldNumber: number) {
            this.board.getField(fieldNumber).mortgageField(fieldNumber);
        }

        public unmortgageField(fieldNumber: number) {
            this.board.getField(fieldNumber).unmortgageField(fieldNumber);
        }

        public buyBackField(fieldNumber: number) {
            this.board.getField(fieldNumber).buyBackField(fieldNumber);
        }

        // Wybieranie z dropdown menu
        public selectValueFromDropdownMenu(dropdownId: string) {
            $("#" + dropdownId).children("li").click(function (e) {
                $(this).parents(".btn-group").find('.btn').html(
                    $(this).text() + "<span class=\"caret\"></span>"
                );
                e.preventDefault();
            });
        }

        public selectPlayerToTrade(list: Array<string>) {
            // pobierz wszystkich graczy
            $("#players-menu").children().remove();
            for (var i = 0; i < list.length; i++)
                $("#players-menu").append('<li><a href="#">' + list[i] + '</a></li>');
            // wybierz odpowiedniego gracza i wyswietl na przycisku
            this.selectValueFromDropdownMenu("players-menu");
        }

        public selectOfferedFieldsToTrade(list: Array<string>) {
            $("#offered-menu").children().remove();
            for (var i = 0; i < list.length; i++)
                $("#offered-menu").append('<li><a href="#">' + list[i] + '</a></li>');
            // dodatkowe puste pole
            $("#offered-menu").append('<li><a href="#">Brak</a></li>');

            this.selectValueFromDropdownMenu("offered-menu");
        }

        public selectRequestedFieldsToTrade(list: Array<string>) {
            $("#requested-menu").children().remove();
            for (var i = 0; i < list.length; i++)
                $("#requested-menu").append('<li><a href="#">' + list[i] + '</a></li>');
            $("#requested-menu").append('<li><a href="#">Brak</a></li>');

            this.selectValueFromDropdownMenu("requested-menu");
        }

        public onPlayerChosen(listener: () => any)
        {
            $("#players-menu").children("li").click(function (e) {
                listener();
                e.preventDefault();
            });
        }

        // todo
        public clearTradeWindow() {
            this.setOfferedMoney("");
            this.setRequestedMoney("");
            this.setOfferedField("Wybierz pole");
            this.setRequestedField("Wybierz pole");
            this.setSelectedPlayer("Wybierz gracza");

        }

        // getter - pole z wybranym graczem (przeciwnikiem)
        public getSelectedPlayer(): string {
            return $("#player-to-trade-button").text();
        }

        // getter - pole z oferowana kwota
        public getOfferedMoney(): string {
            var offeredMoney = $('#offered-money').val();
            return offeredMoney;
        }

        // getter - pole z zadana kwota
        public getRequestedMoney(): string {
            var requestedMoney = $('#requested-money').val();
            return requestedMoney;
        }

        // getter - oferowane pole
        public getOfferedField(): string {
            return $("#offered-field-button").text();
        }

        // getter - zadane pole
        public getRequestedField(): string {
            return $("#requested-field-button").text();
        }

        // setter - wybrany gracz
        public setSelectedPlayer(playerName: string) {
            $("#player-to-trade-button").text(playerName);
        }

        // setter - oferowana kwota
        public setOfferedMoney(offeredMoney: string) {
            $("#offered-money").val(offeredMoney);
        }

        // setter - zadana kwota
        public setRequestedMoney(requestedMoney: string) {
            $("#requested-money").val(requestedMoney);
        }

        // setter - oferowane pole
        public setOfferedField(offeredFieldName: string) {
            $("#offered-field-button").text(offeredFieldName);
        }

        // setter - zadane pole
        public setRequestedField(requestedFieldName: string) {
            $("#requested-field-button").text(requestedFieldName);
        }

        public showDices(firstDice: number, secondDice: number) {
            this.dices.setValue(firstDice, secondDice);
        }
	}
}
