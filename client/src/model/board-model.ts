/// <reference path="domain/board.ts" />
/// <reference path="domain/colors.ts" />
/// <reference path="domain/field.ts" />
/// <reference path="utils.ts" />

namespace model {

    export class BoardModel {
        private board_ = new Board();
        private pawns: { [username: string]: Field } = {};

        placePawnsOnBoard(players: Array<Player>) {
            players.forEach(player => this.pawns[player.username] = this.board_.startField());
        }

        /**
         * Checks if user can buy a field he currently stays on.
         * @param username user to check
         * @param cash user's cash
         */
        enoughCashToBuyField(username: string, cash: number) {
            const field = this.pawns[username];
            return field.isBuyable() && field.fieldCost <= cash;
        }

        /**
         * Returns field the given player currently stays on.
         * @param username
         */
        getField(username: string): Field {
            return this.pawns[username];
        }

        priceOfHouseOn(fieldId: number) {
            return this.board_.getField(fieldId).houseCost;
        }

        /**
         * Checks if given user owns the field with given id.
         */
        ownsField(username: string, fieldId: number): boolean {
            return this.field(fieldId).ownerUsername() === username;
        }

        /**
         * Moves the pawn of given user by specified amount of fields.
         */
        movePawnBy(username: string, rollResult: number): void {
            const currentField = this.pawns[username];
            const targetField = this.board_.fieldInDistanceOf(currentField, rollResult);
            this.pawns[username] = targetField;
        }

        /**
         * Moves the pawn of given user on the field with specified id.
         */
        movePawnOn(username: string, targetField: number): void {
            this.pawns[username] = this.field(targetField);
        }

        /**
         * Marks field the specified user stays on as bought by him.
         * @param username
         */
        buyField(username: string): void {
            this.getField(username).markAsBought(username);
        }

        buyHouseOn(fieldId: number): void {
            this.board_.getField(fieldId).buyHouse();
        }

        houseMayBeBoughtOn(fieldId: number, username: string): boolean {
            return this.checkIfIdMatches(fieldId, this.buildableFields(username));
        }

        /**
         * Fields are buildable if the player owns whole district ( described by the
         * group property of the field ) and the difference between the house number of the field
         * A and minimal number of houses in the district is less than one.
         * @param username
         */
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

        private canBeUnmortgaged(field: Field, owner: string): boolean {
            return field.isMortgaged
                && this.matchingOwner(field, owner);
        }

        fieldsToUnmortgage(owner: string): Array<Field> {
            return this.fieldsOwnedBy(owner)
                .filter(f => this.canBeUnmortgaged(f, owner));
        }

        fieldMayBeUnmortgaged(fieldId: number, username: string): boolean {
            return this.canBeUnmortgaged(this.field(fieldId), username);
        }

        /**
         * Changes the owner of the fields with given id numbers to specified player.
         */
        changeOwner(fieldsIds: Array<number>, newOwner: string) {
            fieldsIds.forEach(id => this.field(id).markAsBought(newOwner));
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

        /**
         * Removes info about owner in the fields specified by the given ids.
         * @param username
         */
        clearOwner(username: string): Array<number> {
            const ownedBy = this.fieldsOwnedBy(username);
            ownedBy.forEach(f => f.markAsBought(""));
            return ownedBy.map(f => f.id);
        }

        /**
         * Checks if specified player is on the jail field ( doesn't matter if as the
         * prisoner or the visitor ).
         * @param username
         */
        userInJail(username: string) {
            return this.pawns[username].id === Board.JAIL_FIELD_NUMBER;
        }
    }

}