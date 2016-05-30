/// <reference path="../model/model.ts" />

namespace view {

    export class View {
        private board: Board;

        constructor() {
            this.board = new Board();
            this.showSignInWindow();
            this.setDisabledReadyButton();
            this.setDisabledRollButton();

            this.collateralizeField(1);
        }

        public showSignInWindow() {
            $("#myModal").modal('show');
        }

        public hideSignInWindow() {
            $("#myModal").modal('hide');
        }

        public setActiveRollButton() {
            $('#roll-button').removeAttr('disabled');
        }

        public setDisabledRollButton() {
            $('#roll-button').removeAttr('active');
            $('#roll-button').attr('disabled', 1);
        }

        public setActiveReadyButton() {
            $('#ready-button').removeAttr('disabled');
        }

        public setDisabledReadyButton() {
            $('#ready-button').removeAttr('active');
            $('#ready-button').attr('disabled', 1);
        }

        public setActiveBuyButton() {
            $('#buy-button').removeAttr('disabled');
        }

        public setDisabledBuyButton() {
            $('#buy-button').removeAttr('active');
            $('#buy-button').attr('disabled', 1);
        }

        public setActiveEndTurnButton() {
            $('#end-turn-button').removeAttr('disabled');
        }

        public setDisabledEndTurnButton() {
            $('#end-turn-button').removeAttr('active');
            $('#end-turn-button').attr('disabled', 1);
        }

        public setActiveBuilButton() {
            $('#build-button').removeAttr('disabled');
        }

        public setDisabledBuildButton() {
            $('#build-button').removeAttr('active');
            $('#build-button').attr('disabled', 1);
        }

        public setActiveCollateralizeButton() {
            $('#collateralize-button').removeAttr('disabled');
        }

        public setDisabledCollateralizeButton() {
            $('#collateralize-button').removeAttr('active');
            $('#collateralize-button').attr('disabled', 1);
        }

        public setActiveSellButton() {
            $('#sell-button').removeAttr('disabled');
        }

        public setDisabledSellButton() {
            $('#sell-button').removeAttr('active');
            $('#sell-button').attr('disabled', 1);
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
            // TODO    
        }

        public highlightFields(fieldIds: Array<number>) {
            for (let i = 0; i < fieldIds.length; i++) {
                // pole o zadanym w tablicy nr
                var field = this.board.getField(fieldIds[i]);
                // wspolrzedne tego pola
           
                var x = field.getCoordX();
                var y = field.getCoordY();

                field.drawHighlightField(x, y);
            }
        }

        public unhighlightAllFields() {
            var highlightedFields = $(".highlighted-field");
            highlightedFields.remove();
        }

        public drawHousesOnField(fieldId: number, houseAmount: number) {
            this.board.getField(fieldId).buildHouses(fieldId, houseAmount);
        }

        public collateralizeField(fieldId: number) {
            this.board.getField(fieldId).collateralizeField(fieldId);
        }

        // public removeHouses..????
	}
}
