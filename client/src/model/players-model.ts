/// <reference path="domain/player.ts" />

namespace model {

    export class PlayersModel {
        private myUsername_: string;
        private activeUsername_: string;
        private players_: Array<Player> = [];

        addNew(username: string, color: string): void {
            this.players_.push(new Player(username, color));
        }

        removeAll(): void {
            this.players_ = [];
        }

        getAll(): Array<Player> {
            return this.players_.slice();
        }

        usernames(): Array<string> {
            return this.players_.map(player => player.username);
        }

        isMyTurn(): boolean {
            return this.activeUsername_ === this.myUsername_;
        }

        setMyUsername(myUsername: string): void {
            this.myUsername_ = myUsername;
        }

        myUsername(): string {
            return this.myUsername_;
        }

        setActive(newActiveUsername: string): void {
            this.activeUsername_ = newActiveUsername;
        }

        activeUsername(): string {
            return this.activeUsername_;
        }

        activeCash(): number {
            return this.activePlayer().cash;
        }

        activeColor(): string {
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