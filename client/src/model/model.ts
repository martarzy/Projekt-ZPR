/// <reference path="board-model.ts" />
/// <reference path="players-model.ts" />

namespace model {

    /*  Model doesn't validate game rules, so for example
        uniqueness of players usernames must be provided by controller */

    export class Model {
        private board_ = new BoardModel();
        private players_ = new PlayersModel();
        private round_ = new Round();

        get boardModel(): BoardModel {
            return this.board_;
        }

        get playersModel(): PlayersModel {
            return this.players_;
        }

        get round(): Round {
            return this.round_;
        }
    }
    
}
