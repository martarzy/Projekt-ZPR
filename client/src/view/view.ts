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