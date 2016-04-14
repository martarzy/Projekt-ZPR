namespace model {

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
        private enemiesUsernames: Array<string> = [];

        // Model doesn't validate game rules so Logic needs to check
        // if the passed username is unique.

        addNewUser(username: string): void {
            this.enemiesUsernames = this.enemiesUsernames.concat(username);
        }

        getUsernames(): Array<string> {
            return this.enemiesUsernames.concat([this.myUsername]);
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
    }

}