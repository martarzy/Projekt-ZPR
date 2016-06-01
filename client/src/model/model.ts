/// <reference path="../../lib/collections.d.ts" />

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
        private board_ = new Board();
        private pawnsOwners_ = new collections.Dictionary<string, Pawn>();
        private pawnsPosition_ = new collections.Dictionary<Pawn, Field>();

        getField(ownerUsername: string): Field {
            return this.pawnsPosition_.getValue(this.pawnsOwners_.getValue(ownerUsername));
        }

        placePawnsOnBoard(players: Array<Player>) {
            for (const player of players)
                this.pawnsOwners_.setValue(player.username, new Pawn(player.color));
            this.pawnsOwners_
                .forEach((username, pawn) => this.pawnsPosition_.setValue(pawn, this.board_.startField()));
        }

        movePawn(ownerUsername: string, rollResult: number): void {
            const targetPawn = this.pawnsOwners_.getValue(ownerUsername);
            const currentField = this.pawnsPosition_.getValue(targetPawn);
            const targetField = this.board_.fieldInDistanceOf(currentField, rollResult);
            this.pawnsPosition_.setValue(targetPawn, targetField);
        }

        buyField(ownerUsername: string) {
            this.getField(ownerUsername).markAsBought(ownerUsername);
        }

        expansibleFields(owner: string): Array<Field> {
            let fields = this.fieldsOwnedBy(owner)
                             .filter(f => f.expansible());
            let results: Array<Field> = [];
            while (fields.length != 0) {
                const currentGroup = fields[0].group;
                if (this.userOwnsWholeDistinct(owner, currentGroup)) {
                    const chosenFields = fields.filter(f => f.group === currentGroup);
                    const minHouseAmount = this.minOf(chosenFields.map(f => f.housesBuilt));
                    chosenFields.filter(f => f.housesBuilt <= minHouseAmount)
                        .forEach(f => results.push(f));
                }                
                fields = fields.filter(f => f.group !== currentGroup);                
            }
            return results;
        }

        private minOf(numbers: Array<number>): number {
            return numbers.reduce((x, y) => Math.min(x, y));
        }

        private userOwnsWholeDistinct(username: string, targetGroup: string) {
            return this.board_.getFields()
                            .filter(f => f.group === targetGroup)
                            .every(f => f.ownerUsername() === username);
        }

        fieldsWithSellableHouses(owner: string): Array<Field> {
            return this.fieldsOwnedBy(owner)
                       .filter(f => f.housesBuilt > 0);
        }


        private fieldsOwnedBy(owner: string): Array<Field> {
            return this.board_.getFields()
                             .filter(field => field.ownerUsername() === owner);
        }

        buyHouseOn(fieldId: number): void {
            this.board_.getField(fieldId).buyHouse();
        }

        sellHouseOn(fieldId: number): void {
            this.board_.getField(fieldId).sellHouse();
        }

        houseAmountOn(fieldId: number): number {
            return this.board_.getField(fieldId).housesBuilt;
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
