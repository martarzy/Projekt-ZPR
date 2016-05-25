/// <reference path="../model/model.ts" />

namespace view {

	export class View {
		private boardView: BoardView;
        private playersView: PlayersView;



		constructor(model: model.Model) { 
			this.boardView = new BoardView(model.board);
            this.playersView = new PlayersView(model.players);
		}

		updateBoard(): void { 
			this.boardView.update();
		}
		
		updatePlayers(): void {
			this.playersView.update();
        }

        showSignInWindow(): void {
            $("#myModal").modal('show');
        }

        hideSignInWindow(): void {
            //$('#submit-username').attr("disabled");
            $("#myModal").modal('hide');
        }

        setActiveRollButton(): void {
            $('#roll-button').removeClass('disabled');
            $('#roll-button').addClass('active');
        }

        setDisabledRollButton(): void {
            $('#roll-button').removeClass('active');
            $('#roll-button').addClass('disabled');
        }

        setActiveReadyButton(): void {
            $('#ready-button').removeClass('disabled');
            $('#ready-button').addClass('active');
        }

        setDisabledReadyButton(): void {
            $('#ready-button').removeClass('active');
            $('#ready-button').addClass('disabled');
        }
	}

	class BoardView {
		constructor(private model: model.BoardModel) { }
		update(): void {}
	}

	class PlayersView {
		constructor(private model: model.PlayersModel) { }
		update(): void { }
	}

}