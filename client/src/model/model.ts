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
        private myUsername: string;
        private activeUsername: string;
        private players: Array<Player> = [];

        getPlayers(): Array<Player> {
            return this.players;
        }

        addNewUser(username: string): void {
            this.players = this.players.concat(new Player(username));
        }

        getUsernames(): Array<string> {
            return this.players.map(player => player.username);
        }

        setMyUsername(myUsername: string): void {
            this.myUsername = myUsername;
        }

        getMyUsername(): string {
            return this.myUsername;
        }

        setActivePlayer(activeUsername: string): void {
            this.activeUsername = activeUsername;
        }

        getActivePlayer(): string {
            return this.activeUsername;
        }

        setCash(username: string, amount: number): void {
            this.players.filter(player => player.username === username)
                        .forEach(player => player.setCash(amount));
        }
    }
}