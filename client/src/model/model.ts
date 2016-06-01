/// <reference path="../../lib/collections.d.ts" />
/// <reference path="board.ts" />
/// <reference path="pawn.ts" />
/// <reference path="utils.ts" />

namespace model {

    /*  Model doesn't validate game rules, so for example
        uniqueness of players usernames must be provided by controller */

    export class Model {
        private board_ = new BoardModel();
        private players_ = new PlayersModel();
        private round_ = new Round();

        get boardModel(): BoardModel {
            return this.board_;
        }

        get playersModel(): PlayersModel {
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

        priceOfHouseOn(fieldId: number) {
            return this.board_.getField(fieldId).houseCost;
        }

        placePawnsOnBoard(players: Array<Player>) {
            for (const player of players)
                this.pawnsOwners_.setValue(player.username, new Pawn(player.color));
            this.pawnsOwners_
                .forEach((username, pawn) => this.pawnsPosition_.setValue(pawn, this.board_.startField()));
        }

        movePawn(ownerUsername: string, rollResult: number): void {
            const pawn = this.pawnsOwners_.getValue(ownerUsername);
            const currentField = this.pawnsPosition_.getValue(pawn);
            const targetField = this.board_.fieldInDistanceOf(currentField, rollResult);
            this.pawnsPosition_.setValue(pawn, targetField);
        }

        buyField(ownerUsername: string): void {
            this.getField(ownerUsername).markAsBought(ownerUsername);
        }

        expansibleFields(username: string): Array<Field> {
            let fields = this.fieldsOwnedBy(username)
                .filter(f => f.expansible());
            let expansible: Array<Field> = [];
            while (fields.length != 0) {
                const districtId = fields[0].group;
                const fieldsPartitionedById = utils.partition(fields, (f: Field) => f.group === districtId);
                if (this.ownsWholeDistrict(username, districtId))
                    expansible = expansible.concat(this.findExpansibleInGivenDistrict(fieldsPartitionedById[0]));
                fields = fieldsPartitionedById[1];
            }
            return expansible;
        }

        fieldsWithSellableHouses(owner: string): Array<Field> {
            const owned = this.fieldsOwnedBy(owner);
            const ownedWithHouses = owned.filter(f => f.housesBuilt > 0);
            return ownedWithHouses.filter(f => {
                const maxHouses = Math.max(...owned.filter(o => f.group === o.group).map(o => o.housesBuilt));
                return maxHouses - f.housesBuilt < 1;
            });
        }

        groupFieldsByGroup(fields: Array<Field>): { [key: string]: Array<Field> } {
            let dict: {[key: string]: Array<Field>} = {};
            fields.forEach(f => {
                if (!dict[f.group])
                    dict[f.group] = [f];
                else
                    dict[f.group].push(f);
            });
            return dict;
        }

        mortgageField(id: number) {
            this.board_.getField(id).mortgage(true);
        }

        fieldsToMortgage(owner: string): Array<Field> {
            return this.fieldsOwnedBy(owner)
                .filter(f => this.canBeMortgaged(f, owner));
        }

        fieldMayBeMortgaged(fieldId: number, username: string): boolean {
            return this.canBeMortgaged(this.field(fieldId), username);
        }

        private canBeMortgaged(field: Field, owner: string) {
            return !field.isMortgaged
                && field.housesBuilt === 0
                && field.ownerUsername() === owner;
        }

        fieldsToUnmortgage(owner: string): Array<Field> {
            return this.fieldsOwnedBy(owner)
                .filter(f => this.canBeUnmortgaged(f, owner));
        }

        fieldMayBeUnmortgaged(fieldId: number, username: string): boolean {
            return this.canBeUnmortgaged(this.field(fieldId), username);
        }

        private canBeUnmortgaged(field: Field, owner: string) {
            return field.isMortgaged
                && field.ownerUsername() === owner;
        }

        private field(id: number): Field {
            return this.board_.getField(id);
        }

        unmortgageField(id: number) {
            this.board_.getField(id).mortgage(false);
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

        houseMayBeBoughtOn(fieldId: number, username: string): boolean {
            return this.checkIfIdMatches(fieldId, this.expansibleFields(username));
        }

        houseMayBeSoldOn(fieldId: number, username: string): boolean {
            return this.checkIfIdMatches(fieldId, this.fieldsWithSellableHouses(username));
        }

        private checkIfIdMatches(fieldId: number,
                                 fields: Array<model.Field>): boolean {
            return fields.some(f => f.id === fieldId);
        }

        private findExpansibleInGivenDistrict(district: Array<Field>): Array<Field> {
            const minHouseAmount = Math.min(...district.map(f => f.housesBuilt));
            return district.filter(f => f.housesBuilt <= minHouseAmount);
        }

        private ownsWholeDistrict(username: string, districtId: string): boolean {
            return !this.board_.getFields()
                .filter(f => f.group === districtId)
                .some(f => f.ownerUsername() !== username);
        }

        private fieldsOwnedBy(username: string): Array<Field> {
            return this.board_.getFields()
                .filter(field => field.ownerUsername() === username);
        }
    }

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
