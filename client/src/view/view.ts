/// <reference path="../model/model.ts" />

namespace view {

    export class View {

        constructor() {
            this.showSignInWindow();
            this.setDisabledReadyButton();
            this.setDisabledRollButton();
        }

        // mapa nazwa_gracza->pionek
        dictionary: { [playerName: string]: Pawn; } = {};

        showSignInWindow(): void {
            $("#myModal").modal('show');
        }

        hideSignInWindow(): void {
            $("#myModal").modal('hide');
        }

        setActiveRollButton(): void {
            $('#roll-button').removeAttr('disabled');
        }

        setDisabledRollButton(): void {
            $('#roll-button').removeAttr('active');
            $('#roll-button').attr('disabled', 1);
        }

        setActiveReadyButton(): void {
            $('#ready-button').removeAttr('disabled');
        }

        setDisabledReadyButton(): void {
            $('#ready-button').removeAttr('active');
            $('#ready-button').attr('disabled', 1);
        }

        showError(msg: string): void {
            document.getElementById("message").innerHTML = msg;
        }

        updateUserList(list: Array<view.PlayerDTO>): void {
            // @todo
            var other_players_list = $(".other-players-box").toArray();

            for (var i = 0; i < list.length; i++) {
                if (list[i].active) {
                    $(".current-player-name").val(list[i].username);
                    $(".current-player-money").val(list[i].cash);
                    // jeszcze ustawianie koloru --> @todo
                    // ...
                } else {
                    // Pobierz element z other_players z usunieciem
                    var other_player = other_players_list.shift();
                    other_player.children(".player-name").val(list[i].username);
                    other_player.children(".player-money").val(list[i].cash);
                    // jeszcze ustawianie koloru --> @todo
                }
            }
        }

        movePawn(username: string, targetFieldNumber: number): void {
            //@todo
        }
	}
}