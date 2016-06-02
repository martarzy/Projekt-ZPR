/// <reference path="domain/player.ts" />

namespace model {

    export class PlayersModel {
        private myUsername_: string;
        private activeUsername_: string;
        private players_: Array<Player> = [];

        myTurnInProgress(): boolean {
            return this.activeUsername_ === this.myUsername_;
        }

        getPlayers(): Array<Player> {
            return this.players_.slice();
        }

        removeAllPlayer(): void {
            this.players_ = [];
        }

        addNewUser(username: string, color: string): void {
            this.players_ = this.players_.concat(new Player(username, color));
        }

        allUsernames(): Array<string> {
            return this.players_.map(player => player.username);
        }

        saveMyUsername(myUsername: string): void {
            this.myUsername_ = myUsername;
        }

        myUsername(): string {
            return this.myUsername_;
        }

        changeActivePlayer(newActiveUsername: string): void {
            this.activeUsername_ = newActiveUsername;
        }

        activePlayerUsername(): string {
            return this.activeUsername_;
        }

        activePlayerFunds(): number {
            return this.activePlayer().cash;
        }

        activePlayerColor(): string {
            return this.activePlayer().color;
        }

        private activePlayer(): Player {
            return this.players_.filter(player => player.username === this.activeUsername_)[0];
        }

        setCash(username: string, amount: number): void {
            this.players_.filter(player => player.username === username)
                .forEach(player => player.setCash(amount));
        }
    }

}