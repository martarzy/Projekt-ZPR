/// <reference path="../model/model.ts" />

namespace view {

    export class View {
        private board: Board;

        constructor() {
            this.board = new Board();
            this.showSignInWindow();
            this.setDisabledReadyButton();
            this.setDisabledRollButton();
        }

        showSignInWindow() {
            $("#myModal").modal('show');
        }

        hideSignInWindow() {
            $("#myModal").modal('hide');
        }

        setActiveRollButton() {
            $('#roll-button').removeAttr('disabled');
        }

        setDisabledRollButton() {
            $('#roll-button').removeAttr('active');
            $('#roll-button').attr('disabled', 1);
        }

        setActiveReadyButton() {
            $('#ready-button').removeAttr('disabled');
        }

        setDisabledReadyButton() {
            $('#ready-button').removeAttr('active');
            $('#ready-button').attr('disabled', 1);
        }

        showError(msg: string) {
            document.getElementById("message").innerHTML = msg;
        }

        updateUserList(list: Array<view.PlayerDTO>) {
            // @todo
            var other_players_list = $(".other-players-box").children().toArray();

            for (let i = 0; i < list.length; i++) {
                if (list[i].active) {
                    $(".current-player-name").val(list[i].username);
                    $(".current-player-money").val(list[i].cash);
                    // jeszcze ustawianie koloru --> @todo
                    // ...
                } else {
                    // Pobierz element z other_players z usunieciem
                    let other_player = other_players_list.shift();
                    let children = other_player.children;
                    $(children[0]).text(list[i].username);
                    $(children[1]).text(list[i].cash);
                    // jeszcze ustawianie koloru --> @todo
                }
            }
        }

        initPawnsDictionary(list: Array<view.PlayerDTO>) {
            for (let i = 0; i < list.length; i++)
                this.board.addPawn(list[i].username);
        }
	}
}