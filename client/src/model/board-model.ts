/// <reference path="domain/board.ts" />
/// <reference path="domain/colors.ts" />
/// <reference path="domain/field.ts" />
/// <reference path="utils.ts" />

namespace model {

    export class BoardModel {
        private board_ = new Board();
        private pawns: { [username: string]: Field } = {};

        userInJail(username: string) {
            return this.pawns[username].id === Board.JAIL_FIELD_NUMBER;
        }

        enoughCashToBuyField(username: string, cash: number) {
            const field = this.pawns[username];
            return field.isBuyable() && field.cost <= cash;
        }

        getField(username: string): Field {
            return this.pawns[username];
        }

        priceOfHouseOn(fieldId: number) {
            return this.board_.getField(fieldId).houseCost;
        }

        placePawnsOnBoard(players: Array<Player>) {
            players.forEach(player => this.pawns[player.username] = this.board_.startField());
        }

        movePawnBy(username: string, rollResult: number): void {
            const currentField = this.pawns[username];
            const targetField = this.board_.fieldInDistanceOf(currentField, rollResult);
            this.pawns[username] = targetField;
        }

        movePawnOn(username: string, targetField: number): void {
            this.pawns[username] = this.field(targetField);
        }

        buyField(username: string): void {
            this.getField(username).markAsBought(username);
        }

        buyHouseOn(fieldId: number): void {
            this.board_.getField(fieldId).buyHouse();
        }

        houseMayBeBoughtOn(fieldId: number, username: string): boolean {
            return this.checkIfIdMatches(fieldId, this.buildableFields(username));
        }

        buildableFields(username: string): Array<Field> {
            let fields = this.fieldsOwnedBy(username)
                .filter(f => f.buildable());
            let buildables: Array<Field> = [];
            while (fields.length != 0) {
                const districtId = fields[0].group;
                const fieldsPartitionedById = utils.partition(fields, (f: Field) => f.group === districtId);
                if (this.ownsWholeDistrict(username, districtId))
                    buildables = buildables.concat(this.findBuildableInGivenDistrict(fieldsPartitionedById[0]));
                fields = fieldsPartitionedById[1];
            }
            return buildables;
        }

        sellHouseOn(fieldId: number): void {
            this.board_.getField(fieldId).sellHouse();
        }

        houseMayBeSoldOn(fieldId: number, owner: string): boolean {
            return this.checkIfIdMatches(fieldId, this.fieldsWithSellableHouses(owner));
        }

        fieldsWithSellableHouses(owner: string): Array<Field> {
            const owned = this.fieldsOwnedBy(owner);
            const ownedWithHouses = owned.filter(f => f.housesBuilt > 0);
            return ownedWithHouses.filter(f => {
                const maxHouses = Math.max(...owned.filter(o => f.group === o.group).map(o => o.housesBuilt));
                return maxHouses - f.housesBuilt < 1;
            });
        }

        houseAmountOn(fieldId: number): number {
            return this.board_.getField(fieldId).housesBuilt;
        }

        mortgageField(id: number) {
            this.field(id).mortgage(true);
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
                && this.matchingOwner(field, owner);
        }

        unmortgageField(id: number) {
            this.board_.getField(id).mortgage(false);
        }

        fieldsToUnmortgage(owner: string): Array<Field> {
            return this.fieldsOwnedBy(owner)
                .filter(f => this.canBeUnmortgaged(f, owner));
        }

        fieldMayBeUnmortgaged(fieldId: number, username: string): boolean {
            return this.canBeUnmortgaged(this.field(fieldId), username);
        }

        changeOwner(fieldsIds: Array<number>, newOwner: string) {
            fieldsIds.forEach(id => this.field(id).markAsBought(newOwner));
        }

        private canBeUnmortgaged(field: Field, owner: string): boolean {
            return field.isMortgaged
                && this.matchingOwner(field, owner);
        }

        private checkIfIdMatches(fieldId: number, fields: Array<model.Field>): boolean {
            return fields.some(f => f.id === fieldId);
        }

        private findBuildableInGivenDistrict(district: Array<Field>): Array<Field> {
            const minHouseAmount = Math.min(...district.map(f => f.housesBuilt));
            return district.filter(f => f.housesBuilt <= minHouseAmount);
        }

        private ownsWholeDistrict(owner: string, districtId: string): boolean {
            return this.fields()
                .filter(f => f.group === districtId)
                .every(f => this.matchingOwner(f, owner));
        }

        private fieldsOwnedBy(owner: string): Array<Field> {
            return this.fields().filter(f => this.matchingOwner(f, owner));
        }

        private matchingOwner(field: Field, owner: string) {
            return field.ownerUsername() === owner;
        }

        private fields(): Array<Field> {
            return this.board_.fields();
        }

        private field(id: number): Field {
            return this.board_.getField(id);
        }
    }

}