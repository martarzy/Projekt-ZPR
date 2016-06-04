/// <reference path="../model/model.ts" />

namespace view {

    export enum Button {
        ROLL, READY, END_TURN, BUY_FIELD,
        BUY_HOUSE, SELL_HOUSE, MORTGAGE, UNMORTGAGE,
        ACCEPT_TRADE, DECLINE_TRADE, OFFER_TRADE,
        JAIL_PAY, JAIL_USE_CARD, BANKRUPTCY
    }

    export class View {
        private board: Board;

        private buttonsIds: { [elem: number]: string } = { };

        private initButtonsIds(): void {
            this.buttonsIds[Button.ROLL] = "roll-button";
            this.buttonsIds[Button.READY] = "ready-button";
            this.buttonsIds[Button.BUY_FIELD] = "buy-button";
            this.buttonsIds[Button.END_TURN] = "end-turn-button";
            this.buttonsIds[Button.BUY_HOUSE] = "build-button";
            this.buttonsIds[Button.SELL_HOUSE] = "sell-button";
            this.buttonsIds[Button.MORTGAGE] = "mortgage-button";
            this.buttonsIds[Button.UNMORTGAGE] = "unmortgage-button";
            this.buttonsIds[Button.ACCEPT_TRADE] = "accept-offer-button";
            this.buttonsIds[Button.DECLINE_TRADE] = "decline-offer-button";
            this.buttonsIds[Button.OFFER_TRADE] = "make-bid-button";
            this.buttonsIds[Button.JAIL_PAY] = "jail-pay-button";
            this.buttonsIds[Button.JAIL_USE_CARD] = "jail-use-card-button";
            this.buttonsIds[Button.BANKRUPTCY] = "bankruptcy-button";
        }

        private initTabs() {
            $('.nav-tabs a').click(function(e) {
                e.preventDefault();
                console.log(this);
                $(this).tab('show');
            })
        }

        constructor()
        {
            this.board = new Board();
            this.showSignInWindow();
            this.initButtonsIds();
            this.initTabs();
        }

        public enableButton(id: Button | number) {
            $("#" + this.buttonsIds[id]).removeAttr("disabled");
        }

        public disableButton(id: Button | number) {
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
            for (let i = 0; i < list.length; i++) {
                if (list[i].active) {
                    $(".player-name")[i].style.fontWeight = "bold";
                }
                else {
                    $(".player-name")[i].style.fontWeight = "normal";
                }
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
