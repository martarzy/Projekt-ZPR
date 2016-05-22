namespace model {

    /*  Model doesn't validate game rules, so for example
        uniqueness of players usernames must be provided by controller */

    export class Model {
        private board_ = new BoardModel();
        private players_ = new PlayersModel();

        get board(): BoardModel {
            return this.board_;
        }

        get players(): PlayersModel {
            return this.players_;
        }
    }

    export class BoardModel {
        private board = new Board();
        private pawnsOwners = new collections.Dictionary<string, Pawn>();
        private pawnsPosition = new collections.Dictionary<Pawn, Field>();

        placePawnsOnBoard(usernames: Array<string>) {
            for (const username of usernames)
                this.pawnsOwners.setValue(username, new Pawn(Color.BLACK));
            this.pawnsOwners
                .forEach((username, pawn) => this.pawnsPosition.setValue(pawn, this.board.startField()));
        }

        movePawn(ownerUsername: string, rollResult: number): void {
            const targetPawn = this.pawnsOwners.getValue(ownerUsername);
            const currentField = this.pawnsPosition.getValue(targetPawn);
            const targetField = this.board.fieldInDistanceOf(currentField, rollResult);
            this.pawnsPosition.setValue(targetPawn, targetField);
        }
    }

    export class PlayersModel {
        private me: Player;
        private activeUsername: string;
        private enemies: Array<Player> = [];

        addNewUser(username: string): void {
            this.enemies = this.enemies.concat(new Player(username));
        }

        getUsernames(): Array<string> {
            return this.enemies.map(enemy => enemy.username)
                               .concat(this.me.username);
        }

        setMyUsername(myUsername: string): void {
            this.me = new Player(myUsername);
        }

        getMyUsername(): string {
            return this.me.username;
        }

        setActivePlayer(activeUsername: string): void {
            this.activeUsername = activeUsername;
        }
    }
}