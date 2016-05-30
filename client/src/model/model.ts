namespace model {

    /*  Model doesn't validate game rules, so for example
        uniqueness of players usernames must be provided by controller */

    export class Model {
        private board_ = new BoardModel();
        private players_ = new PlayersModel();
        private round_ = new Round();

        get board(): BoardModel {
            return this.board_;
        }

        get players(): PlayersModel {
            return this.players_;
        }

        get round(): Round {
            return this.round_;
        }
    }

    export class BoardModel {
        private board = new Board();
        private pawnsOwners = new collections.Dictionary<string, Pawn>();
        private pawnsPosition = new collections.Dictionary<Pawn, Field>();

        getField(ownerUsername: string): Field {
            return this.pawnsPosition.getValue(this.pawnsOwners.getValue(ownerUsername));
        }

        placePawnsOnBoard(players: Array<Player>) {
            for (const player of players)
                this.pawnsOwners.setValue(player.username, new Pawn(player.color));
            this.pawnsOwners
                .forEach((username, pawn) => this.pawnsPosition.setValue(pawn, this.board.startField()));
        }

        movePawn(ownerUsername: string, rollResult: number): void {
            const targetPawn = this.pawnsOwners.getValue(ownerUsername);
            const currentField = this.pawnsPosition.getValue(targetPawn);
            const targetField = this.board.fieldInDistanceOf(currentField, rollResult);
            this.pawnsPosition.setValue(targetPawn, targetField);
        }

        buyField(ownerUsername: string) {
            this.getField(ownerUsername).markAsBought(ownerUsername);
        }
        
        fieldsOwnedBy(owner: string): Array<Field> {
            return this.board.getFields()
                             .filter(field => field.ownerUsername() === owner);
        }
    }

    export class PlayersModel {
        private myUsername: string;
        private activeUsername: string;
        private players: Array<Player> = [];

        iAmActive(): boolean {
            return this.activeUsername === this.myUsername;
        }

        getPlayers(): Array<Player> {
            return this.players.slice();
        }

        resetPlayers(): void {
            this.players = [];
        }

        addNewUser(username: string, color: string): void {
            this.players = this.players.concat(new Player(username, color));
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

        getActivePlayerFunds(): number {
            return this.findActivePlayer().cash;
        }

        getActivePlayerColor(): string {
            return this.findActivePlayer().color;
        }

        private findActivePlayer(): Player {
            return this.players.filter(player => player.username === this.activeUsername)[0];
        }

        setCash(username: string, amount: number): void {
            this.players.filter(player => player.username === username)
                        .forEach(player => player.setCash(amount));
        }
    }
}
