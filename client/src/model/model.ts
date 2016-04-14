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
        private pawnsAssigment = new collections.Dictionary<string, Pawn>();
        private fields: Array<Field>;

        movePawn(ownerUsername: string, rollResult: number): void {
            const targetPawn = this.pawnsAssigment.getValue(ownerUsername);
        }
    }

	export class PlayersModel {
        private myUsername: string;
        private activeUsername: string;
        private enemiesUsernames: Array<string>;

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
            // TODO
        }

        setReady(username: string): void {
            // TODO
        }
	}

}