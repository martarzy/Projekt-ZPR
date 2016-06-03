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

        get(username: string): Player {
            return this.players_.filter(p => p.username === username)[0];
        }

        getMe(): Player {
            return this.get(this.myUsername_);
        }

        getAll(): Array<Player> {
            return this.players_.slice();
        }

        getEnemies(): Array<string> {
            return this.players_.filter(p => p.username !== this.myUsername_)
                                .map(p => p.username);
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
            return this.get(this.activeUsername_);
        }

        setCash(username: string, amount: number): void {
            this.get(username).setCash(amount);
        }

        addCash(username: string, amount: number): void {
            const player = this.get(username);
            player.cash += amount;
        }
    }

}