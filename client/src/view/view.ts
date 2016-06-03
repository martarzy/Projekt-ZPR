/// <reference path="../model/model.ts" />

namespace view {

    export enum ViewElement {
        ROLL_BTN, READY_BTN, END_TURN_BTN, BUY_FIELD_BTN,
        BUY_HOUSE, SELL_HOUSE, MORTGAGE_BTN, UNMORTGAGE_BTN,
        ACCEPT_OFFER_BTN, DECLINE_OFFER_BTN, MAKE_BID_BTN,
        JAIL_PAY_BTN, JAIL_USE_CARD_BTN, BANKRUPTCY_BTN
    }

    export class View {
        private board: Board;

        constructor() {
            this.board = new Board();
            this.showSignInWindow();
            this.initButtonsIds();
        }

        private buttonsIds: { [elem: number]: string } = {};

        private initButtonsIds(): void {
            this.buttonsIds[ViewElement.ROLL_BTN] = "roll-button";
            this.buttonsIds[ViewElement.READY_BTN] = "ready-button";
            this.buttonsIds[ViewElement.BUY_FIELD_BTN] = "buy-button";
            this.buttonsIds[ViewElement.END_TURN_BTN] = "end-turn-button";
            this.buttonsIds[ViewElement.BUY_HOUSE] = "build-button";
            this.buttonsIds[ViewElement.SELL_HOUSE] = "sell-button";
            this.buttonsIds[ViewElement.MORTGAGE_BTN] = "mortgage-button";
            this.buttonsIds[ViewElement.UNMORTGAGE_BTN] = "unmortgage-button";
            this.buttonsIds[ViewElement.ACCEPT_OFFER_BTN] = "accept-offer-button";
            this.buttonsIds[ViewElement.DECLINE_OFFER_BTN] = "decline-offer-button";
            this.buttonsIds[ViewElement.MAKE_BID_BTN] = "make-bid-button";
            this.buttonsIds[ViewElement.JAIL_PAY_BTN] = "jail-pay-button";
            this.buttonsIds[ViewElement.JAIL_USE_CARD_BTN] = "jail-use-card-button";
            this.buttonsIds[ViewElement.BANKRUPTCY_BTN] = "bankruptcy-button";
        }

        public enableButton(id: ViewElement | number) {
            $("#" + this.buttonsIds[id]).removeAttr("disabled");
        }

        public disableButton(id: ViewElement | number) {
            $("#" + this.buttonsIds[id]).attr("disabled", 1);
        }

        public showSignInWindow() {
            $("#myModal").modal('show');
        }

        public hideSignInWindow() {
            $("#myModal").modal('hide');
        }

        public showError(msg: string) {
            document.getElementById("message").innerHTML = msg;
        }

        public updateUserList(list: Array<view.PlayerDTO>) {
            var other_players_list = $(".other-players-box").children().toArray();

            for (let i = 0; i < list.length; i++) {
                if (list[i].active) {
                    $(".current-player-name").text(list[i].username);
                    $(".current-player-money").text(list[i].cash);
                    $(".current-player-color").css("background-color", list[i].color);
                } else {
                    // Pobierz element z other_players z usunieciem
                    let other_player = other_players_list.shift();
                    let children = other_player.children;
                    $(children[0]).text(list[i].username);
                    $(children[1]).text(list[i].cash);
                    $(children[2]).css("background-color", list[i].color);
                }
            }
            // Trzeba czyscic pozostale pola!
            while(other_players_list.length)
            {
				let other_player = other_players_list.shift();
				let children = other_player.children;
				$(children[0]).text(" ");
                $(children[1]).text(" ");
            }
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

        public highlightFields(fieldNumbers: Array<number>) {
            return;
        }

        public unhighlightAllFields() {
            var highlightedFields = $(".highlighted-field");
            highlightedFields.remove();
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
	}
}
