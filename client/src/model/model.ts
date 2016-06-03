/// <reference path="board-model.ts" />
/// <reference path="players-model.ts" />

namespace model {

    /*  Model doesn't validate game rules, so for example
        uniqueness of players usernames must be provided by controller */

    export class Model {
        private board_ = new BoardModel();
        private users_ = new PlayersModel();
        private round_ = new Round();

        get board(): BoardModel {
            return this.board_;
        }

        get users(): PlayersModel {
            return this.users_;
        }

        get round(): Round {
            return this.round_;
        }
    }
    
}
